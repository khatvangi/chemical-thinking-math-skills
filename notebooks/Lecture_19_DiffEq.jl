### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1b2c3d4-5678-9abc-def0-123456789abc
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ b2c3d4e5-6789-abcd-ef01-23456789abcd
md"""
# Lecture 19: Differential Equations

**Primitive:** DYNAMICS — Equations that describe how systems evolve

In chemistry, differential equations are the language of kinetics, quantum mechanics, and transport phenomena. This lecture introduces the main types and solution methods.
"""

# ╔═╡ c3d4e5f6-789a-bcde-f012-3456789abcde
md"""
## Part 1: First-Order Separable Equations

### The Simplest Rate Law: First-Order Decay

When reaction rate depends only on concentration:

$$\frac{d[A]}{dt} = -k[A]$$

This is **separable** — we can put all [A] terms on one side, all t terms on the other.
"""

# ╔═╡ d4e5f6a7-89ab-cdef-0123-456789abcdef
md"""
### Solving by Separation

$$\frac{d[A]}{[A]} = -k\,dt$$

Integrate both sides:
$$\ln[A] - \ln[A]_0 = -kt$$

Therefore:
$$[A](t) = [A]_0 e^{-kt}$$

The exponential is THE solution to first-order decay!
"""

# ╔═╡ e5f6a7b8-9abc-def0-1234-56789abcdef0
@bind decay_params PlutoUI.combine() do Child
    md"""
    **First-Order Decay Parameters:**

    Initial concentration [A]₀: $(Child("A0", Slider(0.5:0.1:2.0, default=1.0, show_value=true))) M

    Rate constant k: $(Child("k", Slider(0.1:0.1:2.0, default=0.5, show_value=true))) s⁻¹
    """
end

# ╔═╡ f6a7b8c9-abcd-ef01-2345-6789abcdef01
let
    A0 = decay_params.A0
    k = decay_params.k
    t = 0:0.05:10
    A = A0 .* exp.(-k .* t)

    half_life = log(2) / k

    p = plot(t, A,
        lw=3,
        color=:blue,
        xlabel="Time (s)",
        ylabel="[A] (M)",
        title="First-Order Decay",
        legend=:topright,
        label="[A](t) = $A0 e^(-$(k)t)",
        ylims=(0, 2.5))

    # Mark half-life
    hline!([A0/2], ls=:dash, color=:gray, label="")
    vline!([half_life], ls=:dash, color=:red, label="t₁/₂ = $(round(half_life, digits=2)) s")
    scatter!([half_life], [A0/2], ms=8, color=:red, label="")

    p
end

# ╔═╡ a7b8c9d0-bcde-f012-3456-789abcdef012
md"""
### Half-Life

The half-life is when $[A] = [A]_0/2$:

$$\frac{[A]_0}{2} = [A]_0 e^{-kt_{1/2}}$$

$$t_{1/2} = \frac{\ln 2}{k} \approx \frac{0.693}{k}$$

**Key insight:** For first-order kinetics, half-life is constant regardless of starting concentration!
"""

# ╔═╡ b8c9d0e1-cdef-0123-4567-89abcdef0123
md"""
## Part 2: First-Order Linear Equations

### Consecutive Reactions: A → B → C

When B is both produced and consumed:

$$\frac{d[B]}{dt} = k_1[A] - k_2[B]$$

This is first-order linear: $\frac{dy}{dt} + P(t)y = Q(t)$
"""

# ╔═╡ c9d0e1f2-def0-1234-5678-9abcdef01234
md"""
### The Integrating Factor Method

For $\frac{dy}{dt} + py = q$ (with constant coefficients):

1. Multiply by integrating factor $\mu = e^{pt}$
2. Left side becomes $\frac{d}{dt}(\mu y)$
3. Integrate: $\mu y = \int \mu q\, dt$

For A → B → C with [A]₀ = [A]₀, [B]₀ = 0:

$$[B](t) = \frac{k_1 [A]_0}{k_2 - k_1}\left(e^{-k_1 t} - e^{-k_2 t}\right)$$
"""

