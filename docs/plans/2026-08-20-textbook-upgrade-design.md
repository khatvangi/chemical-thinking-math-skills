# CHEM 291 Textbook Upgrade — Design

**Date:** 2026-08-20
**Status:** Approved

## Problem

Two failures in the current lecture pages:

1. **Material feels juvenile.** Choppy declarative fragments, little sustained
   mathematical development, no precise definitions or derivations, trivial
   problems. Reads like a slide deck, not a text.
2. **No build-up.** Each lecture is one long HTML scroll. Serious math sites
   (model: GaTech's *Interactive Linear Algebra*) are structured: one page per
   section, sidebar TOC, numbered Definitions/Theorems/Examples, cross-
   references, exercises closing each section, prev/next navigation.

## Decision summary

| Question | Decision |
|---|---|
| Exemplar | Interactive textbook (ILA / PreTeXt style) |
| Framework | Quarto **book** project + hard custom SCSS theme |
| Organization | Chapters = **topics** (not lectures); schedule page maps weeks → sections later |
| Priority | Module 1 first (students hit it weeks 1–5) |
| Old pages | **Replace**: as each chapter ships, old lecture pages redirect into the book |
| Adaptive practice | Per **section** (`<div data-skill>` + skill module), reusing existing engine |
| Depth | Mortimer/McQuarrie level; proofs where illuminating; not trivial |
| Fall-2026 alignment (schedule/exams/portfolio) | Deferred until Module 1 ships |

## Architecture

New self-contained Quarto book at `book/`, rendered into `site/book/`.
Rendered output is **committed** — Cloudflare Pages keeps serving `site/`
statically; no CI or build-config changes; deploys stay instant.

```
book/
├── _quarto.yml          # book config: chapters, sidebar, theme, KaTeX
├── theme/               # custom SCSS (anti-generic)
├── index.qmd            # front matter
├── 00-seeing/           # Ch 0 prologue
├── 01-numbers/          # one .qmd per section
├── 02-vectors/
├── 03-matrices/
└── js/                  # widgets extracted from old lectures + adaptive engine
```

Canvas widgets are extracted from the old 1,500-line lecture files into small
standalone JS files in `book/js/`, each mounted by a one-line `<div>` include —
same pattern as the adaptive engine.

## Chapter plan (Module 1)

```
Ch 0  Seeing Like a Chemist            (Lecture 1 — short unnumbered prologue)
Ch 1  Numbers and Counting
  1.1 Kinds of numbers (ℕ→ℤ→ℚ→ℝ→ℂ)    (Lecture 2)
  1.2 Sets and collections              (Lecture 3)
  1.3 Permutations and combinations     (Lecture 3)
Ch 2  Vectors
  2.1 Direction in space                (Lecture 4)
  2.2 Magnitude and components          (Lecture 4)
  2.3 The dot product                   (Lecture 5)
  2.4 Basis and coordinates             (Lecture 6)
Ch 3  Matrices and Transformations
  3.1 Grids of numbers                  (Lecture 7)
  3.2 Matrix algebra                    (Lecture 7)
  3.3 Linear transformations            (Lecture 8)
  3.4 Determinants and what they mean   (Lecture 8)
```

## Depth spec (every section)

- Numbered environments: Definition, Theorem (proof or sketch when it
  illuminates — e.g., Cauchy–Schwarz in 2.3, det-as-area in 3.4), Worked
  Example with mandatory **Check** paragraph, Remark boxes.
- Textbook register prose throughout: motivation → derivation-as-narration →
  interpretation, opening from a chemical phenomenon.
- Exercise set closing every section, ramped: routine → chemistry application
  → starred challenge. Odd answers in an appendix.
- Widgets embedded where they teach, framed predict-then-test + debrief.
- One adaptive practice block per section (~11 skill modules for Module 1,
  3 tiers each, misconception tables with distractors computed from the same
  random params as the correct answer).

## Theme

Light-first with dark mode. Fraunces (headings), STIX Two Text (body — a
scientific text serif that harmonizes with math), JetBrains Mono (code).
KaTeX. Environment boxes distinguished by left-rule color + small-caps labels,
not gradient cards. ~65-char measure, generous leading. One custom SCSS theme;
no stock-Quarto traces.

## Rollout

1. **Scaffold + pilot:** install Quarto, build book skeleton + full theme,
   write §2.3 The Dot Product complete (apparatus, proof sketch, widget,
   exercises, adaptive module). User reviews live before mass production.
2. **Teaching order:** Ch 0 → Ch 1 → rest of Ch 2 → Ch 3; one section per
   commit; redirect old lecture pages as each chapter completes.
3. Modules 2–3 and Fall-2026 alignment follow with the same machinery.
