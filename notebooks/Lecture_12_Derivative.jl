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

# ╔═╡ a1000012-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000012-0001-0001-0001-000000000002
md"""
# Lecture 12: Instantaneous Rate

*The derivative — capturing "how fast, right now?"*

---

## The Real Question

Your advisor asks: "What's the reaction rate at t = 25 seconds?"

You have measurements at t = 20 and t = 30, but not at t = 25. And even if you did — the rate is *changing*.

**How do you answer?**

This is not a calculus exercise. This is your actual problem in the lab.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000003
md"""
---
## From Average to Instantaneous

The **average rate** over an interval is easy: Δf/Δx.

But we want the rate **at an instant**.

Strategy: Make the interval smaller and smaller. The limit is the **derivative**.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000004
md"""
---
## Secant Line → Tangent Line

Watch the secant line become the tangent line as h → 0.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000005
md"""
**Choose function:**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000006
@bind deriv_func Select([
    "x^2" => "f(x) = x²",
    "x^3" => "f(x) = x³",
    "sin" => "f(x) = sin(x)",
    "exp" => "f(x) = eˣ",
    "sqrt" => "f(x) = √x"
])

# ╔═╡ a1000012-0001-0001-0001-000000000007
md"""
**Point a:**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000008
@bind a_val Slider(-2:0.25:2, default=1, show_value=true)

# ╔═╡ a1000012-0001-0001-0001-000000000009
md"""
**h (interval size) — watch what happens as h → 0:**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000010
@bind h_val Slider([2.0, 1.5, 1.0, 0.75, 0.5, 0.25, 0.1, 0.05, 0.01], default=1.0, show_value=true)

# ╔═╡ a1000012-0001-0001-0001-000000000011
begin
    # Define functions and their derivatives
    if deriv_func == "x^2"
        f(x) = x^2
        f_prime(x) = 2x
        f_name = "x²"
        x_range = range(-3, 3, length=200)
        y_lim = (-1, 10)
    elseif deriv_func == "x^3"
        f(x) = x^3
        f_prime(x) = 3x^2
        f_name = "x³"
        x_range = range(-2, 2, length=200)
        y_lim = (-8, 8)
    elseif deriv_func == "sin"
        f(x) = sin(x)
        f_prime(x) = cos(x)
        f_name = "sin(x)"
        x_range = range(-π, π, length=200)
        y_lim = (-2, 2)
    elseif deriv_func == "exp"
        f(x) = exp(x)
        f_prime(x) = exp(x)
        f_name = "eˣ"
        x_range = range(-2, 2, length=200)
        y_lim = (-1, 8)
    else
        f(x) = sqrt(max(x, 0.01))
        f_prime(x) = 1/(2*sqrt(max(x, 0.01)))
        f_name = "√x"
        x_range = range(0.01, 4, length=200)
        y_lim = (-0.5, 3)
    end

    # Compute secant slope
    a = a_val
    h = h_val
    secant_slope = (f(a + h) - f(a)) / h
    true_slope = f_prime(a)

    # Plot
    p_secant = plot(x_range, f.(x_range),
        xlabel="x", ylabel="f(x)",
        title="f(x) = $(f_name) — Secant → Tangent at x = $a",
        linewidth=3, color=:blue,
        legend=:topleft,
        label="f(x)",
        ylim=y_lim,
        size=(700, 500)
    )

    # Point at a
    scatter!(p_secant, [a], [f(a)], markersize=10, color=:red, label="(a, f(a))")

    # Point at a + h
    scatter!(p_secant, [a + h], [f(a + h)], markersize=8, color=:orange,
        label="(a+h, f(a+h))")

    # Secant line
    secant_x = range(a - 1, a + h + 1, length=50)
    secant_y = f(a) .+ secant_slope .* (secant_x .- a)
    plot!(p_secant, secant_x, secant_y,
        linewidth=2, color=:orange, linestyle=:dash,
        label="Secant: slope = $(round(secant_slope, digits=4))")

    # True tangent line
    tangent_x = range(a - 1.5, a + 1.5, length=50)
    tangent_y = f(a) .+ true_slope .* (tangent_x .- a)
    plot!(p_secant, tangent_x, tangent_y,
        linewidth=2, color=:green,
        label="Tangent: slope = $(round(true_slope, digits=4))")

    p_secant
end

# ╔═╡ a1000012-0001-0001-0001-000000000012
md"""
### Convergence Table

As h → 0, the secant slope approaches the derivative:

| h | Secant slope | True derivative | Error |
|:--|:-------------|:----------------|:------|
| $(h_val) | $(round(secant_slope, digits=6)) | $(round(true_slope, digits=6)) | $(round(abs(secant_slope - true_slope), digits=6)) |

$f'($(a_val)) = \lim_{h \to 0} \frac{f($(a_val) + h) - f($(a_val))}{h} = $(round(true_slope, digits=4))$
"""

