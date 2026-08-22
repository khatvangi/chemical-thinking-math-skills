/**
 * Adaptive skill: complex numbers (§1.4).
 * Tier 1 (numeric): real part of a product — the i² = −1 sign flip.
 * Tier 2 (numeric): modulus (Pythagorean families).
 * Tier 3 (numeric): polar multiplication — angles ADD.
 */

(function () {
    const A = window.Adaptive;

    const T1 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const a = A.randInt(1, 5), b = A.randInt(1, 4);
                const c = A.randInt(1, 5), d = A.randInt(1, 4);
                const correct = a * c - b * d;                 // real part
                const noFlip = a * c + b * d;                  // forgot i² = −1
                const droppedTerm = a * c;                     // ignored bd entirely
                const imagPart = a * d + b * c;                // reported Im instead of Re
                if (new Set([correct, noFlip, droppedTerm, imagPart]).size < 4) continue;
                return {
                    prompt: "Compute the <strong>real part</strong> of $(" + a + " + " + b + "i)(" + c + " + " + d + "i)$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "no-sign-flip",
                            value: noFlip, tol: 0.01,
                            why: "The bd term enters through i·i = i² = −1 — it SUBTRACTS from the real part.",
                            nudges: [
                                "Distribute: the term " + b + "i × " + d + "i = " + (b * d) + "·i², and i² = −1 makes it −" + (b * d) + ", which is real.",
                                "Real part = ac − bd = " + (a * c) + " − " + (b * d) + "."
                            ]
                        },
                        {
                            id: "dropped-bd",
                            value: droppedTerm, tol: 0.01,
                            why: "The product of the two imaginary parts is REAL (via i² = −1) and belongs in the answer.",
                            nudges: [
                                b + "i × " + d + "i is not imaginary — the i's multiply to −1 and the term lands in the real part: −" + (b * d) + ". Add it to " + (a * c) + "."
                            ]
                        },
                        {
                            id: "imag-part",
                            value: imagPart, tol: 0.01,
                            why: "That is the imaginary part (ad + bc); the question asks for the real part.",
                            nudges: [
                                "Sort the four distributed terms: ac and (bd·i²) are real; adi and bci are imaginary. The real part is ac − bd."
                            ]
                        }
                    ]
                };
            }
        }
    };

    const PAIRS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15]];

    const T2 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const p = A.rand(PAIRS);
                const flip = Math.random() < 0.5;
                const a = flip ? p[1] : p[0];
                const b = flip ? p[0] : p[1];
                const sign = Math.random() < 0.4 ? -1 : 1;
                const correct = p[2];
                const sum = a + sign * b;
                const noSqrt = correct * correct;
                if (new Set([correct, Math.abs(sum), noSqrt, a]).size < 4) continue;
                return {
                    prompt: "An NMR detector records the signal $z = " + a + (sign < 0 ? " - " : " + ") + b +
                        "i$ (arbitrary units). What is the signal's amplitude $|z|$?",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "no-sqrt",
                            value: noSqrt, tol: 0.01,
                            why: "That is |z|² = z·z̄ — the square root is still owed.",
                            nudges: [
                                "|z| = √(a² + b²) = √(" + (a * a) + " + " + (b * b) + ") = √" + noSqrt + "."
                            ]
                        },
                        {
                            id: "added-parts",
                            value: Math.abs(sum), tol: 0.01,
                            why: "Real and imaginary parts are perpendicular directions in the Argand plane — they combine by Pythagoras, not by plain addition.",
                            nudges: [
                                "The modulus is the arrow's LENGTH: √(" + a + "² + (" + (sign * b) + ")²). Signs die in the squares."
                            ]
                        },
                        {
                            id: "real-only",
                            value: a, tol: 0.01,
                            why: "That is only the real part — the imaginary channel carries signal too.",
                            nudges: [
                                "Amplitude uses both quadrature channels: |z| = √(" + a + "² + " + b + "²)."
                            ]
                        }
                    ]
                };
            }
        }
    };

    const T3 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const th1 = A.rand([30, 45, 60, 90, 120]);
                const th2 = A.rand([30, 45, 60, 90]);
                const r1 = A.randInt(2, 4), r2 = A.randInt(2, 3);
                const correct = th1 + th2;
                const avg = (th1 + th2) / 2;
                const diff = Math.abs(th1 - th2);
                const modProduct = r1 * r2;
                if (new Set([correct, avg, diff, modProduct]).size < 4) continue;
                return {
                    prompt: "Two complex numbers in polar form: $z_1$ has modulus $" + r1 + "$ and angle $" + th1 +
                        "^\\circ$; $z_2$ has modulus $" + r2 + "$ and angle $" + th2 +
                        "^\\circ$. What is the <strong>angle</strong> (in degrees) of the product $z_1 z_2$?",
                    correct: correct,
                    tol: 0.5,
                    misconceptions: [
                        {
                            id: "averaged",
                            value: avg, tol: 0.5,
                            why: "Angles are not averaged under multiplication — each factor's rotation is applied in full.",
                            nudges: [
                                "Theorem 1.4.3: multiplying by z₂ ROTATES z₁ by z₂'s full angle. Total turn: " + th1 + "° + " + th2 + "°."
                            ]
                        },
                        {
                            id: "subtracted",
                            value: diff, tol: 0.5,
                            why: "Subtracting angles is DIVISION's rule; multiplication adds them.",
                            nudges: [
                                "Products stack rotations: " + th1 + "° + " + th2 + "°. (The angle difference would appear in z₁/z₂.)"
                            ]
                        },
                        {
                            id: "gave-modulus",
                            value: modProduct, tol: 0.4,
                            why: "That is the product's MODULUS (" + r1 + "×" + r2 + ") — the question asks for its angle.",
                            nudges: [
                                "Two outputs per product: moduli multiply (" + r1 + "×" + r2 + " = " + modProduct + "), angles add. Report the angle: " + th1 + " + " + th2 + " degrees."
                            ]
                        }
                    ]
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["complex-numbers"] = {
        id: "complex-numbers",
        title: "Complex numbers",
        tiers: [T1, T2, T3]
    };
})();
