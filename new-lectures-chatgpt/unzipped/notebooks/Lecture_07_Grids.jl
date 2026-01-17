### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra
using DelimitedFiles

# ╔═╡ e1ab6e6a-030b-485f-880c-315776f9a1f6
md"""
# Lecture 07 — Grids of Numbers
"""

# ╔═╡ 358045f6-4d8a-4d61-b7fa-6eb65f9601d6
md"""
## 1) Heatmap + slices
Load the absorbance grid and slice by row/column.
"""

# ╔═╡ 091b8256-3b6d-4c34-a02f-ad0e730fb819
@bind sample_idx Slider(1:4, default=1, show_value=true)
@bind wl_idx Slider(1:5, default=3, show_value=true)

# ╔═╡ f27cd14e-8f13-4e4e-8233-424aa2385ded
let
    path = joinpath(@__DIR__, "..", "assets", "lessons", "07-grids", "data", "absorbance_grid.csv")
    raw = readdlm(path, ',', skipstart=0)
    header = raw[1,2:end]
    wl = raw[2:end,1]
    A = raw[2:end,2:end]
    s = Int(sample_idx)
    w = Int(wl_idx)

    p1 = heatmap(A, title="Absorbance grid (rows=wavelength, cols=samples)", xlabel="sample", ylabel="wavelength index")
    p2 = plot(wl, A[:,s], marker=:circle, title="Slice: one sample vs wavelength",
              xlabel="wavelength (nm)", ylabel="absorbance", legend=false)
    p3 = bar(1:size(A,2), A[w,:], title="Slice: one wavelength across samples",
             xlabel="sample index", ylabel="absorbance", legend=false)

    md"""
Chosen sample: **$(header[s])**, chosen wavelength: **$(wl[w]) nm**
"""
    plot(p1, p2, p3, layout=(1,3), size=(1100,320))
end

# ╔═╡ d1db013f-5792-44f2-9e52-be34ad967deb
md"""
## 2) Column-mixture view of Ax
Pick weights and form a weighted sum of columns.
"""

# ╔═╡ 2c16a763-d002-4c8a-be96-5d63042afcb3
@bind x1 Slider(0:0.05:1, default=0.5, show_value=true)
@bind x2 Slider(0:0.05:1, default=0.2, show_value=true)

# ╔═╡ 1c5fea40-c688-4fd7-8364-1b1c2917e122
let
    path = joinpath(@__DIR__, "..", "assets", "lessons", "07-grids", "data", "absorbance_grid.csv")
    raw = readdlm(path, ',', skipstart=0)
    wl = raw[2:end,1]
    A = raw[2:end,2:end]

    x = [x1, x2, 0.0, 0.0]
    mix = A * x

    p = plot(wl, mix, marker=:circle, title="Mixture spectrum = A*x (using first two samples)",
             xlabel="wavelength (nm)", ylabel="absorbance", legend=false)
    md"""
Weights: \(x = ($(x1), $(x2), 0, 0)\)

This is \(x_1\,A_{:1} + x_2\,A_{:2}\).
"""
    p
end