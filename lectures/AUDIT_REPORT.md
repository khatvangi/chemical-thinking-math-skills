# Lecture Audit Report

**Audited against:** `/storage/chem-math-course/PRIMER.md`
**Date:** 2026-01-13

---

## Executive Summary

The 24 lectures are **well-structured** and consistently follow the "Reality → Recognition → Tool" pedagogy. However, they predate the refined primer and miss several key concepts.

### Scorecard

| Criterion | Status | Notes |
|-----------|--------|-------|
| Reality → Recognition → Tool | ✅ PASS | All lectures follow this order |
| Chemical hooks | ✅ PASS | Every lecture opens with phenomenon |
| Primitives named | ✅ PASS | Explicit primitive identification |
| Interactive visualizations | ✅ PASS | Canvas-based demos throughout |
| A → B transformation framing | ⚠️ PARTIAL | Present but not systematic |
| Mix-and-match primitives | ❌ MISSING | Mostly 1:1 rigid mapping |
| Clearinghouse concept | ❌ MISSING | Not articulated |
| Thermo (CAN) vs Kinetics (WILL) | ❌ MISSING | Rules not framed this way |
| Rearrangement as central mechanism | ❌ MISSING | Not explicit |

---

## Detailed Findings

### What's Working Well

**1. Consistent Structure**
Every lecture follows:
```
Hook → Recognition → Tool → Chemistry Applications → Exercises
```

**2. Strong Chemical Grounding**
| Lecture | Hook |
|---------|------|
| L03 | Protein sequences (20¹⁰⁰ combinations) |
| L04 | Water bond geometry |
| L07 | Molecular coordinate matrix |
| L09 | Water invariants under rotation |
| L12 | Reaction rate at t=25s |
| L17 | Product accumulation from rate |
| L19 | Uranium decay cascade |
| L22 | Bond length measurement error |

**3. Primitive-Tool Mapping**
Each lecture successfully connects perception → formalism:
- DIRECTION → vectors
- ARRANGEMENT → matrices
- SAMENESS → eigenvalues
- CHANGE → derivatives
- ACCUMULATION → integrals
- SPREAD → probability

---

### What's Missing (vs. Primer)

#### 1. Rigid 1:1 Mapping

**Current state:** Most lectures treat ONE primitive
```
L03: COLLECTION only
L04: DIRECTION only
L09: SAMENESS only
L12: CHANGE only
L17: ACCUMULATION only
```

**Primer says:** "The tools combine because the primitives combine. Any real phenomenon involves multiple primitives simultaneously."

**Exception:** L19 (Differential Equations) correctly combines CHANGE + RATE + ACCUMULATION

**Fix needed:** Show how phenomena blend primitives. Example: A reaction rate law involves:
- CHANGE (concentration evolving)
- RATE (how fast)
- PROXIMITY (collision requirement)
- ACCUMULATION (total yield)

---

#### 2. A → B Not Central

**Current state:** Transformation framing exists but is incidental
- L07 shows matrix transformations
- L19 shows A → B → C reactions
- L24 shows Reality → Tool pipeline

**Primer says:** "All of chemistry reduces to one statement: Something becomes something else. A → B"

**Fix needed:** Every lecture should frame its content as:
- What is A? (initial state)
- What is B? (final state)
- What governs →? (rules)

---

#### 3. No Clearinghouse Framing

**Current state:** Primitives presented as cognitive categories

**Primer says:** Primitives are the **clearinghouse** — chemistry poses needs, primitives parse needs, tools emerge from primitives

```
Chemistry need → PRIMITIVE → Tool
```

**Fix needed:** Add explicit "Chemistry asks... Primitive parses... Tool answers..." flow

---

#### 4. Thermo/Kinetics Rules Missing

**Current state:** Rules not articulated as thermo vs kinetics

**Primer says:**
- **CAN it happen?** (Thermodynamics) — SAMENESS + PROXIMITY
- **WILL it happen?** (Kinetics) — RATE + PROXIMITY

**Fix needed:** L09 (invariance) should connect SAMENESS to thermodynamic constraints. L12-L16 (derivatives) should connect RATE to kinetic accessibility.

---

#### 5. Rearrangement Not Explicit

**Current state:** Transformations taught as abstract math operations

