# Adaptive Exercises — Design

**Date:** 2026-06-12
**Status:** Validated, ready for implementation
**Pilot:** Lecture 12 (`derivative-rate`)

## Goal

A per-topic adaptive exercise widget that, when a student answers wrong,
**diagnoses the specific misconception**, delivers a **graduated nudge**
(not the full solution), and serves **fresh targeted variants until the
student gets it** — while students who answer correctly **climb in
difficulty**. Mastery requires clean (un-nudged) solves.

## Key decisions (all validated with author)

| Decision | Choice | Rationale |
|---|---|---|
| Diagnosis intelligence | **Authored, in-browser** | Offline, deterministic, instant, never hallucinates a misconception. Author is the domain expert. |
| Answer format | **Mixed per problem** | Numeric entry where a computed answer makes sense; multiple choice for conceptual "which/why" questions. |
| Escalation | **Per-misconception** | Same misconception persists → more concrete nudge. Different misconception → fresh level-1 nudge (don't punish fixing the first error). |
| Difficulty | **Three tiers, climb on clean solve** | Right answers advance one tier; mastery = clean solve at each tier finishing with Tier 3. |
| On wrong | **Hold, don't drop** | Dropping a tier feels punitive; student is already getting targeted help. |
| Server dependency | **None** — pure client-side | Works on static Cloudflare Pages regardless of home-server uptime. Fixes existing fragility. |
| Persistence | **localStorage** | Survives refresh, no login. Optional backend sync later. |

## The adaptive loop

Two adaptive forces on two axes:
- **Wrong answers** move *across* misconceptions → diagnose + nudge, hold difficulty.
- **Right answers** move *up* difficulty → harder variant.

1. Student attempts a variant at the current tier.
2. **Right (no nudges used)** → advance one tier; mastery when Tier 3 is clean-solved.
3. **Right (nudges were used)** → hold tier; serve another variant (must eventually clean-solve to advance).
4. **Wrong** → match answer against the misconception table → show that
   misconception's current nudge level → generate a **fresh variant** → retry.
   - Same misconception again → escalate nudge concreteness (L1 → L2 → L3).
   - Different misconception → fresh L1 nudge for the new error.
   - Unrecognized answer → generic "check your steps" hint; reveal after N tries.
5. Difficulty never climbs mid-struggle.

Mastery counts **clean solves only**, so heavy-scaffolded solves keep the loop
going "until the student gets it."

### Nudge ladder example (derivative rate, Tier 1)

Problem: rate `−d[A]/dt` of `[A] = c·e^(−kt)` at `t = 0` (answer `k·c`).

| Student gives | Diagnosis | Nudge L1 |
|---|---|---|
| `c` (the value) | Concentration vs. its rate | "You reported [A]. The rate is how fast it *changes* — d[A]/dt." |
| `−k·c` | Dropped/!inverted sign | "Right size, wrong sign. A is consumed, but the rate is reported positive." |
| `c` again after k-nudge | Forgot the factor k | "Differentiating e^(−kt) pulls down a −k. Where did your k go?" |

## Difficulty tiers (derivative example)

| Tier | Tests | Example |
|---|---|---|
| 1 — Easy | Direct application, friendly numbers | Rate at **t = 0** → `k·c` |
| 2 — Medium | Evaluate away from zero; invert | Rate at **t = 10**; "at what t is the rate 0.01?" |
| 3 — Hard | Multi-step / cross-domain / 2nd derivative | Marginal cost = target; "is CO₂ accelerating?" |

## Architecture

Three pieces, clean separation:

- **`site/js/adaptive-engine.js`** — reusable engine. Runs the loop, tracks
  current tier + per-misconception nudge depth, renders the widget, persists to
  localStorage. Written once.
- **`site/js/skills/<topic>.js`** — authored content, one file per topic.
- **Per-page drop-in:** `<div data-skill="derivative-rate"></div>` plus two
  `<script>` tags at the bottom of each lecture's exercises section. Static
  worked examples and exercises stay; the widget is an added "Practice until
  mastery" block.

### Authoring format (per-topic JS module)

Wrong-answer values are computed from the **same random parameters** as the
correct answer, so diagnosis stays exact under any randomization.

```js
export const derivativeRate = {
  id: "derivative-rate",
  title: "Instantaneous rate from C(t) = c·e^(−kt)",
  tiers: [
    { // TIER 1 — evaluate at t = 0
      gen() {
        const c = rand([0.4, 0.5, 0.8, 1.0]);
        const k = rand([0.05, 0.1, 0.2]);
        return {
          prompt: `For [A] = ${c}·e^(−${k}t) M, what is the rate −d[A]/dt at t = 0? (M/s)`,
          correct: c * k,
          tol: 0.001,
          misconceptions: [
            { value: c,
              why: "That's [A] itself, not its rate of change.",
              nudges: [
                "You reported [A]. The rate is how fast it *changes* — d[A]/dt.",
                "Differentiate c·e^(−kt): the e^(−kt) pulls down a factor of −k.",
                `−d[A]/dt = k·c. Here k=${k}, c=${c}. Now compute and retry.` ] },
            { value: -c * k,
              why: "Right size, wrong sign.",
              nudges: [ "A is consumed, so d[A]/dt < 0 — but the *rate* is reported positive." ] }
          ]
        };
      }
    }
    // TIER 2: evaluate at t≠0 … TIER 3: invert / cross-domain …
  ]
};
```

Conceptual (multiple-choice) problems use the same shape with `choices` +
tagged distractors instead of `value`.

The author only ever writes `gen()` functions and misconception tables. The
engine handles loop, tier climb, nudge escalation, rendering, and persistence.

## Scope and rollout

1. Build `adaptive-engine.js` + the `derivative-rate` skill (Tiers 1–3).
2. Mount in Lecture 12; author tests the full loop end-to-end.
3. Iterate on the engine/UX from that feedback.
4. Template the remaining 23 topics (one skill file each), module by module —
   author's corrections on the pilot calibrate the rest.

## Relationship to existing system

- The existing Ollama/FastAPI `/grade` backend and `practice-widget.js` are
  **not** used by this loop. They remain available for later open-ended features
  (e.g. homework grading) but introduce no dependency here.
- This fixes the prior fragility where the adaptive feature died whenever the
  home server or Cloudflare tunnel was down.
