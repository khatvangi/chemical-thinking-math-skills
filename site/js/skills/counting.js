/**
 * Adaptive skill: permutations and combinations (§1.3).
 * Tier 1 (numeric): ordered selection — n^k vs P(n,k).
 * Tier 2 (numeric): combinations C(n,k), dividing out order.
 * Tier 3 (numeric): microstates — indistinguishable electrons in spin-orbitals.
 */

(function () {
    const A = window.Adaptive;

    const fact = n => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; };
    const P = (n, k) => fact(n) / fact(n - k);
    const C = (n, k) => fact(n) / (fact(k) * fact(n - k));

    const T1 = {
        gen() {
            const n = A.randInt(5, 9);
            const k = A.randInt(3, 4);
            const correct = P(n, k);
            return {
                prompt: "From $" + n + "$ distinct samples, $" + k + "$ are loaded into an autosampler " +
                    "whose run order matters; no sample can be loaded twice. How many distinct loadings?",
                correct: correct,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "with-repetition",
                        value: Math.pow(n, k), tol: 0.01,
                        why: "That is " + n + "^" + k + " — sequences WITH repetition. A physical sample can't occupy two positions.",
                        nudges: [
                            "After the first sample is placed, only " + (n - 1) + " remain for the next slot. The option pool shrinks.",
                            "The count is " + n + " × " + (n - 1) + " × … for " + k + " factors: P(n, k) = n!/(n−k)!."
                        ]
                    },
                    {
                        id: "forgot-order",
                        value: C(n, k), tol: 0.01,
                        why: "That is the count of unordered CHOICES — but the run order matters here.",
                        nudges: [
                            "You computed n-choose-k, which treats {A, B, C} loaded in any order as one outcome. Run order distinguishes them — each chosen set is counted " + fact(k) + " times.",
                            "Multiply your answer by " + k + "! to restore the orderings, or compute P(" + n + ", " + k + ") directly."
                        ]
                    },
                    {
                        id: "multiplied-nk",
                        value: n * k, tol: 0.01,
                        why: n + "×" + k + " counts a grid of pairs, not sequences of choices.",
                        nudges: [
                            "Each slot is a choice from a (shrinking) pool, and the multiplication principle multiplies the pools: " +
                                n + " × " + (n - 1) + " × " + (n - 2) + (k === 4 ? " × " + (n - 3) : "") + "."
                        ]
                    }
                ]
            };
        }
    };

    const T2 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                const n = A.randInt(7, 12);
                const k = A.randInt(3, 4);
                const correct = C(n, k);
                const vals = [correct, P(n, k), fact(n) / fact(k), n * k];
                if (new Set(vals.map(v => Math.round(v))).size < 4) continue;
                return {
                    prompt: "A screening study will use $" + k + "$ solvents chosen from $" + n +
                        "$ candidates; the panel is a set — the order of choosing is irrelevant. How many distinct panels?",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "kept-order",
                            value: P(n, k), tol: 0.01,
                            why: "That is the ORDERED count P(n, k) — every panel got counted " + fact(k) + " times, once per ordering.",
                            nudges: [
                                "A panel of " + k + " solvents can be picked in " + fact(k) + " different orders, and all of them are the same panel. Your count includes each of those orders separately.",
                                "Divide the overcount out: C(n, k) = P(n, k)/k! = " + P(n, k) + "/" + fact(k) + "."
                            ]
                        },
                        {
                            id: "wrong-divisor",
                            value: fact(n) / fact(k), tol: 0.01,
                            why: "n!/k! is not the combination formula — the (n−k)! in the denominator is missing.",
                            nudges: [
                                "C(n, k) = n! / (k! (n−k)!). Both factors belong downstairs: k! removes the orderings of the chosen, (n−k)! cancels the never-chosen tail of n!.",
                                "Compute " + n + "!/(" + k + "!·" + (n - k) + "!)."
                            ]
                        },
                        {
                            id: "multiplied-nk",
                            value: n * k, tol: 0.01,
                            why: "n×k answers a different question (a grid of independent pairs), not a choice of a subset.",
                            nudges: [
                                "Choosing a k-subset isn't k independent choices from a constant pool. Use the formula built for it: C(" + n + ", " + k + ") = " + n + "!/(" + k + "!·" + (n - k) + "!)."
                            ]
                        }
                    ]
                };
            }
        }
    };

    const T3 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                // e indistinguishable electrons in m spin-orbitals (m = 2 × spatial)
                const spatial = A.rand([3, 5, 7]);   // p, d, f subshells
                const m = 2 * spatial;
                const e = A.randInt(2, 3);
                const correct = C(m, e);
                const vals = [correct, P(m, e), Math.pow(m, e), m * e];
                if (new Set(vals.map(v => Math.round(v))).size < 4) continue;
                const sub = { 3: "p", 5: "d", 7: "f" }[spatial];
                return {
                    prompt: "Count the microstates of a $" + sub + "^" + e + "$ configuration: $" + e +
                        "$ indistinguishable electrons distributed over the $" + m + "$ " + sub +
                        " spin-orbitals, at most one electron per spin-orbital.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "distinguishable",
                            value: P(m, e), tol: 0.01,
                            why: "That count treats the electrons as labeled individuals. Electrons are indistinguishable — swapping them gives the SAME physical state.",
                            nudges: [
                                "P(" + m + ", " + e + ") counts ordered assignments 'electron 1 here, electron 2 there.' But no experiment can tell the electrons apart, so each physical state was counted " + fact(e) + " times.",
                                "Divide by " + e + "! — or directly: a microstate is just a CHOICE of which " + e + " spin-orbitals are occupied, C(" + m + ", " + e + ")."
                            ]
                        },
                        {
                            id: "with-repetition",
                            value: Math.pow(m, e), tol: 0.01,
                            why: m + "^" + e + " lets several electrons occupy one spin-orbital — Pauli exclusion forbids that.",
                            nudges: [
                                "At most one electron per spin-orbital: once a spin-orbital is used, it's unavailable. And the electrons are identical. Which formula selects an unordered subset without repetition?"
                            ]
                        },
                        {
                            id: "multiplied",
                            value: m * e, tol: 0.01,
                            why: "m×e is not a selection count of any kind here.",
                            nudges: [
                                "The question asks: how many ways to choose which " + e + " of the " + m + " spin-orbitals are occupied? That's C(" + m + ", " + e + ")."
                            ]
                        }
                    ]
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["counting"] = {
        id: "counting",
        title: "Permutations and combinations",
        tiers: [T1, T2, T3]
    };
})();
