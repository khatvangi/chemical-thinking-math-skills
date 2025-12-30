# Chemical Thinking: Claude Project Setup Guide

## 1. Project Description

Copy this into the project description field:

---

**Mathematics for Chemistry Undergraduates — "Chemical Thinking: The Grammar of Reality"**

A revolutionary course inverting traditional pedagogy: Reality → Recognition → Tool. Students see chemical phenomena, recognize cognitive primitives (COLLECTION, ARRANGEMENT, DIRECTION, PROXIMITY, SAMENESS, CHANGE, RATE, ACCUMULATION, SPREAD), and summon appropriate mathematical tools.

Modeled on MIT 18.S191 "Computational Thinking." Tech stack: Julia + Pluto notebooks (reactive), Quarto site. 24 lectures across 3 modules (Structure, Change, Probability).

---

## 2. Custom Instructions for Claude

Add these to the project's "Custom Instructions" field:

---

You are a collaborator on "Chemical Thinking: The Grammar of Reality" — a mathematics course for chemistry undergraduates.

**Core Philosophy:**
- Reality → Recognition → Tool (not Tool → Application)
- 9 Primitives: COLLECTION, ARRANGEMENT, DIRECTION, PROXIMITY, SAMENESS, CHANGE, RATE, ACCUMULATION, SPREAD
- Math and chemistry are the same thought in different formalizations

**When developing course content:**
1. Always start with a chemical PHENOMENON (the hook)
2. Guide students to RECOGNIZE which primitive(s) they're seeing
3. Let the mathematical TOOL emerge from that recognition
4. Include interactive elements (sliders, parameters) for reactivity
5. Connect back to chemistry applications

**Technical standards:**
- Primary: Julia + Pluto notebooks (.jl files)
- Secondary: Python + Colab (.ipynb) for accessibility
- Site: Quarto (.qmd files)
- Visualizations: Plots.jl, PlutoUI for interactivity
- External: PhET simulations, Desmos, GeoGebra where appropriate

**Code style (Julia):**
- Use Unicode where it aids clarity (α, β, Δ, ∑)
- Prefer mathematical notation: f(x) = x^2 not function definitions
- Always include @bind sliders for key parameters
- Comment the WHAT, not the HOW

**Writing style:**
- Direct, minimal prose
- Tables over paragraphs for structured info
- Show don't tell — visualization first, explanation second
- No "math anxiety" coddling — treat students as capable

**File naming:**
- Lectures: `01-orientation.qmd`, `02-existence.qmd`
- Notebooks: `Lecture_01_Seeing.jl`, `Lecture_02_Existence.jl`
- Keep consistent numbering across all formats

**When I ask for a lecture or notebook:**
1. Confirm which primitive(s) it covers
2. Propose the chemical hook
3. Draft the content with full interactivity
4. Include exercises at the end

**When reviewing/editing:**
- Check primitive alignment — does the hook actually demonstrate the claimed primitive?
- Check tool emergence — does the math arise naturally or feel forced?
- Check reactivity — are there enough interactive elements?

---

## 3. Project Knowledge Files

Upload these files to Project Knowledge:

### File 1: chemical-thinking-project-knowledge.md
(Already created — the comprehensive foundation document)

### File 2: lecture-status.md
Create this to track progress:

```markdown
# Lecture Development Status

## Completed
| # | Title | Primitive | Notebook | QMD | Reviewed |
|---|-------|-----------|----------|-----|----------|
| 1 | Orientation: Seeing | All | ✅ | ❌ | ❌ |

## In Progress
| # | Title | Primitive | Status |
|---|-------|-----------|--------|
| 2 | Existence | — | Not started |

## Backlog
- Lectures 3-24 (see full map in foundation doc)

## Known Issues
- None yet

## Design Decisions Log
- 2025-12-26: Committed to Julia + Pluto as primary
- 2025-12-26: Adopted MIT 18.S191 module structure
```

### File 3: style-guide.md (optional but recommended)

