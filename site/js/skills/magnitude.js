/**
 * Adaptive skill: magnitude, distance, unit vectors (§2.2).
 * Tier 1 (numeric): |v| for a 3D vector (Pythagorean families keep numbers clean).
 * Tier 2 (numeric): distance between two atomic positions.
 * Tier 3 (numeric): a component of the normalized vector.
 */

(function () {
    const A = window.Adaptive;

    // Pythagorean-friendly vectors: |v| is a whole number
    const CLEAN = [
        [3, 4, 0], [0, 3, 4], [4, 0, 3],
        [1, 2, 2], [2, 1, 2], [2, 2, 1],
        [2, 3, 6], [6, 2, 3], [3, 6, 2],
        [1, 4, 8], [4, 8, 1], [8, 1, 4],
        [2, 6, 9], [6, 9, 2]
    ];
    const mag = v => Math.hypot(v[0], v[1], v[2]);

    const T1 = {
        gen() {
            const base = A.rand(CLEAN);
            // random sign flips (magnitude unchanged — that's part of the lesson)
            const v = base.map(x => (Math.random() < 0.4 ? -x : x));
            const correct = mag(v);
            const sq = correct * correct;
            const taxicab = Math.abs(v[0]) + Math.abs(v[1]) + Math.abs(v[2]);
            const plainSum = v[0] + v[1] + v[2];
            return {
                prompt: "A bond vector is $\\mathbf{v} = (" + v.join(", ") + ")$ (in 0.1 Å units). " +
                    "Compute its magnitude $|\\mathbf{v}|$.",
                correct: correct,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "forgot-sqrt",
                        value: sq, tol: 0.01,
                        why: "That is |v|² — the square root is still owed.",
                        nudges: [
                            "Check units: summing squared components gives a squared length. One more step: take √" + sq + ".",
                            "|v| = √(" + v.map(x => x + "²").join(" + ") + ") = √" + sq + "."
                        ]
                    },
                    {
                        id: "taxicab",
                        value: taxicab, tol: 0.01,
                        why: "You added |components| — the axis-aligned detour, not the straight-line length.",
                        nudges: [
                            "Walking each axis separately covers more ground than the straight tunnel. Perpendicular legs combine by Pythagoras: square, sum, root.",
                            "Compute √(" + v[0] + "² + " + v[1] + "² + " + v[2] + "²)."
                        ]
                    },
                    {
                        id: "signed-sum",
                        value: Math.abs(plainSum) > 1e-9 && Math.abs(plainSum - correct) > 0.02 ? plainSum : NaN,
                        tol: 0.01,
                        why: "You summed the raw components, letting signs cancel length away.",
                        nudges: [
                            "A magnitude can't shrink because a component is negative — direction reversal doesn't shorten an arrow. Squaring removes the signs before they can cancel: √(Σ components²)."
                        ]
                    }
                ].filter(m => isFinite(m.value))
            };
        }
    };

    const T2 = {
        gen() {
            const d = A.rand(CLEAN);
            const r1 = [A.randInt(2, 9), A.randInt(2, 9), A.randInt(2, 9)];
            const r2 = [r1[0] + d[0], r1[1] + d[1], r1[2] + d[2]];
            const correct = mag(d);
            const magR2 = mag(r2);
            const noSqrt = correct * correct;
            const f = x => (Math.round(x * 100) / 100);
            return {
                prompt: "Two atoms sit at $\\mathbf{r}_1 = (" + r1.join(", ") + ")$ and " +
                    "$\\mathbf{r}_2 = (" + r2.join(", ") + ")$ Å. Find their separation distance.",
                correct: correct,
                tol: 0.02,
                misconceptions: [
                    {
                        id: "magnitude-of-position",
                        value: magR2, tol: Math.max(0.02, magR2 * 0.005),
                        why: "That is |r₂| — the second atom's distance from the ORIGIN, not from the first atom.",
                        nudges: [
                            "Distance between atoms needs the displacement between them: subtract first, r₂ − r₁, then take the magnitude.",
                            "r₂ − r₁ = (" + d.join(", ") + "). Now compute its magnitude."
                        ]
                    },
                    {
                        id: "forgot-sqrt",
                        value: noSqrt, tol: 0.01,
                        why: "That is the squared distance; take the square root.",
                        nudges: [
                            "Units say Å² — root it: √" + f(noSqrt) + " = " + f(correct) + "."
                        ]
                    },
                    {
                        id: "taxicab",
                        value: Math.abs(d[0]) + Math.abs(d[1]) + Math.abs(d[2]), tol: 0.01,
                        why: "That is the sum of coordinate differences — the detour, not the straight line.",
                        nudges: [
                            "Combine the perpendicular differences in quadrature: √(" + d[0] + "² + " + d[1] + "² + " + d[2] + "²)."
                        ]
                    }
                ]
            };
        }
    };

    const T3 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                const v = A.rand(CLEAN);
                const m = mag(v);
                const i = A.rand([0, 1, 2]);
                if (v[i] === 0) continue;
                const name = ["x", "y", "z"][i];
                const correct = v[i] / m;
                const vals = [correct, v[i], v[i] / (m * m), v[i] / (v[0] + v[1] + v[2])];
                if (new Set(vals.map(x => Math.round(x * 1000))).size < 4) continue;
                return {
                    prompt: "Normalize $\\mathbf{v} = (" + v.join(", ") + ")$ and give the <strong>" + name +
                        "-component</strong> of the unit vector $\\hat{\\mathbf{v}}$. (3 decimals)",
                    correct: correct,
                    tol: 0.005,
                    misconceptions: [
                        {
                            id: "not-normalized",
                            value: v[i], tol: 0.01,
                            why: "That is the raw component — the vector hasn't been divided by its magnitude.",
                            nudges: [
                                "First find |v| = √(" + v.map(x => x + "²").join("+") + ") = " + m + ". Then divide the component by it.",
                                "v̂_" + name + " = " + v[i] + "/" + m + "."
                            ]
                        },
                        {
                            id: "divided-by-square",
                            value: v[i] / (m * m), tol: 0.005,
                            why: "You divided by |v|² instead of |v|.",
                            nudges: [
                                "Normalization divides by the magnitude itself, |v| = " + m + ", not its square. Check: the result's squares must sum to 1."
                            ]
                        },
                        {
                            id: "divided-by-sum",
                            value: v[i] / (v[0] + v[1] + v[2]), tol: 0.005,
                            why: "You divided by the sum of components — that's not the length.",
                            nudges: [
                                "The length is Pythagorean, not a plain sum: |v| = " + m + ". Divide " + v[i] + " by that."
                            ]
                        }
                    ]
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["magnitude"] = {
        id: "magnitude",
        title: "Magnitude and unit vectors",
        tiers: [T1, T2, T3]
    };
})();
