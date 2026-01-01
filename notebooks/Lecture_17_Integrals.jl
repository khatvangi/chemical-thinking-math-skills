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

# ╔═╡ a1000017-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000017-0001-0001-0001-000000000002
md"""
# Lecture 17: Adding It All Up

*The integral — ACCUMULATION. From rates back to amounts.*

---

## ACCUMULATION: "All Together"

The derivative takes amounts → rates.

The integral takes rates → amounts.

**They are inverse operations.**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000003
md"""
---
## Riemann Sums: The Idea

Approximate area under curve with rectangles. As rectangles get thinner, approximation improves.
"""

# ╔═╡ a1000017-0001-0001-0001-000000000004
md"""
**Number of rectangles:**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000005
@bind n_rect Slider([2, 4, 8, 16, 32, 64, 128], default=8, show_value=true)

# ╔═╡ a1000017-0001-0001-0001-000000000006
md"""
**Sum type:**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000007
@bind sum_type Select([
    "left" => "Left Riemann Sum",
    "right" => "Right Riemann Sum",
    "midpoint" => "Midpoint Sum"
])

# ╔═╡ a1000017-0001-0001-0001-000000000008
begin
    # Function: f(x) = x² on [0, 2]
    f_riemann(x) = x^2
    a_riemann, b_riemann = 0, 2
    exact_integral = 8/3  # ∫₀² x² dx = [x³/3]₀² = 8/3

    Δx = (b_riemann - a_riemann) / n_rect

    # Compute Riemann sum
    if sum_type == "left"
        sample_pts = [a_riemann + i*Δx for i in 0:n_rect-1]
    elseif sum_type == "right"
        sample_pts = [a_riemann + i*Δx for i in 1:n_rect]
    else  # midpoint
        sample_pts = [a_riemann + (i + 0.5)*Δx for i in 0:n_rect-1]
    end

    riemann_sum = sum(f_riemann.(sample_pts)) * Δx

    # Plot
    x_plot = range(a_riemann, b_riemann, length=200)

    p_riemann = plot(x_plot, f_riemann.(x_plot),
        xlabel="x", ylabel="f(x)",
        title="f(x) = x² — $(sum_type) sum with n = $(n_rect)",
        linewidth=3, color=:blue,
        label="f(x) = x²",
        legend=:topleft,
        size=(700, 500))

    # Draw rectangles
    for i in 1:n_rect
        x_left = a_riemann + (i-1)*Δx
        x_right = a_riemann + i*Δx

        if sum_type == "left"
            height = f_riemann(x_left)
        elseif sum_type == "right"
            height = f_riemann(x_right)
        else
            height = f_riemann((x_left + x_right)/2)
        end

        # Rectangle
        plot!(p_riemann, [x_left, x_left, x_right, x_right, x_left],
            [0, height, height, 0, 0],
            fillalpha=0.3, fillcolor=:orange,
            linecolor=:orange, linewidth=1,
            label=(i==1 ? "Rectangles" : ""))
    end

    p_riemann
end

# ╔═╡ a1000017-0001-0001-0001-000000000009
md"""
### Approximation Quality

| Quantity | Value |
|:---------|:------|
| Riemann sum | $(round(riemann_sum, digits=6)) |
| Exact integral | $(round(exact_integral, digits=6)) |
| Error | $(round(abs(riemann_sum - exact_integral), digits=6)) |
| Relative error | $(round(100*abs(riemann_sum - exact_integral)/exact_integral, digits=3))% |

As n → ∞, the Riemann sum → exact integral.
"""

# ╔═╡ a1000017-0001-0001-0001-000000000010
md"""
---
## The Fundamental Theorem of Calculus

$\int_a^b f(x) \, dx = F(b) - F(a)$

where F'(x) = f(x).

**To integrate: find an antiderivative, evaluate at endpoints, subtract.**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000011
md"""
---
## Chemistry: Work Done by Gas

$W = -\int_{V_1}^{V_2} P \, dV$

For isothermal expansion of ideal gas: P = nRT/V
"""

