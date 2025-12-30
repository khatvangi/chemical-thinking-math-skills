# Chemical Thinking: The Grammar of Reality

## Project Overview

A revolutionary mathematics course for chemistry undergraduates that inverts the traditional pedagogy. Instead of "here's a tool, find applications," we teach "see reality, recognize the pattern, summon the tool."

**Core Philosophy:** Reality → Recognition → Tool

**Model:** MIT 18.S191 "Introduction to Computational Thinking" (computationalthinking.mit.edu)

**Tech Stack:** Julia + Pluto notebooks (reactive), Python/Colab as secondary

---

## The Primitives

Before "math" or "chemistry," there is human cognition parsing reality. We perceive through fundamental patterns:

| Primitive | Cognitive Act | Tools Summoned | Chemistry Examples |
|-----------|---------------|----------------|-------------------|
| COLLECTION | "There are many" | Sets, counting, factorial | Moles, ensembles, electron shells |
| ARRANGEMENT | "Order matters" | Permutations, matrices | Stereoisomers, crystal packing, configurations |
| DIRECTION | "It points" | Vectors, dot product | Dipoles, gradients, bond angles |
| PROXIMITY | "Near vs far" | Functions, limits | Potential energy, interaction range |
| SAMENESS | "Unchanged" | Eigenvalues, symmetry | Molecular symmetry, resonance |
| CHANGE | "Becoming" | Derivatives, operators | Reactions, transformations |
| RATE | "How fast" | Derivatives, diff eq | Kinetics, half-life |
| ACCUMULATION | "All together" | Integrals | Yield, work, total energy |
| SPREAD | "Distributed" | Probability | Boltzmann distribution, entropy |

**Key insight:** Math and chemistry are the same thought wearing different clothes.

---

## Course Structure

### Three Modules (MIT-style)

```
MODULE 1: STRUCTURE (Weeks 1-4, Lectures 1-8)
"What is a molecule?"
- Chemical focus: Molecular geometry, bonding, isomers
- Math emerges: Vectors, matrices, counting, symmetry

MODULE 2: CHANGE (Weeks 5-9, Lectures 9-18)
"How do things transform?"
- Chemical focus: Reactions, kinetics, equilibrium, energy
- Math emerges: Functions, derivatives, integrals, diff eq

MODULE 3: PROBABILITY (Weeks 10-12, Lectures 19-24)
"What happens with many particles?"
- Chemical focus: Thermodynamics, statistical mechanics
- Math emerges: Probability, distributions, eigenvalues
```

### 24 Lectures Map

| Lecture | Primitive | Title | Math Tools |
|---------|-----------|-------|------------|
| 1 | — | Orientation: Seeing | Introduction to primitives |
| 2 | EXISTENCE | What Kinds of Numbers? | ℤ→ℚ→ℝ→ℂ, complex plane |
| 3 | COLLECTION | Counting Things | Sets, cardinality, factorial |
| 4 | DIRECTION | Bonds Point | Vectors in ℝ² and ℝ³ |
| 5 | DIRECTION | Angles and Projections | Dot product, cosine |
| 6 | DIRECTION | Coordinates | Basis, components |
| 7 | ARRANGEMENT | Grids of Numbers | Matrices as data |
| 8 | ARRANGEMENT | Transformations | Matrix operations |
| 9 | SAMENESS | What Doesn't Change? | Determinants |
| 10 | SAMENESS | Characteristic Directions | Eigenvalues, eigenvectors |
| 11 | SAMENESS | Symmetry | Group theory preview |
| 12 | PROXIMITY | As X Approaches... | Functions, limits |
| 13 | PROXIMITY | Asymptotes and Infinities | Behavior at boundaries |
| 14 | CHANGE | Instantaneous Rate | Derivative definition |
| 15 | CHANGE | Rules of Change | Differentiation rules |
| 16 | RATE | The Kinetics Problem | Rate laws, orders |
| 17 | ACCUMULATION | Adding It All Up | Integral definition |
| 18 | ACCUMULATION | Techniques | Integration methods |
| 19 | DYNAMICS | Laws of Change | ODEs, 1st order |
| 20 | DYNAMICS | Second Order | Oscillations, kinetics |
| 21 | SPREAD | Probability Basics | Sample space, events |
| 22 | SPREAD | Distributions | Boltzmann, Gaussian |
| 23 | SPREAD | Expectation and Variance | Moments, error |
| 24 | SYNTHESIS | The Complete Map | Review, connections |

---

## Tool Dependency Tree

