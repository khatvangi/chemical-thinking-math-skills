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

# ╔═╡ a1000014-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000014-0001-0001-0001-000000000002
md"""
# Lecture 14: Finding Extrema

*Where are the maxima and minima? — Optimization in one variable.*

---

## Why Extrema Matter

| Chemistry Problem | Optimization |
|:------------------|:-------------|
| Equilibrium bond length | Minimize V(r) |
| Transition state | Saddle point |
| Most probable speed | Maximize distribution |
| Optimal temperature | Maximize yield |

**Finding extrema is how nature finds equilibrium.**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000003
md"""
---
## The Key Idea

At a maximum or minimum, the function momentarily stops changing.

**f'(x) = 0** at extrema (horizontal tangent).

But f'(x) = 0 doesn't guarantee an extremum — could be an inflection point!
"""

# ╔═╡ a1000014-0001-0001-0001-000000000004
md"""
---
## Critical Point Finder

Explore how critical points relate to extrema.
"""

# ╔═╡ a1000014-0001-0001-0001-000000000005
@bind extrema_func Select([
    "cubic" => "f(x) = x³ - 3x (two extrema)",
    "quartic" => "f(x) = x⁴ - 4x³ (one extremum)",
    "x3" => "f(x) = x³ (inflection, no extremum)",
    "x4" => "f(x) = x⁴ (minimum, f''=0)",
    "sinx" => "f(x) = sin(x) (periodic extrema)"
])

# ╔═╡ a1000014-0001-0001-0001-000000000006
begin
    if extrema_func == "cubic"
        f_ex(x) = x^3 - 3x
        df_ex(x) = 3x^2 - 3
        ddf_ex(x) = 6x
        x_ex = range(-2.5, 2.5, length=300)
        crit_pts = [-1.0, 1.0]
        title_ex = "f(x) = x³ - 3x"
    elseif extrema_func == "quartic"
        f_ex(x) = x^4 - 4x^3
        df_ex(x) = 4x^3 - 12x^2
        ddf_ex(x) = 12x^2 - 24x
        x_ex = range(-1, 4.5, length=300)
        crit_pts = [0.0, 3.0]
        title_ex = "f(x) = x⁴ - 4x³"
    elseif extrema_func == "x3"
        f_ex(x) = x^3
        df_ex(x) = 3x^2
        ddf_ex(x) = 6x
        x_ex = range(-2, 2, length=300)
        crit_pts = [0.0]
        title_ex = "f(x) = x³"
    elseif extrema_func == "x4"
        f_ex(x) = x^4
        df_ex(x) = 4x^3
        ddf_ex(x) = 12x^2
        x_ex = range(-1.5, 1.5, length=300)
        crit_pts = [0.0]
        title_ex = "f(x) = x⁴"
    else
        f_ex(x) = sin(x)
        df_ex(x) = cos(x)
        ddf_ex(x) = -sin(x)
        x_ex = range(-2π, 2π, length=300)
        crit_pts = [-3π/2, -π/2, π/2, 3π/2]
        title_ex = "f(x) = sin(x)"
    end

    p_extrema = plot(layout=(3,1), size=(700, 700))

    # Top: function
    plot!(p_extrema[1], x_ex, f_ex.(x_ex),
        ylabel="f(x)",
        title=title_ex,
        linewidth=3, color=:blue,
        legend=:topright,
        label="f(x)")

    # Mark critical points on f
    for c in crit_pts
        scatter!(p_extrema[1], [c], [f_ex(c)], markersize=10, color=:red, label="")
    end

    # Middle: first derivative
    plot!(p_extrema[2], x_ex, df_ex.(x_ex),
        ylabel="f'(x)",
        linewidth=3, color=:green,
        legend=:topright,
        label="f'(x)")
    hline!(p_extrema[2], [0], color=:gray, linewidth=1, label="")

    # Mark zeros of f'
    for c in crit_pts
        scatter!(p_extrema[2], [c], [0], markersize=10, color=:red, label="")
    end

    # Bottom: second derivative
    plot!(p_extrema[3], x_ex, ddf_ex.(x_ex),
        xlabel="x", ylabel="f''(x)",
        linewidth=3, color=:purple,
        legend=:topright,
        label="f''(x)")
    hline!(p_extrema[3], [0], color=:gray, linewidth=1, label="")

    # Mark f'' at critical points
    for c in crit_pts
        scatter!(p_extrema[3], [c], [ddf_ex(c)], markersize=10, color=:red, label="")
    end

    p_extrema
end

# ╔═╡ a1000014-0001-0001-0001-000000000007
begin
    # Analysis of critical points
    analysis_rows = []
    for c in crit_pts
        fc = round(f_ex(c), digits=3)
        fppc = round(ddf_ex(c), digits=3)

        if abs(ddf_ex(c)) > 0.01
            class = ddf_ex(c) > 0 ? "Local minimum (f'' > 0)" : "Local maximum (f'' < 0)"
        else
            class = "Inconclusive (f'' = 0) — use first derivative test"
        end

        push!(analysis_rows, "| $(round(c, digits=3)) | $fc | $fppc | $class |")
    end

    Markdown.parse("""
    ### Critical Point Analysis

    | Critical point | f(c) | f''(c) | Classification |
    |:---------------|:-----|:-------|:---------------|
    $(join(analysis_rows, "\n"))
    """)
end

# ╔═╡ a1000014-0001-0001-0001-000000000008
md"""
---
## First vs Second Derivative Test

