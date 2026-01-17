### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra
using DelimitedFiles

# ╔═╡ ec858cc0-6b36-4f70-b54f-4ae8a3b8704c
md"""
# Lecture 08 — Transformations
"""

# ╔═╡ f8bd26a5-8337-44fe-be11-db5675946458
md"""
## 1) Build a 2D linear transformation
We combine rotation + scaling + shear.
"""

# ╔═╡ 4583e4d6-f20b-40ca-8241-bd81ec5c4a9e
@bind θ Slider(-pi:0.01:pi, default=0.5, show_value=true)
@bind sx Slider(0.2:0.05:3.0, default=1.3, show_value=true)
@bind sy Slider(0.2:0.05:3.0, default=0.8, show_value=true)
@bind k Slider(-2:0.05:2, default=0.3, show_value=true)

# ╔═╡ ea36f5bd-ea87-49ed-a981-240110dc705c
let
    R = [cos(θ) -sin(θ); sin(θ) cos(θ)]
    S = [sx 0.0; 0.0 sy]
    Sh = [1.0 k; 0.0 1.0]
    A = R * Sh * S

    square = [0 0; 1 0; 1 1; 0 1; 0 0]
    sq2 = (A * square')'

    p = plot(aspect_ratio=:equal, xlim=(-4,4), ylim=(-4,4), legend=:bottomright,
        title="Transform a square", xlabel="x", ylabel="y")
    plot!(p, square[:,1], square[:,2], label="original")
    plot!(p, sq2[:,1], sq2[:,2], label="transformed")

    e1 = A * [1.0,0.0]
    e2 = A * [0.0,1.0]
    plot!(p, [0,e1[1]], [0,e1[2]], arrow=true, label="A e1 (col 1)")
    plot!(p, [0,e2[1]], [0,e2[2]], arrow=true, label="A e2 (col 2)")

    md"""
Matrix \(A\):

\[
A = \begin{pmatrix}
$(round(A[1,1],digits=3)) & $(round(A[1,2],digits=3))\\
$(round(A[2,1],digits=3)) & $(round(A[2,2],digits=3))
\end{pmatrix}
\]
"""
    p
end

# ╔═╡ 72067ec5-6f59-4a17-adf6-8d0bf6b0e6c6
md"""
## 2) Basis determines the transform (numerical check)
Pick a vector and compare two ways to compute \(A\vec x\).
"""

# ╔═╡ c240feb5-cabb-41a5-b51c-44e6970f0e79
@bind u Slider(-3:0.1:3, default=1.1, show_value=true)
@bind v Slider(-3:0.1:3, default=-0.7, show_value=true)

# ╔═╡ 06486125-76f2-4dc8-9ff0-1681279c4fb1
let
    R = [cos(θ) -sin(θ); sin(θ) cos(θ)]
    S = [sx 0.0; 0.0 sy]
    Sh = [1.0 k; 0.0 1.0]
    A = R * Sh * S

    x = [u, v]
    direct = A * x

    col1 = A[:,1]
    col2 = A[:,2]
    combo = u*col1 + v*col2

    md"""
\(A\vec x\) direct = $(round.(direct, digits=6))  
column combo = $(round.(combo, digits=6))  

Difference norm = $(round(norm(direct-combo), digits=12))
"""
end