### Representation Track (Objects)
```
NUMBERS (scalars)
    │
    ├── COMPLEX NUMBERS
    │
    └── VECTORS
            │
            └── MATRICES
                    │
                    ├── DETERMINANTS
                    └── EIGENVALUES

FUNCTIONS
    │
    └── LIMITS
            │
            ├── DERIVATIVES ──► PARTIAL DERIVATIVES
            │                          │
            └── INTEGRALS ────► MULTIPLE INTEGRALS
                    │
                    └── DIFFERENTIAL EQUATIONS
```

### Transformation Track (Actions)
```
ARITHMETIC (+,−,×,÷)
    │
    ├── COUNTING (n!, C, P)
    │
    ├── DOT PRODUCT (v·w → scalar)
    │
    ├── CROSS PRODUCT (v×w → vector)
    │
    └── MATRIX MULTIPLY (A×B → matrix)
            │
            ├── SOLVING SYSTEMS
            └── EIGENVALUE PROBLEM
```

### Cross-Borrowing
| Trans Tool | Borrows From | Why |
|------------|--------------|-----|
| Derivative | Functions, Limits | Defined as limit of difference quotient |
| Integral | Functions, Summation | Limit of Riemann sums |
| Eigenvalue | Determinant, Polynomial | Solve det(A - λI) = 0 |
| Matrix multiply | Dot product | Each entry is a dot product |

---

## Technology Stack

### Primary: Julia + Pluto
- **Why reactive:** Change slider → everything updates → students SEE relationships
- **MIT model:** 18.S191 uses this exact stack
- **Mathematical syntax:** Julia looks like math (Unicode support: α, β, ∑, ∫)

### Secondary: Python + Colab
- For students who can't install Julia
- Jupyter versions of all notebooks

### Interactive Tools
- **PhET Simulations** (phet.colorado.edu) — Carl Wieman's research-based sims
- **Desmos** — Live function manipulation
- **GeoGebra** — 3D geometry, vectors, transformations

### Course Site: Quarto
- Single URL, everything integrated
- Renders from .qmd source files
- Embeds notebooks, LaTeX, interactives

---

## Directory Structure

```
chemical_thinking/
├── index.qmd                 # Homepage
├── framework.qmd             # Conceptual architecture
├── tech-stack.qmd            # Why Julia + Pluto
├── course-structure.qmd      # Three modules, lecture map
├── _quarto.yml               # Site configuration
├── styles.css                # Custom styling
├── references.bib            # Bibliography
│
├── lectures/
│   ├── index.qmd             # Lecture overview
│   ├── 01-orientation.qmd    # Lecture 1
│   └── 02-24...              # Remaining lectures
│
├── notebooks/
│   ├── index.qmd             # Notebook hub
│   ├── Lecture_01_Seeing.jl  # Pluto notebook (Julia)
│   └── Lecture_01.ipynb      # Colab alternative (Python)
│
├── tools/
│   └── index.qmd             # Tool Selector reference
│
└── resources/
    └── index.qmd             # PhET, Desmos, videos, books
```

---

## Lecture Format (Each Lecture)

1. **THE HOOK** — A phenomenon (image, molecule, data)
2. **RECOGNITION** — What primitive are we seeing?
3. **THE TOOL** — Mathematical machinery, step by step
4. **INTERACTIVE** — Sliders, parameters, "what if"
5. **CHEMISTRY CONNECTION** — Apply to real systems
6. **EXERCISES** — Practice problems

---

## Key Design Principles

1. **Reality first** — Start with chemical phenomenon, not abstract math
2. **Reactivity** — Students change things, watch responses, see relationships
3. **Primitives as bridge** — Same cognitive act, different formalizations
4. **Tool summoning** — Recognition calls forth the appropriate tool
5. **Integrated** — No separation between "lecture" and "lab"

---

## Sample: Lecture 1 Skeleton

**Title:** Orientation — Reality → Recognition → Tool

**Hook:** Show 5 chemical situations. Ask: "What do you notice?"
1. Water molecule (bond angle) → DIRECTION
2. Concentration decay → CHANGE, RATE  
3. Lennard-Jones potential → PROXIMITY
4. Maxwell-Boltzmann distribution → SPREAD
5. Benzene symmetry → SAMENESS

**Reveal:** You used different words for each — "pointing," "changing," "near/far," "spread out," "same." These are the primitives.

**Promise:** By course end, you'll look at any chemical phenomenon and see what kind of thing it is. The math will follow.

---

## References

- MIT 18.S191: computationalthinking.mit.edu
- PhET: phet.colorado.edu
- 3Blue1Brown: 3blue1brown.com (Manim for animations)
- McQuarrie, *Mathematics for Physical Chemistry*
- Strang, *Introduction to Linear Algebra*

---

## Next Development Steps

1. Build remaining 23 Pluto notebooks
2. Create Quarto site, deploy
3. Record Manim concept videos for difficult primitives
4. Test with pilot student group
5. Iterate based on feedback
