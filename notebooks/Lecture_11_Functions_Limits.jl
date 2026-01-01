### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# This Pluto notebook uses @bind for interactivity. When running this notebook outside of Pluto, the following 'mock version' of @bind gives bound variables a default value (instead of an error).
macro bind(def, element)
    quote
        local iv = try Base.loaded_modules[Base.PkgId(Base.UUID("6e696c72-6542-2067-7265-42206c756150"), "AbstractPlutoDingetjes")].Bonds.initial_value catch; b -> missing; end
        local el = $(esc(element))
        global $(esc(def)) = Core.applicable(Base.get, el) ? Base.get(el) : iv(el)
        el
    end
end

# ╔═╡ 8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d
md"""
# Lecture 11: As X Approaches...
## Functions and Limits — The Mathematics of Nearness

**The PROXIMITY Primitive**: Understanding what happens as variables approach certain values.
"""

# ╔═╡ 2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d
md"""
## 1. Functions: The Language of Dependence

A **function** f: X → Y assigns to each input x exactly one output f(x).

In chemistry, functions describe how quantities depend on each other:
- Potential energy V(r) depends on distance
- Reaction rate v([S]) depends on substrate concentration
- Population distribution P(E) depends on energy
"""

# ╔═╡ 3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d
md"""
### Interactive: Function Explorer

Select a function to explore:
"""

# ╔═╡ 4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d
@bind func_type Select([
    "polynomial" => "Polynomial: x² - 2x + 1",
    "rational" => "Rational: 1/(x-1)",
    "exponential" => "Exponential: e⁻ˣ",
    "sinc" => "Sinc: sin(x)/x",
    "gaussian" => "Gaussian: e⁻ˣ²"
])

# ╔═╡ 5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d
begin
    x_range = -5:0.01:5

    if func_type == "polynomial"
        y = x_range.^2 .- 2 .* x_range .+ 1
        title_str = "f(x) = x² - 2x + 1"
    elseif func_type == "rational"
        y = [abs(x - 1) < 0.05 ? NaN : 1/(x-1) for x in x_range]
        title_str = "f(x) = 1/(x-1)"
    elseif func_type == "exponential"
        y = exp.(-x_range)
        title_str = "f(x) = e⁻ˣ"
    elseif func_type == "sinc"
        y = [abs(x) < 0.001 ? 1.0 : sin(x)/x for x in x_range]
        title_str = "f(x) = sin(x)/x"
    else  # gaussian
        y = exp.(-x_range.^2)
        title_str = "f(x) = e⁻ˣ²"
    end

    plot(x_range, y,
        title = title_str,
        xlabel = "x",
        ylabel = "f(x)",
        linewidth = 2,
        color = :orange,
        legend = false,
        ylims = (-3, 3),
        size = (600, 400)
    )
    hline!([0], color = :gray, linestyle = :dash, alpha = 0.5)
    vline!([0], color = :gray, linestyle = :dash, alpha = 0.5)
end

# ╔═╡ 6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d
md"""
## 2. Limits: The Mathematics of Approach

The **limit** captures what happens as x approaches a value, without necessarily reaching it.

**Formal Definition**: We say lim_{x→a} f(x) = L if for every ε > 0, there exists δ > 0 such that:

$$0 < |x - a| < \delta \implies |f(x) - L| < \varepsilon$$
"""

# ╔═╡ 7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d
md"""
### Interactive: Limit Explorer for sin(x)/x

Drag the slider to see what happens as x approaches 0:
"""

# ╔═╡ 8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d
@bind x_approach Slider(0.01:0.01:2.0, default=1.0, show_value=true)

# ╔═╡ 9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d
begin
    sinc_val = sin(x_approach) / x_approach
    dist_from_limit = abs(1 - sinc_val)

    md"""
    **Current x**: $(round(x_approach, digits=3))

    **f(x) = sin(x)/x**: $(round(sinc_val, digits=4))

    **Distance from limit (1)**: $(round(dist_from_limit, digits=4))

    As x → 0, sin(x)/x → **1**
    """
end

# ╔═╡ 0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5e
begin
    x_sinc = -4π:0.01:4π
    y_sinc = [abs(x) < 0.001 ? 1.0 : sin(x)/x for x in x_sinc]

    p_sinc = plot(x_sinc, y_sinc,
        title = "sin(x)/x approaching the limit",
        xlabel = "x",
        ylabel = "f(x)",
        linewidth = 2,
        color = :orange,
        legend = false,
        size = (600, 400)
    )

    # Mark the limit
    hline!([1], color = :red, linestyle = :dash, label = "y = 1 (limit)")

    # Mark current point
    scatter!([x_approach], [sinc_val],
        color = :green,
        markersize = 8,
        label = "Current point"
    )
    scatter!([-x_approach], [sinc_val],
        color = :green,
        markersize = 8
    )

    # Draw approach lines
    plot!([x_approach, 0], [sinc_val, 1],
        color = :green,
        linestyle = :dot,
        linewidth = 2
    )

    p_sinc
