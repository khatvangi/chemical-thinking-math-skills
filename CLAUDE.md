# Chemical Thinking: The Grammar of Reality

## Project Overview

A mathematics course for chemistry undergraduates inverting traditional pedagogy: **Reality → Recognition → Tool** (not Tool → Application).

**Model:** MIT 18.S191 "Computational Thinking"
**Tech Stack:** Julia + Pluto notebooks (primary), Python/Colab (secondary), Quarto site

---

## The 9 Primitives

| Primitive | Cognitive Act | Math Tools | Chemistry Examples |
|-----------|---------------|------------|-------------------|
| COLLECTION | "There are many" | Sets, factorial | Moles, electron shells |
| ARRANGEMENT | "Order matters" | Permutations, matrices | Stereoisomers, crystal packing |
| DIRECTION | "It points" | Vectors, dot product | Dipoles, bond angles |
| PROXIMITY | "Near vs far" | Functions, limits | Potential energy, interaction range |
| SAMENESS | "Unchanged" | Eigenvalues, symmetry | Molecular symmetry, resonance |
| CHANGE | "Becoming" | Derivatives, operators | Reactions, transformations |
| RATE | "How fast" | Derivatives, diff eq | Kinetics, half-life |
| ACCUMULATION | "All together" | Integrals | Yield, work, total energy |
| SPREAD | "Distributed" | Probability | Boltzmann distribution, entropy |

**Key insight:** Math and chemistry are the same thought wearing different clothes.

---

## Course Structure (24 Lectures, 3 Modules)

```
MODULE 1: STRUCTURE (Lectures 1-8)
"What is a molecule?"
- Vectors, matrices, counting, symmetry

MODULE 2: CHANGE (Lectures 9-18)
"How do things transform?"
- Functions, derivatives, integrals, diff eq

MODULE 3: PROBABILITY (Lectures 19-24)
"What happens with many particles?"
- Probability, distributions, eigenvalues
```

---

## Lecture Format

1. **HOOK** — A chemical phenomenon (image, molecule, data)
2. **RECOGNITION** — What primitive are we seeing?
3. **TOOL** — Mathematical machinery, step by step
4. **INTERACTIVE** — Sliders, parameters, "what if"
5. **CHEMISTRY CONNECTION** — Apply to real systems
6. **EXERCISES** — Practice problems

---

## Development Guidelines

### Content Development
1. Always start with a chemical PHENOMENON (the hook)
2. Guide students to RECOGNIZE which primitive(s) they're seeing
3. Let the mathematical TOOL emerge from that recognition
4. Include interactive elements (sliders, parameters) for reactivity
5. Connect back to chemistry applications

### Code Style (Julia)
- Use Unicode where it aids clarity (α, β, Δ, ∑)
- Prefer mathematical notation: `f(x) = x^2`
- Always include `@bind` sliders for key parameters
- Comment the WHAT, not the HOW

### Writing Style
- Direct, minimal prose
- Tables over paragraphs for structured info
- Show don't tell — visualization first, explanation second
- No "math anxiety" coddling — treat students as capable

### What NOT to Do
- Don't start with "In this lecture we will learn..."
- Don't present tools before phenomena
- Don't over-explain — trust the visualization

---

## File Structure

```
chem-math-course/
├── CLAUDE.md                 # This file
├── run.sh                    # Quick start script
│
├── app/                      # Adaptive learning system
│   ├── backend/
│   │   ├── main.py           # FastAPI + Ollama integration
│   │   └── requirements.txt
│   ├── frontend/
│   │   └── practice-widget.js  # IXL-style mastery widget
│   └── problems/
│       └── direction_problems.json  # Seed problems
│
├── site/                     # Quarto website
│   ├── _quarto.yml           # Site configuration
│   ├── index.qmd             # Homepage
│   ├── styles.css            # Custom styling
│   ├── lectures/
│   │   └── 04-direction.qmd  # Sample lecture
│   ├── practice/
│   │   └── index.qmd         # Practice mode hub
│   └── js/
│       └── practice-widget.js
│
└── extracted_zip/            # Original planning docs
```

### Naming Conventions
- Lectures: `01-orientation.qmd`, `02-existence.qmd`
- Notebooks: `Lecture_01_Seeing.jl`, `Lecture_02_Existence.jl`

---

## Adaptive Learning System

**Architecture:**
```
Student → Quarto Site → Practice Widget (JS)
                              ↓
                     FastAPI Backend (Python)
                              ↓
                     Ollama (local LLM)
                     ├── qwen2.5-math (grading)
                     └── Generates new problems
```

**How it works:**
1. Student answers problem
2. LLM checks answer, provides feedback
3. If wrong → worked example + similar problem
4. Repeat until 3 correct in a row = mastery

**To run:**
```bash
# Terminal 1: Start Ollama
ollama run qwen2.5-math:7b

# Terminal 2: Start backend
cd app/backend && pip install -r requirements.txt && python main.py

# Terminal 3: Preview site
cd site && quarto preview
```

---

## Quality Checklist

When reviewing content:
- [ ] **Primitive alignment** — Does the hook demonstrate the claimed primitive?
- [ ] **Tool emergence** — Does the math arise naturally or feel forced?
- [ ] **Interactivity** — At least 2 sliders per lecture
- [ ] **Chemistry connections** — Real applications included
- [ ] **Exercise quality** — 3-5 problems with solutions

---

## References

- MIT 18.S191: computationalthinking.mit.edu
- PhET: phet.colorado.edu
- 3Blue1Brown: 3blue1brown.com
- McQuarrie, *Mathematics for Physical Chemistry*
- Strang, *Introduction to Linear Algebra*

---

## Development Status

See `extracted_zip/lecture-status.md` for current progress.

**Next Steps:**
1. Build remaining 23 Pluto notebooks
2. Create Quarto site, deploy
3. Record Manim concept videos for difficult primitives
4. Test with pilot student group