# ╔═╡ a1000017-0001-0001-0001-000000000012
md"""
**Initial volume V₁ (L):**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000013
@bind V1_work Slider(5:5:20, default=10, show_value=true)

# ╔═╡ a1000017-0001-0001-0001-000000000014
md"""
**Final volume V₂ (L):**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000015
@bind V2_work Slider(15:5:50, default=25, show_value=true)

# ╔═╡ a1000017-0001-0001-0001-000000000016
begin
    n_work = 1.0  # mol
    R_work = 8.314  # J/(mol·K)
    T_work = 300  # K

    P_work(V) = n_work * R_work * T_work / V  # Pa if V in m³, but we'll use L and kPa
    # Actually: P in kPa, V in L → P = nRT/V with R = 8.314 L·kPa/(mol·K)

    # Work (in Joules, since 1 L·kPa = 1 J)
    W_work = -n_work * R_work * T_work * log(V2_work / V1_work)

    V_range_work = range(V1_work*0.8, V2_work*1.1, length=200)

    p_work = plot(V_range_work, P_work.(V_range_work),
        xlabel="Volume (L)", ylabel="Pressure (kPa)",
        title="Isothermal Expansion: Work = -∫P dV",
        linewidth=3, color=:blue,
        label="P = nRT/V",
        legend=:topright,
        size=(700, 450))

    # Shade area (work)
    V_fill = range(V1_work, V2_work, length=100)
    plot!(p_work, V_fill, P_work.(V_fill),
        fillrange=0, fillalpha=0.3, fillcolor=:green,
        linewidth=0, label="Work = $(round(abs(W_work), digits=1)) J")

    # Mark limits
    vline!(p_work, [V1_work], color=:red, linestyle=:dash, label="V₁ = $(V1_work) L")
    vline!(p_work, [V2_work], color=:red, linestyle=:dash, label="V₂ = $(V2_work) L")

    p_work
end

# ╔═╡ a1000017-0001-0001-0001-000000000017
md"""
### Work Calculation

$W = -\int_{V_1}^{V_2} P \, dV = -\int_{$(V1_work)}^{$(V2_work)} \frac{nRT}{V} \, dV = -nRT \ln\frac{V_2}{V_1}$

$W = -($(n_work))(8.314)($(T_work)) \ln\frac{$(V2_work)}{$(V1_work)} = $(round(W_work, digits=1)) \text{ J}$

$(W_work < 0 ? "**Work done BY the gas** (expansion)" : "**Work done ON the gas** (compression)")
"""

# ╔═╡ a1000017-0001-0001-0001-000000000018
md"""
---
## Chemistry: Product Formation from Rate

For a first-order reaction A → B:

$\text{Rate} = k[A]_0 e^{-kt}$

Total product formed:

$\Delta[B] = \int_0^t \text{Rate} \, dt = [A]_0(1 - e^{-kt})$
"""

# ╔═╡ a1000017-0001-0001-0001-000000000019
md"""
**Rate constant k (s⁻¹):**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000020
@bind k_prod Slider(0.05:0.05:0.5, default=0.1, show_value=true)

# ╔═╡ a1000017-0001-0001-0001-000000000021
md"""
**Time (s):**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000022
@bind t_prod Slider(0:1:50, default=20, show_value=true)

# ╔═╡ a1000017-0001-0001-0001-000000000023
begin
    A0_prod = 1.0  # M

    rate_prod(t) = k_prod * A0_prod * exp(-k_prod * t)
    product_formed(t) = A0_prod * (1 - exp(-k_prod * t))

    t_range_prod = range(0, 50, length=200)

    p_prod = plot(layout=(2,1), size=(700, 550))

    # Top: Rate vs time with shaded area
    plot!(p_prod[1], t_range_prod, rate_prod.(t_range_prod),
        ylabel="Rate (M/s)",
        title="Rate and Accumulated Product",
        linewidth=3, color=:blue,
        label="Rate = k[A]₀e^(-kt)",
        legend=:topright)

    # Shade area up to t_prod
    t_fill = range(0, t_prod, length=100)
    plot!(p_prod[1], t_fill, rate_prod.(t_fill),
        fillrange=0, fillalpha=0.3, fillcolor=:green,
        linewidth=0, label="∫Rate dt = Δ[B]")

    vline!(p_prod[1], [t_prod], color=:red, linestyle=:dash, label="")

    # Bottom: Product formed
    plot!(p_prod[2], t_range_prod, product_formed.(t_range_prod),
        xlabel="Time (s)", ylabel="[B] (M)",
        linewidth=3, color=:green,
        label="[B] = [A]₀(1 - e^(-kt))",
        legend=:bottomright)

    scatter!(p_prod[2], [t_prod], [product_formed(t_prod)], markersize=10, color=:red,
        label="[B]($(t_prod)) = $(round(product_formed(t_prod), digits=3)) M")

    hline!(p_prod[2], [A0_prod], color=:gray, linestyle=:dash, label="[A]₀ (max)")

    p_prod
