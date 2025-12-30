# Chemical Thinking: The Grammar of Reality

## Project Overview

A mathematics course for chemistry undergraduates inverting traditional pedagogy: **Reality → Recognition → Tool** (not Tool → Application).

**Live Site:** https://khatvangi.github.io/chemical-thinking-math-skills/
**API:** https://unawaked-unlunar-alyvia.ngrok-free.dev (when running)

**Model:** MIT 18.S191 "Computational Thinking"
**Tech Stack:** Quarto + JavaScript (site), FastAPI + Ollama (backend), SQLite (student data)

---

## The 9 Primitives

| Primitive | Cognitive Act | Math Tools | Chemistry Examples |
|-----------|---------------|------------|-------------------|
| COLLECTION | "There are many" | Sets, factorial | Moles, electron shells |
| ARRANGEMENT | "Order matters" | Permutations, matrices | Stereoisomers, crystal packing |
| **DIRECTION** | "It points" | Vectors, dot product | Dipoles, bond angles |
| PROXIMITY | "Near vs far" | Functions, limits | Potential energy, interaction range |
| SAMENESS | "Unchanged" | Eigenvalues, symmetry | Molecular symmetry, resonance |
| CHANGE | "Becoming" | Derivatives, operators | Reactions, transformations |
| RATE | "How fast" | Derivatives, diff eq | Kinetics, half-life |
| ACCUMULATION | "All together" | Integrals | Yield, work, total energy |
| SPREAD | "Distributed" | Probability | Boltzmann distribution, entropy |

**Key insight:** Math and chemistry are the same thought wearing different clothes.

---

## Primitive Development Model

Each primitive gets TWO pages:

### 1. Concept Page (The Primitive)
Cognitive archaeology — what the primitive IS before any formalism:
- Bodily experience (how we embody this primitive)
- Natural phenomena (where we see it in the world)
- Chemical manifestations (where it shows up in chemistry)
- Interactive visualizations (explore the primitive directly)
- Bridge to formalism (why we need the mathematical tool)

### 2. Tool Page (The Math)
The mathematical machinery that captures the primitive:
- Hook (chemical phenomenon)
- Tool introduction (notation, operations)
- Interactive practice (sliders, parameters)
- Chemistry connections (applications)
- Exercises with adaptive feedback

---

## DIRECTION: Complete Implementation

### Concept Page: `lectures/direction-concept.qmd`

**Content layers:**
1. The first direction (infant reaching)
2. Binary direction (toward/away as ur-direction)
3. Direction in the world (gravity, light, rivers, wind, growth, time)
4. Direction in animals (predator-prey, migration, attention)
5. Direction in the body (reaching, walking, looking, pointing)
6. The six directions from the body
7. Direction in language (prepositions encode direction)
8. Direction in mind (attention, intention, memory)
9. Direction as relation (from-to structure)
10. Direction without movement (orientation ≠ motion)
11. Continuous direction: circle (2D) and sphere (3D)
12. Combining directions
13. Gradients and causation
14. Bridge to vectors

**Interactive Visualizations** (`js/direction-visuals.js`):

| Visual | Interaction | Insight |
|--------|-------------|---------|
| Toward/Away | Drag food/danger | Organism responds to stimuli |
| Body Directions | Rotate figure | Forward/back rotate with body; up/down stay fixed |
| Circle (2D) | Slider 0-360° | All directions parameterized by angle |
| Sphere (3D) | θ and φ sliders | All 3D directions on sphere surface |
| Combining | Two direction sliders | Same/opposite/perpendicular/oblique |
| Gradient | Click heightmap | Arrow shows steepest uphill |
| Causation | Toggle buttons | Reaction chain vs reasoning chain |

### Tool Page: `lectures/04-direction.qmd`

- Bond angles and molecular geometry
- Vector notation and operations
- Magnitude (bond length)
- Dot product (angle relationship)
- Interactive bond angle slider (CO₂ ↔ H₂O polarity)
- Practice problems with adaptive LLM feedback

---

## Course Structure (24 Lectures, 3 Modules)

```
MODULE 1: STRUCTURE (Lectures 1-8)
"What is a molecule?"
├── DIRECTION (complete)
│   ├── direction-concept.qmd (cognitive primitive)
│   └── 04-direction.qmd (vectors, dot product)
├── COLLECTION (planned)
├── ARRANGEMENT (planned)
└── PROXIMITY (planned)

MODULE 2: CHANGE (Lectures 9-18)
"How do things transform?"
- Functions, derivatives, integrals, diff eq

MODULE 3: PROBABILITY (Lectures 19-24)
"What happens with many particles?"
- Probability, distributions, eigenvalues
```

---

## File Structure

