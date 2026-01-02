### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000021-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000021-0001-0001-0001-000000000002
md"""
# Lecture 21: Distributions

*How probability spreads across states — Boltzmann, Gaussian, Maxwell-Boltzmann.*

---

## SPREAD: The Shape of Uncertainty

A distribution tells you what values are possible and how likely each is.
"""

# ╔═╡ a1000021-0001-0001-0001-000000000003
md"""
---
## The Boltzmann Distribution

$P_i = \frac{e^{-E_i/k_BT}}{Z}$

At thermal equilibrium, lower energy states are more probable.
"""

# ╔═╡ a1000021-0001-0001-0001-000000000004
md"""
### Two-Level System

Ground state (E = 0) and excited state (E = ε).
"""

# ╔═╡ a1000021-0001-0001-0001-000000000005
md"""
**Energy gap ε (cm⁻¹):**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000006
@bind ε_2level Slider(100:100:2000, default=500, show_value=true)

# ╔═╡ a1000021-0001-0001-0001-000000000007
begin
    # k_B in cm⁻¹/K
    kB_cm = 0.695  # cm⁻¹/K

    T_range = 100:10:2000

    P1_2level(T) = exp(-ε_2level / (kB_cm * T)) / (1 + exp(-ε_2level / (kB_cm * T)))
    P0_2level(T) = 1 - P1_2level(T)

    p_2level = plot(T_range, P0_2level.(T_range),
        xlabel="Temperature (K)", ylabel="Population",
        title="Two-Level System: ε = $(ε_2level) cm⁻¹",
        linewidth=3, color=:blue,
        label="P₀ (ground)",
        legend=:right,
        ylim=(0, 1),
        size=(700, 450))

    plot!(p_2level, T_range, P1_2level.(T_range),
        linewidth=3, color=:red,
        label="P₁ (excited)")

    # Mark where kT = ε
    T_equal = ε_2level / kB_cm
    if T_equal < 2000
        vline!(p_2level, [T_equal], color=:gray, linestyle=:dash,
            label="k_BT = ε (T = $(round(Int, T_equal)) K)")
    end

    hline!(p_2level, [0.5], color=:gray, linestyle=:dot, label="")

    p_2level
end

# ╔═╡ a1000021-0001-0001-0001-000000000008
md"""
### Key Observations

- **Low T:** Almost all population in ground state
- **k_BT = ε:** P₁/P₀ = e⁻¹ ≈ 0.37
- **High T:** Populations approach equality (50-50)
- **Never inverted:** Ground state always has more population at equilibrium

Current at T = 300 K: P₀ = $(round(P0_2level(300), digits=3)), P₁ = $(round(P1_2level(300), digits=3))
"""

# ╔═╡ a1000021-0001-0001-0001-000000000009
md"""
---
## The Maxwell-Boltzmann Speed Distribution

$f(v) = 4\pi \left(\frac{m}{2\pi k_BT}\right)^{3/2} v^2 e^{-mv^2/(2k_BT)}$
"""

# ╔═╡ a1000021-0001-0001-0001-000000000010
md"""
**Temperature (K):**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000011
@bind T_MB Slider(100:100:1000, default=300, show_value=true)

# ╔═╡ a1000021-0001-0001-0001-000000000012
md"""
**Molecule:**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000013
@bind molecule Select([
    "H2" => "H₂ (M = 2)",
    "N2" => "N₂ (M = 28)",
    "O2" => "O₂ (M = 32)",
    "Ar" => "Ar (M = 40)",
    "CO2" => "CO₂ (M = 44)"
])

# ╔═╡ a1000021-0001-0001-0001-000000000014
begin
    # Molar masses in kg/mol
    M_dict = Dict("H2" => 0.002, "N2" => 0.028, "O2" => 0.032, "Ar" => 0.040, "CO2" => 0.044)
    M_mol = M_dict[molecule]

    R = 8.314  # J/(mol·K)

    # Characteristic speeds
    v_mp = sqrt(2 * R * T_MB / M_mol)
    v_mean = sqrt(8 * R * T_MB / (π * M_mol))
    v_rms = sqrt(3 * R * T_MB / M_mol)

    # Maxwell-Boltzmann distribution
    function f_MB(v, T, M)
        a = M / (2 * R * T)
        return 4π * (a / π)^1.5 * v^2 * exp(-a * v^2)
    end

    v_range = range(0, 2000, length=300)
    f_values = [f_MB(v, T_MB, M_mol) for v in v_range]

    p_MB = plot(v_range, f_values .* 1000,  # Scale for visibility
        xlabel="Speed (m/s)", ylabel="f(v) (arbitrary units)",
        title="Maxwell-Boltzmann: $(molecule) at $(T_MB) K",
        linewidth=3, color=:purple,
        fill=true, fillalpha=0.3,
        label="f(v)",
        legend=:topright,
        size=(700, 450))

    # Mark characteristic speeds
    vline!(p_MB, [v_mp], color=:red, linewidth=2, linestyle=:dash,
        label="v_mp = $(round(Int, v_mp)) m/s")
    vline!(p_MB, [v_mean], color=:green, linewidth=2, linestyle=:dash,
        label="⟨v⟩ = $(round(Int, v_mean)) m/s")
    vline!(p_MB, [v_rms], color=:blue, linewidth=2, linestyle=:dash,
        label="v_rms = $(round(Int, v_rms)) m/s")

    p_MB
end

# ╔═╡ a1000021-0001-0001-0001-000000000015
md"""
### Characteristic Speeds

