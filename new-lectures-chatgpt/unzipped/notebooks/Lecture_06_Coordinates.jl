### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra
using DelimitedFiles

# ╔═╡ a69e7d6f-c932-4768-afc6-e885455ca8a1
md"""
# Lecture 06 — Coordinates
"""

# ╔═╡ f887a80b-dbed-483e-bebc-6ba869ca193d
md"""
## 1) A vector, two descriptions
Move the sliders. Compare:
- **Rotate the object** (physical rotation)
- **Rotate the axes** (change of coordinates)
"""

# ╔═╡ 33818832-312b-4b92-aad0-36034ecd5dd8
@bind θ Slider(0:0.01:2pi, default=0.6, show_value=true)

# ╔═╡ 87cc24b9-fed9-4f85-a9e7-ba275dd3969e
@bind vx Slider(-5:0.1:5, default=3.0, show_value=true)
@bind vy Slider(-5:0.1:5, default=2.0, show_value=true)

# ╔═╡ adfe4f76-7557-4ee2-9285-f87871217ffe
let
    v = [vx, vy]
    R = [cos(θ) -sin(θ); sin(θ) cos(θ)]

    v_obj = R * v
    v_axes = R' * v

    p = plot(xlim=(-6,6), ylim=(-6,6), aspect_ratio=:equal, legend=:bottomright,
        title="Vector: rotate object vs rotate axes", xlabel="x", ylabel="y")
    plot!(p, [0,v[1]], [0,v[2]], arrow=true, label="v (original)")
    plot!(p, [0,v_obj[1]], [0,v_obj[2]], arrow=true, label="rotate object: Rv")

    e1 = R * [1.0,0.0]
    e2 = R * [0.0,1.0]
    plot!(p, [0,e1[1]], [0,e1[2]], lw=2, label="rotated x-axis")
    plot!(p, [0,e2[1]], [0,e2[2]], lw=2, label="rotated y-axis")

    md"""
**Coordinates in rotated axes:** \(v' = R^	op v = ($(round(v_axes[1],digits=3)), $(round(v_axes[2],digits=3)))\)

**Lengths:** \(|v|=$(round(norm(v),digits=4))\), \(|Rv|=$(round(norm(v_obj),digits=4))\)
"""
    p
end

# ╔═╡ cd8c273a-42ce-4547-adf6-833009491f09
md"""
## 2) Bond vectors from shipped data
We load `water_coords.csv` and compute O–H bond lengths.
"""

# ╔═╡ af7072c6-29b5-4cee-8bbd-6c470700fb89
let
    path = joinpath(@__DIR__, "..", "assets", "lessons", "06-coordinates", "data", "water_coords.csv")
    data = readdlm(path, ',', skipstart=1)
    O = data[1,2:4]
    H1 = data[2,2:4]
    H2 = data[3,2:4]
    r1 = H1 - O
    r2 = H2 - O
    md"""
Bond lengths (Å):
- \(|r_{OH1}| = $(round(norm(r1), digits=6))\)
- \(|r_{OH2}| = $(round(norm(r2), digits=6))\)
"""
end