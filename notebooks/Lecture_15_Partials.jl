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

# ╔═╡ a1000015-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    using LinearAlgebra
    plotly()
end

# ╔═╡ a1000015-0001-0001-0001-000000000002
md"""
# Lecture 15: Partial Derivatives

*Functions of several variables — it's simpler than you think.*

---

## The Key Insight

**Partial derivative = ordinary derivative with other variables held constant.**

That's the whole idea. If you can differentiate, you can do partial derivatives.
"""

# ╔═╡ a1000015-0001-0001-0001-000000000003
md"""
---
## Computing Partials: It's Just Differentiation

To find ∂f/∂x: **treat y as a constant**, differentiate normally.
"""

# ╔═╡ a1000015-0001-0001-0001-000000000004
md"""
### Example: f(x, y) = x²y + 3xy² - y³
"""

# ╔═╡ a1000015-0001-0001-0001-000000000005
md"""
**∂f/∂x** (y is constant):
- d/dx[x²y] = 2xy (y is just a constant coefficient)
- d/dx[3xy²] = 3y² (y² is constant)
- d/dx[-y³] = 0 (no x!)

**Result: ∂f/∂x = 2xy + 3y²**

**∂f/∂y** (x is constant):
- d/dy[x²y] = x²
- d/dy[3xy²] = 6xy
- d/dy[-y³] = -3y²

**Result: ∂f/∂y = x² + 6xy - 3y²**
"""

# ╔═╡ a1000015-0001-0001-0001-000000000006
md"""
---
## Visualizing Partial Derivatives

For z = f(x, y), the graph is a **surface**.

- ∂f/∂x = slope in the x-direction
- ∂f/∂y = slope in the y-direction
"""

# ╔═╡ a1000015-0001-0001-0001-000000000007
md"""
**Choose a point (x₀, y₀) on the surface:**
"""

# ╔═╡ a1000015-0001-0001-0001-000000000008
@bind x0_surf Slider(-2:0.25:2, default=1, show_value=true)

# ╔═╡ a1000015-0001-0001-0001-000000000009
@bind y0_surf Slider(-2:0.25:2, default=1, show_value=true)

# ╔═╡ a1000015-0001-0001-0001-000000000010
begin
    # f(x,y) = x² + y² (paraboloid)
    f_surf(x, y) = x^2 + y^2
    fx_surf(x, y) = 2x  # ∂f/∂x
    fy_surf(x, y) = 2y  # ∂f/∂y

    # Create surface
    x_surf = range(-2.5, 2.5, length=50)
    y_surf = range(-2.5, 2.5, length=50)
    z_surf = [f_surf(x, y) for y in y_surf, x in x_surf]

    p_surf = surface(x_surf, y_surf, z_surf,
        xlabel="x", ylabel="y", zlabel="z",
        title="z = x² + y² with tangent lines at ($(x0_surf), $(y0_surf))",
        alpha=0.7,
        colorbar=false,
        camera=(30, 30),
        size=(700, 550))

    # Point on surface
    z0 = f_surf(x0_surf, y0_surf)
    scatter3d!(p_surf, [x0_surf], [y0_surf], [z0],
        markersize=8, color=:red, label="")

    # Tangent line in x-direction
    slope_x = fx_surf(x0_surf, y0_surf)
    tx = range(x0_surf - 0.8, x0_surf + 0.8, length=20)
    tz_x = z0 .+ slope_x .* (tx .- x0_surf)
    plot3d!(p_surf, tx, fill(y0_surf, 20), tz_x,
        linewidth=4, color=:blue, label="∂f/∂x direction")

    # Tangent line in y-direction
    slope_y = fy_surf(x0_surf, y0_surf)
    ty = range(y0_surf - 0.8, y0_surf + 0.8, length=20)
    tz_y = z0 .+ slope_y .* (ty .- y0_surf)
    plot3d!(p_surf, fill(x0_surf, 20), ty, tz_y,
        linewidth=4, color=:green, label="∂f/∂y direction")

    p_surf
end

# ╔═╡ a1000015-0001-0001-0001-000000000011
md"""
### Partial Derivatives at ($(x0_surf), $(y0_surf))

| Direction | Partial | Value | Meaning |
|:----------|:--------|:------|:--------|
| x | ∂f/∂x = 2x | $(2*x0_surf) | Slope going east |
| y | ∂f/∂y = 2y | $(2*y0_surf) | Slope going north |

**Gradient:** ∇f = ($(2*x0_surf), $(2*y0_surf)) — points uphill!
"""

# ╔═╡ a1000015-0001-0001-0001-000000000012
md"""
---
## The Gradient and Steepest Ascent

The **gradient** ∇f = (∂f/∂x, ∂f/∂y) points in the direction of steepest increase.
"""