**First derivative test:** Check if f' changes sign at critical point.

**Second derivative test:** Check sign of f'' at critical point.

Second derivative test is often faster, but fails when f''(c) = 0.
"""

# ╔═╡ a1000014-0001-0001-0001-000000000009
md"""
---
## Chemistry: Lennard-Jones Minimum

$V(r) = 4\varepsilon \left[ \left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^{6} \right]$

Where is the equilibrium distance?
"""

# ╔═╡ a1000014-0001-0001-0001-000000000010
md"""
**ε (well depth):**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000011
@bind ε_lj Slider(0.5:0.5:5, default=1, show_value=true)

# ╔═╡ a1000014-0001-0001-0001-000000000012
md"""
**σ (size parameter):**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000013
@bind σ_lj Slider(0.5:0.1:2, default=1, show_value=true)

# ╔═╡ a1000014-0001-0001-0001-000000000014
begin
    # Lennard-Jones
    V_lj(r) = 4ε_lj * ((σ_lj/r)^12 - (σ_lj/r)^6)
    dV_lj(r) = 4ε_lj * (-12σ_lj^12/r^13 + 6σ_lj^6/r^7)

    # Equilibrium distance
    r_eq = σ_lj * 2^(1/6)
    V_eq = -ε_lj

    r_range = range(0.9*σ_lj, 3*σ_lj, length=200)

    p_lj = plot(layout=(2,1), size=(700, 550))

    # Top: potential
    plot!(p_lj[1], r_range, V_lj.(r_range),
        ylabel="V(r)",
        title="Lennard-Jones Potential",
        linewidth=3, color=:blue,
        legend=:topright,
        ylim=(-2ε_lj, 2ε_lj),
        label="V(r)")

    hline!(p_lj[1], [0], color=:gray, linewidth=1, label="")
    hline!(p_lj[1], [-ε_lj], color=:green, linestyle=:dash, label="V = -ε")
    scatter!(p_lj[1], [r_eq], [V_eq], markersize=12, color=:red,
        label="Minimum: r = $(round(r_eq, digits=3))")

    # Bottom: derivative (force direction)
    plot!(p_lj[2], r_range, -dV_lj.(r_range),
        xlabel="r", ylabel="F(r) = -dV/dr",
        linewidth=3, color=:green,
        legend=:topright,
        label="Force")

    hline!(p_lj[2], [0], color=:gray, linewidth=1, label="")
    scatter!(p_lj[2], [r_eq], [0], markersize=12, color=:red,
        label="F = 0 at equilibrium")

    p_lj
end

# ╔═╡ a1000014-0001-0001-0001-000000000015
md"""
### Optimization Analysis

**Setting V'(r) = 0:**

$4\varepsilon \left[ -\frac{12\sigma^{12}}{r^{13}} + \frac{6\sigma^{6}}{r^{7}} \right] = 0$

$\frac{12\sigma^{12}}{r^{13}} = \frac{6\sigma^{6}}{r^{7}}$

$r^6 = 2\sigma^6 \implies r_{eq} = 2^{1/6}\sigma = $(round(r_eq, digits=4))$

**Minimum energy:** V(r_eq) = -ε = $(-ε_lj)

**Physical meaning:** At r < r_eq, repulsion dominates (F > 0, pushes apart). At r > r_eq, attraction dominates (F < 0, pulls together).
"""

# ╔═╡ a1000014-0001-0001-0001-000000000016
md"""
---
## Chemistry: Maxwell-Boltzmann Most Probable Speed

