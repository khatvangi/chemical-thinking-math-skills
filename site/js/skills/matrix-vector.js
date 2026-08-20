/**
 * Adaptive skill: matrix–vector products (§3.1).
 * Tier 1 (numeric): one entry of a 2×2 product.
 * Tier 2 (numeric): an element total from a composition matrix.
 * Tier 3 (numeric): predicted absorbance from a Beer's-law matrix.
 */

(function () {
    const A = window.Adaptive;

    const T1 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                const M = [[A.randInt(1, 6), A.randInt(-4, 5)], [A.randInt(-3, 6), A.randInt(1, 5)]];
                const v = [A.randInt(1, 5), A.randInt(1, 5)];
                const i = A.rand([0, 1]);
                const correct = M[i][0] * v[0] + M[i][1] * v[1];
                const colDot = M[0][i] * v[0] + M[1][i] * v[1];       // used a column instead of a row
                const oneTerm = M[i][0] * v[0];                        // stopped after one term
                const rowSum = M[i][0] + M[i][1];                      // ignored v
                if (new Set([correct, colDot, oneTerm, rowSum]).size < 4) continue;
                return {
                    prompt: "Let $M = \\begin{pmatrix} " + M[0][0] + " & " + M[0][1] + " \\\\ " +
                        M[1][0] + " & " + M[1][1] + " \\end{pmatrix}$ and $\\mathbf{v} = \\begin{pmatrix} " +
                        v[0] + " \\\\ " + v[1] + " \\end{pmatrix}$. Compute entry <strong>" + (i + 1) +
                        "</strong> of $M\\mathbf{v}$.",
                    correct: correct,
                    tol: 0.01,
                    misconceptions: [
                        {
                            id: "used-column",
                            value: colDot, tol: 0.01,
                            why: "You dotted a COLUMN of M with v. Entry i of Mv uses row i.",
                            nudges: [
                                "Row i across, vector down: entry " + (i + 1) + " = (row " + (i + 1) + ") · v.",
                                "Compute " + M[i][0] + "×" + v[0] + " + (" + M[i][1] + ")×" + v[1] + "."
                            ]
                        },
                        {
                            id: "stopped-early",
                            value: oneTerm, tol: 0.01,
                            why: "Only the first product was taken — the row dot product sums ALL its terms.",
                            nudges: [
                                "The second term " + M[i][1] + "×" + v[1] + " still needs adding."
                            ]
                        },
                        {
                            id: "ignored-vector",
                            value: rowSum, tol: 0.01,
                            why: "You summed the row's entries without weighting by v.",
                            nudges: [
                                "Each row entry multiplies the matching component of v before the sum: " +
                                    M[i][0] + "×" + v[0] + " + (" + M[i][1] + ")×" + v[1] + "."
                            ]
                        }
                    ]
                };
            }
        }
    };

    const T2 = {
        gen() {
            // compounds: glucose C6H12O6, ethanol C2H6O, water H2O — rows C, H, O
            const comp = [[6, 2, 0], [12, 6, 2], [6, 1, 1]];
            const names = ["C", "H", "O"];
            const n = [A.rand([0.5, 1.0, 1.5]), A.rand([1.0, 2.0]), A.rand([5.0, 10.0])];
            const i = A.rand([0, 1, 2]);
            const row = comp[i];
            const correct = row[0] * n[0] + row[1] * n[1] + row[2] * n[2];
            const j = (i + 1) % 3;
            const wrongRow = comp[j][0] * n[0] + comp[j][1] * n[1] + comp[j][2] * n[2];
            const missing = row[0] * n[0] + row[1] * n[1];
            return {
                prompt: "A broth contains $" + n[0] + "$ mol glucose (C₆H₁₂O₆), $" + n[1] +
                    "$ mol ethanol (C₂H₆O), and $" + n[2] + "$ mol water (H₂O). " +
                    "How many moles of <strong>" + names[i] + "</strong> in total?",
                correct: correct,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "wrong-row",
                        value: wrongRow, tol: 0.01,
                        why: "That total belongs to " + names[j] + " — you used the wrong element's row.",
                        nudges: [
                            names[i] + " counts per molecule: glucose " + row[0] + ", ethanol " + row[1] + ", water " + row[2] + ". Dot those with the amounts."
                        ]
                    },
                    {
                        id: "dropped-term",
                        value: Math.abs(missing - correct) > 0.005 ? missing : NaN, tol: 0.01,
                        why: "One compound's contribution was dropped from the sum.",
                        nudges: [
                            "Every compound in the recipe contributes (possibly zero): " +
                                row[0] + "×" + n[0] + " + " + row[1] + "×" + n[1] + " + " + row[2] + "×" + n[2] + "."
                        ]
                    },
                    {
                        id: "unweighted",
                        value: row[0] + row[1] + row[2], tol: 0.01,
                        why: "You added the per-molecule counts without multiplying by the mole amounts.",
                        nudges: [
                            "Atoms per molecule × moles of molecules = moles of atoms. Weight each count by its compound's amount first."
                        ]
                    }
                ].filter(m => isFinite(m.value))
            };
        }
    };

    const T3 = {
        gen() {
            // Beer's law: A_i = eps_iX cX + eps_iY cY, 1 cm path
            const e = [[A.rand([12000, 15000]), A.rand([2000, 3000])],
                       [A.rand([1500, 2500]), A.rand([9000, 11000])]];
            const c = [A.rand([2, 4, 5]) * 1e-5, A.rand([3, 6]) * 1e-5];
            const i = A.rand([0, 1]);
            const correct = e[i][0] * c[0] + e[i][1] * c[1];
            const swapped = e[i][0] * c[1] + e[i][1] * c[0];
            const oneSpecies = e[i][0] * c[0];
            const f = x => x.toExponential(0).replace("e-5", " \\times 10^{-5}");
            return {
                prompt: "Two dyes X, Y (path 1 cm). At wavelength " + (i + 1) + ", $\\varepsilon_X = " + e[i][0] +
                    "$ and $\\varepsilon_Y = " + e[i][1] + "$ M⁻¹cm⁻¹. Concentrations: $c_X = " + f(c[0]) +
                    "$ M, $c_Y = " + f(c[1]) + "$ M. Predict the absorbance $A_" + (i + 1) + "$. (2 decimals)",
                correct: correct,
                tol: 0.012,
                misconceptions: [
                    {
                        id: "swapped-species",
                        value: Math.abs(swapped - correct) > 0.02 ? swapped : NaN, tol: 0.012,
                        why: "Each ε must multiply its OWN species' concentration — X's absorptivity with X's concentration.",
                        nudges: [
                            "Pair by species: ε_X·c_X + ε_Y·c_Y = " + e[i][0] + "×" + c[0].toExponential(1) + " + " + e[i][1] + "×" + c[1].toExponential(1) + "."
                        ]
                    },
                    {
                        id: "one-species",
                        value: oneSpecies, tol: 0.012,
                        why: "Absorbances of the two dyes ADD — the mixture's A includes both contributions.",
                        nudges: [
                            "Beer's law in a mixture is a sum over absorbers. Add dye Y's term " + e[i][1] + "×" + c[1].toExponential(1) + "."
                        ]
                    },
                    {
                        id: "added-eps",
                        value: (e[i][0] + e[i][1]) * c[0], tol: 0.012,
                        why: "You summed the ε's and applied one concentration — each ε weights its own dye's concentration.",
                        nudges: [
                            "This is a dot product, not a lump sum: (ε_X, ε_Y)·(c_X, c_Y)."
                        ]
                    }
                ].filter(m => isFinite(m.value))
            };
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["matrix-vector"] = {
        id: "matrix-vector",
        title: "Matrix–vector products",
        tiers: [T1, T2, T3]
    };
})();