# ╔═╡ a1000015-0001-0001-0001-000000000013
begin
    # Contour plot with gradient vectors
    x_cont = range(-2, 2, length=40)
    y_cont = range(-2, 2, length=40)
    z_cont = [f_surf(x, y) for y in y_cont, x in x_cont]

    p_grad = contour(x_cont, y_cont, z_cont,
        xlabel="x", ylabel="y",
        title="Contours of f(x,y) = x² + y² with gradient vectors",
        levels=10,
        aspect_ratio=:equal,
        size=(600, 550),
        colorbar=true)

    # Add gradient vectors at grid points
    for xi in -1.5:0.75:1.5
        for yi in -1.5:0.75:1.5
            if abs(xi) > 0.1 || abs(yi) > 0.1  # skip origin
                gx = 0.15 * fx_surf(xi, yi)
                gy = 0.15 * fy_surf(xi, yi)
                quiver!(p_grad, [xi], [yi], quiver=([gx], [gy]),
                    color=:red, linewidth=2, label="")
            end
        end
    end

    # Mark current point
    scatter!(p_grad, [x0_surf], [y0_surf], markersize=10, color=:blue,
        label="($(x0_surf), $(y0_surf))")

    # Gradient at current point
    gx0 = 0.3 * fx_surf(x0_surf, y0_surf)
    gy0 = 0.3 * fy_surf(x0_surf, y0_surf)
    quiver!(p_grad, [x0_surf], [y0_surf], quiver=([gx0], [gy0]),
        color=:blue, linewidth=3, label="∇f at point")

    p_grad
end

# ╔═╡ a1000015-0001-0001-0001-000000000014
md"""
**Gradient vectors point perpendicular to contour lines** (direction of steepest ascent).

For a potential energy surface, the force is **F** = -∇V (opposite to gradient — points downhill).
"""

# ╔═╡ a1000015-0001-0001-0001-000000000015
md"""
---
## Critical Points: Where ∇f = 0

At a critical point, both partial derivatives are zero — the surface is flat.
"""

# ╔═╡ a1000015-0001-0001-0001-000000000016
@bind crit_func Select([
    "paraboloid" => "f = x² + y² (minimum)",
    "neg_paraboloid" => "f = -x² - y² (maximum)",
    "saddle" => "f = x² - y² (saddle)",
    "monkey" => "f = x³ - 3xy² (monkey saddle)"
])

# ╔═╡ a1000015-0001-0001-0001-000000000017
begin
    if crit_func == "paraboloid"
        f_crit(x, y) = x^2 + y^2
        crit_type = "Local minimum"
        crit_color = :green
    elseif crit_func == "neg_paraboloid"
        f_crit(x, y) = -x^2 - y^2
        crit_type = "Local maximum"
        crit_color = :red
    elseif crit_func == "saddle"
        f_crit(x, y) = x^2 - y^2
        crit_type = "Saddle point"
        crit_color = :orange
    else
        f_crit(x, y) = x^3 - 3x*y^2
        crit_type = "Monkey saddle"
        crit_color = :purple
    end

    x_crit = range(-2, 2, length=60)
    y_crit = range(-2, 2, length=60)
    z_crit = [f_crit(x, y) for y in y_crit, x in x_crit]

    p_crit = surface(x_crit, y_crit, z_crit,
        xlabel="x", ylabel="y", zlabel="z",
        title="Critical point at origin: $(crit_type)",
        alpha=0.8,
        colorbar=false,
        camera=(30, 30),
        size=(650, 500))

    # Mark origin
    scatter3d!(p_crit, [0], [0], [0],
        markersize=10, color=crit_color, label="Critical point")

    p_crit
end

# ╔═╡ a1000015-0001-0001-0001-000000000018
md"""
### Second Derivative Test (2D)

At critical point where ∇f = 0, compute:

$D = f_{xx} \cdot f_{yy} - (f_{xy})^2 = \det(\text{Hessian})$

| D | f_xx | Type |
|:--|:-----|:-----|
| D > 0 | > 0 | **Minimum** |
| D > 0 | < 0 | **Maximum** |
| D < 0 | any | **Saddle** |
| D = 0 | — | Inconclusive |
"""

# ╔═╡ a1000015-0001-0001-0001-000000000019
md"""
---
## Chemistry: Thermodynamic Partials

In thermodynamics, we constantly use partial derivatives with specific variables held constant.
"""

# ╔═╡ a1000015-0001-0001-0001-000000000020
md"""
### Ideal Gas: PV = nRT

**P as a function of V and T:**

$P = \frac{nRT}{V}$
"""

# ╔═╡ a1000015-0001-0001-0001-000000000021
@bind n_gas Slider(0.5:0.5:3, default=1, show_value=true)

