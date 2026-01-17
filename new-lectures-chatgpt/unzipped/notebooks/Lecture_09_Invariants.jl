### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra
using DelimitedFiles

# ╔═╡ 4a906ebf-d5ea-49eb-a9fd-1eb04a135027
md"""
# Lecture 09 — Invariants
"""

# ╔═╡ 17ff7d41-5725-49cc-9f5a-f2e7931fb211
md"""
## 1) Rotation preserves length (orthogonal invariant)
Move θ and the vector components.
"""

# ╔═╡ cbda6c1f-b060-497b-bba4-a3f70cae497d
@bind θ Slider(0:0.01:2pi, default=0.4, show_value=true)
@bind vx Slider(-5:0.1:5, default=3.0, show_value=true)
@bind vy Slider(-5:0.1:5, default=1.5, show_value=true)

# ╔═╡ 64900f1c-f13d-4e5b-b419-87eac6b76c6f
let
    v = [vx, vy]
    R = [cos(θ) -sin(θ); sin(θ) cos(θ)]
    vr = R * v

    md"""
\(|v| = $(round(norm(v), digits=6))\)  
\(|Rv| = $(round(norm(vr), digits=6))\)  
difference = $(round(abs(norm(v)-norm(vr)), digits=12))
"""
    p = plot(aspect_ratio=:equal, xlim=(-6,6), ylim=(-6,6), legend=false,
        title="v and Rv", xlabel="x", ylabel="y")
    plot!(p, [0,v[1]], [0,v[2]], arrow=true)
    plot!(p, [0,vr[1]], [0,vr[2]], arrow=true)
    p
end

# ╔═╡ 2e8bb6cd-1bad-4db2-9ef1-49ab10713170
md"""
## 2) Invariance can fail (by design)
Switch to a non-orthogonal transform and watch length change.
"""

# ╔═╡ a0c0ffc3-4bcf-41d1-a44a-adf292944b9b
@bind s Slider(0.2:0.05:3.0, default=1.5, show_value=true)

# ╔═╡ 3f96bc37-4dab-4c6e-a1d1-6210a0721cec
let
    v = [vx, vy]
    A = [s 0.0; 0.0 1.0]
    av = A * v
    md"""
Scaling matrix \(A=\mathrm{diag}($s,1)\)

\(|v|=$(round(norm(v),digits=6))\), \(|Av|=$(round(norm(av),digits=6))\)
"""
end