# ╔═╡ a1000012-0001-0001-0001-000000000013
md"""
---
## The Derivative as Slope

Move along the curve and watch the slope (derivative) change.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000014
@bind x_explore Slider(-2:0.1:2, default=0, show_value=true)

# ╔═╡ a1000012-0001-0001-0001-000000000015
begin
    # Use x² for exploration
    g(x) = x^2
    g_prime(x) = 2x

    x_exp = range(-2.5, 2.5, length=200)

    p_explore = plot(layout=(1,2), size=(900, 400))

    # Left plot: function with tangent
    plot!(p_explore[1], x_exp, g.(x_exp),
        xlabel="x", ylabel="f(x)",
        title="f(x) = x² with tangent at x = $(x_explore)",
        linewidth=3, color=:blue,
        legend=:topleft,
        label="f(x)")

    # Tangent line
    slope_exp = g_prime(x_explore)
    tan_x = range(x_explore - 1, x_explore + 1, length=50)
    tan_y = g(x_explore) .+ slope_exp .* (tan_x .- x_explore)
    plot!(p_explore[1], tan_x, tan_y,
        linewidth=2, color=:red,
        label="Tangent (slope = $(round(slope_exp, digits=2)))")

    scatter!(p_explore[1], [x_explore], [g(x_explore)],
        markersize=10, color=:red, label="")

    # Right plot: derivative function
    plot!(p_explore[2], x_exp, g_prime.(x_exp),
        xlabel="x", ylabel="f'(x)",
        title="f'(x) = 2x (the derivative)",
        linewidth=3, color=:green,
        legend=:topleft,
        label="f'(x)")

    scatter!(p_explore[2], [x_explore], [g_prime(x_explore)],
        markersize=10, color=:red, label="f'($(x_explore)) = $(round(slope_exp, digits=2))")

    hline!(p_explore[2], [0], color=:gray, linewidth=1, label="")

    p_explore
end

# ╔═╡ a1000012-0001-0001-0001-000000000016
md"""
**Observations:**
- When x < 0: f'(x) < 0 → function is **decreasing**
- When x = 0: f'(x) = 0 → **horizontal tangent** (minimum!)
- When x > 0: f'(x) > 0 → function is **increasing**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000017
md"""
---
## Chemistry: Reaction Rate from Concentration

Real kinetics data: find the instantaneous rate.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000018
md"""
**Rate constant k (s⁻¹):**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000019
@bind k_rate Slider(0.05:0.05:0.5, default=0.1, show_value=true)

# ╔═╡ a1000012-0001-0001-0001-000000000020
md"""
**Time to evaluate rate (s):**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000021
@bind t_eval Slider(0:1:50, default=10, show_value=true)

# ╔═╡ a1000012-0001-0001-0001-000000000022
begin
    # First-order decay
    A0 = 1.0  # Initial concentration (M)
    A(t) = A0 * exp(-k_rate * t)
    dAdt(t) = -k_rate * A0 * exp(-k_rate * t)

    t_range = range(0, 50, length=200)

    p_kinetics = plot(layout=(1,2), size=(900, 400))

    # Left: concentration
    plot!(p_kinetics[1], t_range, A.(t_range),
        xlabel="Time (s)", ylabel="[A] (M)",
        title="First-order decay: [A] = [A]₀e^(-kt)",
        linewidth=3, color=:blue,
        legend=:topright,
        label="[A](t)")

    # Tangent at t_eval
    rate_at_t = dAdt(t_eval)
    tan_t = range(max(0, t_eval-10), t_eval+10, length=50)
    tan_A = A(t_eval) .+ rate_at_t .* (tan_t .- t_eval)
    plot!(p_kinetics[1], tan_t, tan_A,
        linewidth=2, color=:red, linestyle=:dash,
        label="Tangent at t=$t_eval")

    scatter!(p_kinetics[1], [t_eval], [A(t_eval)],
        markersize=10, color=:red, label="")

    # Right: rate
    plot!(p_kinetics[2], t_range, -dAdt.(t_range),
        xlabel="Time (s)", ylabel="Rate (M/s)",
        title="Reaction rate = -d[A]/dt",
        linewidth=3, color=:green,
        legend=:topright,
        label="Rate(t)")

    scatter!(p_kinetics[2], [t_eval], [-dAdt(t_eval)],
        markersize=10, color=:red,
        label="Rate at t=$t_eval: $(round(-dAdt(t_eval), digits=4)) M/s")

    p_kinetics
end

# ╔═╡ a1000012-0001-0001-0001-000000000023
md"""
### Rate Analysis