```markdown
# Chemical Thinking Style Guide

## Lecture Structure
1. **Hook** — A phenomenon (30 seconds to grab attention)
2. **Recognition** — "What do you notice?" → Name the primitive
3. **Tool** — Mathematical content, built step-by-step
4. **Interactive** — Sliders, exploration
5. **Chemistry** — Real applications
6. **Exercises** — 3-5 problems

## Primitive Naming
Always use CAPS for primitives: DIRECTION, not "direction"

## Chemical Examples by Primitive
| Primitive | Go-to Examples |
|-----------|----------------|
| COLLECTION | Moles, electron shells, isomer counting |
| ARRANGEMENT | Stereoisomers, crystal packing, MO diagrams |
| DIRECTION | Bond angles, dipoles, orbital orientation |
| PROXIMITY | Potential energy curves, reaction coordinates |
| SAMENESS | Molecular symmetry, resonance, conservation |
| CHANGE | Reaction progress, phase transitions |
| RATE | Kinetics, half-life, diffusion |
| ACCUMULATION | Work, heat, total yield |
| SPREAD | Boltzmann distribution, entropy, orbitals |

## Visualization Preferences
- Use consistent color scheme across lectures
- Default: purple for functions, orange for distributions, green for potentials
- Always label axes
- Prefer interactive over static

## What NOT to do
- Don't start with "In this lecture we will learn..."
- Don't present tools before phenomena
- Don't over-explain — trust the visualization
- Don't use bullet points in student-facing content (prose or tables)
```

---

## 4. How to Use the Project Effectively

### Starting a Work Session

Begin conversations with context-setting:

**Good openers:**
- "Continue developing Lecture 3 on vectors. The hook should involve bond angles in water vs CO2."
- "Review Lecture_01_Seeing.jl — check if the Maxwell-Boltzmann interactive is pedagogically sound."
- "Draft the Quarto site structure. I need _quarto.yml and index.qmd."

**Bad openers:**
- "Help me with the course" (too vague)
- "Write a lecture" (which one? what primitive?)

### Maintaining Continuity

After significant work, update the status tracker:

"Update lecture-status.md: Lecture 2 notebook complete, needs QMD version and review."

### Requesting Specific Outputs

Be explicit about format:

- "Give me the Pluto notebook (.jl) for Lecture 5"
- "Draft the Quarto page (.qmd) for Lecture 5"  
- "Create the Python/Colab version (.ipynb) of Lecture 5"

### Iterating on Content

Use focused requests:

- "The PROXIMITY hook in Lecture 12 feels weak. Propose 3 alternative chemical phenomena."
- "The eigenvalue section in Lecture 10 is too abstract. Add a concrete molecular symmetry example."
- "Students found Lecture 7 confusing. Identify where tool emergence fails and fix it."

### Quality Checks

Periodically request reviews:

- "Audit Lectures 1-5 for primitive alignment. Flag any where the hook doesn't match the claimed primitive."
- "Check all notebooks for missing interactivity — every lecture should have at least 2 sliders."

---

## 5. Recommended Workflow

### Phase 1: Foundation (Weeks 1-2)
1. Set up project with knowledge files
2. Build Quarto site skeleton
3. Complete Lectures 1-4 (Module 1 start)
4. Test with 2-3 students informally

### Phase 2: Module 1 Complete (Weeks 3-4)
1. Finish Lectures 5-8
2. Create all Module 1 Colab alternatives
3. Record 1-2 Manim concept videos
4. First full review pass

### Phase 3: Module 2 (Weeks 5-8)
1. Lectures 9-18 (the calculus core)
2. This is the hardest section — budget extra time
3. Heavy use of PhET simulations for kinetics

### Phase 4: Module 3 + Polish (Weeks 9-12)
1. Lectures 19-24 (probability/stat mech)
2. Full site deployment
3. All notebooks tested
4. Student pilot

---

## 6. Conversation Templates

### For New Lectures
```
Develop Lecture [N]: [Title]

Primitive(s): [LIST]
Chemical hook idea: [PHENOMENON]
Key math tools: [TOOLS]

Deliver:
1. Pluto notebook (.jl)
2. List of PhET/Desmos resources to embed
3. 5 exercises with solutions
```

### For Reviews
```
Review Lecture [N] for:
- [ ] Primitive alignment
- [ ] Tool emergence (natural vs forced)
- [ ] Interactivity (minimum 2 sliders)
- [ ] Chemistry connections
- [ ] Exercise quality

Flag issues and propose fixes.
```

### For Site Work
```
Build Quarto infrastructure:
- _quarto.yml with full navigation
- index.qmd homepage
- lectures/index.qmd overview page
- Consistent styling

Output all files.
```

---

## 7. Emergency Reference

If context seems lost mid-project:

"Reload context: This is the Chemical Thinking course. Core philosophy: Reality → Recognition → Tool. 9 primitives. Julia + Pluto. 24 lectures in 3 modules. Check project knowledge for full details."

---

## Summary

| Element | Content |
|---------|---------|
| **Project Name** | chem-math (or "Chemical Thinking") |
| **Description** | ~50 words on philosophy + tech stack |
| **Custom Instructions** | ~400 words on collaboration rules |
| **Knowledge Files** | Foundation doc, status tracker, style guide |
| **Usage Pattern** | Specific requests, regular status updates, periodic audits |
