### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ 00000001-cell
begin
    using Plots
    using PlutoUI
    using LinearAlgebra
    plotly()
end

# ╔═╡ 00000002-cell
md"""
# Lecture 1: Seeing

**Chemical Thinking: The Grammar of Reality**

---

## The Promise

By the end of this course, you will look at a beaker, a molecule, a graph, a process — and you will **see** what kind of thing it is.

The math will follow.

---

## A Quick Experiment

I'm going to show you five situations.

For each one, just **notice what you notice**.

Don't try to solve anything. Just look.
"""

# ╔═╡ 00000003-cell
md"""
---
## Situation 1: The Molecule

Water: H₂O. What do you see?
"""

# ╔═╡ 00000004-cell
begin
    # Water molecule visualization
    bond_angle = 104.5  # degrees
    θ = deg2rad(bond_angle)
    
    O = [0.0, 0.0]
    H1 = [cos(θ/2), sin(θ/2)]
    H2 = [cos(θ/2), -sin(θ/2)]
    
    p1 = plot(
        [O[1], H1[1]], [O[2], H1[2]], 
        linewidth=4, color=:blue, label="",
        xlim=(-0.5, 1.5), ylim=(-1, 1),
        aspect_ratio=:equal,
        axis=false, grid=false,
        title="Water Molecule"
    )
    plot!(p1, [O[1], H2[1]], [O[2], H2[2]], linewidth=4, color=:blue, label="")
    scatter!(p1, [O[1]], [O[2]], markersize=30, color=:red, label="O")
    scatter!(p1, [H1[1], H2[1]], [H1[2], H2[2]], markersize=15, color=:white, markerstrokewidth=2, label="H")
    p1
end

# ╔═╡ 00000005-cell
md"""
**What do you notice?**

Most people say: *"The bonds point in different directions"* or *"There's an angle."*

→ You're seeing **DIRECTION**
"""

# ╔═╡ 00000006-cell
md"""
---
## Situation 2: The Decay

Concentration of a reactant over time:
"""

# ╔═╡ 00000007-cell
begin
    t = 0:0.1:50
    C = exp.(-0.1 .* t)
    
    p2 = plot(t, C, 
        linewidth=3, color=:purple, label="[A]",
        xlabel="Time (s)", ylabel="Concentration (M)",
        title="Reactant Concentration",
        ylim=(0, 1.1)
    )
end

# ╔═╡ 00000008-cell
md"""
**What do you notice?**

Most people say: *"It's going down"* or *"Fast at first, then slower."*

→ You're seeing **CHANGE** and **RATE**
"""

# ╔═╡ 00000009-cell
md"""
---
## Situation 3: The Potential

Two atoms approach each other. What happens to the energy?
"""

# ╔═╡ 00000010-cell
begin
    r = 0.8:0.01:3.0
    # Lennard-Jones potential
    σ = 1.0
    ε = 1.0
    V = 4ε .* ((σ./r).^12 .- (σ./r).^6)
    
    p3 = plot(r, V, 
        linewidth=3, color=:green, label="V(r)",
        xlabel="Distance r", ylabel="Energy V",
        title="Interatomic Potential",
        ylim=(-1.5, 3)
    )
    hline!(p3, [0], linestyle=:dash, color=:gray, label="")
end

# ╔═╡ 00000011-cell
md"""
**What do you notice?**

Most people say: *"There's a well"* or *"Too close = bad, far away = nothing."*

→ You're seeing **PROXIMITY**
"""

# ╔═╡ 00000012-cell
md"""
---
## Situation 4: The Distribution

Molecular speeds at different temperatures:
"""

# ╔═╡ 00000013-cell
@bind T_slider Slider(100:50:1000, default=300, show_value=true)

