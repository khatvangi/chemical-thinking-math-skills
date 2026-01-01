# Chemical Thinking: The Grammar of Reality

## Project Overview

A mathematics course for chemistry undergraduates inverting traditional pedagogy: **Reality → Recognition → Tool** (not Tool → Application).

**Live Site:** https://course.thebeakers.com (pending DNS fix)
**API:** https://api.thebeakers.com (Cloudflare Tunnel)
**Main Domain:** thebeakers.com (reserved for future science blog, Aeon-style)

**⚠️ DNS Action Required:** Update nameservers at Hostinger from `jay/aisha.ns.cloudflare.com` to `ignat.ns.cloudflare.com` and `sonia.ns.cloudflare.com`

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

**Live URL:** https://course.thebeakers.com/direction.html

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

**12 Interactive Visualizations (Complete):**

| # | Visual | Status | Key Insight |
|---|--------|--------|-------------|
| 1 | Symmetry Breaking | ✅ Done | Sphere → cone morph (3D wireframe, side view) |
| 2 | Circle of Directions | ✅ Done | All 2D directions parameterized by angle |
| 3 | Ur-Direction (Amoeba) | ✅ Done | Chemotaxis: seek nutrients, flee toxins |
| 4 | Comparing Directions | ✅ Done | Same/opposite/perpendicular/oblique |
| 5 | Gradient Landscape | ✅ Done | Topographic heightmap with gradient arrows |
| 6 | Sphere of Directions | ✅ Done | 3D wireframe sphere with azimuth/elevation |
| 7 | Body Directions | ✅ Done | Asymmetric body creates forward |
| 8 | Asymmetric Bodies | ✅ Done | Fish/arrow/person showing forward direction |
| 9 | Magnitude + Direction | ✅ Done | Three-panel comparison (same dir, same mag, both) |
| 10 | Causation Flow | ✅ Done | SN2 reaction with flowing particles |
| 11 | Field Lines | ✅ Done | Electric field between charges |
| 12 | Bridge Animation | ✅ Done | Perception → formalism with bezier curves |

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
MODULE 1: STRUCTURE (Lectures 1-8) ✅ COMPLETE
"What is a molecule?"

Lecture 1: Orientation — Seeing (introduction)
Lecture 2: Existence — What Kinds of Numbers? (number types)
Lecture 3: Counting Things → COLLECTION primitive
Lecture 4: Bonds Point → DIRECTION primitive
Lecture 5: Angles & Projections → DIRECTION primitive (dot product)
Lecture 6: Coordinates & Basis → DIRECTION primitive (basis vectors)
Lecture 7: Grids of Numbers → ARRANGEMENT primitive (matrices)
Lecture 8: Transformations → ARRANGEMENT primitive (linear maps)

MODULE 2: CHANGE (Lectures 9-18)
"How do things transform?"
- Functions, derivatives, integrals, diff eq

MODULE 3: PROBABILITY (Lectures 19-24)
"What happens with many particles?"
- Probability, distributions, eigenvalues
```

### Module 1 Lecture Details

| Lecture | Title | Primitive | Key Topics | Visualizations |
|---------|-------|-----------|------------|----------------|
| 1 | Orientation | — | Perception before formalism | 5 phenomena demos |
| 2 | Existence | — | Number types (ℕ, ℤ, ℚ, ℝ, ℂ) | Number line, complex plane |
| 3 | Counting Things | COLLECTION | Factorial, permutations, combinations | Molecular arrangements |
| 4 | Bonds Point | DIRECTION | Vectors, magnitude, components | Water molecule 3D |
| 5 | Angles & Projections | DIRECTION | Dot product, orthogonality | Bond angle calculator |
| 6 | Coordinates & Basis | DIRECTION | Basis vectors, Gram-Schmidt | Coordinate rotation |
| 7 | Grids of Numbers | ARRANGEMENT | Matrix types, multiplication, inverse | Hückel matrix builder |
| 8 | Transformations | ARRANGEMENT | Linear maps, determinant, kernel | Symmetry operations |

### Lecture → Primitive Mapping

| Lectures | Primitive | Primitive Page |
|----------|-----------|----------------|
| 1-2 | (Introductory) | — |
| 3 | COLLECTION | `primitives/collection.html` |
| 4-6 | DIRECTION | `primitives/direction.html` |
| 7-8 | ARRANGEMENT | `primitives/arrangement.html` |

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
│   ├── index.qmd                # Homepage (Quarto)
│   ├── landing.html             # Beautiful standalone landing page
│   ├── protein-raga.html        # Protein music visualization
│   ├── CNAME                    # Custom domain config
│   │
│   ├── primitives/              # Primitive concept pages
│   │   ├── collection.html
│   │   ├── direction.html       # Complete with 12 visualizations
│   │   ├── arrangement.html
│   │   ├── sameness.html
│   │   ├── proximity.html
│   │   ├── change.html
│   │   ├── rate.html
│   │   ├── accumulation.html
│   │   └── spread.html
│   │
│   ├── lectures/                # All standalone HTML lectures
│   │   ├── all-lectures.html    # Lecture index/directory
│   │   ├── 01-orientation/
│   │   │   └── index.html       # Lecture 1: Perception
│   │   ├── 02-existence/
│   │   │   └── index.html       # Lecture 2: Number types
│   │   ├── 03-collection/
│   │   │   └── index.html       # Lecture 3: Counting
│   │   ├── 04-direction/
│   │   │   ├── index.html       # Lecture 4: Vectors intro
│   │   │   └── sec*.html        # Section pages
│   │   ├── 05-arrangement/
│   │   │   └── index.html       # Lecture 5: Dot product
│   │   ├── 06-coordinates/
│   │   │   └── index.html       # Lecture 6: Basis vectors
│   │   ├── 07-matrices/
│   │   │   └── index.html       # Lecture 7: Matrix algebra
│   │   └── 08-transformations/
│   │       └── index.html       # Lecture 8: Linear maps
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
Student → course.thebeakers.com (GitHub Pages) → Practice Widget (JS)
                                                        ↓
                                          api.thebeakers.com (Cloudflare Tunnel)
                                                        ↓
                                          FastAPI Backend (localhost:8000)
                                                        ↓
                                          Ollama (local LLM)
                                          └── qwen3:latest (grading)
```

