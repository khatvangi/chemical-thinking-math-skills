### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra
using Random
using Statistics

md"""
# Lecture 01 — SEEING
**Orientation: identify the primitive reality is forcing.**

Primitive order (LOCKED):
**COLLECTION → ARRANGEMENT → DIRECTION → PROXIMITY → SAMENESS → CHANGE → RATE → ACCUMULATION → SPREAD**

This notebook is a lab for *recognition*: you change reality with sliders and watch what must stay true.
"""

md"---"

# ╔═╡ 00000000-0000-0000-0000-000000000001
md"""
## Part A — COLLECTION vs SPREAD (particles in a box)

Same *count* (COLLECTION) can produce many *configurations* (SPREAD).
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
@bind N Slider(10:10:400, default=120, show_value=true)

# ╔═╡ 00000000-0000-0000-0000-000000000003
@bind seed Slider(1:1:50, default=7, show_value=true)

# ╔═╡ 00000000-0000-0000-0000-000000000004
begin
    Random.seed!(seed)
    x = rand(N)
    y = rand(N)
    p = scatter(x, y, markersize=3, xlabel="x", ylabel="y",
        title="Same N (COLLECTION), different microstate (SPREAD)")
    p
end

# ╔═╡ 00000000-0000-0000-0000-000000000005
md"""
**Recognition gate:** If you change `seed`, the picture changes.  
But the *count* `N` is invariant. That’s the COLLECTION invariant.
"""

md"---"

# ╔═╡ 00000000-0000-0000-0000-000000000006
md"""
## Part B — DIRECTION (arrows are not just numbers)

A vector needs magnitude and direction. Changing the reference flips signs systematically.
"""

# ╔═╡ 00000000-0000-0000-0000-000000000007
@bind θ Slider(0:1:360, default=55, show_value=true)

# ╔═╡ 00000000-0000-0000-0000-000000000008
@bind m Slider(0.0:0.1:5.0, default=2.0, show_value=true)

# ╔═╡ 00000000-0000-0000-0000-000000000009
begin
    v = m .* [cosd(θ), sind(θ)]
    p = plot([-5,5], [0,0], legend=false, xlabel="x", ylabel="y",
        title="Vector with magnitude m and angle θ", aspect_ratio=1)
    plot!([0, v[1]], [0, v[2]], arrow=:arrow, linewidth=3)
    scatter!([v[1]], [v[2]])
    annotate!(v[1], v[2], text("v = ($(round(v[1],digits=2)), $(round(v[2],digits=2)))", 9))
    p
end

# ╔═╡ 00000000-0000-0000-0000-000000000010
md"""
**Gate:** The magnitude should match \\(\\|v\\| = m\\).  
Try θ→θ+180: components flip sign, magnitude stays the same.
"""

md"---"

# ╔═╡ 00000000-0000-0000-0000-000000000011
md"""
## Part C — SPREAD (Boltzmann intuition preview)

Even when the *state variables* look simple, the microstates spread out.

We model a toy system with discrete energies \\(E = 0,1,2,3,4\\) (arbitrary units).
"""

# ╔═╡ 00000000-0000-0000-0000-000000000012
@bind T Slider(0.2:0.1:5.0, default=1.0, show_value=true)

# ╔═╡ 00000000-0000-0000-0000-000000000013
begin
    E = collect(0:4)
    w = exp.(-E ./ T)
    p = w ./ sum(w)
    bar(E, p, xlabel="energy level E", ylabel="probability",
        title="Distribution over energies (SPREAD) for temperature T")
end

# ╔═╡ 00000000-0000-0000-0000-000000000014
md"""
**Gate:** probabilities must be in \\([0,1]\\) and sum to 1.  
As T increases, the distribution flattens (more spread).
"""

md"---"

# ╔═╡ 00000000-0000-0000-0000-000000000015
md"""
## Takeaway

- **Name the primitive** first.
- Run a **gate** (units / sign / rearrangement / limit).
- Then compute with the correct tool.

That is the entire course.
"""
