/**
 * Adaptive skill: complex manipulations (§1.5).
 * Tier 1 (numeric): conjugate products (a+bi)(a−bi) — the sign rescue.
 * Tier 2 (numeric): division via the conjugate — real part of w/z.
 * Tier 3 (numeric): De Moivre — modulus or angle of zⁿ.
 */

(function () {
    const A = window.Adaptive;

    // keep only wrong answers that differ from the right one and each other
    function pruned(correct, list, minGap) {
        const seen = [correct];
        return list.filter(m => {
            if (!isFinite(m.value)) return false;
            if (seen.some(v => Math.abs(v - m.value) < (minGap || 0.02))) return false;
            seen.push(m.value);
            return true;
        });
    }

    const T1 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const a = A.randInt(2, 7), b = A.randInt(1, 6);
                const correct = a * a + b * b;
                const problem = {
                    prompt: "Compute the conjugate product $(" + a + " + " + b + "i)(" + a + " - " + b + "i)$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: pruned(correct, [
                        {
                            id: "sign-not-rescued",
                            value: a * a - b * b, tol: 0.01,
                            why: "Difference of squares gives a² − (bi)², and (bi)² = −b² — the subtraction FLIPS to addition.",
                            nudges: [
                                "(a+bi)(a−bi) = a² − (bi)². Now (bi)² = b²·i² = −b², so subtracting it ADDS b².",
                                "Compute " + (a * a) + " + " + (b * b) + " — a conjugate product is always a positive real."
                            ]
                        },
                        {
                            id: "modulus-not-square",
                            value: Math.sqrt(a * a + b * b), tol: 0.02,
                            why: "That is |z| — the conjugate product is the SQUARED length, z·z̄ = |z|².",
                            nudges: [
                                "z z̄ = a² + b² with no square root: this product IS |z|², not |z|. Report " + (a * a) + " + " + (b * b) + "."
                            ]
                        },
                        {
                            id: "cross-terms",
                            value: 2 * a * b, tol: 0.01,
                            why: "The cross terms ±" + (a * b) + "i cancel each other — they are not the answer, they are the reason the answer is real.",
                            nudges: [
                                "Expand all four terms: a² − abi + abi − (bi)². The middles vanish; the ends give a² + b²."
                            ]
                        }
                    ])
                };
                if (problem.misconceptions.length >= 2) return problem;
            }
        }
    };

    const T2 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                // build an exact quotient: w = z·q with small integer q = x + yi
                const c = A.randInt(1, 3), d = A.randInt(1, 3);
                const x = A.randInt(1, 4), y = A.randInt(1, 3);
                const w = [c * x - d * y, c * y + d * x];
                const modz2 = c * c + d * d;
                const correct = x;
                const problem = {
                    prompt: "Compute the <strong>real part</strong> of $\\dfrac{" +
                        w[0] + (w[1] >= 0 ? " + " : " - ") + Math.abs(w[1]) + "i}{" +
                        c + " + " + d + "i}$ (use the conjugate of the denominator).",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: pruned(correct, [
                        {
                            id: "gave-imaginary",
                            value: y, tol: 0.01,
                            why: "That is the quotient's imaginary part — the question asks for the real part.",
                            nudges: [
                                "After multiplying top and bottom by " + c + " − " + d + "i, sort the numerator into real and imaginary parts and report the real one."
                            ]
                        },
                        {
                            id: "forgot-denominator",
                            value: modz2 * x, tol: 0.02,
                            why: "You computed the numerator w·z̄ but never divided by z·z̄ = |z|² = " + modz2 + ".",
                            nudges: [
                                "The conjugate trick has two halves: multiply the TOP by z̄, and the BOTTOM becomes the real number " + modz2 + ". Divide by it.",
                                "Real part = " + (modz2 * x) + " / " + modz2 + "."
                            ]
                        },
                        {
                            id: "divided-parts",
                            value: w[0] / c, tol: 0.02,
                            why: "Dividing real part by real part ignores the imaginary parts' contributions — complex division mixes all four numbers.",
                            nudges: [
                                "Complex division isn't componentwise. Multiply numerator and denominator by the conjugate " + c + " − " + d + "i, then read off the parts."
                            ]
                        }
                    ])
                };
                if (problem.misconceptions.length >= 2) return problem;
            }
        }
    };

    const T3 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const r = A.rand([1, 2, 3]);
                const th = A.rand([30, 45, 60, 90, 120]);
                const n = A.rand([3, 4, 5]);
                const askAngle = Math.random() < 0.6;
                if (askAngle) {
                    const raw = n * th;
                    const correct = raw % 360;
                    const problem = {
                        prompt: "$z$ has modulus $" + r + "$ and angle $" + th + "^\\circ$. By De Moivre, what is the <strong>angle</strong> of $z^{" + n + "}$, reduced to $[0°, 360°)$?",
                        correct: correct,
                        tol: 0.5,
                        misconceptions: pruned(correct, [
                            {
                                id: "no-reduction",
                                value: raw, tol: 0.5,
                                why: "Right product, but angles live on a circle — reduce " + raw + "° modulo 360°.",
                                nudges: [
                                    raw + "° means " + Math.floor(raw / 360) + " full turn(s) plus " + correct + "°. Report the remainder."
                                ]
                            },
                            {
                                id: "unchanged",
                                value: th, tol: 0.5,
                                why: "Powers rotate: each multiplication by z adds another " + th + "° of turn.",
                                nudges: [
                                    "De Moivre: the angle of zⁿ is n·θ = " + n + " × " + th + "° (then reduced mod 360°)."
                                ]
                            },
                            {
                                id: "power-of-angle",
                                value: Math.pow(th, n) % 360, tol: 0.5,
                                why: "The angle is MULTIPLIED by n, not raised to the n-th power — exponentiation hits the modulus, multiplication hits the angle.",
                                nudges: [
                                    "zⁿ = rⁿ(cos nθ + i sin nθ): modulus to the power, angle times n. Compute " + n + " × " + th + "°, mod 360°."
                                ]
                            }
                        ], 0.9)
                    };
                    if (problem.misconceptions.length >= 2) return problem;
                } else {
                    const correct = Math.pow(r, n);
                    const problem = {
                        prompt: "$z$ has modulus $" + r + "$ and angle $" + th + "^\\circ$. By De Moivre, what is the <strong>modulus</strong> of $z^{" + n + "}$?",
                        correct: correct,
                        tol: 0.01,
                        misconceptions: pruned(correct, [
                            {
                                id: "multiplied-by-n",
                                value: r * n, tol: 0.01,
                                why: "Moduli COMPOUND under multiplication: r·r·…·r = rⁿ, not r·n.",
                                nudges: [
                                    "Each multiplication by z stretches by another factor of " + r + ". After " + n + " of them: " + r + "^" + n + "."
                                ]
                            },
                            {
                                id: "unchanged-modulus",
                                value: r, tol: 0.01,
                                why: "Only modulus-1 numbers keep their length under powers; |z| = " + r + " does not.",
                                nudges: [
                                    "|zⁿ| = |z|ⁿ = " + r + "^" + n + "."
                                ]
                            },
                            {
                                id: "angle-slipped-in",
                                value: n * th % 360, tol: 0.5,
                                why: "That is the ANGLE of zⁿ — the question asks for its modulus.",
                                nudges: [
                                    "Two separate outputs: angle n·θ, modulus rⁿ. Report rⁿ = " + r + "^" + n + "."
                                ]
                            }
                        ])
                    };
                    if (problem.misconceptions.length >= 2) return problem;
                }
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["complex-plane"] = {
        id: "complex-plane",
        title: "Complex manipulations",
        tiers: [T1, T2, T3]
    };
})();