# ╔═╡ d0e1f2a3-ef01-2345-6789-abcdef012345
@bind consec_params PlutoUI.combine() do Child
    md"""
    **Consecutive Reaction A → B → C:**

    Rate constant k₁ (A→B): $(Child("k1", Slider(0.1:0.1:2.0, default=0.5, show_value=true))) s⁻¹

    Rate constant k₂ (B→C): $(Child("k2", Slider(0.1:0.1:2.0, default=0.2, show_value=true))) s⁻¹
    """
end

# ╔═╡ e1f2a3b4-f012-3456-789a-bcdef0123456
let
    k1 = consec_params.k1
    k2 = consec_params.k2
    A0 = 1.0
    t = 0:0.02:15

    # Solutions
    A = A0 .* exp.(-k1 .* t)

    if abs(k2 - k1) > 0.001
        B = (k1 * A0 / (k2 - k1)) .* (exp.(-k1 .* t) .- exp.(-k2 .* t))
    else
        # Degenerate case: k1 ≈ k2
        B = k1 * A0 .* t .* exp.(-k1 .* t)
    end

    C = A0 .- A .- B

    # Find B_max
    if k1 != k2
        t_max = log(k1/k2) / (k1 - k2)
        B_max = (k1 * A0 / (k2 - k1)) * (exp(-k1 * t_max) - exp(-k2 * t_max))
    else
        t_max = 1/k1
        B_max = A0 * exp(-1)
    end

    p = plot(t, A, lw=3, label="[A]", color=:blue)
    plot!(t, B, lw=3, label="[B] (intermediate)", color=:green)
    plot!(t, C, lw=3, label="[C]", color=:red)

    if t_max > 0 && t_max < 15
        scatter!([t_max], [B_max], ms=8, color=:green, label="B_max at t=$(round(t_max, digits=2))s")
    end

    plot!(xlabel="Time (s)", ylabel="Concentration (M)",
          title="Consecutive Reactions: A → B → C",
          legend=:right)
end

# ╔═╡ f2a3b4c5-0123-4567-89ab-cdef01234567
md"""
### Maximum Intermediate Concentration

The intermediate B reaches maximum when $\frac{d[B]}{dt} = 0$:

$$t_{max} = \frac{\ln(k_1/k_2)}{k_1 - k_2}$$

This is crucial for:
- Selecting reaction intermediates
- Designing synthesis routes
- Understanding metabolic pathways
"""

# ╔═╡ a3b4c5d6-1234-5678-9abc-def012345678
md"""
## Part 3: Second-Order Constant Coefficient Equations

### The Harmonic Oscillator

Vibrating molecules follow:

$$m\frac{d^2x}{dt^2} = -kx$$

Or in standard form: $\frac{d^2x}{dt^2} + \omega^2 x = 0$ where $\omega = \sqrt{k/m}$
"""

# ╔═╡ b4c5d6e7-2345-6789-abcd-ef0123456789
md"""
### Characteristic Equation Method

For $\frac{d^2y}{dt^2} + b\frac{dy}{dt} + cy = 0$:

1. Assume $y = e^{rt}$
2. Substitute: $r^2 + br + c = 0$ (characteristic equation)
3. Solve for r

**Cases:**
- Two real roots: $y = c_1 e^{r_1 t} + c_2 e^{r_2 t}$ (overdamped)
- One repeated root: $y = (c_1 + c_2 t)e^{rt}$ (critically damped)
- Complex roots $r = \alpha \pm i\beta$: $y = e^{\alpha t}(c_1 \cos\beta t + c_2 \sin\beta t)$ (underdamped/oscillating)
"""