**Primer says:** "The arrow IS rearrangement. A transforms into B by rearranging — atoms shuffle, bonds break and form, electrons relocate."

**Fix needed:** Ground matrix transformations, derivatives, etc. in physical rearrangement of matter.

---

## Lecture-by-Lecture Gap Analysis

### Module 1: STRUCTURE (L01-L08)

| Lecture | Primitives | Gap |
|---------|------------|-----|
| L01 | Multiple (9) | ✅ Introduces framework correctly |
| L02 | — | Needs: connect number types to representation of states |
| L03 | COLLECTION | Needs: show COLLECTION blending with ARRANGEMENT |
| L04 | DIRECTION | Needs: vectors as state components, not just geometry |
| L05 | DIRECTION | ✅ Dot product well-grounded |
| L06 | DIRECTION | Needs: basis as "language" for describing states |
| L07 | ARRANGEMENT | Needs: matrices as A → B operators explicitly |
| L08 | ARRANGEMENT | Needs: transformations as rearrangement |

### Module 2: CHANGE (L09-L18)

| Lecture | Primitives | Gap |
|---------|------------|-----|
| L09 | SAMENESS | Needs: connect to thermodynamic constraints (CAN) |
| L10 | SAMENESS | ✅ Eigenvalues as "what survives transformation" |
| L11 | PROXIMITY | Needs: connect limits to "how close" |
| L12 | CHANGE | Needs: derivative as "arrow" description |
| L13 | CHANGE | ✅ Rules well-structured |
| L14 | CHANGE | Needs: extrema as equilibrium states |
| L15 | CHANGE | Needs: partials as "which rearrangement?" |
| L16 | CHANGE | Needs: Taylor as local approximation of A → B |
| L17 | ACCUMULATION | ✅ Well-grounded in "total effect" |
| L18 | ACCUMULATION | ✅ Techniques well-motivated |

### Module 3: PROBABILITY (L19-L24)

| Lecture | Primitives | Gap |
|---------|------------|-----|
| L19 | CHANGE+RATE+ACCUMULATION | ✅ Best example of blending |
| L20 | SPREAD | Needs: probability as "where things end up" |
| L21 | SPREAD | Needs: distributions as equilibrium outcomes |
| L22 | SPREAD | Needs: error as "spread of A → B" |
| L23 | — | Dimensions — check for primitive connection |
| L24 | ALL | ✅ Synthesis works well |

---

## Recommended Actions

### Priority 1: Add Primer Excerpt to Each Lecture

Insert at the start of each lecture (after hook):
```html
<div class="primer-box">
  <p><strong>Chemistry asks:</strong> [specific question]</p>
  <p><strong>Primitive:</strong> [PRIMITIVE NAME] — "[cognitive act]"</p>
  <p><strong>Tool summoned:</strong> [mathematical formalism]</p>
</div>
```

### Priority 2: Revise L07-L08 (Matrices/Transformations)

These are the **A → B** lectures. They should explicitly frame:
- A = initial state vector
- B = final state vector
- Matrix = the rearrangement operator
- → = matrix multiplication

### Priority 3: Add "Blending" Examples

In L09, L12, L17, L19 — show how multiple primitives combine:
```
Rate law example:
  CHANGE (d[A]/dt) + RATE (k coefficient) + PROXIMITY (collision)
```

### Priority 4: Add Thermo/Kinetics Frame to L09-L19

- L09: SAMENESS → "What CAN happen" (thermodynamic constraints)
- L12-L16: RATE → "What WILL happen" (kinetic accessibility)

### Priority 5: Link to PRIMER.md

Add footer to all lectures:
```html
<footer>
  <a href="../../PRIMER.md">Read the Primer →</a>
</footer>
```

---

## Summary

The lectures are **pedagogically sound** but predate the refined primer. The main gaps:

1. **Rigid 1:1 mapping** — need to show primitives blend
2. **A → B not central** — need to make transformation explicit
3. **Clearinghouse missing** — need to show chemistry → primitive → tool flow
4. **Thermo/kinetics** — need CAN vs WILL framing

Estimated effort: **2-3 hours** to add primer boxes and A → B framing to all 24 lectures.

---

*Audit completed: 2026-01-13*
