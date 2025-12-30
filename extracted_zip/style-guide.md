# Chemical Thinking Style Guide

## Lecture Structure

Every lecture follows this skeleton:

```
1. THE HOOK (2 min)
   └── A phenomenon. An image. A question.
   
2. RECOGNITION (3 min)
   └── "What do you notice?" → Name the primitive(s)
   
3. THE TOOL (15 min)
   └── Mathematical content, built step-by-step
   └── Interleaved with code/visualization
   
4. INTERACTIVE EXPLORATION (10 min)
   └── Sliders, parameters, "what if"
   └── Students play, see relationships
   
5. CHEMISTRY CONNECTION (10 min)
   └── Real applications, worked examples
   
6. EXERCISES (5 min intro, homework)
   └── 3-5 problems, graduated difficulty
```

---

## Primitive Naming Convention

Always use **CAPS** for primitives in all materials:

✅ DIRECTION, SAMENESS, ACCUMULATION
❌ direction, Direction, "the direction primitive"

When listing: `COLLECTION | ARRANGEMENT | DIRECTION | PROXIMITY | SAMENESS | CHANGE | RATE | ACCUMULATION | SPREAD`

---

## Chemical Examples Bank

### COLLECTION
- Moles and Avogadro's number
- Electron shells (how many electrons fit?)
- Counting isomers
- Quantum numbers (n, l, m)

### ARRANGEMENT
- Stereoisomers (same atoms, different order)
- Crystal polymorphs
- Electron configurations
- MO energy level diagrams

### DIRECTION
- Bond angles (water 104.5°, CO₂ 180°)
- Dipole moments
- Orbital orientation (px, py, pz)
- Gradient/reaction coordinate

### PROXIMITY
- Lennard-Jones potential
- Coulomb's law (1/r)
- Reaction coordinate diagrams
- Titration curves (near equivalence point)

### SAMENESS
- Molecular symmetry (C2v, D6h)
- Resonance structures
- Conservation laws
- Equilibrium (forward = reverse)

### CHANGE
- Reaction progress (A → B)
- Phase transitions
- Electron transitions
- Conformational change

### RATE
- Kinetics (first order, second order)
- Half-life
- Diffusion
- Turnover number

### ACCUMULATION
- Work (∫F·dx)
- Heat capacity (∫C dT)
- Total yield
- Normalization (∫|ψ|² = 1)

### SPREAD
- Maxwell-Boltzmann distribution
- Orbital probability density
- Entropy (W microstates)
- Error/uncertainty distributions

---

## Visualization Standards

### Color Palette
| Use | Color | Hex |
|-----|-------|-----|
| Functions/curves | Purple | #8B5CF6 |
| Distributions | Orange | #F97316 |
| Potentials/energy | Green | #22C55E |
| Vectors | Blue | #3B82F6 |
| Highlights | Red | #EF4444 |
| Neutral/reference | Gray | #6B7280 |

### Plot Requirements
- Always label axes with units
- Include title stating what's shown
- Use `aspect_ratio=:equal` for geometric plots
- Set explicit `xlim`, `ylim` to prevent jumpy rescaling

### Interactivity Requirements
- Minimum 2 sliders per lecture notebook
- Slider ranges should span interesting behavior
- Default values should show "typical" case
- Include `show_value=true` on sliders

---

## Writing Voice

### Do
- Start with phenomenon, not definition
- Use "you" directly: "You see...", "Notice how..."
- Ask questions: "What do you notice?"
- Be direct: "This is DIRECTION"
- Trust the visualization to carry meaning

### Don't
- "In this lecture, we will learn about..."
- "It is important to understand that..."
- Over-explain what's visually obvious
- Apologize for math difficulty
- Use passive voice

### Example Transformations

❌ "The derivative can be understood as the instantaneous rate of change of a function."

✅ "How fast is it changing *right now*? That's the derivative."

---

❌ "We will now examine the properties of vectors in three-dimensional space."

✅ "A bond points somewhere. That 'somewhere' is a vector."

---

## Code Style (Julia)

### Naming
```julia
# Good
θ = deg2rad(bond_angle)
v⃗ = [vx, vy, vz]
ΔE = E_final - E_initial

# Avoid
theta = deg2rad(bond_angle)
v_vec = [vx, vy, vz]
delta_E = E_final - E_initial
```

### Functions
```julia
# Good — mathematical style
f(x) = x^2 + 2x + 1
V(r) = 4ε * ((σ/r)^12 - (σ/r)^6)

# Avoid — verbose style
function f(x)
    return x^2 + 2*x + 1
end
```

### Comments
```julia
# Good — explain WHAT/WHY
# Lennard-Jones: attractive at medium range, repulsive at short range
V(r) = 4ε * ((σ/r)^12 - (σ/r)^6)

# Avoid — explain HOW (obvious from code)
# Calculate V by raising sigma over r to the 12th power...
```

---

## File Naming

### Lectures (Quarto)
```
lectures/
├── index.qmd
├── 01-orientation.qmd
├── 02-existence.qmd
├── 03-counting.qmd
...
└── 24-synthesis.qmd
```

### Notebooks (Pluto)
```
notebooks/
├── Lecture_01_Seeing.jl
├── Lecture_02_Existence.jl
├── Lecture_03_Counting.jl
...
└── Lecture_24_Synthesis.jl
```

### Notebooks (Colab alternative)
```
notebooks/colab/
├── Lecture_01_Seeing.ipynb
├── Lecture_02_Existence.ipynb
...
```

---

## Exercise Design

### Format
Each exercise should have:
1. **Setup** — minimal context
2. **Question** — what to find/show/compute
3. **Primitive hint** — which primitive applies (for early lectures)
4. **Solution** — hidden/separate

### Difficulty Gradient
- **Exercise 1-2:** Direct application of lecture content
- **Exercise 3:** Requires small extension or combination
- **Exercise 4-5:** Challenge problems, real research scenarios

### Example

```markdown
**Exercise 3: Bond Angle in Ammonia**

Ammonia (NH₃) has three N-H bonds. The bond vectors are:
- v₁ = [1, 0, -0.3]
- v₂ = [-0.5, 0.87, -0.3]  
- v₃ = [-0.5, -0.87, -0.3]

(a) What is the angle between any two bonds?
(b) What primitive is this? What tool did you use?
(c) Why isn't it 109.5° like in methane?

*Hint: DIRECTION → dot product*
```

---

## Quality Checklist

Before marking a lecture "complete":

- [ ] Hook is genuinely compelling (would YOU be curious?)
- [ ] Primitive emergence feels natural, not forced
- [ ] At least 2 interactive elements with sliders
- [ ] All plots have labels, titles, appropriate ranges
- [ ] Chemistry connection uses real molecules/reactions
- [ ] Exercises span difficulty range
- [ ] No "we will learn" or passive voice
- [ ] Code uses Unicode where it aids clarity
- [ ] Tested: notebook runs without errors
