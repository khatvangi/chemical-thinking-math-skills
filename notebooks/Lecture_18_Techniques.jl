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

# ╔═╡ a1000018-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000018-0001-0001-0001-000000000002
md"""
# Lecture 18: Integration Techniques

*The toolkit for harder integrals.*

---

## When Simple Substitution Fails

Sometimes the integrand is a product of "different types" of functions, or a complicated rational function. We need more powerful techniques.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000003
md"""
---
## Integration by Parts

$\int u \, dv = uv - \int v \, du$

Use when the integrand is a product of different types.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000004
md"""
### The LIATE Rule

Choose **u** (to differentiate) in this order of priority:

**L**ogarithmic → **I**nverse trig → **A**lgebraic → **T**rig → **E**xponential

The function earlier in LIATE becomes u.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000005
md"""
### Example: ∫ x eˣ dx

- x is **A**lgebraic
- eˣ is **E**xponential
- A comes before E → **u = x**
"""

# ╔═╡ a1000018-0001-0001-0001-000000000006
@bind show_byparts_steps CheckBox(default=false)

# ╔═╡ a1000018-0001-0001-0001-000000000007
begin
    byparts_md = md"""
    **Setting up:**

    | u = x | dv = eˣ dx |
    |:------|:-----------|
    | du = dx | v = eˣ |

    **Apply formula:**

    $\int x e^x dx = x \cdot e^x - \int e^x \cdot dx = xe^x - e^x + C$

    **Simplify:**

    $= e^x(x - 1) + C$
    """

    if show_byparts_steps
        byparts_md
    else
        md"*Check box above to see solution steps*"
    end
end

# ╔═╡ a1000018-0001-0001-0001-000000000008
begin
    x_bp = range(-2, 3, length=200)

    # Integrand and antiderivative
    f_bp(x) = x * exp(x)
    F_bp(x) = exp(x) * (x - 1)

    p_bp = plot(layout=(2,1), size=(700, 450))

    plot!(p_bp[1], x_bp, f_bp.(x_bp),
        ylabel="f(x)",
        title="Integration by Parts: ∫ xeˣ dx = eˣ(x-1) + C",
        linewidth=3, color=:blue,
        label="f(x) = xeˣ",
        ylim=(-5, 20))

    plot!(p_bp[2], x_bp, F_bp.(x_bp),
        xlabel="x", ylabel="F(x)",
        linewidth=3, color=:green,
        label="F(x) = eˣ(x-1)",
        ylim=(-5, 20))

    p_bp
end

# ╔═╡ a1000018-0001-0001-0001-000000000009
md"""
### Tabular Method (for repeated by parts)

When differentiating u eventually gives 0 (polynomials), use a table.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000010
md"""
**Example:** ∫ x³ eˣ dx

| Derivatives (u) | Integrals (dv) | Sign |
|:----------------|:---------------|:-----|
| x³ | eˣ | + |
| 3x² | eˣ | − |
| 6x | eˣ | + |
| 6 | eˣ | − |
| 0 | eˣ | + |

**Result:** eˣ(x³ − 3x² + 6x − 6) + C

*Multiply diagonally, alternating signs!*
"""

# ╔═╡ a1000018-0001-0001-0001-000000000011
md"""
---
## Partial Fractions

For rational functions P(x)/Q(x), decompose into simpler fractions.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000012
md"""
### Case 1: Distinct Linear Factors