# ╔═╡ a1000015-0001-0001-0001-000000000022
@bind T_gas Slider(200:50:500, default=300, show_value=true)

# ╔═╡ a1000015-0001-0001-0001-000000000023
@bind V_gas Slider(5:5:50, default=25, show_value=true)

# ╔═╡ a1000015-0001-0001-0001-000000000024
begin
    R_const = 8.314  # J/(mol·K)

    P_gas(V, T) = n_gas * R_const * T / V  # in Pa, V in L needs conversion

    # Partials
    dP_dT(V) = n_gas * R_const / V
    dP_dV(V, T) = -n_gas * R_const * T / V^2

    Markdown.parse("""
    ### Partial Derivatives of P(V, T)

    **At n = $(n_gas) mol, T = $(T_gas) K, V = $(V_gas) L:**

    \$\\left(\\frac{\\partial P}{\\partial T}\\right)_V = \\frac{nR}{V} = \\frac{$(n_gas) \\times 8.314}{$(V_gas)} = $(round(dP_dT(V_gas), digits=2)) \\text{ Pa/K}\$

    *At constant volume, pressure increases with temperature.*

    \$\\left(\\frac{\\partial P}{\\partial V}\\right)_T = -\\frac{nRT}{V^2} = -\\frac{$(n_gas) \\times 8.314 \\times $(T_gas)}{$(V_gas)^2} = $(round(dP_dV(V_gas, T_gas), digits=2)) \\text{ Pa/L}\$

    *At constant temperature, pressure decreases as volume increases (negative!).*
    """)
end

# ╔═╡ a1000015-0001-0001-0001-000000000025
md"""
---
## Chemistry: Potential Energy Surface

A triatomic molecule's potential V(r₁, r₂, θ) depends on two bond lengths and an angle.
"""

# ╔═╡ a1000015-0001-0001-0001-000000000026
md"""
### Simplified Model: V(r₁, r₂) for Fixed Angle

$V(r_1, r_2) = D_e\left[(1-e^{-\beta(r_1-r_e)})^2 + (1-e^{-\beta(r_2-r_e)})^2\right]$
"""

# ╔═╡ a1000015-0001-0001-0001-000000000027
begin
    # Simplified 2D Morse potential
    De = 4.0  # eV
    β = 2.0   # Å⁻¹
    re = 1.0  # Å

    V_morse2d(r1, r2) = De * ((1 - exp(-β*(r1-re)))^2 + (1 - exp(-β*(r2-re)))^2)

    r1_range = range(0.6, 2.0, length=50)
    r2_range = range(0.6, 2.0, length=50)
    V_2d = [V_morse2d(r1, r2) for r2 in r2_range, r1 in r1_range]

    p_pes = contour(r1_range, r2_range, V_2d,
        xlabel="r₁ (Å)", ylabel="r₂ (Å)",
        title="Potential Energy Surface V(r₁, r₂)",
        levels=20,
        aspect_ratio=:equal,
        colorbar=true,
        size=(600, 500))

    # Mark equilibrium
    scatter!(p_pes, [re], [re], markersize=12, color=:red,
        label="Equilibrium ($(re), $(re))")

    # Gradient at a displaced point
    r1_disp = 1.3
    r2_disp = 0.8
    # Numerical gradient
    h = 0.01
    grad_r1 = (V_morse2d(r1_disp+h, r2_disp) - V_morse2d(r1_disp-h, r2_disp))/(2h)
    grad_r2 = (V_morse2d(r1_disp, r2_disp+h) - V_morse2d(r1_disp, r2_disp-h))/(2h)

    scatter!(p_pes, [r1_disp], [r2_disp], markersize=8, color=:blue, label="")

    # Force = -∇V
    scale = 0.05
    quiver!(p_pes, [r1_disp], [r2_disp], quiver=([-scale*grad_r1], [-scale*grad_r2]),
        color=:green, linewidth=3, label="Force (-∇V)")

    p_pes
end

# ╔═╡ a1000015-0001-0001-0001-000000000028
md"""
**At equilibrium (r₁ = r₂ = rₑ):**
- ∂V/∂r₁ = 0 and ∂V/∂r₂ = 0 (forces are zero)
- The Hessian is positive definite (stable minimum)

**Away from equilibrium:**
- Force **F** = -∇V pushes toward the minimum
- Green arrow shows force direction
"""

# ╔═╡ a1000015-0001-0001-0001-000000000029
md"""
---
## Total Differential

When both x and y change:

$df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy$

This is the basis of **error propagation** in chemistry!
"""

# ╔═╡ a1000015-0001-0001-0001-000000000030
md"""
### Example: Error in Cylinder Volume

V = πr²h

If r = 2.0 ± 0.1 cm and h = 5.0 ± 0.2 cm:
"""

