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

# ╔═╡ a1000016-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    using LinearAlgebra
    plotly()
end

# ╔═╡ a1000016-0001-0001-0001-000000000002
md"""
# Lecture 16: Approximations and Constraints

*Taylor series for local behavior, Lagrange multipliers for constrained optimization.*

---

## Part I: Taylor Series — Local Approximation
"""

# ╔═╡ a1000016-0001-0001-0001-000000000003
md"""
### The Key Insight

**Any smooth function looks like a polynomial up close.**

Taylor series lets us replace complicated functions with simple polynomials near a point.
"""

# ╔═╡ a1000016-0001-0001-0001-000000000004
md"""
---
## Taylor Series Formula

Around point $x = a$:

$$f(x) \approx f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f'''(a)}{3!}(x-a)^3 + \cdots$$

**Each term adds more accuracy farther from the center point.**
"""

# ╔═╡ a1000016-0001-0001-0001-000000000005
md"""
---
## Interactive: Taylor Approximation of sin(x)

**Number of terms in Taylor expansion:**
"""

# ╔═╡ a1000016-0001-0001-0001-000000000006
@bind n_terms Slider(1:8, default=3, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000007
begin
    # Taylor series for sin(x) around x=0
    function taylor_sin(x, n)
        result = 0.0
        for k in 0:n-1
            result += (-1)^k * x^(2k+1) / factorial(2k+1)
        end
        return result
    end

    x_taylor = range(-2π, 2π, length=200)

    p_taylor = plot(x_taylor, sin.(x_taylor),
        label="sin(x)", linewidth=3, color=:blue,
        xlabel="x", ylabel="y",
        title="Taylor Series Approximation of sin(x)",
        legend=:topright, size=(700, 400))

    plot!(p_taylor, x_taylor, taylor_sin.(x_taylor, n_terms),
        label="Taylor ($n_terms terms)", linewidth=2,
        color=:red, linestyle=:dash)

    ylims!(p_taylor, -2, 2)
    p_taylor
end

# ╔═╡ a1000016-0001-0001-0001-000000000008
md"""
**Notice:** With just a few terms, the approximation is excellent near x = 0!

The Taylor polynomial matches:
- The function value at the center
- All derivatives up to order n at the center
"""

# ╔═╡ a1000016-0001-0001-0001-000000000009
md"""
---
## Chemistry Application: Morse vs Harmonic Potential

The Morse potential describes real bond stretching:

$$V(r) = D_e\left(1 - e^{-a(r-r_e)}\right)^2$$

Near equilibrium, we can approximate it with a harmonic oscillator (Taylor expansion):

$$V(r) \approx \frac{1}{2}k(r-r_e)^2$$
"""

# ╔═╡ a1000016-0001-0001-0001-000000000010
md"""
**Bond parameters:**
"""

# ╔═╡ a1000016-0001-0001-0001-000000000011
@bind De_morse Slider(1:0.5:5, default=3, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000012
@bind a_morse Slider(0.5:0.1:2, default=1.0, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000013
begin
    re = 1.5  # equilibrium distance

    # Morse potential
    morse(r) = De_morse * (1 - exp(-a_morse * (r - re)))^2

    # Harmonic approximation (2nd order Taylor)
    k_harmonic = 2 * De_morse * a_morse^2
    harmonic(r) = 0.5 * k_harmonic * (r - re)^2

    r_range = range(0.8, 3.5, length=200)

    p_morse = plot(r_range, morse.(r_range),
        label="Morse (exact)", linewidth=3, color=:blue,
        xlabel="r (bond length)", ylabel="V(r) (energy)",
        title="Morse Potential vs Harmonic Approximation",
        legend=:topright, size=(700, 400))

    plot!(p_morse, r_range, harmonic.(r_range),
        label="Harmonic (Taylor)", linewidth=2,
        color=:red, linestyle=:dash)

    scatter!(p_morse, [re], [0],
        label="equilibrium", markersize=8, color=:green)

    ylims!(p_morse, -0.5, 1.5 * De_morse)
    p_morse
end

# ╔═╡ a1000016-0001-0001-0001-000000000014
md"""
**Key observation:** The harmonic approximation (red) matches the Morse potential (blue) well near equilibrium, but fails at large displacements. This is why:
- Harmonic oscillator is good for low-energy vibrations
- Anharmonicity matters for dissociation and high-energy states
"""

# ╔═╡ a1000016-0001-0001-0001-000000000015
md"""
---
## Small Angle Approximations

For small θ, trigonometric functions simplify dramatically:

| Function | Approximation | First correction |
|----------|--------------|------------------|
| sin(θ) | θ | -θ³/6 |
| cos(θ) | 1 | -θ²/2 |
| tan(θ) | θ | +θ³/3 |

These are just 1st and 2nd order Taylor expansions!
"""

# ╔═╡ a1000016-0001-0001-0001-000000000016
md"""
**Maximum angle (degrees):**
"""

# ╔═╡ a1000016-0001-0001-0001-000000000017
@bind max_angle Slider(5:5:90, default=30, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000018
begin
    θ_range = range(0, deg2rad(max_angle), length=100)

    p_small = plot(rad2deg.(θ_range), sin.(θ_range),
        label="sin(θ)", linewidth=3, color=:blue,
        xlabel="θ (degrees)", ylabel="value",
        title="Small Angle Approximation",
        legend=:topleft, size=(700, 400))

    plot!(p_small, rad2deg.(θ_range), θ_range,
        label="θ (radians)", linewidth=2,
        color=:red, linestyle=:dash)

    # Calculate error at max angle
    error_percent = 100 * abs(sin(deg2rad(max_angle)) - deg2rad(max_angle)) / sin(deg2rad(max_angle))

    annotate!(p_small, max_angle * 0.7, 0.7 * sin(deg2rad(max_angle)),
        text("Error at $(max_angle)°: $(round(error_percent, digits=1))%", :left, 10))

    p_small
end

# ╔═╡ a1000016-0001-0001-0001-000000000019
md"""
**Rule of thumb:** sin(θ) ≈ θ is good to within 1% for θ < 14°
"""

# ╔═╡ a1000016-0001-0001-0001-000000000020
md"""
---
---
## Part II: Lagrange Multipliers — Constrained Optimization
"""

# ╔═╡ a1000016-0001-0001-0001-000000000021
md"""
### The Problem

**Optimize f(x,y) subject to a constraint g(x,y) = c**

We can't just set ∇f = 0 because we must stay on the constraint curve.
"""

# ╔═╡ a1000016-0001-0001-0001-000000000022
md"""
### The Key Insight

**At the optimum, ∇f is parallel to ∇g.**

Why? If they weren't parallel, we could move along the constraint and still improve f.

$$\nabla f = \lambda \nabla g$$

where λ is the **Lagrange multiplier**.
"""

# ╔═╡ a1000016-0001-0001-0001-000000000023
md"""
---
## Geometric Visualization

We want to maximize f(x,y) = x + y subject to the constraint x² + y² = 1 (unit circle).
"""

# ╔═╡ a1000016-0001-0001-0001-000000000024
@bind show_gradients CheckBox(default=true)

# ╔═╡ a1000016-0001-0001-0001-000000000025
@bind theta_point Slider(0:5:355, default=45, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000026
begin
    # Point on constraint
    θ_rad = deg2rad(theta_point)
    x_pt = cos(θ_rad)
    y_pt = sin(θ_rad)

    # Gradients
    grad_f = [1, 1] / sqrt(2)  # normalized ∇f = (1,1)
    grad_g = [2x_pt, 2y_pt]
    grad_g_norm = grad_g / norm(grad_g)

    # Constraint circle
    θ_circle = range(0, 2π, length=100)

    # Level curves of f(x,y) = x + y
    p_lagrange = plot(cos.(θ_circle), sin.(θ_circle),
        label="constraint: x² + y² = 1", linewidth=3, color=:blue,
        xlabel="x", ylabel="y", aspect_ratio=1,
        title="Lagrange Multipliers: max(x+y) on unit circle",
        legend=:topright, size=(600, 600))

    # Level curves
    for c in -1.5:0.3:1.5
        x_level = range(-1.5, 1.5, length=50)
        plot!(p_lagrange, x_level, c .- x_level,
            label="", linewidth=1, color=:lightgray, alpha=0.5)
    end

    # Current point
    scatter!(p_lagrange, [x_pt], [y_pt],
        label="current point", markersize=10, color=:red)

    # Optimal point
    scatter!(p_lagrange, [1/sqrt(2)], [1/sqrt(2)],
        label="optimum", markersize=10, color=:green, marker=:star)

    if show_gradients
        # Draw gradients as arrows
        scale = 0.4
        quiver!(p_lagrange, [x_pt], [y_pt],
            quiver=([scale * grad_f[1]], [scale * grad_f[2]]),
            color=:orange, linewidth=3, label="")
        quiver!(p_lagrange, [x_pt], [y_pt],
            quiver=([scale * grad_g_norm[1]], [scale * grad_g_norm[2]]),
            color=:purple, linewidth=3, label="")

        annotate!(p_lagrange, x_pt + 0.5*grad_f[1], y_pt + 0.5*grad_f[2],
            text("∇f", :orange, :left, 12))
        annotate!(p_lagrange, x_pt + 0.5*grad_g_norm[1], y_pt + 0.5*grad_g_norm[2],
            text("∇g", :purple, :left, 12))
    end

    xlims!(p_lagrange, -1.8, 1.8)
    ylims!(p_lagrange, -1.8, 1.8)

    # Check if at optimum
    is_parallel = abs(dot(grad_f, grad_g_norm)) > 0.99

    p_lagrange
end

# ╔═╡ a1000016-0001-0001-0001-000000000027
md"""
**Move the slider to θ = 45°.** At this point, ∇f and ∇g are parallel — this is the maximum!

The Lagrange condition ∇f = λ∇g is satisfied.
"""

# ╔═╡ a1000016-0001-0001-0001-000000000028
md"""
---
## Solving with Lagrange Multipliers

**Method:**
1. Write the Lagrangian: $\mathcal{L} = f - \lambda(g - c)$
2. Set all partial derivatives to zero:
   - $\frac{\partial \mathcal{L}}{\partial x} = 0$
   - $\frac{\partial \mathcal{L}}{\partial y} = 0$
   - $\frac{\partial \mathcal{L}}{\partial \lambda} = 0$ (this is just the constraint!)
3. Solve the system of equations
"""

# ╔═╡ a1000016-0001-0001-0001-000000000029
md"""
### Example: Maximize f(x,y) = xy subject to x + y = 10

**Setup:**
- f(x,y) = xy (objective)
- g(x,y) = x + y = 10 (constraint)
- Lagrangian: $\mathcal{L} = xy - \lambda(x + y - 10)$

**Equations:**
- $\frac{\partial \mathcal{L}}{\partial x} = y - \lambda = 0$ → y = λ
- $\frac{\partial \mathcal{L}}{\partial y} = x - \lambda = 0$ → x = λ
- $\frac{\partial \mathcal{L}}{\partial \lambda} = -(x + y - 10) = 0$ → x + y = 10

**Solution:** x = y → 2x = 10 → x = y = 5, and max(xy) = 25
"""

# ╔═╡ a1000016-0001-0001-0001-000000000030
md"""
---
## Chemistry Application: Boltzmann Distribution

**Problem:** Maximize entropy subject to fixed total energy.

$$S = -k_B \sum_i p_i \ln p_i$$

**Constraints:**
- $\sum_i p_i = 1$ (normalization)
- $\sum_i p_i E_i = \langle E \rangle$ (fixed average energy)

**Result:** The Boltzmann distribution emerges naturally!

$$p_i = \frac{e^{-E_i/k_BT}}{Z}$$

The Lagrange multiplier becomes 1/k_BT (inverse temperature).
"""

# ╔═╡ a1000016-0001-0001-0001-000000000031
md"""
---
## Interactive: Constrained Distance Problem

**Find the point on the line y = mx + b closest to the origin.**
"""

# ╔═╡ a1000016-0001-0001-0001-000000000032
@bind m_line Slider(-2:0.25:2, default=1, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000033
@bind b_line Slider(-3:0.5:3, default=2, show_value=true)

# ╔═╡ a1000016-0001-0001-0001-000000000034
begin
    # Line: y = mx + b
    # Minimize: f = x² + y² (distance squared to origin)
    # Constraint: g = y - mx - b = 0

    # Analytical solution:
    # ∂L/∂x = 2x + λm = 0 → x = -λm/2
    # ∂L/∂y = 2y - λ = 0 → y = λ/2
    # Constraint: y - mx - b = 0
    # Substituting: λ/2 + m(λm/2) - b = 0
    # λ(1 + m²)/2 = b → λ = 2b/(1 + m²)

    λ_sol = 2b_line / (1 + m_line^2)
    x_closest = -λ_sol * m_line / 2
    y_closest = λ_sol / 2
    dist_min = sqrt(x_closest^2 + y_closest^2)

    # Plot
    x_line_range = range(-3, 3, length=100)

    p_dist = plot(x_line_range, m_line .* x_line_range .+ b_line,
        label="line: y = $(m_line)x + $(b_line)", linewidth=3, color=:blue,
        xlabel="x", ylabel="y", aspect_ratio=1,
        title="Closest Point to Origin on Line",
        legend=:topright, size=(600, 500))

    # Origin
    scatter!(p_dist, [0], [0],
        label="origin", markersize=10, color=:black)

    # Closest point
    scatter!(p_dist, [x_closest], [y_closest],
        label="closest point", markersize=10, color=:red)

    # Distance line
    plot!(p_dist, [0, x_closest], [0, y_closest],
        label="min distance = $(round(dist_min, digits=2))",
        linewidth=2, color=:red, linestyle=:dash)

    # Show gradient at closest point is perpendicular to line
    if abs(dist_min) > 0.1
        grad_scale = 0.5
        grad_f_pt = [2x_closest, 2y_closest]
        grad_f_pt_norm = grad_f_pt / norm(grad_f_pt) * grad_scale
        quiver!(p_dist, [x_closest], [y_closest],
            quiver=([grad_f_pt_norm[1]], [grad_f_pt_norm[2]]),
            color=:orange, linewidth=2, label="")
    end

    xlims!(p_dist, -3.5, 3.5)
    ylims!(p_dist, -3.5, 3.5)

    p_dist
end

# ╔═╡ a1000016-0001-0001-0001-000000000035
md"""
**The closest point is where the line from the origin hits the constraint perpendicularly.**

This is exactly what Lagrange multipliers tell us: ∇f (pointing toward origin) is parallel to ∇g (normal to the line).
"""

# ╔═╡ a1000016-0001-0001-0001-000000000036
md"""
---
## Summary

### Taylor Series
- Approximate functions locally with polynomials
- Match function value and derivatives at expansion point
- Essential for: harmonic approximation, small-angle approximations, perturbation theory

### Lagrange Multipliers
- Optimize f(x,y) subject to constraint g(x,y) = c
- At optimum: ∇f = λ∇g (gradients are parallel)
- Solve the Lagrangian system of equations
- λ has physical meaning (e.g., inverse temperature in statistical mechanics)
"""

# ╔═╡ a1000016-0001-0001-0001-000000000037
md"""
---
## Practice Problems

1. **Taylor series:** Find the 3rd order Taylor expansion of $e^x$ around x = 0.

2. **Small angle:** Use the small angle approximation to estimate sin(10°) without a calculator. Compare to the actual value.

3. **Lagrange multipliers:** Find the maximum and minimum of f(x,y) = x² + 2y² subject to x² + y² = 1.

4. **Chemistry:** The van der Waals equation can be approximated near the critical point. What does the Taylor expansion tell us about the behavior there?
"""

# ╔═╡ Cell order:
# ╠═a1000016-0001-0001-0001-000000000001
# ╟─a1000016-0001-0001-0001-000000000002
# ╟─a1000016-0001-0001-0001-000000000003
# ╟─a1000016-0001-0001-0001-000000000004
# ╟─a1000016-0001-0001-0001-000000000005
# ╟─a1000016-0001-0001-0001-000000000006
# ╠═a1000016-0001-0001-0001-000000000007
# ╟─a1000016-0001-0001-0001-000000000008
# ╟─a1000016-0001-0001-0001-000000000009
# ╟─a1000016-0001-0001-0001-000000000010
# ╟─a1000016-0001-0001-0001-000000000011
# ╟─a1000016-0001-0001-0001-000000000012
# ╠═a1000016-0001-0001-0001-000000000013
# ╟─a1000016-0001-0001-0001-000000000014
# ╟─a1000016-0001-0001-0001-000000000015
# ╟─a1000016-0001-0001-0001-000000000016
# ╟─a1000016-0001-0001-0001-000000000017
# ╠═a1000016-0001-0001-0001-000000000018
# ╟─a1000016-0001-0001-0001-000000000019
# ╟─a1000016-0001-0001-0001-000000000020
# ╟─a1000016-0001-0001-0001-000000000021
# ╟─a1000016-0001-0001-0001-000000000022
# ╟─a1000016-0001-0001-0001-000000000023
# ╟─a1000016-0001-0001-0001-000000000024
# ╟─a1000016-0001-0001-0001-000000000025
# ╠═a1000016-0001-0001-0001-000000000026
# ╟─a1000016-0001-0001-0001-000000000027
# ╟─a1000016-0001-0001-0001-000000000028
# ╟─a1000016-0001-0001-0001-000000000029
# ╟─a1000016-0001-0001-0001-000000000030
# ╟─a1000016-0001-0001-0001-000000000031
# ╟─a1000016-0001-0001-0001-000000000032
# ╟─a1000016-0001-0001-0001-000000000033
# ╠═a1000016-0001-0001-0001-000000000034
# ╟─a1000016-0001-0001-0001-000000000035
# ╟─a1000016-0001-0001-0001-000000000036
# ╟─a1000016-0001-0001-0001-000000000037