At t = $(t_eval) s:
- **[A]** = $(round(A(t_eval), digits=4)) M
- **Rate** = -d[A]/dt = $(round(-dAdt(t_eval), digits=4)) M/s
- **Verification:** Rate = k[A] = $(k_rate) × $(round(A(t_eval), digits=4)) = $(round(k_rate * A(t_eval), digits=4)) M/s ✓

This is what "first-order kinetics" means: **Rate = k[A]**

The rate is the derivative!
"""

# ╔═╡ a1000012-0001-0001-0001-000000000024
md"""
---
## Chemistry: Force from Potential

Force is the **negative derivative** of potential energy.

$F = -\frac{dV}{dx}$
"""

# ╔═╡ a1000012-0001-0001-0001-000000000025
md"""
**Choose potential:**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000026
@bind potential_type Select([
    "harmonic" => "Harmonic: V = ½kx²",
    "quartic" => "Double-well: V = x⁴ - 2x²",
    "morse" => "Morse-like: V = (1-e^(-x))²"
])

# ╔═╡ a1000012-0001-0001-0001-000000000027
md"""
**Position x:**
"""

# ╔═╡ a1000012-0001-0001-0001-000000000028
@bind x_force Slider(-2:0.1:2, default=0.5, show_value=true)

# ╔═╡ a1000012-0001-0001-0001-000000000029
begin
    if potential_type == "harmonic"
        V(x) = 0.5 * x^2
        Force(x) = -x
        V_name = "½x²"
        x_V = range(-2, 2, length=200)
        V_ylim = (-0.5, 2.5)
    elseif potential_type == "quartic"
        V(x) = x^4 - 2*x^2
        Force(x) = -(4*x^3 - 4*x)
        V_name = "x⁴ - 2x²"
        x_V = range(-1.8, 1.8, length=200)
        V_ylim = (-1.5, 2)
    else
        V(x) = (1 - exp(-x))^2
        Force(x) = -2*(1 - exp(-x))*exp(-x)
        V_name = "(1-e^(-x))²"
        x_V = range(-1, 3, length=200)
        V_ylim = (-0.2, 1.5)
    end

    p_force = plot(layout=(1,2), size=(900, 400))

    # Left: potential with tangent
    plot!(p_force[1], x_V, V.(x_V),
        xlabel="x", ylabel="V(x)",
        title="Potential: V(x) = $(V_name)",
        linewidth=3, color=:purple,
        legend=:topleft,
        ylim=V_ylim,
        label="V(x)")

    scatter!(p_force[1], [x_force], [V(x_force)],
        markersize=10, color=:red, label="")

    # Right: Force
    plot!(p_force[2], x_V, Force.(x_V),
        xlabel="x", ylabel="F(x)",
        title="Force: F = -dV/dx",
        linewidth=3, color=:green,
        legend=:topright,
        label="F(x)")

    hline!(p_force[2], [0], color=:gray, linewidth=1, label="")

    scatter!(p_force[2], [x_force], [Force(x_force)],
        markersize=10, color=:red,
        label="F($(x_force)) = $(round(Force(x_force), digits=3))")

    p_force
end

# ╔═╡ a1000012-0001-0001-0001-000000000030
md"""
### Force Analysis at x = $(x_force)

- **V(x)** = $(round(V(x_force), digits=4))
- **F(x)** = -dV/dx = $(round(Force(x_force), digits=4))

**Interpretation:**
$(Force(x_force) > 0.01 ? "F > 0: Force pushes **right** (toward lower V)" : Force(x_force) < -0.01 ? "F < 0: Force pushes **left** (toward lower V)" : "F ≈ 0: **Equilibrium point**")

$(potential_type == "quartic" ? "This potential has **two stable minima** (x ≈ ±1) and one **unstable maximum** (x = 0)." : "")
"""

