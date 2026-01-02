### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000022-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    using Statistics
    using Random
    plotly()
end

# ╔═╡ a1000022-0001-0001-0001-000000000002
md"""
# Lecture 22: Expectation, Variance, and Error

*The gap between calculation and observation — why all measurements have uncertainty.*

---

## The Fundamental Distinction

**Calculated:** E = -13.6 eV (exact within model)

**Observed:** E = -13.598 ± 0.002 eV (uncertain)

You never observe the "true" value. You observe samples from a distribution.
"""

# ╔═╡ a1000022-0001-0001-0001-000000000003
md"""
---
## Sample Mean vs Population Mean

The sample mean x̄ estimates the true mean μ.

With more samples, our estimate becomes more precise.
"""

# ╔═╡ a1000022-0001-0001-0001-000000000004
md"""
**True mean μ:**
"""

# ╔═╡ a1000022-0001-0001-0001-000000000005
@bind μ_true Slider(0:0.5:10, default=5, show_value=true)

# ╔═╡ a1000022-0001-0001-0001-000000000006
md"""
**True standard deviation σ:**
"""

# ╔═╡ a1000022-0001-0001-0001-000000000007
@bind σ_true Slider(0.5:0.5:3, default=1, show_value=true)

# ╔═╡ a1000022-0001-0001-0001-000000000008
md"""
**Number of samples n:**
"""

# ╔═╡ a1000022-0001-0001-0001-000000000009
@bind n_samples Slider([5, 10, 25, 50, 100, 500], default=25, show_value=true)

# ╔═╡ a1000022-0001-0001-0001-000000000010
@bind resample Button("Take New Sample")

# ╔═╡ a1000022-0001-0001-0001-000000000011
begin
    resample
    Random.seed!(rand(1:10000))

    # Generate samples
    samples = μ_true .+ σ_true .* randn(n_samples)
    x_bar = mean(samples)
    s = std(samples)
    SE = s / sqrt(n_samples)

    # Plot
    p_samples = histogram(samples,
        xlabel="Value", ylabel="Count",
        title="n = $(n_samples) samples from N($(μ_true), $(σ_true)²)",
        bins=15, color=:lightblue, legend=:topright,
        label="Samples",
        size=(700, 400))

    vline!(p_samples, [μ_true], color=:red, linewidth=3, label="True μ = $(μ_true)")
    vline!(p_samples, [x_bar], color=:blue, linewidth=3, linestyle=:dash,
        label="Sample x̄ = $(round(x_bar, digits=3))")

    p_samples
end

# ╔═╡ a1000022-0001-0001-0001-000000000012
md"""
### Sample Statistics

| Quantity | Symbol | Value |
|:---------|:-------|:------|
| Sample mean | x̄ | $(round(x_bar, digits=4)) |
| Sample std dev | s | $(round(s, digits=4)) |
| Standard error | SE = s/√n | $(round(SE, digits=4)) |
| 95% CI | x̄ ± 2SE | $(round(x_bar - 2SE, digits=3)) to $(round(x_bar + 2SE, digits=3)) |

**True μ = $(μ_true).** Does the 95% CI contain it? $(abs(x_bar - μ_true) < 2SE ? "✓ Yes" : "✗ No")

Try clicking "Take New Sample" — about 95% of the time, the CI should contain μ.
"""

# ╔═╡ a1000022-0001-0001-0001-000000000013
md"""
---
## Error Propagation: The General Formula

$\delta f = \sqrt{\left(\frac{\partial f}{\partial x}\right)^2 \delta x^2 + \left(\frac{\partial f}{\partial y}\right)^2 \delta y^2}$
"""

# ╔═╡ a1000022-0001-0001-0001-000000000014
md"""
### Interactive Error Propagation Calculator

**Operation:**
"""

# ╔═╡ a1000022-0001-0001-0001-000000000015
@bind operation Select([
    "add" => "f = x + y",
    "subtract" => "f = x - y",
    "multiply" => "f = x × y",
    "divide" => "f = x / y",
    "power" => "f = xⁿ"
])

