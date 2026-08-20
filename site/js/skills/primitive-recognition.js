/**
 * Adaptive skill: recognize which cognitive primitive a phenomenon engages
 * (Prologue of the book). Multiple-choice; each distractor carries its own
 * diagnosis and nudges. Tier 1: clear-cut. Tier 2: classic confusions.
 * Tier 3: rich scenarios where a PRIMARY primitive must be chosen.
 */

(function () {
    const A = window.Adaptive;

    // shuffle a copy so the correct answer moves around
    function shuffled(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function mc(bank) {
        return {
            gen() {
                const item = A.rand(bank);
                return { prompt: item.prompt, choices: shuffled(item.choices) };
            }
        };
    }

    const T1 = [
        {
            prompt: "A water molecule's O–H bond has a dipole moment of 1.5 D aimed from H toward O. Which primitive is engaged?",
            choices: [
                { label: "DIRECTION — it points", correct: true },
                { label: "COLLECTION — there are many", id: "collection",
                  why: "Nothing here is being counted.",
                  nudges: ["The statement is about a single bond and where it aims. What perceptual fact does 'aimed from H toward O' report?"] },
                { label: "RATE — how fast", id: "rate",
                  why: "No time appears anywhere in the statement.",
                  nudges: ["Rate needs something happening in time. A dipole moment just sits there, pointing. Which primitive is 'it points'?"] },
                { label: "ACCUMULATION — all together", id: "accumulation",
                  why: "Nothing is being summed or totaled.",
                  nudges: ["Accumulation totals contributions up. Here there is one bond and one arrow. What does an arrow embody?"] }
            ]
        },
        {
            prompt: "Avogadro's number lets chemists work with 6.022 × 10²³ molecules as one unit, the mole. Which primitive is engaged?",
            choices: [
                { label: "COLLECTION — there are many", correct: true },
                { label: "ARRANGEMENT — order matters", id: "arrangement",
                  why: "The mole ignores order entirely.",
                  nudges: ["A mole doesn't care which molecule is 'first.' It only answers: how many? Which primitive asks that?"] },
                { label: "SPREAD — distributed", id: "spread",
                  why: "No distribution over values is described.",
                  nudges: ["Spread is about how a property varies across a population. Counting the population itself is a different, more basic act."] },
                { label: "CHANGE — becoming", id: "change",
                  why: "Nothing is transforming.",
                  nudges: ["No before and after here — just a very large count given a convenient name."] }
            ]
        },
        {
            prompt: "As two argon atoms approach, their interaction energy falls, bottoms out at 3.8 Å, then climbs steeply. Which primitive organizes this description?",
            choices: [
                { label: "PROXIMITY — near versus far", correct: true },
                { label: "DIRECTION — it points", id: "direction",
                  why: "Only the separation distance matters here, not any orientation.",
                  nudges: ["Two spherical atoms have no orientation to speak of. The energy depends on one thing: how far apart they are. Which primitive is that?"] },
                { label: "SAMENESS — unchanged", id: "sameness",
                  why: "The energy is changing with distance, not staying fixed.",
                  nudges: ["Something IS varying — energy as separation varies. The pattern 'a quantity depends on near-versus-far' has its own primitive."] },
                { label: "COLLECTION — there are many", id: "collection",
                  why: "Two atoms, and the count is beside the point.",
                  nudges: ["The story is about the distance between them, and how a quantity responds to it."] }
            ]
        },
        {
            prompt: "Iodine-131 has a half-life of 8 days: every 8 days, half of whatever remains decays. Which primitive is front and center?",
            choices: [
                { label: "RATE — how fast", correct: true },
                { label: "ACCUMULATION — all together", id: "accumulation",
                  why: "A half-life describes speed of loss, not a running total.",
                  nudges: ["Accumulation would total up the decays. 'Half of what remains, every 8 days' answers a different question: how FAST does it go?"] },
                { label: "COLLECTION — there are many", id: "collection",
                  why: "The many atoms are the backdrop, not the point.",
                  nudges: ["Yes there are many atoms — but the 8 days is the star of the sentence. What is a half-life measuring?"] },
                { label: "DIRECTION — it points", id: "direction",
                  why: "Nothing points in this statement.",
                  nudges: ["No orientation appears. The number 8 days characterizes how quickly something happens."] }
            ]
        },
        {
            prompt: "Benzene's six C–C bonds are indistinguishable: rotate the ring by 60° and the molecule is exactly as it was. Which primitive?",
            choices: [
                { label: "SAMENESS — unchanged", correct: true },
                { label: "ARRANGEMENT — order matters", id: "arrangement",
                  why: "The point is that the rotation does NOT produce a new arrangement.",
                  nudges: ["Arrangement notices differences in ordering. This statement celebrates the opposite: an operation after which nothing has changed. Which primitive is 'unchanged'?"] },
                { label: "CHANGE — becoming", id: "change",
                  why: "The rotation produces no change at all — that's the point.",
                  nudges: ["Read again: after the rotation the molecule is 'exactly as it was.' The primitive of invariance has a name."] },
                { label: "DIRECTION — it points", id: "direction",
                  why: "The bonds' directions exist, but the sentence is about what the rotation preserves.",
                  nudges: ["The claim isn't that bonds point — it's that a 60° turn leaves everything indistinguishable. Invariance under an operation is which primitive?"] }
            ]
        }
    ];

    const T2 = [
        {
            prompt: "A reaction's enthalpy change is ΔH = −57 kJ/mol: products sit lower in energy than reactants. CHANGE or RATE?",
            choices: [
                { label: "CHANGE — a before-and-after difference", correct: true },
                { label: "RATE — how fast it happens", id: "rate",
                  why: "ΔH says nothing about speed — famously, thermodynamics is silent on kinetics.",
                  nudges: ["A reaction can have huge negative ΔH and take centuries (diamond → graphite). ΔH compares two states. Which primitive compares before with after?",
                           "Rate would need time in its units. kJ/mol has none."] },
                { label: "ACCUMULATION — energy totaled up", id: "accumulation",
                  why: "Close — but ΔH is a difference between two states, not a running total over a process.",
                  nudges: ["Accumulation integrates contributions along the way. ΔH doesn't care about the path at all — only initial and final states. That before/after comparison is CHANGE."] },
                { label: "PROXIMITY — near versus far", id: "proximity",
                  why: "No distance dependence is described.",
                  nudges: ["Nothing here varies with separation. Two states are being compared — one before, one after."] }
            ]
        },
        {
            prompt: "At 298 K, molecular speeds in a gas sample range widely; most N₂ molecules move near 420 m/s but some crawl and some streak. Which primitive?",
            choices: [
                { label: "SPREAD — one property distributed over a population", correct: true },
                { label: "COLLECTION — there are many molecules", id: "collection",
                  why: "The many molecules are the stage; the star is how speeds are distributed across them.",
                  nudges: ["Collection stops at 'how many.' This sentence is about how a PROPERTY (speed) varies over the many. That extra structure is which primitive?"] },
                { label: "RATE — the molecules are moving fast", id: "rate",
                  why: "Individual speeds are involved, but the pattern described is the variety of speeds, not any one speed.",
                  nudges: ["Reread: 'range widely… most near 420… some crawl, some streak.' The subject is the shape of the variation. Which primitive is 'distributed'?"] },
                { label: "SAMENESS — all molecules are identical N₂", id: "sameness",
                  why: "The molecules are identical, yet the sentence stresses how they differ in speed.",
                  nudges: ["The chemical identity is the same, but the described pattern is diversity of a property. That diversity has its own primitive."] }
            ]
        },
        {
            prompt: "The total heat released by a burning candle over an hour is measured with a calorimeter. Which primitive does 'total over an hour' engage?",
            choices: [
                { label: "ACCUMULATION — contributions summed over the process", correct: true },
                { label: "RATE — heat released per second", id: "rate",
                  why: "That would be the power at an instant; the measurement described is the total.",
                  nudges: ["Rate is the per-second story. The calorimeter's number is everything added up from start to finish — which primitive gathers 'all together'?"] },
                { label: "CHANGE — the candle is becoming shorter", id: "change",
                  why: "True but not what the measurement captures — it captures a summed total.",
                  nudges: ["The candle changes, yes. But 'total heat over an hour' is a sum of countless moments' contributions. Summation-over-a-process is which primitive?"] },
                { label: "SPREAD — heat distributed to the surroundings", id: "spread",
                  why: "Spread is about a property varying across a population, not energy dispersing.",
                  nudges: ["In this book SPREAD means a distribution of values over many members. A single running total over time is ACCUMULATION."] }
            ]
        },
        {
            prompt: "Cis- and trans-2-butene contain identical atoms and identical bonds, yet are different compounds with different boiling points. Which primitive explains how?",
            choices: [
                { label: "ARRANGEMENT — the same parts, ordered differently", correct: true },
                { label: "COLLECTION — the set of atoms", id: "collection",
                  why: "The collections are identical — that is exactly why collection alone can't distinguish them.",
                  nudges: ["Same atoms, same count — COLLECTION sees no difference. What differs is how the parts are placed relative to one another. Which primitive notices placement?"] },
                { label: "SAMENESS — they are the same formula", id: "sameness",
                  why: "The formula is shared, but the question asks what makes them DIFFERENT.",
                  nudges: ["The puzzle is the difference despite identical parts. Different orderings of the same parts is the definition of which primitive?"] },
                { label: "DIRECTION — the substituents point different ways", id: "direction",
                  why: "Tempting — pointing is involved — but the essential fact is the relative placement of parts, which is arrangement.",
                  nudges: ["Direction describes a single pointing thing. Here the difference is the CONFIGURATION — which neighbors sit where. That relational pattern is ARRANGEMENT."] }
            ]
        }
    ];

    const T3 = [
        {
            prompt: "A first-order reaction: the less reactant remains, the slower the concentration falls, giving the familiar exponential decay. Which PAIR of primitives is coupled here?",
            choices: [
                { label: "CHANGE + RATE — how fast the becoming happens depends on the current amount", correct: true },
                { label: "COLLECTION + SPREAD", id: "coll-spread",
                  why: "Neither counting nor a distribution over a population drives the exponential.",
                  nudges: ["The engine of exponential decay: the speed of decline is proportional to what's left. That couples a quantity's becoming to its pace — which two primitives?"] },
                { label: "PROXIMITY + DIRECTION", id: "prox-dir",
                  why: "No distances or orientations appear in the rate law.",
                  nudges: ["d[A]/dt = −k[A] contains a change per time tied to the current value. Name the two primitives in 'change per time.'"] },
                { label: "SAMENESS + ARRANGEMENT", id: "same-arr",
                  why: "Invariance and ordering are not what generate decay.",
                  nudges: ["What stays coupled throughout the decay is the amount and its own falling speed."] }
            ]
        },
        {
            prompt: "The Boltzmann factor e^(−E/kT) says high-energy states are exponentially rarer — yet at equilibrium the OVERALL distribution stops evolving. Which pair captures this?",
            choices: [
                { label: "SPREAD + SAMENESS — a distribution of energies that is itself unchanging", correct: true },
                { label: "RATE + ACCUMULATION", id: "rate-acc",
                  why: "At equilibrium the macroscopic totals aren't accumulating and net rates vanish.",
                  nudges: ["Two facts: energies are DISTRIBUTED over the population, and that distribution is INVARIANT in time. Match each fact to a primitive."] },
                { label: "COLLECTION + CHANGE", id: "coll-change",
                  why: "The population is there, but the striking feature is the stable SHAPE of the distribution.",
                  nudges: ["Beyond 'many molecules': their energies form a definite pattern of variation, and that pattern holds still. Which two primitives?"] },
                { label: "PROXIMITY + RATE", id: "prox-rate",
                  why: "Neither distance nor speed is the organizing idea of the equilibrium distribution.",
                  nudges: ["Focus on what e^(−E/kT) describes (a spread of energies) and what equilibrium means (no change in that spread)."] }
            ]
        },
        {
            prompt: "During a titration, pH inches upward as base is added, then leaps across 6 pH units within two drops near equivalence, then flattens. A chemist reading the steep jump is chiefly perceiving which primitive?",
            choices: [
                { label: "RATE — how fast pH changes per drop, suddenly enormous", correct: true },
                { label: "ACCUMULATION — the total base added so far", id: "accumulation",
                  why: "The running total matters for locating equivalence, but the JUMP is a statement about steepness.",
                  nudges: ["The x-axis is accumulated base, true. But 'leaps 6 units within two drops' describes pH change PER unit added — a slope. Slope is which primitive?"] },
                { label: "PROXIMITY — nearness to the equivalence point", id: "proximity",
                  why: "Nearness sets the stage, but the observed drama is the steepness itself.",
                  nudges: ["Proximity explains WHERE the jump happens. The question asks what the jump IS: an enormous change-per-drop. Name that primitive."] },
                { label: "CHANGE — the pH becomes different", id: "change",
                  why: "Change is present, but 'within two drops' makes it change-per-amount — a rate.",
                  nudges: ["Mere change wouldn't need 'within two drops.' The ratio of change to titrant added is the point — which primitive measures how-fast?"] }
            ]
        },
        {
            prompt: "X-ray diffraction reveals that quartz's silicon and oxygen atoms repeat every 4.9 Å along one axis, and every crystal face angle follows from that repeat. Which pair of primitives?",
            choices: [
                { label: "ARRANGEMENT + SAMENESS — a spatial ordering that repeats unchanged", correct: true },
                { label: "DIRECTION + RATE", id: "dir-rate",
                  why: "Face angles involve direction, but nothing here is about speed.",
                  nudges: ["Two facts: atoms sit in a definite spatial ORDER, and translating by 4.9 Å leaves the pattern UNCHANGED. Match the primitives."] },
                { label: "COLLECTION + PROXIMITY", id: "coll-prox",
                  why: "Counting atoms and their nearness misses the periodicity, which is the point.",
                  nudges: ["The key words are 'repeat' (an operation leaving the structure the same) and the ordered placement that repeats. Which two primitives?"] },
                { label: "SPREAD + ACCUMULATION", id: "spread-acc",
                  why: "No distribution of a property, no running total.",
                  nudges: ["A lattice is an arrangement; its repetition is an invariance. Name those two."] }
            ]
        }
    ];

    window.AdaptiveSkills = window.AdaptiveSkills || {};
    window.AdaptiveSkills["primitive-recognition"] = {
        id: "primitive-recognition",
        title: "Name the primitive",
        tiers: [mc(T1), mc(T2), mc(T3)]
    };
})();
