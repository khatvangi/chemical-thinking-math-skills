# Lecture Development Status

## Completed

| # | Title | Primitive(s) | Notebook | QMD | Colab | Reviewed |
|---|-------|--------------|----------|-----|-------|----------|
| 1 | Orientation: Seeing | All (intro) | ✅ | ❌ | ❌ | ❌ |

## In Progress

| # | Title | Primitive(s) | Status | Notes |
|---|-------|--------------|--------|-------|

## Backlog

### Module 1: Structure (Lectures 2-8)
| # | Title | Primitive(s) | Priority |
|---|-------|--------------|----------|
| 2 | Existence: What Kinds of Numbers? | — | HIGH |
| 3 | Counting Things | COLLECTION | HIGH |
| 4 | Bonds Point | DIRECTION | HIGH |
| 5 | Angles and Projections | DIRECTION | MEDIUM |
| 6 | Coordinates | DIRECTION | MEDIUM |
| 7 | Grids of Numbers | ARRANGEMENT | MEDIUM |
| 8 | Transformations | ARRANGEMENT | MEDIUM |

### Module 2: Change (Lectures 9-18)
| # | Title | Primitive(s) | Priority |
|---|-------|--------------|----------|
| 9 | What Doesn't Change? | SAMENESS | MEDIUM |
| 10 | Characteristic Directions | SAMENESS | MEDIUM |
| 11 | Symmetry | SAMENESS | LOW |
| 12 | As X Approaches... | PROXIMITY | MEDIUM |
| 13 | Asymptotes | PROXIMITY | LOW |
| 14 | Instantaneous Rate | CHANGE | HIGH |
| 15 | Rules of Change | CHANGE | HIGH |
| 16 | The Kinetics Problem | RATE | HIGH |
| 17 | Adding It All Up | ACCUMULATION | HIGH |
| 18 | Integration Techniques | ACCUMULATION | MEDIUM |

### Module 3: Probability (Lectures 19-24)
| # | Title | Primitive(s) | Priority |
|---|-------|--------------|----------|
| 19 | Laws of Change (ODEs) | CHANGE + RATE | MEDIUM |
| 20 | Second Order Systems | CHANGE | LOW |
| 21 | Probability Basics | SPREAD | HIGH |
| 22 | Distributions | SPREAD | HIGH |
| 23 | Expectation and Variance | SPREAD | MEDIUM |
| 24 | Synthesis | All | LOW |

---

## Site Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| _quarto.yml | ❌ | |
| index.qmd | ❌ | |
| framework.qmd | ❌ | |
| tech-stack.qmd | ❌ | |
| lectures/index.qmd | ❌ | |
| notebooks/index.qmd | ❌ | |
| tools/index.qmd | ❌ | |
| resources/index.qmd | ❌ | |
| styles.css | ❌ | |

---

## Known Issues

*None yet*

---

## Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-26 | Julia + Pluto as primary | Reactivity essential for "seeing"; MIT model |
| 2025-12-26 | 3-module structure | Follows MIT 18.S191 pattern; coherent themes |
| 2025-12-26 | 9 primitives | Cognitive parsimony; covers all needed math |
| 2025-12-29 | Project created | Moving to persistent Claude Project space |

---

## Resources Inventory

### PhET Simulations to Use
- [ ] Molecule Shapes
- [ ] Balancing Chemical Equations  
- [ ] Reactants, Products and Leftovers
- [ ] Beer's Law Lab
- [ ] States of Matter

### Desmos Activities to Create
- [ ] Vector addition (Lecture 4-5)
- [ ] Matrix transformation (Lecture 8)
- [ ] Derivative as slope (Lecture 14)
- [ ] Riemann sums (Lecture 17)

### Manim Videos to Record
- [ ] "What is a derivative, really?" (CHANGE)
- [ ] "Eigenvalues: What survives?" (SAMENESS)
- [ ] "The integral as accumulator" (ACCUMULATION)