# ╔═╡ a1000022-0001-0001-0001-000000000016
md"""
**x =** $(@bind x_val NumberField(0.1:0.1:100, default=10.0))
**± δx =** $(@bind dx_val NumberField(0.01:0.01:10, default=0.5))
"""

# ╔═╡ a1000022-0001-0001-0001-000000000017
md"""
**y =** $(@bind y_val NumberField(0.1:0.1:100, default=5.0))
**± δy =** $(@bind dy_val NumberField(0.01:0.01:10, default=0.2))
"""

# ╔═╡ a1000022-0001-0001-0001-000000000018
md"""
**n (for power) =** $(@bind n_power NumberField(-5:0.5:5, default=2))
"""

# ╔═╡ a1000022-0001-0001-0001-000000000019
begin
    if operation == "add"
        f_val = x_val + y_val
        df_val = sqrt(dx_val^2 + dy_val^2)
        formula = "δf = √(δx² + δy²)"
    elseif operation == "subtract"
        f_val = x_val - y_val
        df_val = sqrt(dx_val^2 + dy_val^2)
        formula = "δf = √(δx² + δy²)"
    elseif operation == "multiply"
        f_val = x_val * y_val
        rel_err = sqrt((dx_val/x_val)^2 + (dy_val/y_val)^2)
        df_val = f_val * rel_err
        formula = "δf/f = √((δx/x)² + (δy/y)²)"
    elseif operation == "divide"
        f_val = x_val / y_val
        rel_err = sqrt((dx_val/x_val)^2 + (dy_val/y_val)^2)
        df_val = f_val * rel_err
        formula = "δf/f = √((δx/x)² + (δy/y)²)"
    else  # power
        f_val = x_val^n_power
        rel_err = abs(n_power) * dx_val / x_val
        df_val = f_val * rel_err
        formula = "δf/f = |n| × δx/x"
    end

    md"""
    ### Result

    **Formula:** $(formula)

    **f = $(round(f_val, digits=4)) ± $(round(df_val, digits=4))**

    Relative uncertainty: $(round(100*df_val/abs(f_val), digits=2))%
    """
end

# ╔═╡ a1000022-0001-0001-0001-000000000020
md"""
---
## Monte Carlo Error Propagation

Instead of formulas, simulate! Generate random samples and see the distribution of f.
"""

# ╔═╡ a1000022-0001-0001-0001-000000000021
md"""
**Function: f = x²/y** with x = 4.0 ± 0.2, y = 2.0 ± 0.1

**Number of Monte Carlo samples:**
"""

# ╔═╡ a1000022-0001-0001-0001-000000000022
@bind n_mc Slider([100, 1000, 10000, 100000], default=10000, show_value=true)

# ╔═╡ a1000022-0001-0001-0001-000000000023
begin
    x_mc = 4.0
    dx_mc = 0.2
    y_mc = 2.0
    dy_mc = 0.1

    # Generate samples
    x_samples = x_mc .+ dx_mc .* randn(n_mc)
    y_samples = y_mc .+ dy_mc .* randn(n_mc)

    f_samples = (x_samples.^2) ./ y_samples

    f_mean_mc = mean(f_samples)
    f_std_mc = std(f_samples)

    # Analytical (for comparison)
    # f = x²/y, ∂f/∂x = 2x/y, ∂f/∂y = -x²/y²
    f_analytical = x_mc^2 / y_mc
    df_analytical = f_analytical * sqrt((2*dx_mc/x_mc)^2 + (dy_mc/y_mc)^2)

    p_mc = histogram(f_samples,
        xlabel="f = x²/y", ylabel="Count",
        title="Monte Carlo: $(n_mc) samples",
        bins=50, color=:purple, alpha=0.7,
        legend=:topright,
        label="Simulated",
        size=(700, 400))

    vline!(p_mc, [f_mean_mc], color=:red, linewidth=3,
        label="MC mean = $(round(f_mean_mc, digits=3))")
    vline!(p_mc, [f_analytical], color=:blue, linewidth=2, linestyle=:dash,
        label="Analytical = $(round(f_analytical, digits=3))")

    p_mc
end

