### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000023-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000023-0001-0001-0001-000000000002
md"""
# Lecture 23: Dimensional Analysis and Formula Manipulation

*Units as a reasoning tool — checking, deriving, and transforming equations.*

---

## The Fundamental Principle

**Physical equations must be dimensionally consistent.**

You cannot add meters to seconds. Every term must have the same dimensions.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000003
md"""
---
## Dimension Checker

Enter the dimensions of each side of an equation to verify consistency.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000004
md"""
### Base Dimensions: M (mass), L (length), T (time), Θ (temperature), N (amount)

**Left side exponents:**
"""

# ╔═╡ a1000023-0001-0001-0001-000000000005
md"""
M: $(@bind L_M Slider(-3:1:3, default=1, show_value=true))
L: $(@bind L_L Slider(-3:1:3, default=2, show_value=true))
T: $(@bind L_T Slider(-3:1:3, default=-2, show_value=true))
"""

# ╔═╡ a1000023-0001-0001-0001-000000000006
md"""
**Right side exponents:**
"""

# ╔═╡ a1000023-0001-0001-0001-000000000007
md"""
M: $(@bind R_M Slider(-3:1:3, default=1, show_value=true))
L: $(@bind R_L Slider(-3:1:3, default=2, show_value=true))
T: $(@bind R_T Slider(-3:1:3, default=-2, show_value=true))
"""

# ╔═╡ a1000023-0001-0001-0001-000000000008
begin
    left_dims = "M^$(L_M) L^$(L_L) T^$(L_T)"
    right_dims = "M^$(R_M) L^$(R_L) T^$(R_T)"

    consistent = (L_M == R_M) && (L_L == R_L) && (L_T == R_T)

    md"""
    ### Result

    **Left side:** $(left_dims)

    **Right side:** $(right_dims)

    **Dimensionally consistent?** $(consistent ? "✓ YES" : "✗ NO")

    $(consistent ? "" : "The exponents must match for a valid equation!")
    """
end

# ╔═╡ a1000023-0001-0001-0001-000000000009
md"""
---
## Common Quantity Dimensions

| Quantity | M | L | T | Example |
|:---------|:--|:--|:--|:--------|
| Energy | 1 | 2 | -2 | Joule |
| Force | 1 | 1 | -2 | Newton |
| Pressure | 1 | -1 | -2 | Pascal |
| Velocity | 0 | 1 | -1 | m/s |
| Acceleration | 0 | 1 | -2 | m/s² |
| Frequency | 0 | 0 | -1 | Hz |
"""

# ╔═╡ a1000023-0001-0001-0001-000000000010
md"""
---
## Scaling Laws: Surface Area vs Volume

For an object of characteristic size L:
- Surface area ∝ L²
- Volume ∝ L³
- SA/V ∝ L⁻¹
"""

# ╔═╡ a1000023-0001-0001-0001-000000000011
md"""
**Size range (log scale):**
"""

# ╔═╡ a1000023-0001-0001-0001-000000000012
@bind size_range Slider(-9:1:0, default=-6, show_value=true)

# ╔═╡ a1000023-0001-0001-0001-000000000013
begin
    L_sizes = 10.0 .^ range(size_range, 0, length=100)

    # Normalize so values are comparable
    SA_norm = L_sizes.^2 ./ maximum(L_sizes.^2)
    V_norm = L_sizes.^3 ./ maximum(L_sizes.^3)
    SAV_ratio = 1 ./ L_sizes ./ maximum(1 ./ L_sizes)

    p_scaling = plot(L_sizes, SA_norm,
        xlabel="Size L (m)", ylabel="Normalized Value",
        title="Scaling: SA ∝ L², V ∝ L³, SA/V ∝ 1/L",
        xscale=:log10,
        linewidth=3, color=:blue,
        label="Surface Area ∝ L²",
        legend=:right,
        size=(700, 450))

    plot!(p_scaling, L_sizes, V_norm,
        linewidth=3, color=:red,
        label="Volume ∝ L³")

    plot!(p_scaling, L_sizes, SAV_ratio,
        linewidth=3, color=:green,
        label="SA/V ∝ 1/L")

    # Mark some sizes
    if size_range <= -9
        vline!(p_scaling, [1e-9], color=:gray, linestyle=:dash, label="1 nm")
    end
    if size_range <= -6
        vline!(p_scaling, [1e-6], color=:gray, linestyle=:dash, label="1 μm")
    end

    p_scaling
end

# ╔═╡ a1000023-0001-0001-0001-000000000014
md"""
### Implications

**Small objects have higher SA/V:**
- Nanoparticles: more reactive (more surface per volume)
- Cells: efficient nutrient exchange
- Catalysts: finely divided for maximum surface

**Large objects have lower SA/V:**
- Elephants: need special cooling (ears)
- Large animals: more metabolically efficient
"""

# ╔═╡ a1000023-0001-0001-0001-000000000015
md"""
---
## Diffusion Time Scaling

Time to diffuse distance L: t ∼ L²/D
"""

# ╔═╡ a1000023-0001-0001-0001-000000000016
md"""
**Diffusion coefficient D (m²/s):**
"""

