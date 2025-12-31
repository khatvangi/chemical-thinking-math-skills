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

### Standalone Concept Page: `site/direction.html`

**Architecture Decision:** Standalone HTML bypassing Quarto for full visual control. Workflow modified to copy to `_site/` on deploy.

**Live URL:** https://khatvangi.github.io/chemical-thinking-math-skills/direction.html

**Core Insight: Asymmetry is the Genesis of Direction**

SAMENESS and DIRECTION are dual/twin primitives:
- SAMENESS = what remains unchanged (symmetry, invariance)
- DIRECTION = what breaks the sameness (asymmetry creates direction)

**Document Structure (7 Parts):**

| Part | Title | Content |
|------|-------|---------|
| Prologue | — | Genesis: Asymmetry creates direction |
| I | Before Direction | Symmetric world has no direction |
| II | The First Direction | Toward/away as ur-direction (chemotaxis) |
| III | The Circle | 2D direction space, angles, comparison |
| IV | Higher Dimensions | 3D sphere of directions |
| V | Magnitude | Direction + length = vectors |
| VI | Direction Without Motion | Causation, gradients, field lines |
| VII | Bridge to Vectors | Perception → Tool |

**Features:**
- Definition popups (CSS hover with `data-definition` attributes)
- Academic endnotes with anchor back-links
- Formal definitions block
- Perception→Tool bridge table
- Scroll-triggered section reveals (IntersectionObserver)
- Typography: Fraunces (headings), Inter (body), JetBrains Mono (code)

**9 Interactive Visualizations (In Progress):**

| # | Visual | Status | Key Insight |
|---|--------|--------|-------------|
| 1 | Symmetry Breaking | ⬜ TODO | Sphere → marked sphere → cone morph |
| 2 | Circle of Directions | ⬜ TODO | All 2D directions parameterized by angle |
| 3 | Ur-Direction (Amoeba) | ⬜ TODO | Chemotaxis: seek nutrients, flee toxins |
| 4 | Comparing Directions | ⬜ TODO | Same/opposite/perpendicular/oblique |
| 5 | Gradient Landscape | ⬜ TODO | Click heightmap → steepest direction |
| 6 | Sphere of Directions | ⬜ TODO | 3D directions on sphere surface |
| 7 | Body Directions | ⬜ TODO | Asymmetric body creates forward |
| 8 | Causation Flow | ⬜ TODO | Field lines, cause → effect |
| 9 | Bridge Animation | ⬜ TODO | Perception primitive → math tool |

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
│   ├── direction.html           # DIRECTION standalone page (bypasses Quarto)
│   │
│   ├── lectures/
│   │   └── 04-direction.qmd       # Vectors in chemistry (tool page)
│   │
│   ├── practice/
│   │   └── index.qmd            # Practice mode hub
│   │
│   ├── homework/
│   │   └── index.qmd            # HW submission
│   │
│   └── js/
│       └── practice-widget.js   # IXL-style adaptive learning
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
- Push to main → builds Quarto → copies standalone HTML → deploys to Pages
- Workflow copies `site/direction.html` to `site/_site/direction.html` before upload
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
Rigorous academic prose with cognitive archaeology:
- Begin with genesis (where does this primitive come from?)
- Build from bodily experience outward
- Examples before definitions
- Interactive visualizations throughout
- Formal definitions block near the end
- Bridge table: Perception → Tool

### For Standalone HTML Pages
When bypassing Quarto for full visual control:
```css
/* Definition popups */
.def-popup { position: relative; cursor: help; }
.def-tooltip {
    position: absolute; bottom: calc(100% + 10px);
    opacity: 0; visibility: hidden;
}
.def-popup:hover .def-tooltip { opacity: 1; visibility: visible; }

/* Part headers */
.part-header { text-align: center; margin: 6rem 0 4rem; }
.part-number { font-family: monospace; color: var(--accent-purple); }

/* Visual placeholders */
.visual-placeholder {
    background: var(--bg-secondary);
    border: 2px dashed var(--text-muted);
    min-height: 300px;
}
```

JavaScript patterns:
```javascript
// Populate tooltips from data attributes
document.querySelectorAll('.def-popup').forEach(el => {
    const tooltip = el.querySelector('.def-tooltip');
    if (tooltip) tooltip.textContent = el.dataset.definition;
});

// Scroll-triggered reveals
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.1 });
document.querySelectorAll('.part').forEach(p => observer.observe(p));
```

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
- [x] **DIRECTION concept page** (standalone HTML, rigorous academic text)
- [x] **DIRECTION tool** (vectors lecture)

### In Progress
- [ ] **DIRECTION visualizations** (9 interactive canvases for direction.html)
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