# ╔═╡ a1000022-0001-0001-0001-000000000024
md"""
### Comparison

| Method | f | δf |
|:-------|:--|:---|
| Analytical | $(round(f_analytical, digits=4)) | $(round(df_analytical, digits=4)) |
| Monte Carlo | $(round(f_mean_mc, digits=4)) | $(round(f_std_mc, digits=4)) |

Monte Carlo naturally handles:
- Non-linear functions
- Correlated uncertainties
- Non-Gaussian distributions
"""

# ╔═╡ a1000022-0001-0001-0001-000000000025
md"""
---
## Weighted Averages

When measurements have different precisions, weight by 1/σ².
"""

# ╔═╡ a1000022-0001-0001-0001-000000000026
begin
    # Example: three measurements
    measurements = [1.23, 1.45, 1.30]
    uncertainties = [0.05, 0.15, 0.08]

    weights = 1 ./ uncertainties.^2
    x_weighted = sum(weights .* measurements) / sum(weights)
    σ_weighted = 1 / sqrt(sum(weights))

    # Simple average for comparison
    x_simple = mean(measurements)

    p_weighted = scatter(1:3, measurements,
        yerror=uncertainties,
        xlabel="Measurement", ylabel="Value",
        title="Weighted vs Simple Average",
        markersize=10, color=:blue,
        label="Data ± σ",
        legend=:topright,
        ylim=(1.0, 1.7),
        size=(600, 400))

    hline!(p_weighted, [x_weighted], color=:red, linewidth=2,
        label="Weighted avg = $(round(x_weighted, digits=3)) ± $(round(σ_weighted, digits=3))")
    hline!(p_weighted, [x_simple], color=:green, linewidth=2, linestyle=:dash,
        label="Simple avg = $(round(x_simple, digits=3))")

    p_weighted
end

# ╔═╡ a1000022-0001-0001-0001-000000000027
md"""
### Weights

| Measurement | Value | σ | Weight (1/σ²) |
|:------------|:------|:--|:--------------|
| 1 | $(measurements[1]) | $(uncertainties[1]) | $(round(weights[1], digits=1)) |
| 2 | $(measurements[2]) | $(uncertainties[2]) | $(round(weights[2], digits=1)) |
| 3 | $(measurements[3]) | $(uncertainties[3]) | $(round(weights[3], digits=1)) |

**The most precise measurement dominates!**

Weighted average: $(round(x_weighted, digits=4)) ± $(round(σ_weighted, digits=4))
Simple average: $(round(x_simple, digits=4))
"""

# ╔═╡ a1000022-0001-0001-0001-000000000028
md"""
---
## Common Mistakes

### ❌ Adding uncertainties linearly

δ(x + y) = δx + δy (WRONG)

### ✓ Add in quadrature

δ(x + y) = √(δx² + δy²) (CORRECT)

Errors don't always align in the worst case!
"""

# ╔═╡ a1000022-0001-0001-0001-000000000029
begin
    # Demonstrate with Monte Carlo
    n_demo = 10000
    x_demo = 5.0 .+ 1.0 .* randn(n_demo)
    y_demo = 3.0 .+ 0.5 .* randn(n_demo)

    sum_demo = x_demo .+ y_demo

    # Predictions
    linear_prediction = 1.0 + 0.5  # Wrong
    quadrature_prediction = sqrt(1.0^2 + 0.5^2)  # Correct

    actual_std = std(sum_demo)

    md"""
    ### Demonstration: x (σ=1.0) + y (σ=0.5)

    | Method | Predicted δ(x+y) | Actual (MC) |
    |:-------|:-----------------|:------------|
    | Linear (wrong) | $(linear_prediction) | — |
    | Quadrature (correct) | $(round(quadrature_prediction, digits=3)) | $(round(actual_std, digits=3)) |

    The quadrature formula matches!
    """
end

# ╔═╡ a1000022-0001-0001-0001-000000000030
md"""
---
## Summary

| Concept | Formula |
|:--------|:--------|
| Mean | ⟨X⟩ = Σxᵢpᵢ |
| Variance | σ² = ⟨X²⟩ - ⟨X⟩² |
| Standard error | SE = σ/√n |
| Error propagation | δf = √(Σ(∂f/∂xᵢ)²δxᵢ²) |
| Weighted average | x̄ = Σwᵢxᵢ/Σwᵢ, w = 1/σ² |

**Key insight:** Every measurement has uncertainty. Reporting a value without uncertainty is incomplete.
"""

