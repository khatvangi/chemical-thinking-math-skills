### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000020-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    using Random
    plotly()
end

# ╔═╡ a1000020-0001-0001-0001-000000000002
md"""
# Lecture 20: Probability Basics

*The SPREAD primitive — the mathematics of uncertainty.*

---

## Confronting Misconceptions

Before learning rules, we must unlearn errors.
"""

# ╔═╡ a1000020-0001-0001-0001-000000000003
md"""
---
## The Gambler's Fallacy

**Misconception:** After many heads, tails is "due."

**Truth:** Independent events have no memory.
"""

# ╔═╡ a1000020-0001-0001-0001-000000000004
md"""
**Number of flips:**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000005
@bind n_flips Slider([10, 50, 100, 500, 1000, 5000], default=100, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000006
@bind new_seed Button("New Random Sequence")

# ╔═╡ a1000020-0001-0001-0001-000000000007
begin
    new_seed  # Trigger on button press
    Random.seed!(rand(1:10000))

    flips = rand(["H", "T"], n_flips)
    cumulative_heads = cumsum(flips .== "H")
    flip_numbers = 1:n_flips
    running_proportion = cumulative_heads ./ flip_numbers

    # Count streaks
    max_streak = 1
    current_streak = 1
    for i in 2:n_flips
        if flips[i] == flips[i-1]
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        else
            current_streak = 1
        end
    end

    p_gambler = plot(flip_numbers, running_proportion,
        xlabel="Number of Flips", ylabel="Proportion Heads",
        title="Law of Large Numbers: Proportion → 0.5 (but streaks exist!)",
        linewidth=2, color=:teal,
        label="Running proportion",
        legend=:topright,
        ylim=(0, 1),
        size=(700, 450))

    hline!(p_gambler, [0.5], color=:red, linestyle=:dash, label="True probability", linewidth=2)

    p_gambler
end

# ╔═╡ a1000020-0001-0001-0001-000000000008
md"""
### Results

- **Total heads:** $(sum(flips .== "H")) / $(n_flips) = $(round(100*sum(flips .== "H")/n_flips, digits=1))%
- **Longest streak:** $(max_streak) in a row
- **Final proportion:** $(round(running_proportion[end], digits=3))

**Notice:** Streaks are NORMAL in random data! A streak of $(max_streak) doesn't mean the coin is biased or that the opposite is "due."

Click "New Random Sequence" to see different runs.
"""

# ╔═╡ a1000020-0001-0001-0001-000000000009
md"""
---
## Base Rate Neglect: Medical Testing

A test is 95% accurate. You test positive. What's the probability you have the disease?

