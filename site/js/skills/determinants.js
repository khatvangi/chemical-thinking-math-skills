/**
 * Adaptive skill: determinants (§3.4).
 * Tier 1 (numeric): compute a 2×2 determinant.
 * Tier 2 (numeric): area spanned by two vectors (sign vs magnitude).
 * Tier 3 (numeric): monoclinic unit-cell volume — the shear must drop out.
 */

(function () {
    const A = window.Adaptive;

    const T1 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const a = A.randInt(1, 6), b = A.randInt(1, 5), c = A.randInt(1, 5), d = A.randInt(1, 6);
                const correct = a * d - b * c;
                const plus = a * d + b * c;
                const wrongPair = a * b - c * d;
                const trace = a + d;
                if (new Set([correct, plus, wrongPair, trace]).size < 4) continue;
                return {
                    prompt: "Compute $\\det \\begin{pmatrix} " + a + " & " + b + " \\\\ " + c + " & " + d + " \\end{pmatrix}$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "plus-sign",
                            value: plus, tol: 0.01,
                            why: "You ADDED the two products — the anti-diagonal product is subtracted.",
                            nudges: [
                                "det = (diagonal product) − (anti-diagonal product): " + a + "×" + d + " − " + b + "×" + c + ".",
                                "Compute " + (a * d) + " − " + (b * c) + "."
                            ]
                        },
                        {
                            id: "wrong-pairing",
                            value: wrongPair, tol: 0.01,
                            why: "Wrong pairing: the diagonal is a·d (top-left times bottom-right), not a·b.",
                            nudges: [
                                "Pair corner-to-corner: " + a + " (top-left) with " + d + " (bottom-right); " + b + " with " + c + ". Then subtract."
                            ]
                        },
                        {
                            id: "trace",
                            value: trace, tol: 0.01,
                            why: "That is the trace (sum of diagonal entries), a different quantity entirely.",
                            nudges: [
                                "The determinant multiplies and subtracts: ad − bc, not a + d."
                            ]
                        }
                    ]
                };
            }
        }
    };

    const T2 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                // arrange for a NEGATIVE determinant so |·| matters
                const u = [A.randInt(1, 4), A.randInt(2, 5)];
                const v = [A.randInt(2, 5), A.randInt(1, 3)];
                const det = u[0] * v[1] - v[0] * u[1];
                if (det >= 0) continue;
                const correct = Math.abs(det);
                const dot = u[0] * v[0] + u[1] * v[1];
                const lenProd = Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]);
                if (new Set([correct, det, dot].map(x => Math.round(x * 100))).size < 3) continue;
                if (Math.abs(lenProd - correct) < 0.05) continue;
                return {
                    prompt: "Find the <strong>area</strong> of the parallelogram spanned by $\\mathbf{u} = (" +
                        u.join(", ") + ")$ and $\\mathbf{v} = (" + v.join(", ") + ")$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "kept-sign",
                            value: det, tol: 0.01,
                            why: "A negative area is impossible — the sign of the determinant records orientation, and the area is its absolute value.",
                            nudges: [
                                "det = " + u[0] + "×" + v[1] + " − " + v[0] + "×" + u[1] + " = " + det + " < 0 means the pair (u, v) is clockwise. The AREA is |" + det + "|."
                            ]
                        },
                        {
                            id: "used-dot",
                            value: dot, tol: 0.01,
                            why: "That is the dot product — the overlap measure. Area is the determinant's job.",
                            nudges: [
                                "Dot measures alignment; det measures span. Area = |u_x v_y − v_x u_y| = |" + u[0] + "×" + v[1] + " − " + v[0] + "×" + u[1] + "|."
                            ]
                        },
                        {
                            id: "length-product",
                            value: lenProd, tol: Math.max(0.02, lenProd * 0.005),
                            why: "|u||v| is the MAXIMUM possible area, achieved only for perpendicular vectors — the sin θ factor is missing.",
                            nudges: [
                                "Area = |u||v| sin θ, and the determinant computes exactly that in one step: |" + u[0] + "×" + v[1] + " − " + v[0] + "×" + u[1] + "|."
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
                const a1 = A.rand([7.2, 8.4, 9.8, 10.6]);
                const b2 = A.rand([6.8, 9.4, 11.2]);
                const c3 = A.rand([7.5, 9.3, 12.1]);
                const s = A.rand([1.2, 1.8, 2.4]); // shear of the c-axis along x
                const correct = a1 * b2 * c3;
                const edgeProd = a1 * b2 * Math.hypot(s, c3);
                const baseOnly = a1 * b2;
                if (Math.abs(edgeProd - correct) < 0.6) continue;
                const r1 = x => Math.round(x * 10) / 10;
                return {
                    prompt: "A monoclinic unit cell has lattice vectors (Å) $\\mathbf{a} = (" + a1 + ", 0, 0)$, " +
                        "$\\mathbf{b} = (0, " + b2 + ", 0)$, $\\mathbf{c} = (-" + s + ", 0, " + c3 + ")$. " +
                        "Compute the cell volume in Å³ (1 decimal).",
                    correct: correct,
                    tol: Math.max(0.15, correct * 0.004),
                    misconceptions: [
                        {
                            id: "edge-lengths",
                            value: edgeProd, tol: Math.max(0.15, edgeProd * 0.004),
                            why: "You multiplied the three EDGE LENGTHS — but the cell is sheared, and a slanted box holds less than edge-product suggests.",
                            nudges: [
                                "|c| = √(" + s + "² + " + c3 + "²) = " + r1(Math.hypot(s, c3)) + " Å is the edge length, but volume = base × HEIGHT, and the height along z is just " + c3 + ".",
                                "Use the determinant: with these columns it reduces to " + a1 + " × " + b2 + " × " + c3 + " — the shear drops out entirely."
                            ]
                        },
                        {
                            id: "base-only",
                            value: baseOnly, tol: 0.1,
                            why: "That is the area of the ab-base (Å²) — the third dimension is missing.",
                            nudges: [
                                "Volume = (base area) × (height): multiply by the c-axis' vertical component " + c3 + "."
                            ]
                        },
                        {
                            id: "subtracted-shear",
                            value: a1 * b2 * (c3 - s), tol: 0.1,
                            why: "The shear does not reduce the height — the c-axis still rises " + c3 + " Å vertically.",
                            nudges: [
                                "Cofactor-expand the determinant: the −" + s + " entry multiplies a 2×2 block of zeros and contributes nothing. V = " + a1 + "×" + b2 + "×" + c3 + "."
                            ]
                        }
                    ]
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["determinants"] = {
        id: "determinants",
        title: "Determinants",
        tiers: [T1, T2, T3]
    };
})();