# ╔═╡ c5d6e7f8-3456-789a-bcde-f01234567890
@bind damping_params PlutoUI.combine() do Child
    md"""
    **Damped Harmonic Oscillator:**

    Natural frequency ω₀: $(Child("omega0", Slider(0.5:0.1:3.0, default=2.0, show_value=true))) rad/s

    Damping coefficient γ: $(Child("gamma", Slider(0.0:0.1:5.0, default=0.5, show_value=true))) s⁻¹
    """
end

# ╔═╡ d6e7f8a9-4567-89ab-cdef-012345678901
let
    ω0 = damping_params.omega0
    γ = damping_params.gamma
    t = 0:0.02:15
    x0, v0 = 1.0, 0.0

    discriminant = γ^2 - 4*ω0^2

    if discriminant < -1e-10
        # Underdamped (oscillatory)
        ω = sqrt(ω0^2 - (γ/2)^2)
        x = exp.(-γ/2 .* t) .* (x0 .* cos.(ω .* t) .+ (v0 + γ/2*x0)/ω .* sin.(ω .* t))
        regime = "Underdamped (oscillatory)"
        color = :blue
    elseif discriminant > 1e-10
        # Overdamped
        r1 = (-γ + sqrt(discriminant)) / 2
        r2 = (-γ - sqrt(discriminant)) / 2
        c1 = (v0 - r2*x0) / (r1 - r2)
        c2 = x0 - c1
        x = c1 .* exp.(r1 .* t) .+ c2 .* exp.(r2 .* t)
        regime = "Overdamped (no oscillation)"
        color = :red
    else
        # Critically damped
        r = -γ/2
        x = (x0 .+ (v0 - r*x0) .* t) .* exp.(r .* t)
        regime = "Critically damped (fastest decay)"
        color = :green
    end

    # Envelope for underdamped
    envelope_upper = x0 .* exp.(-γ/2 .* t)
    envelope_lower = -x0 .* exp.(-γ/2 .* t)

    p = plot(t, x, lw=3, color=color, label=regime,
             xlabel="Time (s)", ylabel="Displacement",
             title="Damped Oscillator: γ²/4 vs ω₀² = $(round(γ^2/4, digits=2)) vs $(round(ω0^2, digits=2))",
             ylims=(-1.5, 1.5))

    if discriminant < -1e-10
        plot!(t, envelope_upper, ls=:dash, color=:gray, label="Envelope")
        plot!(t, envelope_lower, ls=:dash, color=:gray, label="")
    end

    hline!([0], color=:black, lw=0.5, label="")
    p
end

# ╔═╡ e7f8a9b0-5678-9abc-def0-123456789012
md"""
### The Three Damping Regimes

| Regime | Condition | Behavior | Chemistry Example |
|--------|-----------|----------|-------------------|
| Underdamped | γ² < 4ω₀² | Oscillates with decay | Bond vibration in spectroscopy |
| Critically damped | γ² = 4ω₀² | Fastest non-oscillating decay | Shock absorbers |
| Overdamped | γ² > 4ω₀² | Slow exponential decay | Diffusion-limited processes |
"""

# ╔═╡ f8a9b0c1-6789-abcd-ef01-23456789abcd
md"""
## Part 4: The Schrödinger Equation

### Particle in a Box

The time-independent Schrödinger equation:

$$-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2} = E\psi$$

With boundary conditions $\psi(0) = \psi(L) = 0$
"""

# ╔═╡ a9b0c1d2-789a-bcde-f012-3456789abcde
md"""
### Solutions: Standing Waves

$$\psi_n(x) = \sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right)$$

$$E_n = \frac{n^2\pi^2\hbar^2}{2mL^2} = \frac{n^2 h^2}{8mL^2}$$

**Key insight:** Boundary conditions quantize the energy!
"""

# ╔═╡ b0c1d2e3-89ab-cdef-0123-456789abcdef
@bind quantum_n Slider(1:8, default=1, show_value=true)