end

# ╔═╡ a1000017-0001-0001-0001-000000000024
md"""
### Interpretation

At t = $(t_prod) s:

- **Product formed** = ∫₀ᵗ Rate dt = [A]₀(1 - e^(-kt)) = **$(round(product_formed(t_prod), digits=4)) M**
- This is $(round(100*product_formed(t_prod)/A0_prod, digits=1))% of the initial [A]₀

As t → ∞, all A converts to B: [B]∞ = [A]₀ = $(A0_prod) M
"""

# ╔═╡ a1000017-0001-0001-0001-000000000025
md"""
---
## The Gaussian Integral

$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$

This is fundamental to probability, statistical mechanics, and quantum mechanics.
"""

# ╔═╡ a1000017-0001-0001-0001-000000000026
md"""
**Parameter a in e^(-ax²):**
"""

# ╔═╡ a1000017-0001-0001-0001-000000000027
@bind a_gauss Slider(0.5:0.5:5, default=1, show_value=true)

# ╔═╡ a1000017-0001-0001-0001-000000000028
begin
    gauss_integral = sqrt(π / a_gauss)

    x_gauss = range(-4, 4, length=300)
    y_gauss = exp.(-a_gauss .* x_gauss.^2)

    p_gauss = plot(x_gauss, y_gauss,
        xlabel="x", ylabel="e^(-ax²)",
        title="Gaussian: ∫e^(-$(a_gauss)x²)dx = √(π/$(a_gauss)) = $(round(gauss_integral, digits=3))",
        linewidth=3, color=:purple,
        fill=true, fillalpha=0.3,
        label="e^(-$(a_gauss)x²)",
        legend=:topright,
        size=(650, 400))

    # Mark standard deviation scale
    σ_gauss = 1/sqrt(2*a_gauss)
    vline!(p_gauss, [-σ_gauss, σ_gauss], color=:red, linestyle=:dash,
        label="±σ = ±$(round(σ_gauss, digits=2))")

    p_gauss
end

# ╔═╡ a1000017-0001-0001-0001-000000000029
md"""
### Key Results

$\int_{-\infty}^{\infty} e^{-ax^2} dx = \sqrt{\frac{\pi}{a}}$

As **a increases**: curve gets narrower, integral decreases.

This integral appears in:
- Maxwell-Boltzmann distribution
- Quantum harmonic oscillator
- Error function
- Normalization of Gaussian probability distributions
"""

# ╔═╡ a1000017-0001-0001-0001-000000000030
md"""
---
## Substitution (u-sub)

If the integrand has form f(g(x))g'(x), let u = g(x):

$\int f(g(x)) g'(x) \, dx = \int f(u) \, du$
"""

# ╔═╡ a1000017-0001-0001-0001-000000000031
md"""
### Example: ∫ 2x cos(x²) dx

Let u = x², then du = 2x dx.

$\int 2x \cos(x^2) \, dx = \int \cos(u) \, du = \sin(u) + C = \sin(x^2) + C$
"""

