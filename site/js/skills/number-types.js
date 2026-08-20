/**
 * Adaptive skill: kinds of numbers (§1.1).
 * Tier 1 (MC): classify a chemical quantity by the smallest number system.
 * Tier 2 (numeric): exact dilution-chain arithmetic (rationals at work).
 * Tier 3 (MC): model vs measurement, closure, discreteness subtleties.
 */

(function () {
    const A = window.Adaptive;

    function shuffled(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    const mc = bank => ({
        gen() {
            const item = A.rand(bank);
            return { prompt: item.prompt, choices: shuffled(item.choices) };
        }
    });

    // distractor helper for tier 1: same four systems every time, tailored whys
    function classify(prompt, correctSys, whys) {
        const systems = ["ℕ (naturals)", "ℤ (integers)", "ℚ (rationals)", "ℝ (reals)"];
        return {
            prompt: prompt + " — smallest system in the tower that contains it?",
            choices: systems.map(s => {
                const key = s[0];
                if (key === correctSys) return { label: s, correct: true };
                return { label: s, id: "sys-" + key, why: whys[key].why, nudges: whys[key].nudges };
            })
        };
    }

    const T1 = [
        classify("The number of carbon atoms in one molecule of benzene", "ℕ", {
            "ℤ": { why: "No negative count of atoms is possible — you don't need the negatives.",
                   nudges: ["The question asks for the SMALLEST adequate system. Atom counts are positive whole numbers; which system is exactly that?"] },
            "ℚ": { why: "No molecule contains a fractional atom.",
                   nudges: ["Could a molecule hold 6.5 carbons? Counts are whole and positive — pick the smallest such system."] },
            "ℝ": { why: "Vastly larger than needed — counts are whole numbers.",
                   nudges: ["ℝ contains π and √2; an atom count never needs them. Choose the smallest system of positive whole numbers."] }
        }),
        classify("The oxidation state of oxygen in H₂O (−2)", "ℤ", {
            "ℕ": { why: "−2 is negative; ℕ has no negative members.",
                   nudges: ["ℕ stops at positive counts. Which system was invented exactly to hold results like 3 − 5?"] },
            "ℚ": { why: "Adequate but not smallest — no fractions are needed for −2.",
                   nudges: ["−2 is a whole number. The smallest system containing negative whole numbers is not ℚ."] },
            "ℝ": { why: "Adequate but far larger than needed.",
                   nudges: ["−2 needs neither fractions nor irrationals. Pick the smallest system with negatives."] }
        }),
        classify("A mole fraction of 3/8 in an ethanol–water mixture", "ℚ", {
            "ℕ": { why: "3/8 is not a whole number.",
                   nudges: ["A ratio of counts escapes the whole numbers. Which system holds all fractions p/q?"] },
            "ℤ": { why: "3/8 lies strictly between integers.",
                   nudges: ["Division escapes ℤ — that's why the next level of the tower exists. Name it."] },
            "ℝ": { why: "Adequate but not smallest — 3/8 is an exact ratio of integers.",
                   nudges: ["3/8 needs no irrational machinery. The smallest system of integer ratios is which?"] }
        }),
        classify("The length of the face diagonal of a unit square (edge exactly 1)", "ℝ", {
            "ℕ": { why: "√2 ≈ 1.414 is not a whole number.",
                   nudges: ["Pythagoras gives the diagonal as √2. Theorem 1.1.2 tells you which systems that value escapes."] },
            "ℤ": { why: "√2 lies between 1 and 2 — no integer.",
                   nudges: ["The diagonal is √2. Is that even a ratio of integers? Recall the theorem proved in this section."] },
            "ℚ": { why: "Theorem 1.1.2 is precisely the proof that √2 is NOT a ratio of integers.",
                   nudges: ["This is the section's centerpiece: √2 provably escapes ℚ. The system that fills such gaps is which?",
                            "Only ℝ contains the irrationals. √2 was the historical reason to build it."] }
        }),
        classify("The charge, in units of e, of an electron", "ℤ", {
            "ℕ": { why: "The electron's charge is −1; ℕ has no negatives.",
                   nudges: ["Sign matters and is negative here. Which system first admits negatives?"] },
            "ℚ": { why: "Adequate but not smallest; −1 is a whole number.",
                   nudges: ["No fraction is needed for −1. Choose the smaller system."] },
            "ℝ": { why: "Adequate but far larger than needed.",
                   nudges: ["−1 is as simple as negative numbers get. Smallest system containing it?"] }
        })
    ];

    const T2 = {
        gen() {
            const n = A.rand([2, 3, 4, 5]);      // 1:n dilution
            const k = A.rand([2, 3, 4]);         // k successive steps
            const c0 = A.rand([1.0, 2.0, 0.8, 1.2]); // stock concentration, M
            const correct = c0 / Math.pow(n, k);
            const show = x => (Math.round(x * 1e6) / 1e6).toString();
            return {
                prompt: "A $" + c0 + "$ M stock is carried through $" + k +
                    "$ successive 1:$" + n + "$ dilutions. What is the final concentration in M? " +
                    "(work in exact fractions; enter the decimal at the end)",
                correct: correct,
                tol: Math.max(1e-6, correct * 0.01),
                misconceptions: [
                    {
                        id: "multiplied-not-powered",
                        value: c0 / (n * k), tol: Math.max(1e-6, (c0 / (n * k)) * 0.01),
                        why: "You divided by n×k. Successive dilutions multiply factors, giving nᵏ.",
                        nudges: [
                            "Each 1:" + n + " step divides by " + n + ". Doing that " + k + " times divides by " +
                                n + "×" + n + "×… (" + k + " factors) — a power, not a product with k.",
                            "The overall factor is 1/" + n + "^" + k + " = 1/" + Math.pow(n, k) + ". Divide " + c0 + " by that denominator."
                        ]
                    },
                    {
                        id: "wrong-direction",
                        value: c0 * Math.pow(n, k), tol: c0 * Math.pow(n, k) * 0.01,
                        why: "Dilution makes concentration smaller, not larger.",
                        nudges: [
                            "A dilution can never raise concentration. The factor 1/" + n + "^" + k + " belongs in the denominator.",
                            "Compute " + c0 + " / " + Math.pow(n, k) + "."
                        ]
                    },
                    {
                        id: "single-step",
                        value: c0 / n, tol: Math.max(1e-6, (c0 / n) * 0.005),
                        why: "That is one dilution; the problem performs " + k + ".",
                        nudges: [
                            "After the first step you have " + show(c0 / n) + " M — and then that solution is diluted again, " + (k - 1) + " more times.",
                            "Divide by " + n + " a total of " + k + " times: " + c0 + "/" + Math.pow(n, k) + "."
                        ]
                    }
                ]
            };
        }
    };

    const T3 = [
        {
            prompt: "A crystallographer's model gives a bond length of exactly $a\\sqrt{2}$ with $a = 4.00$ Å; the instrument reports $5.657$ Å. Which statement is precisely right?",
            choices: [
                { label: "The model value is irrational; the reported value is a rational approximation to it", correct: true },
                { label: "The reported value proves the length is rational", id: "measurement-decides",
                  why: "Instruments always report rationals — finite decimals — regardless of the model value.",
                  nudges: ["Every finite decimal readout is rational by construction, so a readout can't decide the model value's type. What IS the model value's type, given Theorem 1.1.2?"] },
                { label: "The model value is rational because 4.00 is rational", id: "rational-times-irrational",
                  why: "A nonzero rational times an irrational is irrational (Exercise 5 of §1.1).",
                  nudges: ["If 4√2 were a fraction p/q, then √2 = p/(4q) would be one too — contradicting the theorem. So which is it?"] },
                { label: "The two values disagree, so one of them is an error", id: "disagreement-error",
                  why: "They agree to instrument precision; they are different KINDS of value, not competing measurements.",
                  nudges: ["5.657 is 4√2 rounded to four figures. Model values and measured values differ in kind: exact vs approximate. Which option says exactly that?"] }
            ]
        },
        {
            prompt: "Is $\\mathbb{Q}$ closed under the operation 'take the square root of a positive member'?",
            choices: [
                { label: "No — √2 is the counterexample: 2 ∈ ℚ but √2 ∉ ℚ", correct: true },
                { label: "Yes — the square root of a fraction is a fraction", id: "sqrt-of-fraction",
                  why: "√(p/q) = √p/√q only helps if √p and √q are themselves rational — usually they are not.",
                  nudges: ["Test the definition of closure on the simplest input: 2 is rational. Is √2? This section proved the answer."] },
                { label: "Yes — every calculator returns a decimal for √2", id: "calculator-closure",
                  why: "The calculator returns a rational approximation, not the true value.",
                  nudges: ["Closure is about TRUE values, and the true √2 provably escapes ℚ. What does that make the answer?"] },
                { label: "No — because some rationals are negative", id: "negatives-redherring",
                  why: "The operation was restricted to positive members, so negatives are beside the point.",
                  nudges: ["Right answer, wrong reason — the failure is not about sign. Which positive rational has an irrational square root, per the theorem?"] }
            ]
        },
        {
            prompt: "Hydrogen's electron energies are $E_n = -13.6/n^2$ eV with $n \\in \\mathbb{N}$. A student computes the energy 'between levels 1 and 2' by plugging in $n = 1.5$. The deepest error is:",
            choices: [
                { label: "Treating an integer-valued physical variable as continuous — no state exists between n = 1 and n = 2", correct: true },
                { label: "Arithmetic — the value of −13.6/1.5² was computed wrong", id: "arithmetic",
                  why: "The arithmetic may be flawless; the input is what's illegitimate.",
                  nudges: ["Even a perfect computation of −13.6/2.25 describes nothing physical. Why not? What values may n take?"] },
                { label: "Using eV instead of joules", id: "units",
                  why: "Units are a convention; the choice of eV is fine.",
                  nudges: ["The units are consistent. The problem is the value n = 1.5 itself — check which number system n lives in."] },
                { label: "Too few significant figures in 13.6", id: "sigfigs",
                  why: "Precision is not the issue; the existence of the state is.",
                  nudges: ["More digits of 13.6 would not create a state between the levels. Quantum numbers are discrete — which primitive error is that?"] }
            ]
        },
        {
            prompt: "Which one of these numbers is (provably) irrational?",
            choices: [
                { label: "The exact ratio of a cube's face diagonal to its edge", correct: true },
                { label: "0.121212… repeating forever", id: "repeating",
                  why: "Repeating decimals are exactly the rationals: 0.\\overline{12} = 12/99.",
                  nudges: ["Every repeating decimal converts to p/q by the 100x − x trick. Which option instead involves √2?"] },
                { label: "6.02214076 × 10²³ (the exact defined Avogadro number)", id: "avogadro",
                  why: "Since 2019 it is a DEFINED integer — as rational as numbers get.",
                  nudges: ["The SI now fixes N_A as an exact whole number. Look for the option that equals √2."] },
                { label: "22/7", id: "pi-approx",
                  why: "22/7 is a famous approximation to π, but it is itself a plain fraction.",
                  nudges: ["π is irrational; 22/7 is not π — it's a ratio of integers, hence rational. Which option is a true irrational?"] }
            ]
        }
    ];

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["number-types"] = {
        id: "number-types",
        title: "Kinds of numbers",
        tiers: [mc(T1), T2, mc(T3)]
    };
})();