end

# ╔═╡ 1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e
md"""
## 3. Types of Discontinuity

A function is **continuous at a** if:
1. f(a) is defined
2. lim_{x→a} f(x) exists
3. lim_{x→a} f(x) = f(a)

When any condition fails, we have a **discontinuity**:
"""

# ╔═╡ 2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f
@bind discont_type Select([
    "continuous" => "Continuous Function",
    "jump" => "Jump Discontinuity",
    "removable" => "Removable Discontinuity",
    "infinite" => "Infinite Discontinuity"
])

# ╔═╡ 3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a
begin
    x_disc = -3:0.01:3

    if discont_type == "continuous"
        y_disc = sin.(2 .* x_disc) .* 0.8 .+ 1
        disc_title = "Continuous: sin(2x)·0.8 + 1"
    elseif discont_type == "jump"
        y_disc = [x < 0 ? 0.5 : 1.5 for x in x_disc]
        disc_title = "Jump Discontinuity at x = 0"
    elseif discont_type == "removable"
        y_disc = [abs(x - 1) < 0.05 ? NaN : (x^2 - 1)/(x - 1) for x in x_disc]
        disc_title = "Removable: (x² - 1)/(x - 1)"
    else  # infinite
        y_disc = [abs(x) < 0.05 ? NaN : 1/x for x in x_disc]
        disc_title = "Infinite Discontinuity: 1/x"
    end

    plot(x_disc, y_disc,
        title = disc_title,
        xlabel = "x",
        ylabel = "f(x)",
        linewidth = 2,
        color = :orange,
        legend = false,
        ylims = (-3, 3),
        size = (600, 400)
    )
    hline!([0], color = :gray, linestyle = :dash, alpha = 0.5)
    vline!([0], color = :gray, linestyle = :dash, alpha = 0.5)
end

# ╔═╡ 4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b
md"""
## 4. Chemical Applications

### 4.1 The Lennard-Jones Potential

The potential energy between two neutral atoms:

$$V(r) = 4\varepsilon\left[\left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^6\right]$$
"""

# ╔═╡ 5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c
md"""
**Parameters:**

ε (well depth): $(@bind lj_eps Slider(0.5:0.1:3.0, default=1.0, show_value=true))

σ (size): $(@bind lj_sig Slider(0.5:0.1:2.0, default=1.0, show_value=true))
"""

# ╔═╡ 6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1e
begin
    r_lj = 0.9:0.01:4.0
    V_lj = 4 * lj_eps .* ((lj_sig ./ r_lj).^12 .- (lj_sig ./ r_lj).^6)

    r_eq = 2^(1/6) * lj_sig
    V_min = -lj_eps

    p_lj = plot(r_lj, V_lj,
        title = "Lennard-Jones Potential",
        xlabel = "r/σ",
        ylabel = "V/ε",
        linewidth = 2,
        color = :orange,
        legend = false,
        ylims = (-2, 3),
        size = (600, 400)
    )

    hline!([0], color = :gray, linestyle = :dash, alpha = 0.5)
    scatter!([r_eq], [V_min], color = :purple, markersize = 8, label = "Minimum")

    # Annotations
    annotate!([(3.5, 2.5, text("lim V(r) as r→∞ = 0", 10, :gray))])
    annotate!([(1.5, 2.5, text("lim V(r) as r→0 = +∞", 10, :red))])

    p_lj
end

# ╔═╡ 7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e
md"""
**Limit Analysis:**
- **As r → 0**: The r⁻¹² term dominates → V → +∞ (infinite repulsion)
- **As r → ∞**: Both terms → 0 → V → 0 (no interaction)
- **Minimum at r = $(round(r_eq, digits=3))σ**: V = -ε
"""

# ╔═╡ 8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f
md"""
### 4.2 Michaelis-Menten Kinetics

Enzyme reaction rate as a function of substrate concentration:

$$v = \frac{V_{max}[S]}{K_M + [S]}$$
"""

# ╔═╡ 9d0e1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f4a
md"""
V_max: $(@bind mm_vmax Slider(0.5:0.1:2.0, default=1.0, show_value=true))

K_M: $(@bind mm_km Slider(0.1:0.1:2.0, default=0.5, show_value=true))
"""

# ╔═╡ 0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b
begin
    S_range = 0:0.01:5
    v_mm = mm_vmax .* S_range ./ (mm_km .+ S_range)

    p_mm = plot(S_range, v_mm,
        title = "Michaelis-Menten Kinetics",
        xlabel = "[S]",
        ylabel = "v",
        linewidth = 2,
        color = :orange,
        legend = false,
        size = (600, 400)
    )

    # Vmax asymptote
    hline!([mm_vmax], color = :red, linestyle = :dash, label = "Vmax")

    # Mark Km point (where v = Vmax/2)
    scatter!([mm_km], [mm_vmax/2], color = :purple, markersize = 8)
    vline!([mm_km], color = :purple, linestyle = :dot, alpha = 0.5)

    annotate!([(4.0, mm_vmax + 0.1, text("Vmax (limit as [S]→∞)", 10, :red))])
    annotate!([(mm_km + 0.3, mm_vmax/2 - 0.1, text("Km, Vmax/2", 10, :purple))])

    p_mm