| Speed | Formula | Value |
|:------|:--------|:------|
| Most probable | v_mp = √(2RT/M) | $(round(Int, v_mp)) m/s |
| Mean | ⟨v⟩ = √(8RT/πM) | $(round(Int, v_mean)) m/s |
| RMS | v_rms = √(3RT/M) | $(round(Int, v_rms)) m/s |

**Order:** v_mp < ⟨v⟩ < v_rms (always!)

**The v² factor:** More ways to have high speed than low (surface area of velocity sphere).
"""

# ╔═╡ a1000021-0001-0001-0001-000000000016
md"""
---
## The Gaussian Distribution

$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-(x-\mu)^2/(2\sigma^2)}$
"""

# ╔═╡ a1000021-0001-0001-0001-000000000017
md"""
**Mean μ:**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000018
@bind μ_gauss Slider(-3:0.5:3, default=0, show_value=true)

# ╔═╡ a1000021-0001-0001-0001-000000000019
md"""
**Standard deviation σ:**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000020
@bind σ_gauss Slider(0.3:0.1:2, default=1, show_value=true)

# ╔═╡ a1000021-0001-0001-0001-000000000021
begin
    x_gauss = range(-6, 6, length=300)

    f_gauss(x, μ, σ) = exp(-(x - μ)^2 / (2σ^2)) / (σ * sqrt(2π))

    p_gauss = plot(x_gauss, f_gauss.(x_gauss, μ_gauss, σ_gauss),
        xlabel="x", ylabel="f(x)",
        title="Gaussian: μ = $(μ_gauss), σ = $(σ_gauss)",
        linewidth=3, color=:teal,
        fill=true, fillalpha=0.3,
        label="N($(μ_gauss), $(σ_gauss)²)",
        legend=:topright,
        ylim=(0, 1.5),
        size=(700, 450))

    # Mark μ ± σ, μ ± 2σ
    vline!(p_gauss, [μ_gauss], color=:red, linewidth=2, label="μ")
    vline!(p_gauss, [μ_gauss - σ_gauss, μ_gauss + σ_gauss],
        color=:orange, linestyle=:dash, label="μ ± σ (68%)")
    vline!(p_gauss, [μ_gauss - 2σ_gauss, μ_gauss + 2σ_gauss],
        color=:green, linestyle=:dot, label="μ ± 2σ (95%)")

    p_gauss
end

# ╔═╡ a1000021-0001-0001-0001-000000000022
md"""
### The 68-95-99.7 Rule

| Range | Probability |
|:------|:------------|
| μ ± 1σ | 68.3% |
| μ ± 2σ | 95.4% |
| μ ± 3σ | 99.7% |

**Why so common?** Central Limit Theorem: sum of many independent variables → Gaussian.
"""

# ╔═╡ a1000021-0001-0001-0001-000000000023
md"""
---
## Rotational Population Distribution

$P_J \propto (2J+1) e^{-BJ(J+1)/k_BT}$

The degeneracy factor (2J+1) causes the peak at J > 0!
"""

# ╔═╡ a1000021-0001-0001-0001-000000000024
md"""
**Rotational constant B (cm⁻¹):**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000025
@bind B_rot Slider(0.5:0.5:10, default=2, show_value=true)

# ╔═╡ a1000021-0001-0001-0001-000000000026
md"""
**Temperature (K):**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000027
@bind T_rot Slider(100:100:1000, default=300, show_value=true)

# ╔═╡ a1000021-0001-0001-0001-000000000028
begin
    kBT_rot = kB_cm * T_rot  # in cm⁻¹

    J_range = 0:30

    # Unnormalized populations
    pop_J(J) = (2J + 1) * exp(-B_rot * J * (J + 1) / kBT_rot)
    pops = pop_J.(J_range)

    # Normalize
    Z_rot = sum(pops)
    pops_norm = pops ./ Z_rot

    # Most probable J
    J_mp = round(Int, sqrt(kBT_rot / (2B_rot)) - 0.5)
    J_mp = max(0, J_mp)

    p_rot = bar(J_range, pops_norm .* 100,
        xlabel="J", ylabel="Population (%)",
        title="Rotational Distribution: B = $(B_rot) cm⁻¹, T = $(T_rot) K",
        legend=false,
        bar_width=0.8,
        color=:teal,
        size=(700, 450))

    # Mark most probable J
    if J_mp <= 30
        vline!(p_rot, [J_mp], color=:red, linewidth=2, linestyle=:dash)
        annotate!(p_rot, [(J_mp + 2, maximum(pops_norm)*100*0.9,
            "J_mp ≈ $(J_mp)")])
    end

    p_rot
end

# ╔═╡ a1000021-0001-0001-0001-000000000029
md"""
### Why J_mp > 0?