**How it works:**
1. Student answers problem in practice widget
2. Widget sends to API via Cloudflare Tunnel (api.thebeakers.com)
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
# Start the API backend
cd app/backend && python main.py  # API on localhost:8000

# Start the Cloudflare Tunnel (in another terminal)
cloudflared tunnel run chem-api   # Exposes as api.thebeakers.com

# Preview site locally (optional)
cd site && quarto preview          # Site on localhost:4321
```

---

## Deployment

**Site:** GitHub Pages (automatic via Actions)
- Push to main → builds Quarto → copies standalone HTML + CNAME → deploys to Pages
- Workflow copies all standalone pages to `site/_site/`:
  - `landing.html`, `protein-raga.html`
  - All `primitives/*.html` files
  - All `lectures/*/index.html` files
  - `lectures/all-lectures.html`
- Live at: https://course.thebeakers.com (custom domain via Cloudflare)

**API:** Cloudflare Tunnel (permanent)
- Run `cloudflared tunnel run chem-api` to start tunnel
- URL: https://api.thebeakers.com
- Config: ~/.cloudflared/config.yml
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

### Lecture Navigation Pattern
Each lecture has a navigation bar at the top:
```html
<nav class="lecture-nav">
    <a href="../all-lectures.html" class="nav-link">← All Lectures</a>
    <a href="../../primitives/direction.html" class="primitive-link">
        <span class="primitive-badge">DIRECTION</span>
        <span class="primitive-text">Explore the Primitive →</span>
    </a>
</nav>
```

CSS for navigation (add to each lecture):
```css
.lecture-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--bg-tertiary);
}
.primitive-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(139, 92, 246, 0.1));
    border: 1px solid rgba(74, 158, 255, 0.3);
    transition: all 0.3s;
}
```

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
- [x] Cloudflare Tunnel setup (api.thebeakers.com → localhost:8000)
- [x] Custom domain configuration (course.thebeakers.com)
- [x] **Landing page** (beautiful dark-themed standalone HTML)
- [x] **Lectures index** (all-lectures.html with status badges)
- [x] **MODULE 1: All 8 lectures complete** (standalone HTML with interactive visualizations)
  - Lecture 1: Orientation (5 phenomena demos)
  - Lecture 2: Existence (number line, complex plane)
  - Lecture 3: Counting Things (factorial, combinations)
  - Lecture 4: Bonds Point (3D water molecule)
  - Lecture 5: Angles & Projections (dot product, bond angles)
  - Lecture 6: Coordinates & Basis (Gram-Schmidt, rotation)
  - Lecture 7: Grids of Numbers (matrix operations, Hückel)
  - Lecture 8: Transformations (determinant, symmetry ops)
- [x] **Primitive concept pages** (9 pages in primitives/)
- [x] **DIRECTION visualizations** (12 interactive canvas animations)
- [x] **Navigation system** (all lectures link to primitives and index)

### Planned
- [ ] Module 2: CHANGE primitives (Lectures 9-18)
- [ ] Module 3: PROBABILITY primitives (Lectures 19-24)
- [ ] Manim videos for complex concepts
- [ ] thebeakers.com science blog (Aeon-style)

### DNS Setup (Pending)
Update nameservers at Hostinger:
- FROM: `jay.ns.cloudflare.com`, `aisha.ns.cloudflare.com`
- TO: `ignat.ns.cloudflare.com`, `sonia.ns.cloudflare.com`

Once updated, wait 1-24 hours for propagation.

---

## References

- MIT 18.S191: computationalthinking.mit.edu
- PhET: phet.colorado.edu
- 3Blue1Brown: 3blue1brown.com
- Lakoff & Núñez: *Where Mathematics Comes From*
- McQuarrie: *Mathematics for Physical Chemistry*
- Strang: *Introduction to Linear Algebra*