end

# ╔═╡ 1f2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c
md"""
**Limit Analysis:**
- **As [S] → 0**: v → 0 (no substrate, no reaction)
- **As [S] → ∞**: v → V_max (enzyme saturated)
- **At [S] = K_M**: v = V_max/2 (half-maximal rate)
"""

# ╔═╡ 2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7e
md"""
### 4.3 Boltzmann Distribution

Fraction of molecules in excited state vs temperature:

$$P_{excited} = \frac{e^{-\Delta E/k_BT}}{1 + e^{-\Delta E/k_BT}}$$
"""

# ╔═╡ 3b4c5d6e-7f8a-9b0c-1d2e-3f4a5b6c7d8e
md"""
Temperature (K): $(@bind boltz_T Slider(100:50:1000, default=300, show_value=true))

Energy gap (units of kT₃₀₀): $(@bind boltz_gap Slider(0.5:0.5:5.0, default=2.0, show_value=true))
"""

# ╔═╡ 4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f
begin
    T_range = 100:10:1000
    kT_norm = T_range ./ 300  # Normalize to room temperature

    exp_factor = exp.(-boltz_gap ./ kT_norm)
    P_excited = exp_factor ./ (1 .+ exp_factor)

    # Current probability
    kT_current = boltz_T / 300
    exp_current = exp(-boltz_gap / kT_current)
    P_current = exp_current / (1 + exp_current)

    p_boltz = plot(T_range, P_excited,
        title = "Boltzmann Distribution",
        xlabel = "Temperature (K)",
        ylabel = "P(excited)",
        linewidth = 2,
        color = :orange,
        legend = false,
        ylims = (0, 0.6),
        size = (600, 400)
    )

    # 0.5 asymptote
    hline!([0.5], color = :red, linestyle = :dash)

    # Mark current point
    scatter!([boltz_T], [P_current], color = :green, markersize = 8)

    annotate!([(800, 0.52, text("limit as T→∞ = 0.5", 10, :red))])
    annotate!([(200, 0.05, text("limit as T→0 = 0", 10, :gray))])

    p_boltz
end

# ╔═╡ 5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a
md"""
**Current state:**
- Temperature: $(boltz_T) K
- P(excited): $(round(P_current, digits=4))

**Limits:**
- **As T → 0**: P → 0 (all molecules in ground state)
- **As T → ∞**: P → 0.5 (equal populations)
"""

# ╔═╡ 6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b
md"""
## 5. Summary: Limits in Chemistry

| System | Variable | Limit As → 0 | Limit As → ∞ |
|--------|----------|--------------|--------------|
| Lennard-Jones | r | V → +∞ | V → 0 |
| Michaelis-Menten | [S] | v → 0 | v → V_max |
| Boltzmann | T | P → 0 | P → 0.5 |
| First-order kinetics | t | [A] → [A]₀ | [A] → 0 |

The language of limits allows us to describe **boundary behavior** — what happens at the extremes of our variables.
"""

# ╔═╡ 7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c
md"""
## Exercises

### Exercise 1: Limit Evaluation
Evaluate the following limits:
1. lim_{x→2} (x² - 4)/(x - 2)
2. lim_{x→0} (eˣ - 1)/x
3. lim_{x→∞} (3x² + 2x)/(x² + 1)

### Exercise 2: Lennard-Jones Analysis
For the Lennard-Jones potential:
1. Find r where dV/dr = 0
2. What is V at this point?
3. At what r does V = 0?

### Exercise 3: Michaelis-Menten
An enzyme has V_max = 100 μM/s and K_M = 5 μM:
1. What is v when [S] = 5 μM?
2. What [S] gives v = 90 μM/s?
"""

# ╔═╡ 8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3e
md"""
---
*Next: Lecture 12 — Derivatives: When limits meet rates of change*
"""

# ╔═╡ Cell order:
# ╠═8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d
# ╟─1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d
# ╟─2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d
# ╟─3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d
# ╟─4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d
# ╟─5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d
# ╟─6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d
# ╟─7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d
# ╟─8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d
# ╟─9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d
# ╟─0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5e
# ╟─1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e
# ╟─2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f
# ╟─3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a
# ╟─4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b
# ╟─5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c
# ╟─6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1e
# ╟─7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e
# ╟─8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f
# ╟─9d0e1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f4a
# ╟─0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b
# ╟─1f2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c
# ╟─2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7e
# ╟─3b4c5d6e-7f8a-9b0c-1d2e-3f4a5b6c7d8e
# ╟─4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f
# ╟─5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a
# ╟─6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b
# ╟─7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c
# ╟─8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3e
