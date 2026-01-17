### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra
using DelimitedFiles

# ╔═╡ 45060257-e1ec-438b-ac1e-9f3ab40c5185
md"""
# Lecture 10 — Characteristic Directions
"""

# ╔═╡ eb04371e-ffb9-4b6a-bd60-2fe6a5ceddf2
md"""
## 1) Eigenvectors as characteristic directions
Use a symmetric 2×2 matrix \(A=\begin{pmatrix}a&b\\b&c\end{pmatrix}\).
"""

# ╔═╡ 0741c0c2-f2b3-427a-9e62-7691651e1828
@bind a Slider(-1:0.1:6, default=3.0, show_value=true)
@bind b Slider(-3:0.1:3, default=1.2, show_value=true)
@bind c Slider(-1:0.1:6, default=1.0, show_value=true)

# ╔═╡ 1168b3bc-a528-4bdc-9779-bd5673914534
let
    A = [a b; b c]
    vals, vecs = eigen(Symmetric(A))
    λ1, λ2 = vals
    v1 = vecs[:,1]; v2 = vecs[:,2]

    t = range(0, 2pi, length=300)
    circle = [cos.(t) sin.(t)]'
    E = vecs * Diagonal(sqrt.(vals)) * circle

    p = plot(E[1,:], E[2,:], aspect_ratio=:equal, legend=false,
             title="Ellipse + eigenvectors", xlabel="x", ylabel="y")
    quiver!(p, [0.0], [0.0], quiver=([v1[1]*sqrt(λ1)],[v1[2]*sqrt(λ1)]))
    quiver!(p, [0.0], [0.0], quiver=([v2[1]*sqrt(λ2)],[v2[2]*sqrt(λ2)]))

    md"""
Eigenvalues: \(\lambda_1=$(round(λ1,digits=4))\), \(\lambda_2=$(round(λ2,digits=4))\)

Trace: \(a+c=$(round(a+c,digits=4))\) vs \(\lambda_1+\lambda_2=$(round(λ1+λ2,digits=4))\)  
Det: \(ac-b^2=$(round(a*c-b^2,digits=4))\) vs \(\lambda_1\lambda_2=$(round(λ1*λ2,digits=4))\)
"""
    p
end

# ╔═╡ 0c2a4d38-8701-4fb6-92e6-d2ee17b334e2
md"""
## 2) Quick eigenvector test
Pick v and verify \(Av\) is parallel to v.
"""

# ╔═╡ 6142347d-b33c-4510-804c-12fc2a17107c
@bind which Slider(1:2, default=1, show_value=true)

# ╔═╡ fc679bf0-ce33-4a44-ba67-19f98ac92461
let
    A = [a b; b c]
    vals, vecs = eigen(Symmetric(A))
    v = vecs[:,Int(which)]
    λ = vals[Int(which)]
    Av = A*v
    md"""
Chosen: v$(Int(which))

\(\|Av - \lambda v\| = $(round(norm(Av-λ*v), digits=12))\)
"""
end