# ╔═╡ c1d2e3f4-9abc-def0-1234-56789abcdef0
let
    L = 1.0
    x = 0:0.01:L
    n = quantum_n

    # Wavefunction (normalized)
    ψ = sqrt(2/L) .* sin.(n * π .* x ./ L)

    # Probability density
    ψ² = ψ.^2

    # Energy (in units of h²/8mL²)
    E = n^2

    p1 = plot(x, ψ, lw=3, color=:blue,
              fill=0, alpha=0.3,
              xlabel="Position x", ylabel="ψₙ(x)",
              title="Wavefunction: n = $n",
              legend=false)
    hline!([0], color=:black, lw=0.5)

    p2 = plot(x, ψ², lw=3, color=:purple,
              fill=0, alpha=0.3,
              xlabel="Position x", ylabel="|ψₙ(x)|²",
              title="Probability Density (E = $(n)² h²/8mL²)",
              legend=false)

    plot(p1, p2, layout=(1,2), size=(700, 300))
end

# ╔═╡ d2e3f4a5-abcd-ef01-2345-6789abcdef01
md"""
Notice:
- **n = 1:** One antinode, no internal nodes
- **n = 2:** Two antinodes, one node at center
- **n = n:** n antinodes, (n-1) internal nodes

Each node is where the electron has zero probability!
"""

# ╔═╡ e3f4a5b6-bcde-f012-3456-789abcdef012
md"""
## Part 5: Numerical Methods — Euler's Method

When analytical solutions don't exist, we compute numerically.

### The Euler Algorithm

For $\frac{dy}{dt} = f(t, y)$:

$$y_{n+1} = y_n + h \cdot f(t_n, y_n)$$

where $h$ is the step size.
"""

# ╔═╡ f4a5b6c7-cdef-0123-4567-89abcdef0123
function euler_method(f, y0, t_span, h)
    t = collect(t_span[1]:h:t_span[2])
    y = zeros(length(t))
    y[1] = y0

    for i in 1:(length(t)-1)
        y[i+1] = y[i] + h * f(t[i], y[i])
    end

    return t, y
end

# ╔═╡ a5b6c7d8-def0-1234-5678-9abcdef01234
@bind euler_h Slider(0.05:0.05:1.0, default=0.5, show_value=true)

# ╔═╡ b6c7d8e9-ef01-2345-6789-abcdef012345
let
    # First-order decay: dy/dt = -0.5y
    k = 0.5
    f(t, y) = -k * y
    y0 = 1.0
    t_span = (0.0, 10.0)

    # Euler approximation
    t_euler, y_euler = euler_method(f, y0, t_span, euler_h)

    # Exact solution
    t_exact = 0:0.01:10
    y_exact = y0 .* exp.(-k .* t_exact)

    # Calculate error at final time
    y_euler_final = y_euler[end]
    y_exact_final = exp(-k * 10)
    error = abs(y_euler_final - y_exact_final)

    p = plot(t_exact, y_exact, lw=3, color=:blue, label="Exact: e^(-0.5t)",
             xlabel="Time", ylabel="y(t)",
             title="Euler's Method (step size h = $(euler_h))")

    scatter!(t_euler, y_euler, ms=4, color=:red, label="Euler approximation")
    plot!(t_euler, y_euler, lw=1, color=:red, alpha=0.5, label="")

    annotate!(8, 0.8, text("Error at t=10: $(round(error, digits=4))", 10, :left))

    p
end

# ╔═╡ c7d8e9f0-f012-3456-789a-bcdef0123456
md"""
### Euler's Method: Accuracy vs Step Size

| Step Size h | Error (approximate) |
|-------------|---------------------|
| 1.0 | Large |
| 0.5 | Moderate |
| 0.1 | Small |
| 0.01 | Very small |

The error is approximately **O(h)** — halving h halves the error.

For better accuracy, use:
- **Runge-Kutta methods** (O(h⁴))
- **Adaptive step size** methods
"""

