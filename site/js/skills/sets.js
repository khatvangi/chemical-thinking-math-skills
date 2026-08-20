/**
 * Adaptive skill: sets and collections (§1.2).
 * Tier 1 (numeric): inclusion–exclusion counts.
 * Tier 2 (numeric): multiplication principle on experimental grids.
 * Tier 3 (MC): element-vs-subset, multiset, universe subtleties.
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

    const T1 = {
        gen() {
            const both = A.randInt(3, 9);
            const aOnly = A.randInt(4, 12);
            const bOnly = A.randInt(4, 12);
            const nA = aOnly + both, nB = bOnly + both;
            const union = nA + nB - both;
            const universe = union + A.randInt(5, 15);
            return {
                prompt: "In a library of $" + universe + "$ compounds, $" + nA +
                    "$ pass screen A, $" + nB + "$ pass screen B, and $" + both +
                    "$ pass both. How many pass <strong>at least one</strong> screen?",
                correct: union,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "no-subtraction",
                        value: nA + nB, tol: 0.01,
                        why: "You added the two counts — the compounds passing both screens got counted twice.",
                        nudges: [
                            "A compound passing both screens appears in the " + nA + " AND in the " + nB + ". Adding counts it twice; the union wants it once.",
                            "Inclusion–exclusion: |A ∪ B| = |A| + |B| − |A ∩ B|. Subtract the overlap of " + both + ".",
                            "Compute " + nA + " + " + nB + " − " + both + "."
                        ]
                    },
                    {
                        id: "subtracted-twice",
                        value: nA + nB - 2 * both, tol: 0.01,
                        why: "You removed the overlap twice — that counts the 'both' compounds zero times.",
                        nudges: [
                            "The double-count is exactly one extra copy per shared compound, so subtract |A ∩ B| once, not twice.",
                            "Your number is the count passing EXACTLY one screen. 'At least one' includes the " + both + " passing both — add them back."
                        ]
                    },
                    {
                        id: "complement",
                        value: universe - union, tol: 0.01,
                        why: "That is the number passing NEITHER screen.",
                        nudges: [
                            "You computed the complement. The question asks for the union itself; the 'neither' count is " + universe + " minus that."
                        ]
                    }
                ]
            };
        }
    };

    const T2 = {
        gen() {
            const s = A.randInt(3, 7);   // solvents
            const t = A.randInt(3, 5);   // temperatures
            const c = A.randInt(2, 4);   // catalysts
            const correct = s * t * c;
            return {
                prompt: "A screen runs every combination of $" + s + "$ solvents, $" + t +
                    "$ temperatures, and $" + c + "$ catalysts, one experiment per combination. " +
                    "How many experiments?",
                correct: correct,
                tol: 0.01,
                misconceptions: [
                    {
                        id: "added",
                        value: s + t + c, tol: 0.01,
                        why: "You added the option counts. Independent choices multiply.",
                        nudges: [
                            "For EACH of the " + s + " solvents you run all " + t + " temperatures — that's already " + s + "×" + t + " runs before catalysts enter.",
                            "The multiplication principle: |S × T × C| = |S|·|T|·|C|. Multiply " + s + " × " + t + " × " + c + "."
                        ]
                    },
                    {
                        id: "partial-product",
                        value: s * t + c, tol: 0.01,
                        why: "You multiplied two factors but added the third — every factor multiplies.",
                        nudges: [
                            "Each of the " + (s * t) + " solvent–temperature pairs is run with EACH of the " + c + " catalysts. That final choice multiplies too."
                        ]
                    },
                    {
                        id: "pairs-only",
                        value: s * t, tol: 0.01,
                        why: "That counts solvent–temperature pairs, ignoring the catalyst dimension.",
                        nudges: [
                            "You've counted the grid of " + s + "×" + t + " pairs. Now each pair fans out over " + c + " catalyst choices — multiply once more."
                        ]
                    }
                ]
            };
        }
    };

    const T3 = [
        {
            prompt: "Let $H$ be the set of halogens. Which statement is correctly typed?",
            choices: [
                { label: "Cl ∈ H, and {Cl} ⊆ H", correct: true },
                { label: "Cl ⊆ H, and {Cl} ∈ H", id: "swapped",
                  why: "The symbols are swapped: ∈ relates an element to a set; ⊆ relates a set to a set.",
                  nudges: ["Chlorine the ELEMENT is a member: that's ∈. The one-member COLLECTION {Cl} is a subset: that's ⊆. Which option assigns them that way?"] },
                { label: "Cl ∈ H, and Cl ⊆ H — both are fine", id: "both-fine",
                  why: "Cl ⊆ H is a type error: chlorine is not a collection, so it cannot be a subset.",
                  nudges: ["⊆ asks 'is every element of the left thing in the right thing?' — the left thing must be a SET. Is Cl a set?"] },
                { label: "{Cl} ∈ H, because {Cl} contains a halogen", id: "singleton-member",
                  why: "H's members are elements like Cl, not sets like {Cl}.",
                  nudges: ["List H: {F, Cl, Br, I, At}. Is the OBJECT {Cl} — a set — on that list? Membership means literally appearing in the collection."] }
            ]
        },
        {
            prompt: "Why is the molecular formula H₂O <em>not</em> faithfully represented by the set {H, H, O}?",
            choices: [
                { label: "Sets ignore repetition, so {H, H, O} collapses to {H, O}, losing the count of hydrogens", correct: true },
                { label: "Because sets cannot contain atoms, only numbers", id: "atoms-not-allowed",
                  why: "Sets may contain any objects — atoms, orbitals, solvents.",
                  nudges: ["Sets of solvents and orbitals appeared all through this section. The failure is about the TWO hydrogens — what does a set do with duplicates?"] },
                { label: "Because the order H, H, O is wrong — it should be O, H, H", id: "order",
                  why: "Sets ignore order entirely; ordering is not the issue.",
                  nudges: ["Order never matters in a set — that part is fine. What happens to the duplicate H when the collection becomes a set?"] },
                { label: "It is faithful — {H, H, O} has three elements", id: "three-elements",
                  why: "By Definition 1.2.1, repetition does not count: |{H, H, O}| = 2.",
                  nudges: ["A set is determined by membership alone. The listing {H, H, O} names only two distinct members. What object DOES track multiplicities?"] }
            ]
        },
        {
            prompt: "A safety officer bans 'every solvent except the alcohols.' The instruction is ambiguous until…",
            choices: [
                { label: "…a universe U is fixed — 'every solvent' must range over a stated collection", correct: true },
                { label: "…the alcohols are listed in alphabetical order", id: "order-red-herring",
                  why: "Sets don't care about order; listing order changes nothing.",
                  nudges: ["Ordering is never the issue for sets. The complement A∖B needs to know what the total collection A IS. What's missing?"] },
                { label: "…we know whether the ban includes the alcohols too", id: "misread",
                  why: "'Except the alcohols' already excludes them unambiguously — that part is clear.",
                  nudges: ["The exception clause is fine. The vague term is 'every solvent': every solvent WHERE? In the room, the catalog, the world? Name the missing ingredient."] },
                { label: "…each solvent's boiling point is measured", id: "irrelevant-data",
                  why: "No physical data is needed to interpret a set complement.",
                  nudges: ["This is a set-theory ambiguity, not a chemistry one. A complement is 'U minus the alcohols' — which symbol is undefined here?"] }
            ]
        },
        {
            prompt: "A screening run returns zero hits. As a set, the result is…",
            choices: [
                { label: "…the empty set ∅, a perfectly valid set with |∅| = 0", correct: true },
                { label: "…not a set — a collection must contain something", id: "must-contain",
                  why: "The empty set is a legitimate set; nothing in Definition 1.2.1 requires members.",
                  nudges: ["A set is determined by membership — and 'no members' is a definite membership status for every candidate. Which option says the result is still a set?"] },
                { label: "…undefined, so the arithmetic of the section no longer applies", id: "undefined",
                  why: "All the formulas work with |∅| = 0 — that robustness is a design feature.",
                  nudges: ["Try it: |∅ ∪ B| = 0 + |B| − 0 = |B| ✓. The machinery is fine with zero. What is the empty result, formally?"] },
                { label: "…an error in the screen, since a valid method always finds members", id: "error",
                  why: "Finding nothing is a scientific result, not a malfunction.",
                  nudges: ["'No compounds passed' can be exactly right and highly informative. Which set has cardinality zero?"] }
            ]
        }
    ];

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["sets"] = {
        id: "sets",
        title: "Sets and collections",
        tiers: [T1, T2, mc(T3)]
    };
})();