$f(v) \propto v^2 e^{-mv^2/(2k_BT)}$

What speed maximizes this distribution?
"""

# ╔═╡ a1000014-0001-0001-0001-000000000017
md"""
**Temperature (K):**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000018
@bind T_mb Slider(100:50:500, default=300, show_value=true)

# ╔═╡ a1000014-0001-0001-0001-000000000019
md"""
**Molar mass (g/mol):**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000020
@bind M_mb Slider(2:2:40, default=28, show_value=true)

# ╔═╡ a1000014-0001-0001-0001-000000000021
begin
    # Constants
    R_gas = 8.314  # J/(mol·K)

    # Most probable speed
    v_mp = sqrt(2 * R_gas * T_mb / (M_mb/1000))  # m/s

    # Maxwell-Boltzmann (unnormalized)
    a_mb = M_mb/1000 / (2 * R_gas * T_mb)
    f_mb(v) = v^2 * exp(-a_mb * v^2)

    v_range = range(0, 3*v_mp, length=200)

    p_mb = plot(v_range, f_mb.(v_range),
        xlabel="Speed v (m/s)", ylabel="f(v) (arb. units)",
        title="Maxwell-Boltzmann Distribution (T = $(T_mb) K, M = $(M_mb) g/mol)",
        linewidth=3, color=:orange,
        legend=:topright,
        label="f(v) ∝ v²e^(-av²)",
        size=(650, 400))

    # Mark most probable speed
    vline!(p_mb, [v_mp], color=:red, linestyle=:dash, linewidth=2,
        label="v_mp = $(round(Int, v_mp)) m/s")
    scatter!(p_mb, [v_mp], [f_mb(v_mp)], markersize=10, color=:red, label="")

    p_mb
end

# ╔═╡ a1000014-0001-0001-0001-000000000022
md"""
### Optimization Analysis

**Setting d/dv[v²e^(-av²)] = 0:**

$2ve^{-av^2} + v^2(-2av)e^{-av^2} = 0$
$2ve^{-av^2}(1 - av^2) = 0$

**Solutions:** v = 0 (minimum) or v² = 1/a

$v_{mp} = \sqrt{\frac{1}{a}} = \sqrt{\frac{2RT}{M}} = $(round(Int, v_mp)) \text{ m/s}$

**Physical meaning:** Lighter molecules and higher temperatures → faster most probable speed.
"""

# ╔═╡ a1000014-0001-0001-0001-000000000023
md"""
---
## Closed Interval Method

On a closed interval [a, b], the global extrema are either at:
- Critical points inside (a, b)
- Endpoints a or b

**Always check endpoints!**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000024
md"""
**Interval [a, b]:**
"""

# ╔═╡ a1000014-0001-0001-0001-000000000025
@bind interval_a Slider(-3:0.5:0, default=-2, show_value=true)

# ╔═╡ a1000014-0001-0001-0001-000000000026
@bind interval_b Slider(1:0.5:4, default=3, show_value=true)

# ╔═╡ a1000014-0001-0001-0001-000000000027
begin
    # f(x) = x³ - 3x² on [a, b]
    f_int(x) = x^3 - 3x^2
    df_int(x) = 3x^2 - 6x

    # Critical points
    # 3x² - 6x = 0 → x(x - 2) = 0 → x = 0 or x = 2
    crit_interval = [0.0, 2.0]
    crit_in_interval = [c for c in crit_interval if interval_a < c < interval_b]

    # All candidates
    candidates = vcat([interval_a, interval_b], crit_in_interval)
    candidate_vals = f_int.(candidates)

    global_max_idx = argmax(candidate_vals)
    global_min_idx = argmin(candidate_vals)

    x_int = range(interval_a, interval_b, length=200)

    p_int = plot(x_int, f_int.(x_int),
        xlabel="x", ylabel="f(x)",
        title="f(x) = x³ - 3x² on [$(interval_a), $(interval_b)]",
        linewidth=3, color=:blue,
        legend=:topright,
        label="f(x)",
        size=(650, 450))

    # Mark all candidates
    for (i, c) in enumerate(candidates)
        if i == global_max_idx
            scatter!(p_int, [c], [f_int(c)], markersize=12, color=:green,
                label="Global max: ($(round(c, digits=1)), $(round(f_int(c), digits=2)))")
        elseif i == global_min_idx
            scatter!(p_int, [c], [f_int(c)], markersize=12, color=:red,
                label="Global min: ($(round(c, digits=1)), $(round(f_int(c), digits=2)))")
        else
            scatter!(p_int, [c], [f_int(c)], markersize=8, color=:orange,
                label="Candidate: ($(round(c, digits=1)), $(round(f_int(c), digits=2)))")
        end
    end

    p_int