# ╔═╡ a1000012-0001-0001-0001-000000000031
md"""
---
## When the Derivative Doesn't Exist

Not all functions have derivatives everywhere.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000032
begin
    # |x| function
    abs_x = range(-2, 2, length=400)
    abs_y = abs.(abs_x)

    p_nodiff = plot(abs_x, abs_y,
        xlabel="x", ylabel="f(x)",
        title="f(x) = |x| — Not differentiable at x = 0",
        linewidth=3, color=:blue,
        legend=:topleft,
        label="f(x) = |x|",
        size=(600, 400)
    )

    # Left tangent (slope = -1)
    plot!(p_nodiff, [-1.5, 0], [1.5, 0],
        linewidth=2, color=:red, linestyle=:dash,
        label="Left slope = -1")

    # Right tangent (slope = +1)
    plot!(p_nodiff, [0, 1.5], [0, 1.5],
        linewidth=2, color=:green, linestyle=:dash,
        label="Right slope = +1")

    scatter!(p_nodiff, [0], [0], markersize=10, color=:orange,
        label="Corner (no derivative)")

    p_nodiff
end

# ╔═╡ a1000012-0001-0001-0001-000000000033
md"""
At x = 0:
- **Left derivative:** $\lim_{h \to 0^-} \frac{|h| - 0}{h} = \frac{-h}{h} = -1$
- **Right derivative:** $\lim_{h \to 0^+} \frac{|h| - 0}{h} = \frac{h}{h} = +1$

**Left ≠ Right → Derivative does not exist at x = 0**

This is a **corner** or **kink**.
"""

# ╔═╡ a1000012-0001-0001-0001-000000000034
md"""
---
## Basic Derivatives Table

| f(x) | f'(x) |
|:-----|:------|
| c (constant) | 0 |
| x | 1 |
| xⁿ | nxⁿ⁻¹ |
| eˣ | eˣ |
| ln x | 1/x |
| sin x | cos x |
| cos x | -sin x |

*Next lecture: rules for combining these!*
"""

# ╔═╡ a1000012-0001-0001-0001-000000000035
md"""
---
## Summary: When to Use Derivatives

| Question | Use derivative |
|:---------|:---------------|
| How fast is it changing? | Compute f'(x) |
| Where are max/min? | Solve f'(x) = 0 |
| Is it increasing or decreasing? | Check sign of f' |
| What force from this potential? | F = -dV/dx |
| What's the reaction rate? | Rate = \|d[A]/dt\| |
"""

# ╔═╡ a1000012-0001-0001-0001-000000000036
md"""
---
## Exercises

1. Use the definition to find the derivative of f(x) = 3x².

2. For [A](t) = 2e^(-0.05t), what is the rate at t = 20 s?

3. For V(x) = x³ - 3x, find F(x) and locate the equilibrium points.

4. Is f(x) = x^(1/3) differentiable at x = 0?
"""

# ╔═╡ a1000012-0001-0001-0001-000000000037
md"""
---
## Next: Lecture 13

**Rules of Change**

The power rule, product rule, chain rule — computing derivatives efficiently.
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
# ╠═a1000012-0001-0001-0001-000000000001
# ╟─a1000012-0001-0001-0001-000000000002
# ╟─a1000012-0001-0001-0001-000000000003
# ╟─a1000012-0001-0001-0001-000000000004
# ╟─a1000012-0001-0001-0001-000000000005
# ╟─a1000012-0001-0001-0001-000000000006
# ╟─a1000012-0001-0001-0001-000000000007
# ╟─a1000012-0001-0001-0001-000000000008
# ╟─a1000012-0001-0001-0001-000000000009
# ╟─a1000012-0001-0001-0001-000000000010
# ╟─a1000012-0001-0001-0001-000000000011
# ╟─a1000012-0001-0001-0001-000000000012
# ╟─a1000012-0001-0001-0001-000000000013
# ╟─a1000012-0001-0001-0001-000000000014
# ╟─a1000012-0001-0001-0001-000000000015
# ╟─a1000012-0001-0001-0001-000000000016
# ╟─a1000012-0001-0001-0001-000000000017
# ╟─a1000012-0001-0001-0001-000000000018
# ╟─a1000012-0001-0001-0001-000000000019
# ╟─a1000012-0001-0001-0001-000000000020
# ╟─a1000012-0001-0001-0001-000000000021
# ╟─a1000012-0001-0001-0001-000000000022
# ╟─a1000012-0001-0001-0001-000000000023
# ╟─a1000012-0001-0001-0001-000000000024
# ╟─a1000012-0001-0001-0001-000000000025
# ╟─a1000012-0001-0001-0001-000000000026
# ╟─a1000012-0001-0001-0001-000000000027
# ╟─a1000012-0001-0001-0001-000000000028
# ╟─a1000012-0001-0001-0001-000000000029
# ╟─a1000012-0001-0001-0001-000000000030
# ╟─a1000012-0001-0001-0001-000000000031
# ╟─a1000012-0001-0001-0001-000000000032
# ╟─a1000012-0001-0001-0001-000000000033
# ╟─a1000012-0001-0001-0001-000000000034
# ╟─a1000012-0001-0001-0001-000000000035
# ╟─a1000012-0001-0001-0001-000000000036
# ╟─a1000012-0001-0001-0001-000000000037
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