```
chem-math-course/
├── CLAUDE.md                    # This file
├── start-server.sh              # Start API + ngrok
│
├── .github/workflows/
│   └── publish.yml              # GitHub Pages deployment
│
├── app/
│   └── backend/
│       ├── main.py              # FastAPI + Ollama grading
│       ├── database.py          # SQLite student tracking
│       └── requirements.txt
│
├── site/                        # Quarto website
│   ├── _quarto.yml              # Site configuration
│   ├── index.qmd                # Homepage
│   ├── getting-started.qmd      # Student guide
│   ├── progress.qmd             # Progress dashboard
│   ├── styles.css               # Custom styling
│   │
│   ├── lectures/
│   │   ├── direction-concept.qmd  # DIRECTION primitive (deep)
│   │   └── 04-direction.qmd       # Vectors in chemistry
│   │
│   ├── practice/
│   │   └── index.qmd            # Practice mode hub
│   │
│   ├── homework/
│   │   └── index.qmd            # HW submission
│   │
│   └── js/
│       ├── practice-widget.js   # IXL-style adaptive learning
│       └── direction-visuals.js # 7 interactive visualizations
│
└── extracted_zip/               # Original planning docs
```

---

## Adaptive Learning System

**Architecture:**
```
Student → GitHub Pages Site → Practice Widget (JS)
                                      ↓
                             ngrok public URL
                                      ↓
                             FastAPI Backend (Python)
                                      ↓
                             Ollama (local LLM)
                             └── qwen3:latest (grading)
```

**How it works:**
1. Student answers problem in practice widget
2. Widget sends to API via ngrok tunnel
3. LLM checks answer, provides feedback
4. If wrong → worked example + similar problem
5. Repeat until 3 correct in a row = mastery
6. Progress stored in SQLite database

**Practice Widget Features:**
- 10 diverse molecular problems (H₂O, CH₄, CO₂, NH₃, BF₃, SF₆, PCl₅, H₂S, C₂H₄, C₂H₂)
- Tracks used problems to avoid immediate repeats
- Hints and worked solutions
- Mastery streak tracking

**To run locally:**
```bash
./start-server.sh
# or manually:
cd app/backend && python main.py  # API on :8000
ngrok http 8000                    # Public tunnel
cd site && quarto preview          # Site on :4321
```

---

## Deployment

**Site:** GitHub Pages (automatic via Actions)
- Push to main → builds Quarto → deploys to Pages
- Live at: https://khatvangi.github.io/chemical-thinking-math-skills/

**API:** ngrok tunnel (manual start)
- Run `./start-server.sh` on nitrogen server
- Current URL: https://unawaked-unlunar-alyvia.ngrok-free.dev
- Update lecture files if URL changes

**Database:** SQLite at `app/backend/chemical_thinking.db`
- Tables: students, progress, practice_attempts, homework_assignments, homework_submissions

---

## Writing Style

### For Concept Pages (Primitives)
- Direct, almost poetic prose
- Build from bodily experience outward
- Examples before definitions
- Let the reader FEEL the primitive before naming it
- Interactive elements for exploration
- End with "why we need formalization"

### For Tool Pages (Math)
- Hook with chemical phenomenon
- Minimal prose, maximal visualization
- Tables for structured information
- Show don't tell
- Practice problems with feedback

### What NOT to Do
- Don't start with definitions
- Don't present tools before phenomena
- Don't over-explain — trust the visualization
- Don't use "math anxiety" language — treat students as capable

---

## Quality Checklist

When developing a primitive:

**Concept Page:**
- [ ] Bodily/embodied grounding
- [ ] Natural world examples
- [ ] Chemical manifestations
- [ ] At least 3 interactive visualizations
- [ ] Clear bridge to formalism

**Tool Page:**
- [ ] Chemical hook (not abstract math)
- [ ] Interactive sliders/parameters
- [ ] Chemistry connections
- [ ] Practice problems (3-5)
- [ ] Adaptive feedback integration

---

## Development Status

### Complete
- [x] Site infrastructure (Quarto + GitHub Pages)
- [x] API backend (FastAPI + Ollama)
- [x] Student database (SQLite)
- [x] Practice widget (IXL-style)
- [x] **DIRECTION primitive** (concept page + 7 visuals)
- [x] **DIRECTION tool** (vectors lecture)

### In Progress
- [ ] Other Module 1 primitives (COLLECTION, ARRANGEMENT, PROXIMITY)

### Planned
- [ ] Module 2: CHANGE primitives
- [ ] Module 3: PROBABILITY primitives
- [ ] Permanent API URL (domain + Cloudflare Tunnel)
- [ ] Manim videos for complex concepts

---

## References

- MIT 18.S191: computationalthinking.mit.edu
- PhET: phet.colorado.edu
- 3Blue1Brown: 3blue1brown.com
- Lakoff & Núñez: *Where Mathematics Comes From*
- McQuarrie: *Mathematics for Physical Chemistry*
- Strang: *Introduction to Linear Algebra*