# ╔═╡ a1000015-0001-0001-0001-000000000031
begin
    r_cyl = 2.0
    h_cyl = 5.0
    δr = 0.1
    δh = 0.2

    V_cyl = π * r_cyl^2 * h_cyl

    # Partials
    dV_dr = 2π * r_cyl * h_cyl
    dV_dh = π * r_cyl^2

    # Error propagation (independent errors)
    δV = sqrt((dV_dr * δr)^2 + (dV_dh * δh)^2)

    Markdown.parse("""
    **Partial derivatives:**
    - ∂V/∂r = 2πrh = $(round(dV_dr, digits=2)) cm²
    - ∂V/∂h = πr² = $(round(dV_dh, digits=2)) cm²

    **Error propagation:**
    \$\\delta V = \\sqrt{\\left(\\frac{\\partial V}{\\partial r}\\right)^2 \\delta r^2 + \\left(\\frac{\\partial V}{\\partial h}\\right)^2 \\delta h^2}\$

    \$\\delta V = \\sqrt{($(round(dV_dr, digits=1)))^2 (0.1)^2 + ($(round(dV_dh, digits=1)))^2 (0.2)^2} = $(round(δV, digits=1)) \\text{ cm}^3\$

    **Result: V = $(round(V_cyl, digits=1)) ± $(round(δV, digits=1)) cm³** ($(round(100*δV/V_cyl, digits=1))% uncertainty)
    """)
end

# ╔═╡ a1000015-0001-0001-0001-000000000032
md"""
---
## Summary

| Concept | Key Point |
|:--------|:----------|
| ∂f/∂x | Differentiate treating other variables as constants |
| Gradient ∇f | Points in direction of steepest ascent |
| Force | **F** = -∇V (down the potential) |
| Critical points | Where ∇f = **0** |
| Hessian | Matrix of second partials; eigenvalues classify critical points |
| Total differential | df = (∂f/∂x)dx + (∂f/∂y)dy |
"""

# ╔═╡ a1000015-0001-0001-0001-000000000033
md"""
---
## Exercises

1. Find ∂f/∂x and ∂f/∂y for f(x,y) = x²eʸ + sin(xy).

2. Find and classify the critical point of f(x,y) = x² + xy + y² - 3x.

3. For P = nRT/V, verify the cyclic rule: (∂P/∂T)(∂T/∂V)(∂V/∂P) = -1.

4. If f = x²y³, find the direction of steepest increase at (1, 2).
"""

# ╔═╡ a1000015-0001-0001-0001-000000000034
md"""
---
## Next: Lecture 16

**The Kinetics Problem**

Rate laws, reaction orders, and differential equations.
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
LinearAlgebra = "37e2e46d-f89d-539d-b4ee-838fcccc9c8e"
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
# ╠═a1000015-0001-0001-0001-000000000001
# ╟─a1000015-0001-0001-0001-000000000002
# ╟─a1000015-0001-0001-0001-000000000003
# ╟─a1000015-0001-0001-0001-000000000004
# ╟─a1000015-0001-0001-0001-000000000005
# ╟─a1000015-0001-0001-0001-000000000006
# ╟─a1000015-0001-0001-0001-000000000007
# ╟─a1000015-0001-0001-0001-000000000008
# ╟─a1000015-0001-0001-0001-000000000009
# ╟─a1000015-0001-0001-0001-000000000010
# ╟─a1000015-0001-0001-0001-000000000011
# ╟─a1000015-0001-0001-0001-000000000012
# ╟─a1000015-0001-0001-0001-000000000013
# ╟─a1000015-0001-0001-0001-000000000014
# ╟─a1000015-0001-0001-0001-000000000015
# ╟─a1000015-0001-0001-0001-000000000016
# ╟─a1000015-0001-0001-0001-000000000017
# ╟─a1000015-0001-0001-0001-000000000018
# ╟─a1000015-0001-0001-0001-000000000019
# ╟─a1000015-0001-0001-0001-000000000020
# ╟─a1000015-0001-0001-0001-000000000021
# ╟─a1000015-0001-0001-0001-000000000022
# ╟─a1000015-0001-0001-0001-000000000023
# ╟─a1000015-0001-0001-0001-000000000024
# ╟─a1000015-0001-0001-0001-000000000025
# ╟─a1000015-0001-0001-0001-000000000026
# ╟─a1000015-0001-0001-0001-000000000027
# ╟─a1000015-0001-0001-0001-000000000028
# ╟─a1000015-0001-0001-0001-000000000029
# ╟─a1000015-0001-0001-0001-000000000030
# ╟─a1000015-0001-0001-0001-000000000031
# ╟─a1000015-0001-0001-0001-000000000032
# ╟─a1000015-0001-0001-0001-000000000033
# ╟─a1000015-0001-0001-0001-000000000034
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
