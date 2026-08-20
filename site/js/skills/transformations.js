/**
 * Adaptive skill: linear transformations (§3.3).
 * Tier 1 (numeric): apply a named symmetry matrix to a point.
 * Tier 2 (numeric): build a matrix entry from a transformation description.
 * Tier 3 (numeric): compose two operations in the stated order.
 */

(function () {
    const A = window.Adaptive;

    const R = th => {
        const r = th * Math.PI / 180;
        return [[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]].map(
            row => row.map(x => Math.round(x * 1e9) / 1e9));
    };
    const SX = [[1, 0], [0, -1]], SY = [[-1, 0], [0, 1]];
    const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
    const mul = (M, N) => [
        [M[0][0] * N[0][0] + M[0][1] * N[1][0], M[0][0] * N[0][1] + M[0][1] * N[1][1]],
        [M[1][0] * N[0][0] + M[1][1] * N[1][0], M[1][0] * N[0][1] + M[1][1] * N[1][1]]
    ];

    const T1 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const ops = [
                    { name: "a rotation by $90^\\circ$", M: R(90) },
                    { name: "a rotation by $180^\\circ$", M: R(180) },
                    { name: "a reflection across the $x$-axis", M: SX },
                    { name: "a reflection across the $y$-axis", M: SY }
                ];
                const op = A.rand(ops);
                const p = [A.randInt(-3, 4), A.randInt(-3, 4)];
                if (p[0] === 0 || p[1] === 0 || Math.abs(p[0]) === Math.abs(p[1])) continue;
                const i = A.rand([0, 1]);
                const name = i === 0 ? "x" : "y";
                const out = apply(op.M, p);
                const correct = out[i];
                // some candidate wrong answers legitimately coincide with the
                // correct one for symmetric ops — drop those instead of rerolling
                const problem = {
                    prompt: "An atom sits at $(" + p[0] + ", " + p[1] + ")$. Apply " + op.name +
                        " (about/through the origin). What is the atom's new <strong>" + name + "</strong>-coordinate?",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "unmoved",
                            value: p[i], tol: 0.01,
                            why: "That coordinate does change under this operation.",
                            nudges: [
                                "Use the matrix: new position = M·(old position). Write the operation's matrix (columns = where x̂ and ŷ land) and multiply."
                            ]
                        },
                        {
                            id: "sign-only-guess",
                            value: -p[i], tol: 0.01,
                            why: "Not a simple sign flip of that coordinate — check the matrix's action carefully.",
                            nudges: [
                                "Build the matrix from its columns and compute row " + (i + 1) + " dotted with (" + p[0] + ", " + p[1] + ")."
                            ]
                        },
                        {
                            id: "swapped-coords",
                            value: out[1 - i], tol: 0.01,
                            why: "That is the new " + (i === 0 ? "y" : "x") + "-coordinate — the components got swapped in the readout.",
                            nudges: [
                                "The new position is (" + out[0] + ", " + out[1] + "). Report the " + name + " entry."
                            ]
                        }
                    ]
                };
                // drop wrong answers that coincide with the correct one or repeat each other
                const seen = [correct];
                problem.misconceptions = problem.misconceptions.filter(m => {
                    if (seen.some(v => Math.abs(v - m.value) < 0.02)) return false;
                    seen.push(m.value);
                    return true;
                });
                if (problem.misconceptions.length === 0) continue;
                return problem;
            }
        }
    };

    const T2 = {
        gen() {
            const items = [
                { desc: "reflection across the $y$-axis", M: SY },
                { desc: "reflection across the $x$-axis", M: SX },
                { desc: "rotation by $180^\\circ$", M: R(180) },
                { desc: "rotation by $90^\\circ$ (counterclockwise)", M: R(90) },
                { desc: "the stretch that triples $x$ and leaves $y$ unchanged", M: [[3, 0], [0, 1]] }
            ];
            const it = A.rand(items);
            const i = A.rand([0, 1]), j = A.rand([0, 1]);
            const correct = it.M[i][j];
            return {
                prompt: "Write the matrix of " + it.desc + " and report its entry in row " + (i + 1) +
                    ", column " + (j + 1) + ". <em>(Columns are the images of $\\hat{x}$ and $\\hat{y}$.)</em>",
                correct: correct,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "negated",
                        value: correct !== 0 ? -correct : NaN, tol: 0.01,
                        why: "Sign error — re-derive the column from where the basis vector actually lands.",
                        nudges: [
                            "Column " + (j + 1) + " is the destination of " + (j === 0 ? "x̂ = (1, 0)" : "ŷ = (0, 1)") + " under this operation. Track that arrow geometrically, then read off entry " + (i + 1) + "."
                        ]
                    },
                    {
                        id: "transposed",
                        value: it.M[j][i] !== correct ? it.M[j][i] : NaN, tol: 0.01,
                        why: "That is the (" + (j + 1) + "," + (i + 1) + ") entry — row and column got swapped.",
                        nudges: [
                            "Row index first: entry (" + (i + 1) + "," + (j + 1) + ") lives in row " + (i + 1) + ". The columns hold the basis images; the rows are read across."
                        ]
                    },
                    {
                        id: "identity-guess",
                        value: (i === j ? 1 : 0) !== correct ? (i === j ? 1 : 0) : NaN, tol: 0.01,
                        why: "That would be the identity matrix's entry — this operation moves the basis vectors.",
                        nudges: [
                            "Ask where " + (j === 0 ? "x̂" : "ŷ") + " goes under the operation; its new coordinates fill column " + (j + 1) + "."
                        ]
                    }
                ].filter(m => isFinite(m.value))
            };
        }
    };

    const T3 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const first = A.rand([{ n: "rotate $90^\\circ$", M: R(90) }, { n: "reflect across the $x$-axis", M: SX }]);
                const second = first.M === SX
                    ? { n: "rotate $90^\\circ$", M: R(90) }
                    : { n: "reflect across the $x$-axis", M: SX };
                const p = [A.randInt(1, 3), A.randInt(1, 3)];
                const i = A.rand([0, 1]);
                const name = i === 0 ? "x" : "y";
                const correctPos = apply(second.M, apply(first.M, p));
                const wrongOrder = apply(first.M, apply(second.M, p));
                const onlyFirst = apply(first.M, p);
                const correct = correctPos[i];
                const vals = [correct, wrongOrder[i], onlyFirst[i], correctPos[1 - i]];
                if (new Set(vals.map(x => Math.round(x * 100))).size < 4) continue;
                return {
                    prompt: "An atom at $(" + p[0] + ", " + p[1] + ")$ is FIRST made to " + first.n +
                        ", THEN to " + second.n + " (both about/through the origin). " +
                        "What is its final <strong>" + name + "</strong>-coordinate?",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "wrong-order",
                            value: wrongOrder[i], tol: 0.01,
                            why: "That is the OTHER order — these two operations do not commute (Theorem 3.2.2).",
                            nudges: [
                                "Apply the operations in the stated sequence: " + first.n + " first. As matrices the combined map is (second)(first) — the first-applied factor sits nearest the vector.",
                                "Step 1 gives (" + onlyFirst[0] + ", " + onlyFirst[1] + "). Now apply the second operation to THAT point."
                            ]
                        },
                        {
                            id: "stopped-after-one",
                            value: onlyFirst[i], tol: 0.01,
                            why: "Only the first operation was applied — the second still acts on the result.",
                            nudges: [
                                "After " + first.n + " the atom is at (" + onlyFirst[0] + ", " + onlyFirst[1] + "). Now " + second.n + "."
                            ]
                        },
                        {
                            id: "swapped-coords",
                            value: correctPos[1 - i], tol: 0.01,
                            why: "That is the final " + (i === 0 ? "y" : "x") + "-coordinate.",
                            nudges: [
                                "Final position: (" + correctPos[0] + ", " + correctPos[1] + "). Report its " + name + " entry."
                            ]
                        }
                    ]
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["transformations"] = {
        id: "transformations",
        title: "Linear transformations",
        tiers: [T1, T2, T3]
    };
})();