# ╔═╡ a1000023-0001-0001-0001-000000000017
@bind D_diff Select([
    "1e-9" => "Small molecule in water (10⁻⁹)",
    "1e-10" => "Protein in water (10⁻¹⁰)",
    "1e-11" => "Large protein (10⁻¹¹)",
    "1e-5" => "Gas in air (10⁻⁵)"
])

# ╔═╡ a1000023-0001-0001-0001-000000000018
begin
    D_val = parse(Float64, D_diff)

    distances = [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1]
    times = distances.^2 ./ D_val

    labels = ["1 nm", "10 nm", "100 nm", "1 μm", "10 μm", "100 μm", "1 mm", "1 cm", "10 cm", "1 m"]

    # Format times nicely
    function format_time(t)
        if t < 1e-9
            return "$(round(t*1e12, digits=1)) ps"
        elseif t < 1e-6
            return "$(round(t*1e9, digits=1)) ns"
        elseif t < 1e-3
            return "$(round(t*1e6, digits=1)) μs"
        elseif t < 1
            return "$(round(t*1e3, digits=1)) ms"
        elseif t < 60
            return "$(round(t, digits=1)) s"
        elseif t < 3600
            return "$(round(t/60, digits=1)) min"
        elseif t < 86400
            return "$(round(t/3600, digits=1)) hr"
        elseif t < 3.15e7
            return "$(round(t/86400, digits=1)) days"
        else
            return "$(round(t/3.15e7, digits=1)) yr"
        end
    end

    md"""
    ### Diffusion Times (D = $(D_diff) m²/s)

    | Distance | Time |
    |:---------|:-----|
    | 1 nm (molecule) | $(format_time(times[1])) |
    | 100 nm (virus) | $(format_time(times[3])) |
    | 1 μm (bacterium) | $(format_time(times[4])) |
    | 10 μm (cell) | $(format_time(times[5])) |
    | 1 mm | $(format_time(times[7])) |
    | 1 cm | $(format_time(times[8])) |
    | 1 m | $(format_time(times[10])) |

    **Key insight:** t ∝ L². Doubling distance → 4× time!
    """
end

# ╔═╡ a1000023-0001-0001-0001-000000000019
md"""
---
## Linearization of Equations

Many equations can be transformed to linear form for easier analysis.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000020
md"""
**Equation type:**
"""

# ╔═╡ a1000023-0001-0001-0001-000000000021
@bind eq_type Select([
    "arrhenius" => "Arrhenius: k = A exp(-Eₐ/RT)",
    "firstorder" => "First-order: [A] = [A]₀ exp(-kt)",
    "langmuir" => "Langmuir: θ = KP/(1+KP)",
    "michaelis" => "Michaelis-Menten: v = Vmax[S]/(Km+[S])"
])

# ╔═╡ a1000023-0001-0001-0001-000000000022
begin
    if eq_type == "arrhenius"
        lin_md = md"""
        ### Arrhenius Equation

        **Original:** k = A e^(-Eₐ/RT)

        **Take logarithm:** ln k = ln A - (Eₐ/R)(1/T)

        **Linear form:** y = b + mx where
        - y = ln k
        - x = 1/T
        - slope m = -Eₐ/R
        - intercept b = ln A

        **Plot ln k vs 1/T → straight line!**
        """
    elseif eq_type == "firstorder"
        lin_md = md"""
        ### First-Order Kinetics

        **Original:** [A] = [A]₀ e^(-kt)

        **Take logarithm:** ln[A] = ln[A]₀ - kt

        **Linear form:** y = b + mx where
        - y = ln[A]
        - x = t
        - slope m = -k
        - intercept b = ln[A]₀

        **Plot ln[A] vs t → straight line!**
        """
    elseif eq_type == "langmuir"
        lin_md = md"""
        ### Langmuir Isotherm

        **Original:** θ = KP/(1 + KP)

        **Take reciprocal:** 1/θ = (1 + KP)/(KP) = 1/(KP) + 1

        **Linear form:** y = b + mx where
        - y = 1/θ
        - x = 1/P
        - slope m = 1/K
        - intercept b = 1

        **Plot 1/θ vs 1/P → straight line!**
        """
    else
        lin_md = md"""
        ### Michaelis-Menten Equation

        **Original:** v = Vmax[S]/(Km + [S])

        **Take reciprocal (Lineweaver-Burk):**

        1/v = (Km + [S])/(Vmax[S]) = Km/(Vmax[S]) + 1/Vmax

        **Linear form:** y = b + mx where
        - y = 1/v
        - x = 1/[S]
        - slope m = Km/Vmax
        - intercept b = 1/Vmax

        **Plot 1/v vs 1/[S] → straight line!**
        """
    end

    lin_md
end

# ╔═╡ a1000023-0001-0001-0001-000000000023
md"""
---
## Unit Conversion Tool

Common chemistry conversions.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000024
md"""
**Energy value:** $(@bind E_val NumberField(0.1:0.1:1000, default=50.0))

**From:** $(@bind E_from Select(["kJ/mol", "kcal/mol", "eV", "cm⁻¹", "Hz"]))

**To:** $(@bind E_to Select(["kJ/mol", "kcal/mol", "eV", "cm⁻¹", "Hz"]))
"""