# ╔═╡ 00000014-cell
begin
    # Maxwell-Boltzmann distribution
    m = 28.0  # N₂ molar mass (g/mol)
    kB = 1.38e-23
    R = 8.314
    
    v = 0:5:1500
    
    # f(v) for Maxwell-Boltzmann
    function maxwell_boltzmann(v, T, M)
        # M in kg/mol, v in m/s, T in K
        M_kg = M / 1000
        return 4π * (M_kg / (2π * R * T))^(3/2) .* v.^2 .* exp.(-M_kg .* v.^2 ./ (2 * R * T))
    end
    
    f = maxwell_boltzmann.(v, T_slider, m)
    
    p4 = plot(v, f .* 1000, 
        linewidth=3, color=:orange, 
        fill=0, fillalpha=0.3,
        label="T = $(T_slider) K",
        xlabel="Speed (m/s)", ylabel="Probability density",
        title="Maxwell-Boltzmann Distribution",
        xlim=(0, 1500)
    )
end

# ╔═╡ 00000015-cell
md"""
**Move the slider. What do you notice?**

Most people say: *"Hot = wider spread"* or *"The peak moves right."*

→ You're seeing **SPREAD**
"""

# ╔═╡ 00000016-cell
md"""
---
## Situation 5: The Symmetry

A benzene ring. Rotate it.
"""

# ╔═╡ 00000017-cell
@bind rotation_angle Slider(0:10:350, default=0, show_value=true)

# ╔═╡ 00000018-cell
begin
    function draw_hexagon(angle_offset)
        n = 6
        angles = [2π*k/n + deg2rad(angle_offset) for k in 0:n]
        x = cos.(angles)
        y = sin.(angles)
        
        p = plot(x, y, 
            linewidth=3, color=:darkblue, label="",
            xlim=(-1.5, 1.5), ylim=(-1.5, 1.5),
            aspect_ratio=:equal,
            axis=false, grid=false
        )
        scatter!(p, x[1:6], y[1:6], markersize=12, color=:gray, label="")
        return p
    end
    
    p5 = draw_hexagon(rotation_angle)
    title!(p5, "Benzene (rotated $(rotation_angle)°)")
end

# ╔═╡ 00000019-cell
md"""
**What do you notice?**

Most people say: *"At 60°, 120°, 180°... it looks the same!"*

→ You're seeing **SAMENESS**
"""

# ╔═╡ 00000020-cell
md"""
---
## The Primitives

You used **different kinds of words** for each situation:

| Situation | What You Described | Primitive |
|-----------|-------------------|-----------|
| Molecule | Things **pointing** | DIRECTION |
| Decay | Something **changing** | CHANGE / RATE |
| Potential | **Close** vs. **far** | PROXIMITY |
| Distribution | How something is **spread** | SPREAD |
| Symmetry | What stays **the same** | SAMENESS |

These are fundamental ways humans parse reality.

**Math and chemistry are both formalizations of these acts.**
"""

# ╔═╡ 00000021-cell
md"""
---
## Each Primitive Summons Tools

| Primitive | Tools |
|-----------|-------|
| COLLECTION | Sets, counting, factorial |
| ARRANGEMENT | Permutations, matrices |
| DIRECTION | Vectors, dot product |
| PROXIMITY | Functions, limits |
| SAMENESS | Eigenvalues, symmetry groups |
| CHANGE | Derivatives |
| RATE | Derivatives, diff eq |
| ACCUMULATION | Integrals |
| SPREAD | Probability, distributions |

The tools weren't invented and then applied.

They were **invented because we see these patterns**.
"""

# ╔═╡ 00000022-cell
md"""
---
## The Course Method

```
REALITY  →  RECOGNITION  →  TOOL
   ↓            ↓            ↓
You see     You know      You know
something   what kind     what to
            it is         use
```

We will practice this over 24 lectures.

By the end, you will **see** chemistry mathematically.
"""

# ╔═╡ 00000023-cell
md"""
---
## Homework 0 (Ungraded)

Before next class:

1. **List** 5 chemical phenomena you've encountered
2. For each, identify the **primitive(s)**
3. Bring your list to class

Example:
- "Titration" → ACCUMULATION + CHANGE
- "Measuring pH" → PROXIMITY + SPREAD (concentration matters, ions are distributed)
"""

# ╔═╡ 00000024-cell
md"""
---
## Next Lecture

**Lecture 2: Existence** — What kinds of numbers are there?

Why does chemistry need complex numbers?
"""