$\frac{1}{(x-a)(x-b)} = \frac{A}{x-a} + \frac{B}{x-b}$
"""

# ╔═╡ a1000018-0001-0001-0001-000000000013
md"""
**Roots of denominator:**
"""

# ╔═╡ a1000018-0001-0001-0001-000000000014
@bind root_a Slider(-3:1:0, default=-1, show_value=true)

# ╔═╡ a1000018-0001-0001-0001-000000000015
@bind root_b Slider(1:1:4, default=2, show_value=true)

# ╔═╡ a1000018-0001-0001-0001-000000000016
begin
    # 1/((x-a)(x-b)) = A/(x-a) + B/(x-b)
    # 1 = A(x-b) + B(x-a)
    # At x=a: 1 = A(a-b) → A = 1/(a-b)
    # At x=b: 1 = B(b-a) → B = 1/(b-a) = -1/(a-b)

    A_pf = 1 / (root_a - root_b)
    B_pf = 1 / (root_b - root_a)

    md"""
    ### Decomposition of 1/((x - $(root_a))(x - $(root_b)))

    **Solve for A and B:**

    $\frac{1}{(x - $(root_a))(x - $(root_b))} = \frac{A}{x - $(root_a)} + \frac{B}{x - $(root_b)}$

    Multiply through: 1 = A(x - $(root_b)) + B(x - $(root_a))

    - Set x = $(root_a): 1 = A($(root_a - root_b)) → A = $(round(A_pf, digits=3))
    - Set x = $(root_b): 1 = B($(root_b - root_a)) → B = $(round(B_pf, digits=3))

    **Result:**

    $\frac{1}{(x - $(root_a))(x - $(root_b))} = \frac{$(round(A_pf, digits=3))}{x - $(root_a)} + \frac{$(round(B_pf, digits=3))}{x - $(root_b)}$

    **Integral:**

    $\int = $(round(A_pf, digits=3))\ln|x - $(root_a)| + $(round(B_pf, digits=3))\ln|x - $(root_b)| + C$
    """
end

# ╔═╡ a1000018-0001-0001-0001-000000000017
begin
    # Plot original vs decomposition
    x_pf = range(root_a + 0.5, root_b - 0.5, length=100)

    original_pf(x) = 1 / ((x - root_a) * (x - root_b))
    decomp_pf(x) = A_pf / (x - root_a) + B_pf / (x - root_b)

    p_pf = plot(x_pf, original_pf.(x_pf),
        xlabel="x", ylabel="y",
        title="Partial Fractions Decomposition",
        linewidth=3, color=:blue,
        label="1/((x-$(root_a))(x-$(root_b)))",
        legend=:top,
        size=(650, 400))

    plot!(p_pf, x_pf, decomp_pf.(x_pf),
        linewidth=2, color=:red, linestyle=:dash,
        label="$(round(A_pf,digits=2))/(x-$(root_a)) + $(round(B_pf,digits=2))/(x-$(root_b))")

    p_pf
end

# ╔═╡ a1000018-0001-0001-0001-000000000018
md"""
*(The curves overlap perfectly — they're the same function!)*
"""

# ╔═╡ a1000018-0001-0001-0001-000000000019
md"""
---
## Trigonometric Substitution

For integrands with √(a² - x²), √(a² + x²), or √(x² - a²).
"""

# ╔═╡ a1000018-0001-0001-0001-000000000020
md"""
### Geometric Interpretation

The substitutions come from right triangle relationships.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000021
@bind trig_case Select([
    "a2-x2" => "√(a² - x²): x = a sin θ",
    "a2+x2" => "√(a² + x²): x = a tan θ",
    "x2-a2" => "√(x² - a²): x = a sec θ"
])

# ╔═╡ a1000018-0001-0001-0001-000000000022
begin
    if trig_case == "a2-x2"
        trig_md = md"""
        ### √(a² - x²) with x = a sin θ

        **Right triangle:**
        - Hypotenuse = a
        - Opposite = x = a sin θ
        - Adjacent = √(a² - x²) = a cos θ

        **Substitution gives:**
        - √(a² - x²) = a cos θ
        - dx = a cos θ dθ

        **Example:** ∫ √(1-x²) dx → Area under semicircle!
        """
    elseif trig_case == "a2+x2"
        trig_md = md"""
        ### √(a² + x²) with x = a tan θ

        **Right triangle:**
        - Opposite = x = a tan θ
        - Adjacent = a
        - Hypotenuse = √(a² + x²) = a sec θ

        **Substitution gives:**
        - √(a² + x²) = a sec θ
        - dx = a sec² θ dθ

        **Example:** ∫ 1/(x² + a²) dx → (1/a) arctan(x/a) + C
        """
    else
        trig_md = md"""
        ### √(x² - a²) with x = a sec θ

        **Right triangle:**
        - Hypotenuse = x = a sec θ
        - Adjacent = a
        - Opposite = √(x² - a²) = a tan θ

        **Substitution gives:**
        - √(x² - a²) = a tan θ
        - dx = a sec θ tan θ dθ

        **Used for:** Integrals involving inverse hyperbolic functions
        """
    end

    trig_md
end

# ╔═╡ a1000018-0001-0001-0001-000000000023
md"""
---
## Chemistry Application: Second-Order Kinetics

For 2A → products with rate = k[A]²:

$-\frac{d[A]}{dt} = k[A]^2$

Separate and integrate:

$\int \frac{d[A]}{[A]^2} = -k \int dt$
"""

# ╔═╡ a1000018-0001-0001-0001-000000000024
md"""
**Rate constant k (M⁻¹s⁻¹):**
"""

# ╔═╡ a1000018-0001-0001-0001-000000000025
@bind k_2nd Slider(0.01:0.01:0.1, default=0.05, show_value=true)

# ╔═╡ a1000018-0001-0001-0001-000000000026
begin
    A0_2nd = 1.0  # M

    # Solution: 1/[A] = 1/[A]₀ + kt
    A_2nd(t) = A0_2nd / (1 + k_2nd * A0_2nd * t)

    # First order for comparison
    A_1st(t) = A0_2nd * exp(-k_2nd * t)

    t_2nd = range(0, 100, length=200)

    p_2nd = plot(t_2nd, A_2nd.(t_2nd),
        xlabel="Time (s)", ylabel="[A] (M)",
        title="Second-Order Kinetics: 1/[A] = 1/[A]₀ + kt",
        linewidth=3, color=:blue,
        label="Second order",
        legend=:topright,
        size=(700, 450))

    plot!(p_2nd, t_2nd, A_1st.(t_2nd),
        linewidth=2, color=:red, linestyle=:dash,
        label="First order (comparison)")

    # Mark half-life
    t_half_2nd = 1 / (k_2nd * A0_2nd)
    scatter!(p_2nd, [t_half_2nd], [A0_2nd/2], markersize=10, color=:green,
        label="t₁/₂ = 1/(k[A]₀) = $(round(t_half_2nd, digits=1)) s")

    p_2nd
end

# ╔═╡ a1000018-0001-0001-0001-000000000027
md"""
### Second-Order Solution

$\int_{[A]_0}^{[A]} \frac{d[A]}{[A]^2} = -k \int_0^t dt$

$\left[-\frac{1}{[A]}\right]_{[A]_0}^{[A]} = -kt$

$\frac{1}{[A]} - \frac{1}{[A]_0} = kt$

$[A] = \frac{[A]_0}{1 + kt[A]_0}$

**Half-life:** t₁/₂ = 1/(k[A]₀) — depends on initial concentration!
"""

# ╔═╡ a1000018-0001-0001-0001-000000000028
md"""
---
## Chemistry Application: Gaussian Integrals

The integral ∫ x²e^(-αx²) dx appears in quantum mechanics (expectation values).
"""

# ╔═╡ a1000018-0001-0001-0001-000000000029
md"""
**Parameter α:**
"""

# ╔═╡ a1000018-0001-0001-0001-000000000030
@bind α_gauss2 Slider(0.5:0.5:5, default=1, show_value=true)

# ╔═╡ a1000018-0001-0001-0001-000000000031
begin
    # ∫₀^∞ x² e^(-αx²) dx = (1/4)√(π/α³) = √π/(4α^(3/2))
    gauss_x2_integral = sqrt(π) / (4 * α_gauss2^(3/2))

    x_g2 = range(0, 4, length=200)
    y_g2 = x_g2.^2 .* exp.(-α_gauss2 .* x_g2.^2)

    p_g2 = plot(x_g2, y_g2,
        xlabel="x", ylabel="x²e^(-αx²)",
        title="∫₀^∞ x² e^(-$(α_gauss2)x²) dx = $(round(gauss_x2_integral, digits=4))",
        linewidth=3, color=:purple,
        fill=true, fillalpha=0.3,
        label="x²e^(-$(α_gauss2)x²)",
        legend=:topright,
        size=(650, 400))

    p_g2
end

# ╔═╡ a1000018-0001-0001-0001-000000000032
md"""
### Derivation by Parts

$\int_0^{\infty} x^2 e^{-\alpha x^2} dx = \int_0^{\infty} x \cdot (x e^{-\alpha x^2}) dx$

Let u = x, dv = xe^(-αx²)dx → v = -1/(2α)e^(-αx²)

$= \left[-\frac{x}{2\alpha}e^{-\alpha x^2}\right]_0^{\infty} + \frac{1}{2\alpha}\int_0^{\infty} e^{-\alpha x^2} dx$

Boundary terms vanish. Using ∫e^(-αx²)dx = ½√(π/α):

$= \frac{1}{2\alpha} \cdot \frac{1}{2}\sqrt{\frac{\pi}{\alpha}} = \frac{\sqrt{\pi}}{4\alpha^{3/2}}$
"""

# ╔═╡ a1000018-0001-0001-0001-000000000033
md"""
---
## Summary: Which Technique?

| Integrand | Technique |
|:----------|:----------|
| (polynomial) × (exp, trig) | By parts |
| P(x)/Q(x) | Partial fractions |
| √(a² - x²) | x = a sin θ |
| √(a² + x²) | x = a tan θ |
| sinⁿx cosᵐx | Save one, convert, u-sub |
"""

# ╔═╡ a1000018-0001-0001-0001-000000000034
md"""
---
## Exercises

1. Evaluate ∫ x² cos x dx using tabular method.

2. Decompose 1/(x(x+1)(x+2)) into partial fractions.

3. For second-order kinetics with k = 0.02 M⁻¹s⁻¹ and [A]₀ = 0.5 M, find [A] after 50 s.

4. Evaluate ∫ 1/√(9-x²) dx using trig substitution.
"""

# ╔═╡ a1000018-0001-0001-0001-000000000035
md"""
---
## Next: Lecture 19

**Differential Equations**

Laws of change — solving equations that describe how things evolve.
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
# ╠═a1000018-0001-0001-0001-000000000001
# ╟─a1000018-0001-0001-0001-000000000002
# ╟─a1000018-0001-0001-0001-000000000003
# ╟─a1000018-0001-0001-0001-000000000004
# ╟─a1000018-0001-0001-0001-000000000005
# ╟─a1000018-0001-0001-0001-000000000006
# ╟─a1000018-0001-0001-0001-000000000007
# ╟─a1000018-0001-0001-0001-000000000008
# ╟─a1000018-0001-0001-0001-000000000009
# ╟─a1000018-0001-0001-0001-000000000010
# ╟─a1000018-0001-0001-0001-000000000011
# ╟─a1000018-0001-0001-0001-000000000012
# ╟─a1000018-0001-0001-0001-000000000013
# ╟─a1000018-0001-0001-0001-000000000014
# ╟─a1000018-0001-0001-0001-000000000015
# ╟─a1000018-0001-0001-0001-000000000016
# ╟─a1000018-0001-0001-0001-000000000017
# ╟─a1000018-0001-0001-0001-000000000018
# ╟─a1000018-0001-0001-0001-000000000019
# ╟─a1000018-0001-0001-0001-000000000020
# ╟─a1000018-0001-0001-0001-000000000021
# ╟─a1000018-0001-0001-0001-000000000022
# ╟─a1000018-0001-0001-0001-000000000023
# ╟─a1000018-0001-0001-0001-000000000024
# ╟─a1000018-0001-0001-0001-000000000025
# ╟─a1000018-0001-0001-0001-000000000026
# ╟─a1000018-0001-0001-0001-000000000027
# ╟─a1000018-0001-0001-0001-000000000028
# ╟─a1000018-0001-0001-0001-000000000029
# ╟─a1000018-0001-0001-0001-000000000030
# ╟─a1000018-0001-0001-0001-000000000031
# ╟─a1000018-0001-0001-0001-000000000032
# ╟─a1000018-0001-0001-0001-000000000033
# ╟─a1000018-0001-0001-0001-000000000034
# ╟─a1000018-0001-0001-0001-000000000035
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