The degeneracy (2J+1) increases with J, but the Boltzmann factor decreases.

These compete:
- Low J: low degeneracy but high Boltzmann factor
- High J: high degeneracy but low Boltzmann factor
- **Peak:** where they balance

$J_{mp} \approx \sqrt{\frac{k_BT}{2B}} - \frac{1}{2}$

Higher T or smaller B → peak at higher J.
"""

# ╔═╡ a1000021-0001-0001-0001-000000000030
md"""
---
## Summary: Key Distributions

| Distribution | Formula | Use |
|:-------------|:--------|:----|
| Boltzmann | Pᵢ ∝ gᵢe^(-Eᵢ/kT) | Energy state populations |
| Gaussian | f(x) ∝ e^(-(x-μ)²/2σ²) | Errors, fluctuations |
| Maxwell-Boltzmann | f(v) ∝ v²e^(-mv²/2kT) | Molecular speeds |
| Rotational | P_J ∝ (2J+1)e^(-BJ(J+1)/kT) | Rotational states |
"""

# ╔═╡ a1000021-0001-0001-0001-000000000031
md"""
---
## Exercises

1. For a two-level system with ε = 1000 cm⁻¹, at what T is P₁ = 0.1?

2. Calculate v_mp for O₂ at 500 K.

3. A measurement has μ = 2.50 and σ = 0.05. What range contains 95% of values?

4. For CO (B = 1.93 cm⁻¹), find J_mp at 300 K.
"""

# ╔═╡ a1000021-0001-0001-0001-000000000032
md"""
---
## Solutions

### Exercise 1
P₁ = 0.1 means P₁/P₀ = 0.1/0.9 = e^(-ε/kT)
ln(0.111) = -ε/(kT) → T = -ε/(k × ln(0.111))
T = 1000 / (0.695 × 2.20) = **654 K**

### Exercise 2
v_mp = √(2RT/M) = √(2 × 8.314 × 500 / 0.032) = **510 m/s**

### Exercise 3
95% within μ ± 2σ = 2.50 ± 0.10 = **[2.40, 2.60]**

### Exercise 4
J_mp ≈ √(kT/2B) - 0.5 = √(208/3.86) - 0.5 = √53.9 - 0.5 = 7.3 - 0.5 = **J ≈ 7**
"""

# ╔═╡ a1000021-0001-0001-0001-000000000033
md"""
---
## Next: Lecture 22

**Expectation and Variance**

Summarizing distributions — means, variances, and moments.
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
# ╠═a1000021-0001-0001-0001-000000000001
# ╟─a1000021-0001-0001-0001-000000000002
# ╟─a1000021-0001-0001-0001-000000000003
# ╟─a1000021-0001-0001-0001-000000000004
# ╟─a1000021-0001-0001-0001-000000000005
# ╟─a1000021-0001-0001-0001-000000000006
# ╟─a1000021-0001-0001-0001-000000000007
# ╟─a1000021-0001-0001-0001-000000000008
# ╟─a1000021-0001-0001-0001-000000000009
# ╟─a1000021-0001-0001-0001-000000000010
# ╟─a1000021-0001-0001-0001-000000000011
# ╟─a1000021-0001-0001-0001-000000000012
# ╟─a1000021-0001-0001-0001-000000000013
# ╟─a1000021-0001-0001-0001-000000000014
# ╟─a1000021-0001-0001-0001-000000000015
# ╟─a1000021-0001-0001-0001-000000000016
# ╟─a1000021-0001-0001-0001-000000000017
# ╟─a1000021-0001-0001-0001-000000000018
# ╟─a1000021-0001-0001-0001-000000000019
# ╟─a1000021-0001-0001-0001-000000000020
# ╟─a1000021-0001-0001-0001-000000000021
# ╟─a1000021-0001-0001-0001-000000000022
# ╟─a1000021-0001-0001-0001-000000000023
# ╟─a1000021-0001-0001-0001-000000000024
# ╟─a1000021-0001-0001-0001-000000000025
# ╟─a1000021-0001-0001-0001-000000000026
# ╟─a1000021-0001-0001-0001-000000000027
# ╟─a1000021-0001-0001-0001-000000000028
# ╟─a1000021-0001-0001-0001-000000000029
# ╟─a1000021-0001-0001-0001-000000000030
# ╟─a1000021-0001-0001-0001-000000000031
# ╟─a1000021-0001-0001-0001-000000000032
# ╟─a1000021-0001-0001-0001-000000000033
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
