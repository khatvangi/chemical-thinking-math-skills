/**
 * Adaptive skill: basis and coordinates (§2.4).
 * Tier 1 (numeric): fractional → Cartesian in an orthogonal cell.
 * Tier 2 (numeric): coordinate via projection onto an orthonormal basis vector.
 * Tier 3 (numeric): magnitude invariance across orthonormal frames.
 */

(function () {
    const A = window.Adaptive;

    const T1 = {
        gen() {
            const cell = [A.rand([4.0, 5.0, 6.0]), A.rand([7.0, 8.0]), A.rand([9.0, 10.0])];
            const fr = [A.rand([0.25, 0.5, 0.75]), A.rand([0.2, 0.4, 0.6]), A.rand([0.1, 0.3])];
            const i = A.rand([0, 1, 2]);
            const name = ["x", "y", "z"][i];
            const correct = fr[i] * cell[i];
            const j = (i + 1) % 3;
            return {
                prompt: "An orthorhombic cell has perpendicular edges $a = " + cell[0] + "$, $b = " + cell[1] +
                    "$, $c = " + cell[2] + "$ Å along $x, y, z$. An atom sits at fractional coordinates $(" +
                    fr.join(", ") + ")$. What is its Cartesian <strong>" + name + "</strong>-coordinate in Å?",
                correct: correct,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "divided",
                        value: fr[i] / cell[i], tol: 0.005,
                        why: "You divided fraction by edge — conversion to Cartesian multiplies the fraction BY the cell edge.",
                        nudges: [
                            "Fractional 0.5 means 'half-way along that edge.' Half of " + cell[i] + " Å is a multiplication: u × a.",
                            "Compute " + fr[i] + " × " + cell[i] + "."
                        ]
                    },
                    {
                        id: "wrong-axis",
                        value: fr[i] * cell[j], tol: 0.01,
                        why: "You used the wrong cell edge — each fractional coordinate pairs with its own axis's edge.",
                        nudges: [
                            "The " + name + "-coordinate uses the edge along " + name + ", which is " + cell[i] + " Å. Multiply " + fr[i] + " by it."
                        ]
                    },
                    {
                        id: "added",
                        value: fr[i] + cell[i], tol: 0.005,
                        why: "Fraction plus edge length has no meaning — the conversion is a scaling.",
                        nudges: [
                            "r = u·a + v·b + w·c: each term SCALES a cell vector by a fraction. For this component: " + fr[i] + " × " + cell[i] + "."
                        ]
                    }
                ]
            };
        }
    };

    const T2 = {
        gen() {
            for (let t = 0; t < 50; t++) {
                // orthonormal basis from 3-4-5: e1 = (0.6, 0.8), e2 = (-0.8, 0.6), possibly flipped
                const flip = Math.random() < 0.5;
                const e1 = flip ? [0.8, 0.6] : [0.6, 0.8];
                const v = [A.randInt(1, 5), A.randInt(1, 5)];
                const correct = v[0] * e1[0] + v[1] * e1[1];
                const plainX = v[0];
                const sum = v[0] + v[1];
                const magV = Math.hypot(v[0], v[1]);
                const vals = [correct, plainX, sum, magV];
                if (new Set(vals.map(x => Math.round(x * 100))).size < 4) continue;
                return {
                    prompt: "A molecule's symmetry axis, in the lab frame, is the unit vector $\\hat{\\mathbf{e}}_1 = (" +
                        e1[0] + ", " + e1[1] + ")$ (orthonormal frame). The lab-frame dipole is $\\boldsymbol{\\mu} = (" +
                        v[0] + ", " + v[1] + ")$ D. What is the dipole's coordinate along $\\hat{\\mathbf{e}}_1$? (2 decimals)",
                    correct: correct,
                    tol: 0.02,
                    misconceptions: [
                        {
                            id: "lab-component",
                            value: plainX, tol: 0.01,
                            why: "That is the lab-frame x-component — the molecular axis is tilted away from x.",
                            nudges: [
                                "Coordinates in a new orthonormal basis come from PROJECTION (Theorem 2.4.4): dot the vector with the basis vector.",
                                "Compute μ·ê₁ = " + v[0] + "×" + e1[0] + " + " + v[1] + "×" + e1[1] + "."
                            ]
                        },
                        {
                            id: "summed-components",
                            value: sum, tol: 0.01,
                            why: "You added the components — the basis vector's entries must weight them first.",
                            nudges: [
                                "The projection is a dot product, not a plain sum: multiply matching components by ê₁'s entries, then add."
                            ]
                        },
                        {
                            id: "magnitude",
                            value: magV, tol: 0.02,
                            why: "That is |μ| — the whole length, not its share along ê₁.",
                            nudges: [
                                "Only the part of μ along ê₁ counts: |μ| cos θ, computed painlessly as the dot product μ·ê₁."
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
                // |v| known; one rotated-frame coordinate known; find |other|
                const triple = A.rand([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
                const c1 = A.rand([triple[0], triple[1]]);
                const m = triple[2];
                const other = c1 === triple[0] ? triple[1] : triple[0];
                const vals = [other, m - c1, c1, Math.hypot(m, c1)];
                if (new Set(vals.map(x => Math.round(x * 100))).size < 4) continue;
                return {
                    prompt: "A dipole has magnitude $|\\boldsymbol{\\mu}| = " + m + "$ D. In a rotated <em>orthonormal</em> frame " +
                        "its first coordinate is $" + c1 + "$ D. What is the magnitude of its second coordinate? " +
                        "(Magnitudes are invariant under orthonormal changes of basis.)",
                    correct: other,
                    tol: 0.02,
                    misconceptions: [
                        {
                            id: "linear-subtraction",
                            value: m - c1, tol: 0.01,
                            why: "Coordinates combine in quadrature, not linearly: c₁² + c₂² = |μ|².",
                            nudges: [
                                "Parseval/Pythagoras in the rotated frame: |μ|² = c₁² + c₂². Solve for c₂, don't subtract lengths.",
                                "c₂ = √(" + m + "² − " + c1 + "²)."
                            ]
                        },
                        {
                            id: "hypotenuse-confusion",
                            value: Math.hypot(m, c1), tol: 0.02,
                            why: "You added the squares — but |μ| is the hypotenuse, not a leg.",
                            nudges: [
                                "The magnitude is the total: |μ|² = c₁² + c₂². The unknown coordinate is a LEG: c₂² = |μ|² − c₁²."
                            ]
                        },
                        {
                            id: "same-coordinate",
                            value: c1, tol: 0.01,
                            why: "The two coordinates need not be equal — they satisfy c₁² + c₂² = |μ|².",
                            nudges: [
                                "Use the invariance: " + m + "² = " + c1 + "² + c₂². Solve for c₂."
                            ]
                        }
                    ]
                };
            }
        }
    };

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["basis-coords"] = {
        id: "basis-coords",
        title: "Basis and coordinates",
        tiers: [T1, T2, T3]
    };
})();