# ╔═╡ a1000023-0001-0001-0001-000000000025
begin
    # Conversion factors to kJ/mol
    to_kJmol = Dict(
        "kJ/mol" => 1.0,
        "kcal/mol" => 4.184,
        "eV" => 96.485,
        "cm⁻¹" => 0.01196,
        "Hz" => 3.99e-10
    )

    # Convert
    E_kJmol = E_val * to_kJmol[E_from]
    E_result = E_kJmol / to_kJmol[E_to]

    md"""
    ### Conversion Result

    **$(E_val) $(E_from) = $(round(E_result, sigdigits=4)) $(E_to)**

    (via kJ/mol: $(round(E_kJmol, sigdigits=4)) kJ/mol)
    """
end

# ╔═╡ a1000023-0001-0001-0001-000000000026
md"""
---
## Fermi Estimation

Combine dimensional analysis with rough estimates.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000027
md"""
### Example: Water Molecules in a Raindrop

**Raindrop radius:** $(@bind r_rain Slider(0.5:0.5:3, default=1, show_value=true)) mm
"""

# ╔═╡ a1000023-0001-0001-0001-000000000028
begin
    r_m = r_rain * 1e-3  # Convert to meters
    V_rain = (4/3) * π * r_m^3  # Volume in m³
    V_mL = V_rain * 1e6  # Volume in mL (= cm³)

    mass_g = V_mL * 1.0  # Mass in grams (density ≈ 1 g/mL)
    moles_water = mass_g / 18.015  # Moles
    molecules = moles_water * 6.022e23  # Molecules

    md"""
    ### Calculation

    1. **Volume:** V = (4/3)πr³ = $(round(V_mL, sigdigits=3)) mL

    2. **Mass:** m = ρV ≈ $(round(mass_g, sigdigits=3)) g

    3. **Moles:** n = m/M = $(round(moles_water, sigdigits=3)) mol

    4. **Molecules:** N = n × Nₐ ≈ **$(round(molecules, sigdigits=2))**

    That's about **10^$(round(Int, log10(molecules)))** water molecules!
    """
end

# ╔═╡ a1000023-0001-0001-0001-000000000029
md"""
---
## Summary

| Technique | Use |
|:----------|:----|
| Dimension check | Catch equation errors |
| Derive by dimensions | Find functional form |
| Scaling laws | Understand size dependence |
| Linearization | Transform for plotting/fitting |
| Unit conversion | Change between systems |
| Fermi estimation | Order-of-magnitude reasoning |

**Key insight:** Units carry information. Dimensional consistency is the first line of defense against errors.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000030
md"""
---
## Exercises

1. Verify that PV = nRT is dimensionally consistent.

2. Derive how the frequency of a vibrating string depends on length, tension, and linear density.

3. How long to diffuse 1 cm in water (D ≈ 10⁻⁹ m²/s)?

4. Convert 2.5 eV to kJ/mol.
"""

# ╔═╡ a1000023-0001-0001-0001-000000000031
md"""
---
## Next: Lecture 24

**Synthesis**

Connecting all the primitives — the complete map.
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
# ╠═a1000023-0001-0001-0001-000000000001
# ╟─a1000023-0001-0001-0001-000000000002
# ╟─a1000023-0001-0001-0001-000000000003
# ╟─a1000023-0001-0001-0001-000000000004
# ╟─a1000023-0001-0001-0001-000000000005
# ╟─a1000023-0001-0001-0001-000000000006
# ╟─a1000023-0001-0001-0001-000000000007
# ╟─a1000023-0001-0001-0001-000000000008
# ╟─a1000023-0001-0001-0001-000000000009
# ╟─a1000023-0001-0001-0001-000000000010
# ╟─a1000023-0001-0001-0001-000000000011
# ╟─a1000023-0001-0001-0001-000000000012
# ╟─a1000023-0001-0001-0001-000000000013
# ╟─a1000023-0001-0001-0001-000000000014
# ╟─a1000023-0001-0001-0001-000000000015
# ╟─a1000023-0001-0001-0001-000000000016
# ╟─a1000023-0001-0001-0001-000000000017
# ╟─a1000023-0001-0001-0001-000000000018
# ╟─a1000023-0001-0001-0001-000000000019
# ╟─a1000023-0001-0001-0001-000000000020
# ╟─a1000023-0001-0001-0001-000000000021
# ╟─a1000023-0001-0001-0001-000000000022
# ╟─a1000023-0001-0001-0001-000000000023
# ╟─a1000023-0001-0001-0001-000000000024
# ╟─a1000023-0001-0001-0001-000000000025
# ╟─a1000023-0001-0001-0001-000000000026
# ╟─a1000023-0001-0001-0001-000000000027
# ╟─a1000023-0001-0001-0001-000000000028
# ╟─a1000023-0001-0001-0001-000000000029
# ╟─a1000023-0001-0001-0001-000000000030
# ╟─a1000023-0001-0001-0001-000000000031
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
