/**
 * Adaptive skill: the dot product (§2.3 of the book).
 * Tier 1: compute a·b from components.
 * Tier 2: angle between vectors via cos θ = a·b/(|a||b|).
 * Tier 3: bond angle from atomic POSITIONS (central atom off-origin),
 *         targeting the positions-vs-bond-vectors error.
 * Registers on window.AdaptiveSkills; misconception values are computed
 * from the SAME random params as the correct answer.
 */

(function () {
    const A = window.Adaptive;

    const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
    const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const mag2 = v => Math.hypot(v[0], v[1]);
    const mag3 = v => Math.hypot(v[0], v[1], v[2]);
    const clamp = x => Math.max(-1, Math.min(1, x));
    const degAngle2 = (a, b) => Math.acos(clamp(dot2(a, b) / (mag2(a) * mag2(b)))) * 180 / Math.PI;
    const degAngle3 = (a, b) => Math.acos(clamp(dot3(a, b) / (mag3(a) * mag3(b)))) * 180 / Math.PI;
    const f = (x, n) => (Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toString();

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["dot-product"] = {
        id: "dot-product",
        title: "The dot product",
        tiers: [

            // ---------- TIER 1: compute a·b from components ----------
            {
                gen() {
                    // reroll until correct answer and all misconception values differ
                    for (let tries = 0; tries < 50; tries++) {
                        const a = [A.randInt(1, 5), A.randInt(-4, -1)];
                        const b = [A.randInt(1, 5), A.randInt(1, 4)];
                        const correct = dot2(a, b);
                        const sumAll = a[0] + a[1] + b[0] + b[1];        // added everything
                        const crossSwap = a[0] * b[1] + a[1] * b[0];     // mismatched components
                        const subbed = a[0] * b[0] - a[1] * b[1];        // subtracted second term
                        const vals = [correct, sumAll, crossSwap, subbed];
                        if (new Set(vals).size < 4) continue;
                        return {
                            prompt: "Let $\\mathbf{a} = (" + a[0] + ", " + a[1] + ")$ and " +
                                "$\\mathbf{b} = (" + b[0] + ", " + b[1] + ")$. Compute $\\mathbf{a} \\cdot \\mathbf{b}$.",
                            correct: correct,
                            tol: 0.01,
                            misconceptions: [
                                {
                                    id: "added-everything",
                                    value: sumAll, tol: 0.01,
                                    why: "You added the components instead of multiplying matching pairs.",
                                    nudges: [
                                        "The dot product pairs components up first: first with first, second with second. Each pair is <em>multiplied</em>.",
                                        "Compute " + a[0] + "×" + b[0] + " and " + a[1] + "×" + b[1] + " separately, then add those two products.",
                                        "That is " + (a[0] * b[0]) + " + (" + (a[1] * b[1]) + "). Add them."
                                    ]
                                },
                                {
                                    id: "cross-swapped",
                                    value: crossSwap, tol: 0.01,
                                    why: "You paired mismatched components (first with second).",
                                    nudges: [
                                        "Matching components pair up: $a_1 b_1 + a_2 b_2$, never $a_1 b_2$. The x-part of one vector only ever meets the x-part of the other.",
                                        "Pair " + a[0] + " with " + b[0] + ", and " + a[1] + " with " + b[1] + "."
                                    ]
                                },
                                {
                                    id: "subtracted",
                                    value: subbed, tol: 0.01,
                                    why: "The products are added, not subtracted — even when components are negative.",
                                    nudges: [
                                        "The formula is $a_1 b_1 + a_2 b_2$ with a plus sign. Negative signs enter only through the components themselves.",
                                        "Here $a_2 b_2 = " + (a[1] * b[1]) + "$ — already negative. Add it to " + (a[0] * b[0]) + " as-is."
                                    ]
                                }
                            ]
                        };
                    }
                }
            },

            // ---------- TIER 2: angle between two vectors ----------
            {
                gen() {
                    for (let tries = 0; tries < 50; tries++) {
                        const a = [A.randInt(1, 4), A.randInt(1, 4)];
                        const b = [A.randInt(1, 4), A.randInt(-4, -1)];
                        const cosT = clamp(dot2(a, b) / (mag2(a) * mag2(b)));
                        const deg = Math.acos(cosT) * 180 / Math.PI;
                        const rad = Math.acos(cosT);
                        if (Math.abs(deg) < 5 || Math.abs(deg - rad) < 2) continue;
                        return {
                            prompt: "Find the angle in <strong>degrees</strong> between " +
                                "$\\mathbf{a} = (" + a[0] + ", " + a[1] + ")$ and " +
                                "$\\mathbf{b} = (" + b[0] + ", " + b[1] + ")$. (1 decimal place)",
                            correct: deg,
                            tol: 0.6,
                            misconceptions: [
                                {
                                    id: "radian-mode",
                                    value: rad, tol: 0.03,
                                    why: "That is the angle in radians — the question asks for degrees.",
                                    nudges: [
                                        "Your arccos came back in radians. Check your calculator's angle mode, or convert: degrees = radians × 180/π.",
                                        "Multiply " + f(rad, 4) + " by 180/π ≈ 57.296."
                                    ]
                                },
                                {
                                    id: "stopped-at-cos",
                                    value: cosT, tol: 0.02,
                                    why: "That is cos θ, not θ. One more step.",
                                    nudges: [
                                        "You computed the cosine of the angle. The angle itself needs the arccosine of that number.",
                                        "Take arccos(" + f(cosT, 4) + ") with your calculator in degree mode."
                                    ]
                                },
                                {
                                    id: "reported-dot",
                                    value: dot2(a, b), tol: 0.01,
                                    why: "That is the dot product itself, not an angle.",
                                    nudges: [
                                        "The dot product is only the numerator. Divide by |a||b| to get cos θ, then take the arccosine.",
                                        "cos θ = " + dot2(a, b) + " / (" + f(mag2(a), 3) + " × " + f(mag2(b), 3) + "). Then arccos, in degrees."
                                    ]
                                }
                            ]
                        };
                    }
                }
            },

            // ---------- TIER 3: bond angle from atomic positions ----------
            {
                gen() {
                    for (let tries = 0; tries < 50; tries++) {
                        const phi = A.rand([96, 104.5, 109.5, 120]) * Math.PI / 180;
                        const r = A.rand([0.96, 1.01, 1.09]);
                        const c = [A.rand([0.5, 1.0, 1.5]), A.rand([0.5, 1.0]), 0]; // central atom OFF origin
                        const b1 = [r, 0, 0];
                        const b2 = [r * Math.cos(phi), r * Math.sin(phi), 0];
                        const p1 = [c[0] + b1[0], c[1] + b1[1], 0];
                        const p2 = [c[0] + b2[0], c[1] + b2[1], 0];
                        const correct = degAngle3(b1, b2);           // true bond angle
                        const posAngle = degAngle3(p1, p2);          // angle of raw positions at the ORIGIN
                        const rad = correct * Math.PI / 180;
                        if (Math.abs(correct - posAngle) < 4) continue;
                        const F = x => f(x, 3);
                        return {
                            prompt: "A crystal structure lists a central atom X at $(" + F(c[0]) + ", " + F(c[1]) + ", 0)$ Å " +
                                "and two bonded atoms at $(" + F(p1[0]) + ", " + F(p1[1]) + ", 0)$ and " +
                                "$(" + F(p2[0]) + ", " + F(p2[1]) + ", 0)$ Å. " +
                                "Find the bond angle at X, in degrees. (1 decimal place)",
                            correct: correct,
                            tol: 0.8,
                            misconceptions: [
                                {
                                    id: "positions-not-bonds",
                                    value: posAngle, tol: 1.0,
                                    why: "You dotted the raw positions — that measures the angle at the coordinate origin, not at atom X.",
                                    nudges: [
                                        "The angle formula needs vectors placed tail-to-tail <em>at the vertex of the angle</em> — atom X. Positions in the file are measured from the crystallographer's origin, which is somewhere else entirely.",
                                        "Build bond vectors first: $\\mathbf{b}_i = \\mathbf{r}_i - \\mathbf{r}_X$. Subtract X's coordinates from each bonded atom's coordinates, then apply the formula to the b's.",
                                        "b₁ = (" + F(b1[0]) + ", " + F(b1[1]) + ", 0) and b₂ = (" + F(b2[0]) + ", " + F(b2[1]) + ", 0). Now use cos θ = b₁·b₂/(|b₁||b₂|)."
                                    ]
                                },
                                {
                                    id: "radian-mode",
                                    value: rad, tol: 0.03,
                                    why: "That is radians; bond angles are conventionally reported in degrees.",
                                    nudges: [
                                        "A bond angle of ~2 should ring an alarm — molecules do not fold to two degrees. Your arccos returned radians.",
                                        "Multiply by 180/π."
                                    ]
                                },
                                {
                                    id: "stopped-at-cos",
                                    value: Math.cos(rad), tol: 0.02,
                                    why: "That is cos θ, not the angle.",
                                    nudges: [
                                        "Finish the computation: θ = arccos of that value, in degree mode."
                                    ]
                                }
                            ]
                        };
                    }
                }
            }
        ]
    };
})();
