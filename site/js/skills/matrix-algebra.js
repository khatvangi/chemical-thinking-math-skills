/**
 * Adaptive skill: matrix algebra (§3.2).
 * Tier 1 (numeric): one entry of a 2×2 matrix product.
 * Tier 2 (numeric): one entry of a 2×2 inverse.
 * Tier 3 (numeric): solve a 2×2 system via the inverse.
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
                const rowRow = M[i][0] * N[j][0] + M[i][1] * N[j][1];   // dotted two rows
                const other = M[j][0] * N[0][i] + M[j][1] * N[1][i];    // transposed position
                if (new Set([correct, entrywise, rowRow, other]).size < 4) continue;
                return {
                    prompt: "For $M = \\begin{pmatrix} " + M[0][0] + " & " + M[0][1] + " \\\\ " + M[1][0] + " & " + M[1][1] +
                        " \\end{pmatrix}$ and $N = \\begin{pmatrix} " + N[0][0] + " & " + N[0][1] + " \\\\ " + N[1][0] + " & " + N[1][1] +
                        " \\end{pmatrix}$, compute the entry in <strong>row " + (i + 1) + ", column " + (j + 1) + "</strong> of $MN$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "entrywise",
                            value: entrywise, tol: 0.01,
                            why: "You multiplied matching entries. The matrix product dots a full ROW of M with a full COLUMN of N.",
                            nudges: [
                                "Entry (i, j) of MN = (row i of M) · (column j of N) — a sum of two products, not one.",
                                "Compute " + M[i][0] + "×" + N[0][j] + " + (" + M[i][1] + ")×" + N[1][j] + "."
                            ]
                        },
                        {
                            id: "row-row",
                            value: rowRow, tol: 0.01,
                            why: "You dotted a row of M with a ROW of N — the right factor contributes columns.",
                            nudges: [
                                "Left factor: rows. Right factor: COLUMNS. Column " + (j + 1) + " of N is (" + N[0][j] + ", " + N[1][j] + "). Dot it with row " + (i + 1) + " of M."
                            ]
                        },
                        {
                            id: "transposed-entry",
                            value: other, tol: 0.01,
                            why: "That is the (" + (j + 1) + ", " + (i + 1) + ") entry — row and column swapped.",
                            nudges: [
                                "Row index first: you need row " + (i + 1) + " of M against column " + (j + 1) + " of N."
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
                const a = A.randInt(1, 5), b = A.randInt(1, 4), c = A.randInt(1, 4), d = A.randInt(1, 5);
                const det = a * d - b * c;
                if (det === 0 || Math.abs(det) > 6) continue;
                // ask for entry (1,1) of the inverse: d/det
                const correct = d / det;
                const vals = [correct, a / det, d, -d / det];
                if (new Set(vals.map(x => Math.round(x * 1000))).size < 4) continue;
                return {
                    prompt: "For $A = \\begin{pmatrix} " + a + " & " + b + " \\\\ " + c + " & " + d +
                        " \\end{pmatrix}$, compute the <strong>row 1, column 1</strong> entry of $A^{-1}$. (3 decimals)",
                    correct: correct,
                    tol: 0.004,
                    misconceptions: [
                        {
                            id: "forgot-swap",
                            value: a / det, tol: 0.004,
                            why: "You kept a in place — the 2×2 inverse SWAPS the diagonal entries first.",
                            nudges: [
                                "Swap the diagonal (a ↔ d), negate the off-diagonal, divide by ad − bc. Position (1,1) receives d.",
                                "Entry (1,1) of A⁻¹ = d/(ad − bc) = " + d + "/" + det + "."
                            ]
                        },
                        {
                            id: "forgot-det",
                            value: d, tol: 0.004,
                            why: "The swap is right but the division by ad − bc is missing.",
                            nudges: [
                                "The whole swapped-and-negated matrix is divided by ad − bc = " + a + "×" + d + " − " + b + "×" + c + " = " + det + ".",
                                "Compute " + d + "/" + det + "."
                            ]
                        },
                        {
                            id: "wrong-sign",
                            value: -d / det, tol: 0.004,
                            why: "The DIAGONAL entries keep their sign — only the off-diagonal entries are negated.",
                            nudges: [
                                "Swap-negate-divide: negation touches b and c only. (1,1) is d/" + det + ", sign intact."
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
                const a = A.randInt(2, 5), b = A.randInt(1, 3), c = A.randInt(1, 3), d = A.randInt(2, 5);
                const det = a * d - b * c;
                if (det === 0) continue;
                const x = A.randInt(1, 4), y = A.randInt(1, 4);
                const b1 = a * x + b * y, b2 = c * x + d * y;
                const naive = b1 / a;
                const vals = [x, y, naive, b1 - b2];
                if (new Set(vals.map(v => Math.round(v * 100))).size < 4) continue;
                return {
                    prompt: "Two dyes obey $" + a + "c_X + " + b + "c_Y = " + b1 + "$ and $" + c + "c_X + " + d +
                        "c_Y = " + b2 + "$ (scaled units). Solve for $c_X$.",
                    correct: x,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "swapped-solution",
                            value: y, tol: 0.01,
                            why: "That is c_Y — the components came back in the wrong order.",
                            nudges: [
                                "By the inverse formula, c_X = (d·b₁ − b·b₂)/(ad − bc) = (" + d + "×" + b1 + " − " + b + "×" + b2 + ")/" + det + ". The first output slot is c_X."
                            ]
                        },
                        {
                            id: "ignored-coupling",
                            value: Math.abs(naive - x) > 0.02 && Math.abs(naive - y) > 0.02 ? naive : NaN,
                            tol: 0.02,
                            why: "You divided b₁ by " + a + " as if dye Y weren't absorbing — the equations are coupled.",
                            nudges: [
                                "The first equation alone can't isolate c_X: part of " + b1 + " is dye Y's contribution. Use both equations — the inverse (or elimination) untangles them.",
                                "c_X = (" + d + "×" + b1 + " − " + b + "×" + b2 + ")/" + det + "."
                            ]
                        },
                        {
                            id: "subtracted-data",
                            value: Math.abs(b1 - b2 - x) > 0.02 ? (b1 - b2) : NaN, tol: 0.02,
                            why: "Subtracting the right-hand sides doesn't isolate c_X unless the Y-coefficients happen to match.",
                            nudges: [
                                "Blind subtraction eliminates c_Y only if its coefficients are equal (" + b + " vs " + d + " — they aren't). Weight the equations first, or apply the 2×2 inverse."
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