# ╔═╡ a1000017-0001-0001-0001-000000000032
begin
    x_sub = range(-2, 2, length=200)

    # Original: 2x cos(x²)
    f_original(x) = 2x * cos(x^2)

    # Antiderivative: sin(x²)
    F_antideriv(x) = sin(x^2)

    p_sub = plot(layout=(2,1), size=(700, 450))

    plot!(p_sub[1], x_sub, f_original.(x_sub),
        ylabel="f(x)",
        title="Substitution: ∫ 2x cos(x²) dx = sin(x²) + C",
        linewidth=3, color=:blue,
        label="f(x) = 2x cos(x²)")

    plot!(p_sub[2], x_sub, F_antideriv.(x_sub),
        xlabel="x", ylabel="F(x)",
        linewidth=3, color=:green,
        label="F(x) = sin(x²)")

    # Verify: F'(x) = f(x)
    # d/dx[sin(x²)] = cos(x²) · 2x ✓

    p_sub
end

# ╔═╡ a1000017-0001-0001-0001-000000000033
md"""
**Verification:** d/dx[sin(x²)] = cos(x²) · 2x = 2x cos(x²) ✓
"""

# ╔═╡ a1000017-0001-0001-0001-000000000034
md"""
---
## Summary

| Concept | Key Formula |
|:--------|:------------|
| Definite integral | ∫ₐᵇ f(x)dx = F(b) - F(a) |
| Power rule | ∫xⁿdx = xⁿ⁺¹/(n+1) + C |
| Work | W = -∫P dV |
| Product formed | Δ[B] = ∫ Rate dt |
| Gaussian | ∫e^(-ax²)dx = √(π/a) |
| Substitution | ∫f(g(x))g'(x)dx = ∫f(u)du |
"""

# ╔═╡ a1000017-0001-0001-0001-000000000035
md"""
---
## Exercises

1. Evaluate ∫₀² (3x² - 2x + 1) dx

2. Use substitution to find ∫ x·e^(x²) dx

3. Calculate the work for 2 moles of gas expanding from 5 L to 20 L at 400 K.

4. For k = 0.2 s⁻¹ and [A]₀ = 0.5 M, find product formed after 15 s.
"""

# ╔═╡ a1000017-0001-0001-0001-000000000036
md"""
---
## Next: Lecture 18

**Integration Techniques**

Integration by parts, partial fractions, and more.
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
# ╠═a1000017-0001-0001-0001-000000000001
# ╟─a1000017-0001-0001-0001-000000000002
# ╟─a1000017-0001-0001-0001-000000000003
# ╟─a1000017-0001-0001-0001-000000000004
# ╟─a1000017-0001-0001-0001-000000000005
# ╟─a1000017-0001-0001-0001-000000000006
# ╟─a1000017-0001-0001-0001-000000000007
# ╟─a1000017-0001-0001-0001-000000000008
# ╟─a1000017-0001-0001-0001-000000000009
# ╟─a1000017-0001-0001-0001-000000000010
# ╟─a1000017-0001-0001-0001-000000000011
# ╟─a1000017-0001-0001-0001-000000000012
# ╟─a1000017-0001-0001-0001-000000000013
# ╟─a1000017-0001-0001-0001-000000000014
# ╟─a1000017-0001-0001-0001-000000000015
# ╟─a1000017-0001-0001-0001-000000000016
# ╟─a1000017-0001-0001-0001-000000000017
# ╟─a1000017-0001-0001-0001-000000000018
# ╟─a1000017-0001-0001-0001-000000000019
# ╟─a1000017-0001-0001-0001-000000000020
# ╟─a1000017-0001-0001-0001-000000000021
# ╟─a1000017-0001-0001-0001-000000000022
# ╟─a1000017-0001-0001-0001-000000000023
# ╟─a1000017-0001-0001-0001-000000000024
# ╟─a1000017-0001-0001-0001-000000000025
# ╟─a1000017-0001-0001-0001-000000000026
# ╟─a1000017-0001-0001-0001-000000000027
# ╟─a1000017-0001-0001-0001-000000000028
# ╟─a1000017-0001-0001-0001-000000000029
# ╟─a1000017-0001-0001-0001-000000000030
# ╟─a1000017-0001-0001-0001-000000000031
# ╟─a1000017-0001-0001-0001-000000000032
# ╟─a1000017-0001-0001-0001-000000000033
# ╟─a1000017-0001-0001-0001-000000000034
# ╟─a1000017-0001-0001-0001-000000000035
# ╟─a1000017-0001-0001-0001-000000000036
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