# ╔═╡ d8e9f0a1-0123-4567-89ab-cdef01234567
md"""
## Summary: The Differential Equations Toolkit

| Type | Form | Solution Method | Chemistry Example |
|------|------|-----------------|-------------------|
| 1st order separable | dy/dt = f(y)g(t) | Separate, integrate | Radioactive decay |
| 1st order linear | dy/dt + py = q | Integrating factor | Consecutive reactions |
| 2nd order const coef | y'' + by' + cy = 0 | Characteristic equation | Harmonic oscillator |
| Boundary value | y'' + λy = 0, BCs | Eigenvalue problem | Quantum mechanics |
| General | dy/dt = f(t,y) | Numerical (Euler, RK4) | Complex kinetics |
"""

# ╔═╡ e9f0a1b2-1234-5678-9abc-def012345678
md"""
## Key Takeaways

1. **First-order decay** → Exponential solutions → Ubiquitous in kinetics
2. **Consecutive reactions** → Intermediates with maximum → Synthesis design
3. **Second-order** → Oscillations vs exponentials → Damping determines behavior
4. **Boundary conditions** → Quantization → Quantum chemistry foundation
5. **Numerical methods** → When analysis fails → Computational chemistry
"""

# ╔═╡ f0a1b2c3-2345-6789-abcd-ef0123456789
md"""
---
*Lecture 19 | DYNAMICS Primitive | Chemical Thinking*
"""

# ╔═╡ Cell order:
# ╟─a1b2c3d4-5678-9abc-def0-123456789abc
# ╟─b2c3d4e5-6789-abcd-ef01-23456789abcd
# ╟─c3d4e5f6-789a-bcde-f012-3456789abcde
# ╟─d4e5f6a7-89ab-cdef-0123-456789abcdef
# ╟─e5f6a7b8-9abc-def0-1234-56789abcdef0
# ╟─f6a7b8c9-abcd-ef01-2345-6789abcdef01
# ╟─a7b8c9d0-bcde-f012-3456-789abcdef012
# ╟─b8c9d0e1-cdef-0123-4567-89abcdef0123
# ╟─c9d0e1f2-def0-1234-5678-9abcdef01234
# ╟─d0e1f2a3-ef01-2345-6789-abcdef012345
# ╟─e1f2a3b4-f012-3456-789a-bcdef0123456
# ╟─f2a3b4c5-0123-4567-89ab-cdef01234567
# ╟─a3b4c5d6-1234-5678-9abc-def012345678
# ╟─b4c5d6e7-2345-6789-abcd-ef0123456789
# ╟─c5d6e7f8-3456-789a-bcde-f01234567890
# ╟─d6e7f8a9-4567-89ab-cdef-012345678901
# ╟─e7f8a9b0-5678-9abc-def0-123456789012
# ╟─f8a9b0c1-6789-abcd-ef01-23456789abcd
# ╟─a9b0c1d2-789a-bcde-f012-3456789abcde
# ╟─b0c1d2e3-89ab-cdef-0123-456789abcdef
# ╟─c1d2e3f4-9abc-def0-1234-56789abcdef0
# ╟─d2e3f4a5-abcd-ef01-2345-6789abcdef01
# ╟─e3f4a5b6-bcde-f012-3456-789abcdef012
# ╟─f4a5b6c7-cdef-0123-4567-89abcdef0123
# ╟─a5b6c7d8-def0-1234-5678-9abcdef01234
# ╟─b6c7d8e9-ef01-2345-6789-abcdef012345
# ╟─c7d8e9f0-f012-3456-789a-bcdef0123456
# ╟─d8e9f0a1-0123-4567-89ab-cdef01234567
# ╟─e9f0a1b2-1234-5678-9abc-def012345678
# ╟─f0a1b2c3-2345-6789-abcd-ef0123456789