end

# ╔═╡ a1000014-0001-0001-0001-000000000028
begin
    table_rows = []
    for (i, c) in enumerate(candidates)
        ctype = (c == interval_a || c == interval_b) ? "Endpoint" : "Critical"
        push!(table_rows, "| $(round(c, digits=2)) | $ctype | $(round(f_int(c), digits=3)) |")
    end

    Markdown.parse("""
    ### Candidate Table

    | Point | Type | f(x) |
    |:------|:-----|:-----|
    $(join(table_rows, "\n"))

    **Global maximum:** f = $(round(maximum(candidate_vals), digits=3)) at x = $(round(candidates[global_max_idx], digits=2))

    **Global minimum:** f = $(round(minimum(candidate_vals), digits=3)) at x = $(round(candidates[global_min_idx], digits=2))
    """)
end

# ╔═╡ a1000014-0001-0001-0001-000000000029
md"""
---
## Summary: Finding Extrema

**Step 1:** Find critical points (f'(x) = 0 or undefined)

**Step 2:** Classify each critical point:
- Second derivative test: f'' > 0 → min, f'' < 0 → max
- First derivative test: check sign change of f'

**Step 3:** Check boundaries (endpoints, limits at ±∞)

**Step 4:** Compare all values to find global extrema
"""

# ╔═╡ a1000014-0001-0001-0001-000000000030
md"""
---
## Exercises

1. Find all extrema of f(x) = x⁴ - 8x² + 3.

2. For the Lennard-Jones potential, at what r does V(r) = 0?

3. At what temperature does the Maxwell-Boltzmann most probable speed equal 500 m/s for N₂ (M = 28)?

4. Find the global max and min of f(x) = xe^(-x) on [0, 3].
"""

# ╔═╡ a1000014-0001-0001-0001-000000000031
md"""
---
## Next: Lecture 15

**Partial Derivatives**

What if V depends on x, y, z? How do we find minima on potential energy surfaces?
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"
PlutoUI = "7f904dfe-b85e-4ff6-b463-dae2292396a8"

[compat]
Plots = "~1.39.0"
PlutoUI = "~0.7.54"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised
"""

# ╔═╡ Cell order:
# ╠═a1000014-0001-0001-0001-000000000001
# ╟─a1000014-0001-0001-0001-000000000002
# ╟─a1000014-0001-0001-0001-000000000003
# ╟─a1000014-0001-0001-0001-000000000004
# ╟─a1000014-0001-0001-0001-000000000005
# ╟─a1000014-0001-0001-0001-000000000006
# ╟─a1000014-0001-0001-0001-000000000007
# ╟─a1000014-0001-0001-0001-000000000008
# ╟─a1000014-0001-0001-0001-000000000009
# ╟─a1000014-0001-0001-0001-000000000010
# ╟─a1000014-0001-0001-0001-000000000011
# ╟─a1000014-0001-0001-0001-000000000012
# ╟─a1000014-0001-0001-0001-000000000013
# ╟─a1000014-0001-0001-0001-000000000014
# ╟─a1000014-0001-0001-0001-000000000015
# ╟─a1000014-0001-0001-0001-000000000016
# ╟─a1000014-0001-0001-0001-000000000017
# ╟─a1000014-0001-0001-0001-000000000018
# ╟─a1000014-0001-0001-0001-000000000019
# ╟─a1000014-0001-0001-0001-000000000020
# ╟─a1000014-0001-0001-0001-000000000021
# ╟─a1000014-0001-0001-0001-000000000022
# ╟─a1000014-0001-0001-0001-000000000023
# ╟─a1000014-0001-0001-0001-000000000024
# ╟─a1000014-0001-0001-0001-000000000025
# ╟─a1000014-0001-0001-0001-000000000026
# ╟─a1000014-0001-0001-0001-000000000027
# ╟─a1000014-0001-0001-0001-000000000028
# ╟─a1000014-0001-0001-0001-000000000029
# ╟─a1000014-0001-0001-0001-000000000030
# ╟─a1000014-0001-0001-0001-000000000031
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
