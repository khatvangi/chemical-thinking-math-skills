/**
 * Adaptive skill: instantaneous rate from the derivative.
 * Pilot topic for Lecture 12. Registers on window.AdaptiveSkills.
 *
 * Authoring contract (see docs/plans/2026-06-12-adaptive-exercises-design.md):
 *   each tier has gen() -> { prompt, correct, tol, misconceptions[] }
 *   or for a conceptual item: { prompt, choices[] } with one choice.correct.
 *   Misconception .value fields are computed from the SAME random params as
 *   .correct, so diagnosis stays exact under any randomization.
 */

(function () {
    const A = window.Adaptive; // rand / randInt / round helpers from the engine

    // round a number for display without trailing noise
    function show(x) {
        const r = Math.round(x * 1000) / 1000;
        return (Math.abs(r) < 1e-9 ? 0 : r).toString();
    }

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["derivative-rate"] = {
        id: "derivative-rate",
        title: "Instantaneous rate from a derivative",
        tiers: [

            // ---------------- TIER 1 (Easy): rate of c·e^(−kt) at t = 0 ----------------
            {
                gen() {
                    const c = A.rand([0.4, 0.5, 0.8, 1.0]);
                    const k = A.rand([0.05, 0.1, 0.2, 0.25]);
                    const correct = c * k; // −d[A]/dt at t=0 = k·c
                    return {
                        prompt: "A reactant follows $[A] = " + c + "\\,e^{-" + k + "t}$ M. " +
                            "What is the reaction rate $-\\,d[A]/dt$ at $t = 0$? (M/s)",
                        correct: correct,
                        tol: Math.max(0.0005, correct * 0.02),
                        misconceptions: [
                            {
                                id: "conc-not-rate",
                                value: c, tol: 0.005,
                                why: "You reported the concentration, not its rate of change.",
                                nudges: [
                                    "That number is [A] itself. The rate asks how fast [A] is <em>changing</em> — you need d[A]/dt, not [A].",
                                    "Differentiate c·e^(−kt) with respect to t. The exponential pulls a factor of −k out front: d[A]/dt = −k·c·e^(−kt).",
                                    "At t = 0 the exponential is 1, so −d[A]/dt = k·c = " + k + " × " + c + ". Compute that and enter it."
                                ]
                            },
                            {
                                id: "sign-dropped",
                                value: -c * k, tol: 0.0005,
                                why: "Right magnitude, wrong sign.",
                                nudges: [
                                    "A is being consumed, so d[A]/dt is negative — but the <em>rate</em> is reported positive by convention. That's what the leading minus sign in −d[A]/dt is for.",
                                    "Take the magnitude: the rate is +k·c, a positive number."
                                ]
                            },
                            {
                                id: "forgot-k",
                                value: c * c, tol: 0.005, // a plausible slip: squaring/confusing factors
                                why: "Check which factors belong in k·c.",
                                nudges: [
                                    "The rate at t = 0 is exactly k·c — the rate constant times the starting concentration. Multiply k by c, nothing else."
                                ]
                            }
                        ]
                    };
                }
            },

            // ---------------- TIER 2 (Medium): rate at t ≠ 0, or invert for t ----------------
            {
                gen() {
                    const c = A.rand([0.5, 0.8, 1.0]);
                    const k = A.rand([0.1, 0.2]);
                    const t = A.rand([5, 10]);
                    const rate = k * c * Math.exp(-k * t); // −d[A]/dt at time t
                    return {
                        prompt: "For $[A] = " + c + "\\,e^{-" + k + "t}$ M, find the reaction rate " +
                            "$-\\,d[A]/dt$ at $t = " + t + "$ s. (M/s, 3 decimals)",
                        correct: rate,
                        tol: Math.max(0.0008, rate * 0.03),
                        misconceptions: [
                            {
                                id: "forgot-exponential",
                                value: k * c, tol: 0.0008,
                                why: "You used the t = 0 rate; this is a later time.",
                                nudges: [
                                    "k·c is the rate only at t = 0. At t = " + t + " the exponential e^(−kt) is no longer 1 — it has decayed.",
                                    "Rate(t) = k·c·e^(−kt). Multiply your k·c by e^(−" + k + "×" + t + ") = e^(−" + show(k * t) + ").",
                                    "Compute k·c·e^(−kt) = " + k + "×" + c + "×" + show(Math.exp(-k * t)) + " = " + show(rate) + "."
                                ]
                            },
                            {
                                id: "conc-not-rate-t",
                                value: c * Math.exp(-k * t), tol: 0.005,
                                why: "That's [A] at time t, not the rate.",
                                nudges: [
                                    "You evaluated the concentration [A] at t = " + t + ". The rate needs the derivative: multiply by the factor k that differentiating the exponential brings down.",
                                    "Rate = k × [A](t) = " + k + " × (that concentration)."
                                ]
                            },
                            {
                                id: "sign-dropped-t",
                                value: -rate, tol: 0.0008,
                                why: "Right magnitude, wrong sign.",
                                nudges: [
                                    "The −d[A]/dt convention makes a consumption rate positive. Report the magnitude."
                                ]
                            }
                        ]
                    };
                }
            },

            // ---------------- TIER 3 (Hard): cross-domain — marginal cost set to a target ----------------
            {
                gen() {
                    // total cost C(q) = f + b·q + a·q²  ->  MC = b + 2a·q
                    const a = A.rand([0.04, 0.05, 0.1]);
                    const b = A.rand([6, 8, 12]);
                    const target = b + A.rand([6, 8, 10]); // a marginal cost above the base slope
                    const qStar = (target - b) / (2 * a);  // solve b + 2a·q = target
                    return {
                        prompt: "A plant's total cost is $C(q) = 200 + " + b + "q + " + a +
                            "q^2$ dollars for $q$ units. At what output $q$ does the " +
                            "<strong>marginal cost</strong> reach $" + target + "$ per unit?",
                        correct: qStar,
                        tol: Math.max(0.5, qStar * 0.02),
                        misconceptions: [
                            {
                                id: "used-total-not-marginal",
                                value: (function () {
                                    // student set C(q)=target (tiny q) — solve a·q²+b·q+200=target, take positive root if any
                                    const disc = b * b - 4 * a * (200 - target);
                                    return disc > 0 ? (-b + Math.sqrt(disc)) / (2 * a) : -999;
                                })(),
                                tol: 1.0,
                                why: "You set total cost equal to the target, not marginal cost.",
                                nudges: [
                                    "Marginal cost is the <em>derivative</em> dC/dq, not C(q) itself. The target is a per-unit rate, so compare it to dC/dq.",
                                    "Differentiate: dC/dq = " + b + " + " + (2 * a) + "q. Set that equal to " + target + ".",
                                    "Solve " + b + " + " + (2 * a) + "q = " + target + "  →  q = (" + target + " − " + b + ")/" + (2 * a) + "."
                                ]
                            },
                            {
                                id: "forgot-factor-2",
                                value: (target - b) / a, tol: 1.0,
                                why: "Check the derivative of the q² term.",
                                nudges: [
                                    "d/dq of a·q² is 2a·q, not a·q — the power rule brings the exponent down. So dC/dq = " + b + " + " + (2 * a) + "q.",
                                    "Re-solve with the 2: q = (" + target + " − " + b + ")/(2×" + a + ")."
                                ]
                            },
                            {
                                id: "forgot-base-slope",
                                value: target / (2 * a), tol: 1.0,
                                why: "You dropped the constant marginal term b.",
                                nudges: [
                                    "Marginal cost is " + b + " + " + (2 * a) + "q — it starts at " + b + " even when q = 0. Subtract that base before dividing.",
                                    "q = (" + target + " − " + b + ")/(2×" + a + ")."
                                ]
                            }
                        ]
                    };
                }
            }
        ]
    };

    // if the engine already ran its mount pass, re-mount now that we're registered
    if (window.AdaptiveEngine) window.AdaptiveEngine.mountAll();
})();
