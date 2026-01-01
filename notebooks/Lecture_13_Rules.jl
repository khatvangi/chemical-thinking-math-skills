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

# ╔═╡ a1000013-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000013-0001-0001-0001-000000000002
md"""
# Lecture 13: Rules of Change

*Differentiation rules — building complex derivatives from simple pieces*

---

## The Computational Problem

You can find derivatives from the definition (limits), but that's tedious.

For $f(x) = x^2 e^{-x/10}$, the limit calculation is brutal.

**Better approach:** Learn rules to decompose complex functions into simple pieces.
"""

# ╔═╡ a1000013-0001-0001-0001-000000000003
md"""
---
## The Power Rule

For $f(x) = x^n$:

$$\frac{d}{dx}x^n = nx^{n-1}$$

This is the most-used rule in chemistry.
"""

# ╔═╡ a1000013-0001-0001-0001-000000000004
md"""
**Exponent n:**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000005
@bind n_power Slider(-2:0.5:4, default=2, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000006
md"""
**Point x to evaluate:**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000007
@bind x_power Slider(0.5:0.1:3, default=1.5, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000008
begin
    # Power rule visualization
    f_power(x) = x^n_power
    df_power(x) = n_power * x^(n_power - 1)

    x_range_p = range(0.1, 3.5, length=200)

    p_power = plot(layout=(1,2), size=(900, 400))

    # Left: function
    plot!(p_power[1], x_range_p, f_power.(x_range_p),
        xlabel="x", ylabel="f(x)",
        title="f(x) = x^$(n_power)",
        linewidth=3, color=:blue,
        legend=:topleft,
        label="f(x)")

    # Tangent at x_power
    slope = df_power(x_power)
    tan_x = range(x_power - 0.8, x_power + 0.8, length=50)
    tan_y = f_power(x_power) .+ slope .* (tan_x .- x_power)
    plot!(p_power[1], tan_x, tan_y,
        linewidth=2, color=:red, linestyle=:dash,
        label="Tangent (slope=$(round(slope, digits=3)))")

    scatter!(p_power[1], [x_power], [f_power(x_power)],
        markersize=10, color=:red, label="")

    # Right: derivative
    plot!(p_power[2], x_range_p, df_power.(x_range_p),
        xlabel="x", ylabel="f'(x)",
        title="f'(x) = $(n_power)x^$(n_power-1)",
        linewidth=3, color=:green,
        legend=:topright,
        label="f'(x)")

    scatter!(p_power[2], [x_power], [df_power(x_power)],
        markersize=10, color=:red,
        label="f'($(x_power)) = $(round(df_power(x_power), digits=3))")

    hline!(p_power[2], [0], color=:gray, linewidth=1, label="")

    p_power
end

# ╔═╡ a1000013-0001-0001-0001-000000000009
md"""
### Power Rule Table

| f(x) | f'(x) | Example |
|:-----|:------|:--------|
| $x^2$ | $2x$ | Area of square |
| $x^3$ | $3x^2$ | Volume of cube |
| $x^{-1} = 1/x$ | $-x^{-2}$ | Inverse relationship |
| $x^{1/2} = \sqrt{x}$ | $\frac{1}{2}x^{-1/2}$ | Root extraction |
| $x^n$ | $nx^{n-1}$ | **General rule** |

**Special case:** $\frac{d}{dx}(x) = 1$ (slope of a line)
"""

# ╔═╡ a1000013-0001-0001-0001-000000000010
md"""
---
## Linearity Rules

Derivatives respect addition and scalar multiplication:

$$\frac{d}{dx}[cf(x)] = c \cdot f'(x)$$

$$\frac{d}{dx}[f(x) + g(x)] = f'(x) + g'(x)$$
"""

# ╔═╡ a1000013-0001-0001-0001-000000000011
md"""
**Constant c:**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000012
@bind c_lin Slider(0.5:0.5:4, default=2, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000013
begin
    x_lin = range(-2, 2, length=200)

    f_orig(x) = x^2
    f_scaled(x) = c_lin * x^2

    df_orig(x) = 2x
    df_scaled(x) = c_lin * 2x

    p_lin = plot(layout=(1,2), size=(900, 400))

    # Functions
    plot!(p_lin[1], x_lin, f_orig.(x_lin),
        xlabel="x", ylabel="y",
        title="Scaling: f(x) = x² vs $(c_lin)x²",
        linewidth=3, color=:blue,
        legend=:top,
        label="f(x) = x²")

    plot!(p_lin[1], x_lin, f_scaled.(x_lin),
        linewidth=3, color=:red,
        label="g(x) = $(c_lin)x²")

    # Derivatives
    plot!(p_lin[2], x_lin, df_orig.(x_lin),
        xlabel="x", ylabel="y'",
        title="Derivatives: 2x vs $(c_lin)·2x",
        linewidth=3, color=:blue,
        legend=:topleft,
        label="f'(x) = 2x")

    plot!(p_lin[2], x_lin, df_scaled.(x_lin),
        linewidth=3, color=:red,
        label="g'(x) = $(c_lin)·2x = $(2*c_lin)x")

    hline!(p_lin[2], [0], color=:gray, linewidth=1, label="")

    p_lin
end

# ╔═╡ a1000013-0001-0001-0001-000000000014
md"""
### Example: Polynomial

For $p(x) = 3x^4 - 2x^2 + 5x - 7$:

$p'(x) = 3(4x^3) - 2(2x) + 5(1) - 0 = 12x^3 - 4x + 5$

**Each term differentiates independently.**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000015
md"""
---
## The Product Rule

For $f(x) = u(x) \cdot v(x)$:

$$\frac{d}{dx}[u \cdot v] = u' \cdot v + u \cdot v'$$

**Mnemonic:** "First times derivative of second, plus second times derivative of first"
"""

# ╔═╡ a1000013-0001-0001-0001-000000000016
md"""
**Point x:**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000017
@bind x_prod Slider(-1.5:0.1:2.5, default=1, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000018
begin
    # Product: x² · e^x
    u(x) = x^2
    v(x) = exp(x)
    du(x) = 2x
    dv(x) = exp(x)

    prod_f(x) = u(x) * v(x)
    prod_df(x) = du(x) * v(x) + u(x) * dv(x)  # Product rule

    x_prod_range = range(-2, 2.5, length=200)

    p_prod = plot(layout=(1,2), size=(900, 400))

    # Product function
    plot!(p_prod[1], x_prod_range, prod_f.(x_prod_range),
        xlabel="x", ylabel="f(x)",
        title="f(x) = x²eˣ",
        linewidth=3, color=:blue,
        legend=:topleft,
        ylim=(-5, 50),
        label="f(x) = x²eˣ")

    # Tangent
    slope_prod = prod_df(x_prod)
    tan_prod_x = range(x_prod - 0.5, x_prod + 0.5, length=50)
    tan_prod_y = prod_f(x_prod) .+ slope_prod .* (tan_prod_x .- x_prod)
    plot!(p_prod[1], tan_prod_x, tan_prod_y,
        linewidth=2, color=:red, linestyle=:dash,
        label="Tangent")

    scatter!(p_prod[1], [x_prod], [prod_f(x_prod)],
        markersize=10, color=:red, label="")

    # Derivative breakdown
    plot!(p_prod[2], x_prod_range, prod_df.(x_prod_range),
        xlabel="x", ylabel="f'(x)",
        title="f'(x) = 2xeˣ + x²eˣ = (2x + x²)eˣ",
        linewidth=3, color=:green,
        legend=:topleft,
        ylim=(-5, 80),
        label="f'(x)")

    scatter!(p_prod[2], [x_prod], [prod_df(x_prod)],
        markersize=10, color=:red,
        label="f'($(x_prod)) = $(round(prod_df(x_prod), digits=2))")

    hline!(p_prod[2], [0], color=:gray, linewidth=1, label="")

    p_prod
end

# ╔═╡ a1000013-0001-0001-0001-000000000019
md"""
### Product Rule Breakdown at x = $(x_prod)

| Component | Value |
|:----------|:------|
| u = x² | $(round(u(x_prod), digits=3)) |
| v = eˣ | $(round(v(x_prod), digits=3)) |
| u' = 2x | $(round(du(x_prod), digits=3)) |
| v' = eˣ | $(round(dv(x_prod), digits=3)) |
| **u'v + uv'** | $(round(du(x_prod)*v(x_prod), digits=3)) + $(round(u(x_prod)*dv(x_prod), digits=3)) = $(round(prod_df(x_prod), digits=3)) |
"""

# ╔═╡ a1000013-0001-0001-0001-000000000020
md"""
---
## The Quotient Rule

For $f(x) = \frac{u(x)}{v(x)}$:

$$\frac{d}{dx}\left[\frac{u}{v}\right] = \frac{u'v - uv'}{v^2}$$

**Mnemonic:** "Low d-high minus high d-low, over low-low" (lo·dhi - hi·dlo)/lo²
"""

# ╔═╡ a1000013-0001-0001-0001-000000000021
md"""
### Example: Rational Function

For $f(x) = \frac{x}{1+x^2}$:

- $u = x$, $u' = 1$
- $v = 1 + x^2$, $v' = 2x$

$$f'(x) = \frac{(1)(1+x^2) - (x)(2x)}{(1+x^2)^2} = \frac{1 - x^2}{(1+x^2)^2}$$
"""

# ╔═╡ a1000013-0001-0001-0001-000000000022
begin
    quot_f(x) = x / (1 + x^2)
    quot_df(x) = (1 - x^2) / (1 + x^2)^2

    x_quot = range(-4, 4, length=200)

    p_quot = plot(layout=(1,2), size=(900, 400))

    plot!(p_quot[1], x_quot, quot_f.(x_quot),
        xlabel="x", ylabel="f(x)",
        title="f(x) = x/(1+x²)",
        linewidth=3, color=:blue,
        legend=:topleft,
        label="f(x)")

    hline!(p_quot[1], [0], color=:gray, linewidth=1, label="")

    plot!(p_quot[2], x_quot, quot_df.(x_quot),
        xlabel="x", ylabel="f'(x)",
        title="f'(x) = (1-x²)/(1+x²)²",
        linewidth=3, color=:green,
        legend=:topright,
        label="f'(x)")

    hline!(p_quot[2], [0], color=:gray, linewidth=1, label="")

    # Mark critical points
    scatter!(p_quot[1], [-1, 1], [quot_f(-1), quot_f(1)],
        markersize=10, color=:red, label="Max/Min")

    scatter!(p_quot[2], [-1, 1], [0, 0],
        markersize=10, color=:red, label="f'=0 (critical pts)")

    p_quot
end

# ╔═╡ a1000013-0001-0001-0001-000000000023
md"""
**Critical points** where f'(x) = 0:
- x = -1: local minimum at f(-1) = -0.5
- x = +1: local maximum at f(+1) = +0.5
"""

# ╔═╡ a1000013-0001-0001-0001-000000000024
md"""
---
## The Chain Rule

For composed functions $f(x) = g(h(x))$:

$$\frac{df}{dx} = \frac{dg}{dh} \cdot \frac{dh}{dx}$$

Or in prime notation: $[g(h(x))]' = g'(h(x)) \cdot h'(x)$

**The most powerful rule in calculus.**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000025
md"""
**Inner function coefficient a:**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000026
@bind a_chain Slider(0.5:0.5:3, default=1, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000027
md"""
**Point x:**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000028
@bind x_chain Slider(-1.5:0.1:1.5, default=0.5, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000029
begin
    # f(x) = e^(ax²)
    # outer g(u) = e^u, g'(u) = e^u
    # inner h(x) = ax², h'(x) = 2ax
    # f'(x) = e^(ax²) · 2ax

    chain_f(x) = exp(a_chain * x^2)
    chain_df(x) = exp(a_chain * x^2) * 2 * a_chain * x

    x_chain_range = range(-2, 2, length=200)

    p_chain = plot(layout=(1,2), size=(900, 400))

    # Function
    plot!(p_chain[1], x_chain_range, chain_f.(x_chain_range),
        xlabel="x", ylabel="f(x)",
        title="f(x) = e^($(a_chain)x²)",
        linewidth=3, color=:blue,
        legend=:top,
        ylim=(0, 20),
        label="f(x)")

    # Tangent
    slope_chain = chain_df(x_chain)
    tan_chain_x = range(x_chain - 0.3, x_chain + 0.3, length=50)
    tan_chain_y = chain_f(x_chain) .+ slope_chain .* (tan_chain_x .- x_chain)
    plot!(p_chain[1], tan_chain_x, tan_chain_y,
        linewidth=2, color=:red, linestyle=:dash,
        label="Tangent")

    scatter!(p_chain[1], [x_chain], [chain_f(x_chain)],
        markersize=10, color=:red, label="")

    # Derivative
    plot!(p_chain[2], x_chain_range, chain_df.(x_chain_range),
        xlabel="x", ylabel="f'(x)",
        title="f'(x) = $(2*a_chain)x·e^($(a_chain)x²)",
        linewidth=3, color=:green,
        legend=:topleft,
        label="f'(x)")

    hline!(p_chain[2], [0], color=:gray, linewidth=1, label="")

    scatter!(p_chain[2], [x_chain], [chain_df(x_chain)],
        markersize=10, color=:red,
        label="f'($(x_chain)) = $(round(chain_df(x_chain), digits=3))")

    p_chain
end

# ╔═╡ a1000013-0001-0001-0001-000000000030
md"""
### Chain Rule Breakdown

For $f(x) = e^{$(a_chain)x^2}$:

| Step | Expression |
|:-----|:-----------|
| Outer: g(u) = eᵘ | g'(u) = eᵘ |
| Inner: h(x) = $(a_chain)x² | h'(x) = $(2*a_chain)x |
| Chain rule | f'(x) = g'(h(x)) · h'(x) = e^{$(a_chain)x²} · $(2*a_chain)x |

At x = $(x_chain): f'($(x_chain)) = $(round(chain_df(x_chain), digits=4))
"""

# ╔═╡ a1000013-0001-0001-0001-000000000031
md"""
---
## Chemistry: Arrhenius Equation

Rate constant depends on temperature:

$$k(T) = A e^{-E_a/RT}$$

How does k change with T?
"""

# ╔═╡ a1000013-0001-0001-0001-000000000032
md"""
**Activation energy Eₐ (kJ/mol):**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000033
@bind Ea_val Slider(20:10:100, default=50, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000034
md"""
**Temperature T (K):**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000035
@bind T_val Slider(250:10:500, default=300, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000036
begin
    R = 8.314e-3  # kJ/(mol·K)
    A_arr = 1e13  # Pre-exponential factor (s⁻¹)

    k_arr(T) = A_arr * exp(-Ea_val / (R * T))

    # dk/dT using chain rule
    # k = A·exp(-Ea/(RT))
    # Let u = -Ea/(RT) = -Ea·T⁻¹/R
    # du/dT = Ea/(RT²)
    # dk/dT = A·exp(u)·du/dT = k·Ea/(RT²)
    dk_arr(T) = k_arr(T) * Ea_val / (R * T^2)

    T_range = range(250, 500, length=200)

    p_arr = plot(layout=(1,2), size=(900, 400))

    # Rate constant
    plot!(p_arr[1], T_range, k_arr.(T_range),
        xlabel="Temperature (K)", ylabel="k (s⁻¹)",
        title="Arrhenius: k = Ae^(-Eₐ/RT), Eₐ=$(Ea_val) kJ/mol",
        linewidth=3, color=:blue,
        legend=:topleft,
        yscale=:log10,
        label="k(T)")

    scatter!(p_arr[1], [T_val], [k_arr(T_val)],
        markersize=10, color=:red, label="T=$(T_val)K")

    # Sensitivity
    plot!(p_arr[2], T_range, dk_arr.(T_range),
        xlabel="Temperature (K)", ylabel="dk/dT (s⁻¹/K)",
        title="Temperature Sensitivity: dk/dT",
        linewidth=3, color=:green,
        legend=:topleft,
        yscale=:log10,
        label="dk/dT")

    scatter!(p_arr[2], [T_val], [dk_arr(T_val)],
        markersize=10, color=:red, label="")

    p_arr
end

# ╔═╡ a1000013-0001-0001-0001-000000000037
md"""
### Temperature Sensitivity

At T = $(T_val) K with Eₐ = $(Ea_val) kJ/mol:

- **k** = $(round(k_arr(T_val), sigdigits=3)) s⁻¹
- **dk/dT** = $(round(dk_arr(T_val), sigdigits=3)) s⁻¹/K
- **% change per K** ≈ $(round(100*dk_arr(T_val)/k_arr(T_val), digits=1))%

**Rule of thumb:** For typical reactions, a 10°C increase roughly doubles the rate.
"""

# ╔═╡ a1000013-0001-0001-0001-000000000038
md"""
---
## Chemistry: Michaelis-Menten

Enzyme kinetics rate:

$$v = \frac{V_{max}[S]}{K_M + [S]}$$

How sensitive is the rate to substrate concentration?
"""

# ╔═╡ a1000013-0001-0001-0001-000000000039
md"""
**Vmax (μM/s):**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000040
@bind Vmax_val Slider(50:10:200, default=100, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000041
md"""
**Kₘ (μM):**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000042
@bind Km_val Slider(10:10:100, default=50, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000043
md"""
**Substrate [S] (μM):**
"""

# ╔═╡ a1000013-0001-0001-0001-000000000044
@bind S_val Slider(1:5:200, default=50, show_value=true)

# ╔═╡ a1000013-0001-0001-0001-000000000045
begin
    v_mm(S) = Vmax_val * S / (Km_val + S)

    # dv/dS using quotient rule
    # v = Vmax·S/(Km + S)
    # u = Vmax·S, u' = Vmax
    # w = Km + S, w' = 1
    # dv/dS = (Vmax·(Km+S) - Vmax·S·1)/(Km+S)² = Vmax·Km/(Km+S)²
    dv_mm(S) = Vmax_val * Km_val / (Km_val + S)^2

    S_range = range(0.1, 200, length=200)

    p_mm = plot(layout=(1,2), size=(900, 400))

    # Rate
    plot!(p_mm[1], S_range, v_mm.(S_range),
        xlabel="[S] (μM)", ylabel="v (μM/s)",
        title="Michaelis-Menten: Vmax=$(Vmax_val), Kₘ=$(Km_val)",
        linewidth=3, color=:blue,
        legend=:bottomright,
        label="v([S])")

    hline!(p_mm[1], [Vmax_val], color=:gray, linestyle=:dash, label="Vmax")
    vline!(p_mm[1], [Km_val], color=:orange, linestyle=:dash, label="Kₘ")

    scatter!(p_mm[1], [S_val], [v_mm(S_val)],
        markersize=10, color=:red, label="[S]=$(S_val)")

    # Sensitivity
    plot!(p_mm[2], S_range, dv_mm.(S_range),
        xlabel="[S] (μM)", ylabel="dv/d[S] (s⁻¹)",
        title="Substrate Sensitivity",
        linewidth=3, color=:green,
        legend=:topright,
        label="dv/d[S]")

    scatter!(p_mm[2], [S_val], [dv_mm(S_val)],
        markersize=10, color=:red,
        label="dv/d[S] = $(round(dv_mm(S_val), digits=3))")

    p_mm
end

# ╔═╡ a1000013-0001-0001-0001-000000000046
md"""
### Sensitivity Analysis

At [S] = $(S_val) μM:

- **v** = $(round(v_mm(S_val), digits=2)) μM/s ($(round(100*v_mm(S_val)/Vmax_val, digits=1))% of Vmax)
- **dv/d[S]** = $(round(dv_mm(S_val), digits=4)) s⁻¹

**Key insight:** Sensitivity is highest when [S] << Kₘ and drops to zero as [S] >> Kₘ.

At [S] = Kₘ: v = Vmax/2 and dv/d[S] = Vmax/(4Kₘ)
"""

# ╔═╡ a1000013-0001-0001-0001-000000000047
md"""
---
## Summary: When to Use Each Rule

| Situation | Rule | Formula |
|:----------|:-----|:--------|
| $x^n$ | Power | $nx^{n-1}$ |
| $cf(x)$ | Constant multiple | $cf'(x)$ |
| $f + g$ | Sum | $f' + g'$ |
| $f \cdot g$ | Product | $f'g + fg'$ |
| $f/g$ | Quotient | $(f'g - fg')/g^2$ |
| $f(g(x))$ | Chain | $f'(g) \cdot g'$ |
"""

# ╔═╡ a1000013-0001-0001-0001-000000000048
md"""
---
## Exercises

1. Find the derivative of $f(x) = x^3 - 4x^2 + 7x - 2$ using power and linearity rules.

2. Use the product rule to differentiate $f(x) = x \ln(x)$.

3. Use the chain rule to find $\frac{d}{dx}[\sin(3x)]$.

4. For the Arrhenius equation, show that $\frac{d \ln k}{d(1/T)} = -\frac{E_a}{R}$.

5. At what substrate concentration is the Michaelis-Menten rate most sensitive to changes in [S]?
"""

# ╔═╡ a1000013-0001-0001-0001-000000000049
md"""
---
## Next: Lecture 14

**Extrema and Optimization**

Using derivatives to find maximum and minimum values — essential for equilibrium and thermodynamics.
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
# ╠═a1000013-0001-0001-0001-000000000001
# ╟─a1000013-0001-0001-0001-000000000002
# ╟─a1000013-0001-0001-0001-000000000003
# ╟─a1000013-0001-0001-0001-000000000004
# ╟─a1000013-0001-0001-0001-000000000005
# ╟─a1000013-0001-0001-0001-000000000006
# ╟─a1000013-0001-0001-0001-000000000007
# ╟─a1000013-0001-0001-0001-000000000008
# ╟─a1000013-0001-0001-0001-000000000009
# ╟─a1000013-0001-0001-0001-000000000010
# ╟─a1000013-0001-0001-0001-000000000011
# ╟─a1000013-0001-0001-0001-000000000012
# ╟─a1000013-0001-0001-0001-000000000013
# ╟─a1000013-0001-0001-0001-000000000014
# ╟─a1000013-0001-0001-0001-000000000015
# ╟─a1000013-0001-0001-0001-000000000016
# ╟─a1000013-0001-0001-0001-000000000017
# ╟─a1000013-0001-0001-0001-000000000018
# ╟─a1000013-0001-0001-0001-000000000019
# ╟─a1000013-0001-0001-0001-000000000020
# ╟─a1000013-0001-0001-0001-000000000021
# ╟─a1000013-0001-0001-0001-000000000022
# ╟─a1000013-0001-0001-0001-000000000023
# ╟─a1000013-0001-0001-0001-000000000024
# ╟─a1000013-0001-0001-0001-000000000025
# ╟─a1000013-0001-0001-0001-000000000026
# ╟─a1000013-0001-0001-0001-000000000027
# ╟─a1000013-0001-0001-0001-000000000028
# ╟─a1000013-0001-0001-0001-000000000029
# ╟─a1000013-0001-0001-0001-000000000030
# ╟─a1000013-0001-0001-0001-000000000031
# ╟─a1000013-0001-0001-0001-000000000032
# ╟─a1000013-0001-0001-0001-000000000033
# ╟─a1000013-0001-0001-0001-000000000034
# ╟─a1000013-0001-0001-0001-000000000035
# ╟─a1000013-0001-0001-0001-000000000036
# ╟─a1000013-0001-0001-0001-000000000037
# ╟─a1000013-0001-0001-0001-000000000038
# ╟─a1000013-0001-0001-0001-000000000039
# ╟─a1000013-0001-0001-0001-000000000040
# ╟─a1000013-0001-0001-0001-000000000041
# ╟─a1000013-0001-0001-0001-000000000042
# ╟─a1000013-0001-0001-0001-000000000043
# ╟─a1000013-0001-0001-0001-000000000044
# ╟─a1000013-0001-0001-0001-000000000045
# ╟─a1000013-0001-0001-0001-000000000046
# ╟─a1000013-0001-0001-0001-000000000047
# ╟─a1000013-0001-0001-0001-000000000048
# ╟─a1000013-0001-0001-0001-000000000049
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
