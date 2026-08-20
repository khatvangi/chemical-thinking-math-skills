/**
 * Adaptive skill: matrix algebra (§3.2).
 * Tier 1 (numeric): one entry of a 2×2 matrix product.
 * Tier 2 (numeric): one entry of a 2×2 inverse.
 * Tier 3 (numeric): solve a 2×2 chemical system for one unknown.
 */

(function () {
    const A = window.Adaptive;

    const T1 = {
        gen() {
            for (let t = 0; t < 60; t++) {
                const M = [[A.randInt(1, 4), A.randInt(-3, 4)], [A.randInt(-2, 4), A.randInt(1, 4)]];
                const N = [[A.randInt(1, 4), A.randInt(-3, 4)], [A.randInt(-2, 4), A.randInt(1, 4)]];
                const i = A.rand([0, 1]), j = A.rand([0, 1]);
                const correct = M[i][0] * N[0][j] + M[i][1] * N[1][j];
                const entrywise = M[i][j] * N[i][j];
                const rowRow = M[i][0] * N[j][0] + M[i][1] * N[j][1];
                const reversed = N[i][0] * M[0][j] + N[i][1] * M[1][j];
                if (new Set([correct, entrywise, rowRow, reversed]).size < 4) continue;
                return {
                    prompt: "Let $A = \\begin{pmatrix} " + M[0][0] + " & " + M[0][1] + " \\\\ " + M[1][0] + " & " + M[1][1] +
                        " \\end{pmatrix}$, $B = \\begin{pmatrix} " + N[0][0] + " & " + N[0][1] + " \\\\ " + N[1][0] + " & " + N[1][1] +
                        " \\end{pmatrix}$. Compute the entry in row " + (i + 1) + ", column " + (j + 1) + " of $AB$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "entrywise",
                            value: entrywise, tol: 0.01,
                            why: "You multiplied matching entries. The matrix product dots a ROW of A with a COLUMN of B.",
                            nudges: [
                                "(AB)_{" + (i + 1) + (j + 1) + "} = (row " + (i + 1) + " of A) · (column " + (j + 1) + " of B).",
                                "Compute " + M[i][0] + "×" + N[0][j] + " + (" + M[i][1] + ")×" + N[1][j] + "."
                            ]
                        },
                        {
                            id: "row-row",
                            value: rowRow, tol: 0.01,
                            why: "You dotted a row of A with a ROW of B — the second factor contributes a column.",
                            nudges: [
                                "Column " + (j + 1) + " of B is (" + N[0][j] + ", " + N[1][j] + "), read DOWNWARD. Dot row " + (i + 1) + " of A with that."
                            ]
                        },
                        {
                            id: "reversed-order",
                            value: reversed, tol: 0.01,
                            why: "That is the (" + (i + 1) + "," + (j + 1) + ") entry of BA — and BA ≠ AB in general.",
                            nudges: [
                                "Order matters (Theorem 3.2.2). The FIRST factor supplies the row: use A's row " + (i + 1) + ", B's column " + (j + 1) + "."
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
                const a = A.randInt(1, 5), b = A.randInt(1, 4), c = A.randInt(1, 4), d = A.randInt(2, 6);
                const det = a * d - b * c;
                if (det === 0 || det === 1) continue;
                // ask for the (1,1) entry of the inverse: d/det
                const correct = d / det;
                const vals = [correct, d, a / det, -d / det];
                if (new Set(vals.map(x => Math.round(x * 1000))).size < 4) continue;
                return {
                    prompt: "For $A = \\begin{pmatrix} " + a + " & " + b + " \\\\ " + c + " & " + d +
                        " \\end{pmatrix}$, compute the entry in row 1, column 1 of $A^{-1}$. (3 decimals)",
                    correct: correct,
                    tol: 0.004,
                    misconceptions: [
                        {
                            id: "forgot-det",
                            value: d, tol: 0.01,
                            why: "You swapped the diagonal but skipped dividing by the determinant.",
                            nudges: [
                                "The 2×2 inverse is (1/(ad−bc)) × (swapped/negated matrix). Here ad−bc = " + a + "×" + d + " − " + b + "×" + c + " = " + det + ".",
                                "Divide " + d + " by " + det + "."
                            ]
                        },
                        {
                            id: "no-swap",
                            value: a / det, tol: 0.004,
                            why: "You divided by the determinant but forgot to SWAP the diagonal — the (1,1) slot of the inverse holds d, not a.",
                            nudges: [
                                "Theorem 3.2.4: the diagonal entries a and d trade places. The (1,1) entry is d/(ad−bc) = " + d + "/" + det + "."
                            ]
                        },
                        {
                            id: "wrong-sign",
                            value: -d / det, tol: 0.004,
                            why: "The minus signs belong to the OFF-diagonal entries b and c, not the diagonal.",
                            nudges: [
                                "Pattern: swap a↔d, negate b and c. Diagonal entries stay positive (as written): d/" + det + "."
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
                // build a clean system: choose solution first
                const x = A.randInt(1, 5), y = A.randInt(1, 5);
                const a = A.randInt(1, 4), b = A.randInt(1, 3), c = A.randInt(1, 3), d = A.randInt(2, 4);
                const det = a * d - b * c;
                if (det === 0) continue;
                const p = a * x + b * y, q = c * x + d * y;
                const which = A.rand(["x", "y"]);
                const correct = which === "x" ? x : y;
                const other = which === "x" ? y : x;
                if (correct === other) continue;
                return {
                    prompt: "A mixture of two acids satisfies the titration balances $" +
                        a + "x + " + b + "y = " + p + "$ and $" + c + "x + " + d + "y = " + q +
                        "$ (mmol). Solve the system: what is $" + which + "$?",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "swapped-unknowns",
                            value: other, tol: 0.01,
                            why: "That is the value of the OTHER unknown — the pair got swapped at the end.",
                            nudges: [
                                "Substitute your values back into the first equation: " + a + "×(your x) + " + b + "×(your y) must equal " + p + ". Which assignment survives?"
                            ]
                        },
                        {
                            id: "rhs-ratio",
                            value: Math.abs(p / a - correct) > 0.005 ? p / a : NaN, tol: 0.01,
                            why: "That is " + p + "/" + a + " — solving equation 1 as if y were zero. Both equations constrain both unknowns.",
                            nudges: [
                                "One equation alone can't pin two unknowns. Eliminate: multiply the equations to match a coefficient, subtract, then back-substitute — or use the 2×2 inverse of the coefficient matrix."
                            ]
                        },
                        {
                            id: "sum-misread",
                            value: Math.abs(x + y - correct) > 0.005 ? x + y : NaN, tol: 0.01,
                            why: "That is x + y, the total — the question asks for " + which + " alone.",
                            nudges: [
                                "Finish the elimination: once one unknown is known, back-substitute to isolate " + which + "."
                            ]
                        }
                    ].filter(m => isFinite(m.value))
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["matrix-algebra"] = {
        id: "matrix-algebra",
        title: "Matrix algebra",
        tiers: [T1, T2, T3]
    };
})();
