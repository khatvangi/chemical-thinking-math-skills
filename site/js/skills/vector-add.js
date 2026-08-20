/**
 * Adaptive skill: vector addition and scalar multiples (§2.1).
 * Tier 1 (numeric): a component of a + b.
 * Tier 2 (numeric): a component of a − c·b (signs and scalars).
 * Tier 3 (numeric): net molecular dipole 2 μ cos(θ/2).
 */

(function () {
    const A = window.Adaptive;

    const T1 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                const a = [A.randInt(-5, 6), A.randInt(-5, 6)];
                const b = [A.randInt(-5, 6), A.randInt(-5, 6)];
                const i = A.rand([0, 1]);
                const name = i === 0 ? "x" : "y";
                const correct = a[i] + b[i];
                const other = a[1 - i] + b[1 - i];
                const prod = a[i] * b[i];
                if (new Set([correct, other, prod, a[i] - b[i]]).size < 4) continue;
                return {
                    prompt: "Two forces act on an ion: $\\mathbf{F}_1 = (" + a[0] + ", " + a[1] + ")$ pN and " +
                        "$\\mathbf{F}_2 = (" + b[0] + ", " + b[1] + ")$ pN. " +
                        "What is the <strong>" + name + "-component</strong> of the net force $\\mathbf{F}_1 + \\mathbf{F}_2$?",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "wrong-component",
                            value: other, tol: 0.01,
                            why: "That is the " + (i === 0 ? "y" : "x") + "-component — the question asked for " + name + ".",
                            nudges: ["Match slots: the " + name + "-component of the sum uses only the " + name + "-entries, " +
                                     a[i] + " and " + b[i] + "."]
                        },
                        {
                            id: "multiplied",
                            value: prod, tol: 0.01,
                            why: "You multiplied the components. Vector addition adds them (multiplying pairs is the §2.3 dot product, a different operation).",
                            nudges: ["Tip-to-tail means displacements along one axis accumulate: " + a[i] + " + (" + b[i] + ")."]
                        },
                        {
                            id: "subtracted",
                            value: a[i] - b[i], tol: 0.01,
                            why: "You subtracted. The negative signs live inside the components; the operation is still +.",
                            nudges: ["Add the two " + name + "-entries exactly as written, signs included: " + a[i] + " + (" + b[i] + ")."]
                        }
                    ]
                };
            }
        }
    };

    const T2 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                const a = [A.randInt(-4, 5), A.randInt(-4, 5)];
                const b = [A.randInt(-4, 5), A.randInt(-4, 5)];
                const c = A.randInt(2, 3);
                const i = A.rand([0, 1]);
                const name = i === 0 ? "x" : "y";
                const correct = a[i] - c * b[i];
                const noScalar = a[i] - b[i];
                const plusScalar = a[i] + c * b[i];
                const scaledBoth = c * (a[i] - b[i]);
                if (new Set([correct, noScalar, plusScalar, scaledBoth]).size < 4) continue;
                return {
                    prompt: "For $\\mathbf{a} = (" + a[0] + ", " + a[1] + ")$ and $\\mathbf{b} = (" + b[0] + ", " + b[1] + ")$, " +
                        "find the <strong>" + name + "-component</strong> of $\\mathbf{a} - " + c + "\\mathbf{b}$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "forgot-scalar",
                            value: noScalar, tol: 0.01,
                            why: "The factor " + c + " on b was dropped.",
                            nudges: ["Scalar multiplication acts first: " + c + "b has " + name + "-component " + (c * b[i]) + ". Then subtract it from " + a[i] + "."]
                        },
                        {
                            id: "sign-flip",
                            value: plusScalar, tol: 0.01,
                            why: "You added " + c + "b instead of subtracting it.",
                            nudges: ["The expression is a MINUS " + c + "b. Compute " + a[i] + " − (" + (c * b[i]) + "), watching the sign of b's component."]
                        },
                        {
                            id: "scaled-both",
                            value: scaledBoth, tol: 0.01,
                            why: "The scalar " + c + " multiplies only b, not the whole difference.",
                            nudges: ["Read the expression's structure: a − (" + c + "b). Only b gets stretched; a enters at full strength."]
                        }
                    ]
                };
            }
        }
    };

    const T3 = {
        gen() {
            const mu = A.rand([0.69, 1.31, 1.52]);
            const th = A.rand([92, 104.5, 107, 120]);
            const half = th / 2 * Math.PI / 180;
            const correct = 2 * mu * Math.cos(half);
            const noHalf = 2 * mu * Math.cos(th * Math.PI / 180);
            return {
                prompt: "A bent molecule has two equivalent bond dipoles of $" + mu + "$ D meeting at $" + th +
                    "^\\circ$. Using $\\mu_{\\text{net}} = 2\\mu_b\\cos(\\theta/2)$'s geometry, " +
                    "find the net molecular dipole in D. (2 decimals)",
                correct: correct,
                tol: 0.03,
                misconceptions: [
                    {
                        id: "sum-of-magnitudes",
                        value: 2 * mu, tol: 0.02,
                        why: "You added the two magnitudes. The angle between the dipoles steals part of the sum.",
                        nudges: [
                            "2μ_b is the θ = 0 limit — dipoles in lockstep. At " + th + "° each contributes only its along-bisector part, μ_b cos(θ/2).",
                            "Multiply 2 × " + mu + " by cos(" + (th / 2) + "°)."
                        ]
                    },
                    {
                        id: "forgot-half",
                        value: Math.abs(noHalf), tol: 0.02,
                        why: "You used cos θ, but the bisector geometry gives cos(θ/2) — each bond makes angle θ/2 with the bisector.",
                        nudges: [
                            "Each bond dipole sits θ/2 = " + (th / 2) + "° away from the bisector, so its surviving component is μ_b cos(" + (th / 2) + "°).",
                            "Compute 2 × " + mu + " × cos(" + (th / 2) + "°)."
                        ]
                    },
                    {
                        id: "single-bond",
                        value: mu * Math.cos(half), tol: 0.02,
                        why: "That is one bond's contribution; both bonds reinforce along the bisector.",
                        nudges: [
                            "Two bonds each contribute μ_b cos(θ/2) along the bisector — double your value."
                        ]
                    }
                ]
            };
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["vector-add"] = {
        id: "vector-add",
        title: "Vector addition",
        tiers: [T1, T2, T3]
    };
})();