# ╔═╡ a1000022-0001-0001-0001-000000000031
md"""
---
## Exercises

1. Calculate the variance of {2, 4, 4, 4, 5, 5, 7, 9}.

2. For V = πr²h with r = 2.5 ± 0.1 cm, h = 10.0 ± 0.2 cm, find V ± δV.

3. Why is SE = σ/√n, not σ/n?

4. Three measurements: 5.2 ± 0.3, 5.8 ± 0.1, 5.5 ± 0.2. Find weighted average.
"""

# ╔═╡ a1000022-0001-0001-0001-000000000032
md"""
---
## Solutions

### Exercise 1
Mean = 5, ⟨X²⟩ = 29, σ² = 29 - 25 = **4**, σ = **2**

### Exercise 2
V = π(2.5)²(10) = 196.3 cm³
δV/V = √((2×0.1/2.5)² + (0.2/10)²) = √(0.0016 + 0.0004) = 0.045
δV = 8.8 cm³
**V = 196 ± 9 cm³**

### Exercise 3
SE measures precision of the mean, not spread of data. The mean of n values has variance σ²/n (variances add, then divide by n²), so σ_mean = σ/√n.

### Exercise 4
w = [11.1, 100, 25], x̄_w = (11.1×5.2 + 100×5.8 + 25×5.5)/136.1 = **5.74 ± 0.09**
"""

# ╔═╡ a1000022-0001-0001-0001-000000000033
md"""
---
## Next: Lecture 23

**Statistical Mechanics**

Connecting microscopic distributions to macroscopic thermodynamics.
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"
PlutoUI = "7f904dfe-b85e-4ff6-b463-dae2292396a8"
Random = "9a3f8284-a2c9-5f02-9a11-845980a1fd5c"
Statistics = "10745b16-79ce-11e8-11f9-7d13ad32a3b2"

[compat]
Plots = "~1.39.0"
PlutoUI = "~0.7.54"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised
"""

# ╔═╡ Cell order:
# ╠═a1000022-0001-0001-0001-000000000001
# ╟─a1000022-0001-0001-0001-000000000002
# ╟─a1000022-0001-0001-0001-000000000003
# ╟─a1000022-0001-0001-0001-000000000004
# ╟─a1000022-0001-0001-0001-000000000005
# ╟─a1000022-0001-0001-0001-000000000006
# ╟─a1000022-0001-0001-0001-000000000007
# ╟─a1000022-0001-0001-0001-000000000008
# ╟─a1000022-0001-0001-0001-000000000009
# ╟─a1000022-0001-0001-0001-000000000010
# ╟─a1000022-0001-0001-0001-000000000011
# ╟─a1000022-0001-0001-0001-000000000012
# ╟─a1000022-0001-0001-0001-000000000013
# ╟─a1000022-0001-0001-0001-000000000014
# ╟─a1000022-0001-0001-0001-000000000015
# ╟─a1000022-0001-0001-0001-000000000016
# ╟─a1000022-0001-0001-0001-000000000017
# ╟─a1000022-0001-0001-0001-000000000018
# ╟─a1000022-0001-0001-0001-000000000019
# ╟─a1000022-0001-0001-0001-000000000020
# ╟─a1000022-0001-0001-0001-000000000021
# ╟─a1000022-0001-0001-0001-000000000022
# ╟─a1000022-0001-0001-0001-000000000023
# ╟─a1000022-0001-0001-0001-000000000024
# ╟─a1000022-0001-0001-0001-000000000025
# ╟─a1000022-0001-0001-0001-000000000026
# ╟─a1000022-0001-0001-0001-000000000027
# ╟─a1000022-0001-0001-0001-000000000028
# ╟─a1000022-0001-0001-0001-000000000029
# ╟─a1000022-0001-0001-0001-000000000030
# ╟─a1000022-0001-0001-0001-000000000031
# ╟─a1000022-0001-0001-0001-000000000032
# ╟─a1000022-0001-0001-0001-000000000033
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