**Most people say ~95%. They're wrong.**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000010
md"""
**Disease prevalence (%):**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000011
@bind prevalence Slider(0.1:0.1:10, default=1, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000012
md"""
**Test sensitivity (true positive rate %):**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000013
@bind sensitivity Slider(80:1:99, default=95, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000014
md"""
**Test specificity (true negative rate %):**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000015
@bind specificity Slider(80:1:99, default=95, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000016
begin
    # Bayes calculation
    P_D = prevalence / 100
    P_notD = 1 - P_D
    P_pos_given_D = sensitivity / 100
    P_neg_given_notD = specificity / 100
    P_pos_given_notD = 1 - P_neg_given_notD

    # P(+) = P(+|D)P(D) + P(+|notD)P(notD)
    P_pos = P_pos_given_D * P_D + P_pos_given_notD * P_notD

    # P(D|+) = P(+|D)P(D) / P(+)
    P_D_given_pos = (P_pos_given_D * P_D) / P_pos

    # For visualization: out of 10,000 people
    N = 10000
    n_diseased = round(Int, N * P_D)
    n_healthy = N - n_diseased

    true_pos = round(Int, n_diseased * P_pos_given_D)
    false_neg = n_diseased - true_pos
    false_pos = round(Int, n_healthy * P_pos_given_notD)
    true_neg = n_healthy - false_pos

    total_pos = true_pos + false_pos

    md"""
    ### Bayes' Theorem Calculation

    **Given:**
    - Prevalence: $(prevalence)%
    - Sensitivity (P(+|disease)): $(sensitivity)%
    - Specificity (P(-|healthy)): $(specificity)%

    **Out of $(N) people:**

    |  | Test + | Test - | Total |
    |--|--------|--------|-------|
    | **Diseased** | $(true_pos) | $(false_neg) | $(n_diseased) |
    | **Healthy** | $(false_pos) | $(true_neg) | $(n_healthy) |
    | **Total** | $(total_pos) | $(N - total_pos) | $(N) |

    **P(disease | positive test) = $(true_pos) / $(total_pos) = $(round(100*P_D_given_pos, digits=1))%**

    $(P_D_given_pos < 0.5 ? "**Most positive tests are FALSE POSITIVES!**" : "")

    The key: when disease is rare, even a good test produces many false positives relative to true positives.
    """
end

# ╔═╡ a1000020-0001-0001-0001-000000000017
md"""
---
## Independence vs. Dependence

**Independent:** P(A ∩ B) = P(A) × P(B)

**Dependent:** P(A ∩ B) = P(A|B) × P(B) ≠ P(A) × P(B)
"""

# ╔═╡ a1000020-0001-0001-0001-000000000018
md"""
### Example: Drawing Cards

First draw: Ace of spades
Second draw (without replacement): What's P(Ace)?
"""

# ╔═╡ a1000020-0001-0001-0001-000000000019
begin
    # Independent (with replacement)
    p_ace_indep = 4/52
    p_ace_ace_indep = (4/52) * (4/52)

    # Dependent (without replacement)
    p_ace_dep = 3/51  # given first was ace
    p_ace_ace_dep = (4/52) * (3/51)

    md"""
    ### With Replacement (Independent)

    - P(2nd ace | 1st ace) = 4/52 = $(round(p_ace_indep, digits=4))
    - P(both aces) = (4/52)² = $(round(p_ace_ace_indep, digits=5))

    ### Without Replacement (Dependent)

    - P(2nd ace | 1st ace) = 3/51 = $(round(p_ace_dep, digits=4))
    - P(both aces) = (4/52)(3/51) = $(round(p_ace_ace_dep, digits=5))

    **The first draw changes the deck — events are dependent!**
    """
end

# ╔═╡ a1000020-0001-0001-0001-000000000020
md"""
---
## Chemistry: Reaction Branching

A molecule can react via multiple pathways. Probability ∝ rate constant.
"""

# ╔═╡ a1000020-0001-0001-0001-000000000021
md"""
**k₁ (s⁻¹):**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000022
@bind k1_branch Slider(10:10:100, default=50, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000023
md"""
**k₂ (s⁻¹):**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000024
@bind k2_branch Slider(10:10:100, default=30, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000025
md"""
**k₃ (s⁻¹):**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000026
@bind k3_branch Slider(10:10:100, default=20, show_value=true)

# ╔═╡ a1000020-0001-0001-0001-000000000027
begin
    k_total = k1_branch + k2_branch + k3_branch
    p1 = k1_branch / k_total
    p2 = k2_branch / k_total
    p3 = k3_branch / k_total

    p_branch = bar([1, 2, 3], [p1, p2, p3] .* 100,
        xlabel="Pathway", ylabel="Probability (%)",
        title="Reaction Branching: P(pathway) = kᵢ / Σkⱼ",
        legend=false,
        ylim=(0, 100),
        bar_width=0.6,
        color=[:teal, :purple, :orange],
        size=(600, 400),
        xticks=([1,2,3], ["Pathway 1\nk=$(k1_branch)", "Pathway 2\nk=$(k2_branch)", "Pathway 3\nk=$(k3_branch)"]))

    # Add percentage labels
    annotate!(p_branch, [(1, p1*100 + 5, "$(round(p1*100, digits=1))%"),
                          (2, p2*100 + 5, "$(round(p2*100, digits=1))%"),
                          (3, p3*100 + 5, "$(round(p3*100, digits=1))%")])

    p_branch
end

# ╔═╡ a1000020-0001-0001-0001-000000000028
md"""
### Competition Kinetics

When multiple pathways compete, the probability of each is proportional to its rate constant:

$P(\text{pathway } i) = \frac{k_i}{\sum_j k_j} = \frac{k_i}{k_\text{total}}$

This is the basis of:
- Product distributions in organic chemistry
- Fluorescence quantum yields
- Partition functions (with Boltzmann factors)
"""

# ╔═╡ a1000020-0001-0001-0001-000000000029
md"""
---
## What "Random" Actually Looks Like

**Misconception:** Random data should look uniform, evenly spread.

**Truth:** Random data has clusters, gaps, and apparent patterns.
"""

# ╔═╡ a1000020-0001-0001-0001-000000000030
@bind new_points Button("Generate New Random Points")

# ╔═╡ a1000020-0001-0001-0001-000000000031
begin
    new_points
    Random.seed!(rand(1:10000))

    # Random points in unit square
    n_points = 100
    x_rand = rand(n_points)
    y_rand = rand(n_points)

    p_random = scatter(x_rand, y_rand,
        xlabel="x", ylabel="y",
        title="100 Random Points — Notice the clusters and gaps!",
        markersize=6, color=:teal,
        legend=false,
        aspect_ratio=:equal,
        xlim=(0,1), ylim=(0,1),
        size=(500, 500))

    p_random
end

# ╔═╡ a1000020-0001-0001-0001-000000000032
md"""
**Observation:** True random points cluster! There are gaps! This is NORMAL.

If you see perfectly uniform spacing, that's actually evidence of NON-randomness (someone arranged them).

Click "Generate New Random Points" to see more examples.
"""

# ╔═╡ a1000020-0001-0001-0001-000000000033
md"""
---
## Summary: Probability Rules

| Rule | Formula | Use |
|:-----|:--------|:----|
| Complement | P(Aᶜ) = 1 - P(A) | Always |
| Addition | P(A∪B) = P(A) + P(B) - P(A∩B) | Always |
| Multiplication | P(A∩B) = P(A\|B)P(B) | Always |
| Independence | P(A∩B) = P(A)P(B) | If independent |
| Bayes | P(A\|B) = P(B\|A)P(A)/P(B) | Reversing conditionals |

### Misconception Antidotes

| Error | Correction |
|:------|:-----------|
| Gambler's fallacy | Independent events have no memory |
| Base rate neglect | Prior probability matters! |
| P(A\|B) = P(B\|A) | Use Bayes to convert |
| Random = uniform | Random has clusters |
"""

# ╔═╡ a1000020-0001-0001-0001-000000000034
md"""
---
## Exercises

1. After 10 heads in a row, what's P(heads) on flip 11?

2. A chemical test has 98% sensitivity and 90% specificity. If 5% of samples are contaminated, what's P(contaminated | positive)?

3. Are "card is red" and "card is a heart" independent events?

4. A reaction has k₁ = 40 s⁻¹, k₂ = 60 s⁻¹. What fraction goes via pathway 1?
"""

# ╔═╡ a1000020-0001-0001-0001-000000000035
md"""
---
## Solutions

### Exercise 1
**50%** — the coin has no memory! (Gambler's fallacy)

### Exercise 2
P(C) = 0.05, P(+|C) = 0.98, P(+|¬C) = 0.10
P(+) = 0.98(0.05) + 0.10(0.95) = 0.049 + 0.095 = 0.144
P(C|+) = (0.98)(0.05) / 0.144 = 0.049/0.144 = **34%**

### Exercise 3
P(red) = 26/52 = 1/2
P(heart) = 13/52 = 1/4
P(red ∩ heart) = P(heart) = 13/52 = 1/4
P(red) × P(heart) = (1/2)(1/4) = 1/8 ≠ 1/4
**Not independent!** (All hearts are red)

### Exercise 4
P(pathway 1) = 40 / (40 + 60) = 40/100 = **40%**
"""

# ╔═╡ a1000020-0001-0001-0001-000000000036
md"""
---
## Next: Lecture 21

**Distributions**

The Boltzmann distribution, Gaussian distribution, and how probability spreads across states.
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"
PlutoUI = "7f904dfe-b85e-4ff6-b463-dae2292396a8"
Random = "9a3f8284-a2c9-5f02-9a11-845980a1fd5c"

[compat]
Plots = "~1.39.0"
PlutoUI = "~0.7.54"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised
"""

# ╔═╡ Cell order:
# ╠═a1000020-0001-0001-0001-000000000001
# ╟─a1000020-0001-0001-0001-000000000002
# ╟─a1000020-0001-0001-0001-000000000003
# ╟─a1000020-0001-0001-0001-000000000004
# ╟─a1000020-0001-0001-0001-000000000005
# ╟─a1000020-0001-0001-0001-000000000006
# ╟─a1000020-0001-0001-0001-000000000007
# ╟─a1000020-0001-0001-0001-000000000008
# ╟─a1000020-0001-0001-0001-000000000009
# ╟─a1000020-0001-0001-0001-000000000010
# ╟─a1000020-0001-0001-0001-000000000011
# ╟─a1000020-0001-0001-0001-000000000012
# ╟─a1000020-0001-0001-0001-000000000013
# ╟─a1000020-0001-0001-0001-000000000014
# ╟─a1000020-0001-0001-0001-000000000015
# ╟─a1000020-0001-0001-0001-000000000016
# ╟─a1000020-0001-0001-0001-000000000017
# ╟─a1000020-0001-0001-0001-000000000018
# ╟─a1000020-0001-0001-0001-000000000019
# ╟─a1000020-0001-0001-0001-000000000020
# ╟─a1000020-0001-0001-0001-000000000021
# ╟─a1000020-0001-0001-0001-000000000022
# ╟─a1000020-0001-0001-0001-000000000023
# ╟─a1000020-0001-0001-0001-000000000024
# ╟─a1000020-0001-0001-0001-000000000025
# ╟─a1000020-0001-0001-0001-000000000026
# ╟─a1000020-0001-0001-0001-000000000027
# ╟─a1000020-0001-0001-0001-000000000028
# ╟─a1000020-0001-0001-0001-000000000029
# ╟─a1000020-0001-0001-0001-000000000030
# ╟─a1000020-0001-0001-0001-000000000031
# ╟─a1000020-0001-0001-0001-000000000032
# ╟─a1000020-0001-0001-0001-000000000033
# ╟─a1000020-0001-0001-0001-000000000034
# ╟─a1000020-0001-0001-0001-000000000035
# ╟─a1000020-0001-0001-0001-000000000036
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
