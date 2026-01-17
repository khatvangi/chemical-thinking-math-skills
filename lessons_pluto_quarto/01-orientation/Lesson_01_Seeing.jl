### A Pluto.jl notebook ###
# v0.19.38

#> [frontmatter]
#> title = "Lesson 01 — Orientation (Seeing)"
#> layout = "layout.jlhtml"
#> description = "Reality → Recognition → Tool"
#> tags = ["lecture", "orientation", "primitives", "chemistry"]

using Markdown
using InteractiveUtils

# ╔═╡ 6a6b0a9f-0b4d-4b55-8b44-0e6d2a9e0c19
md"""
# Lesson 01 — Orientation (Seeing)

Reality → Recognition → Tool
"""

# ╔═╡ 1b0b1b33-6b6f-4f0c-9d2c-2d19c4b4c96a
md"""
## Course order

1. State a phenomenon in chemical terms.
2. Identify the primitive(s).
3. Introduce the mathematical tool.
"""

# ╔═╡ 35e1cddb-8a6f-4a6b-a7f0-70f7b1b4ccee
md"""
## A → B as a state update

Let a chemical state be a composition vector \(x\). A reaction is represented by a stoichiometric matrix \(S\) and a progress vector \(r\):

\[
\Delta x = S r
\]
"""

# ╔═╡ 1d0e2043-bcde-46cb-bbb1-9f5b31cfe6f6
begin
	using LinearAlgebra
	using PlutoUI
	using Plots
	default(fontfamily="Computer Modern", linewidth=2, size=(700, 360))
end

# ╔═╡ 3f94d6c5-3f26-45a7-923e-3d2032878b4b
S = [-1 0; 1 -1; 0 1]

# ╔═╡ 2efec9b0-c5df-4f3c-97d3-241a4ecf62f9
x0 = [2.0, 0.0, 0.0]

# ╔═╡ 3ad5b2c7-df6e-4b24-8b19-6f6f2bd84c13
@bind r1 Slider(0.0:0.05:2.0, default=0.4, show_value=true)

# ╔═╡ 9c6b6d22-8f1b-4e1e-a2b9-7b62dca28247
@bind r2 Slider(0.0:0.05:2.0, default=0.2, show_value=true)

# ╔═╡ 4af1cc79-4f9b-4c7e-9e17-1a7a6c17dc04
begin
	r = [r1, r2]
	x = x0 + S * r
	bar(["A", "B", "C"], x0, label="initial", title="State update: x' = x + S r")
	bar!(["A", "B", "C"], x, label="updated", alpha=0.7)
end

# ╔═╡ 44ab7a32-1b5d-4c5e-bb3c-4f6b6a4b1d06
md"""
## Conservation as SAMENESS

A conserved quantity satisfies \(\ell^T S = 0\).
"""

# ╔═╡ 1b2b22ab-2e8b-4a0c-ae7b-6d8d7cfc8a6a
begin
	ℓ = [1.0, 1.0, 1.0]
	(ℓ' * S)
end

# ╔═╡ 3e3b5c03-bd9b-4c6e-9c2b-0a0c193f8c6c
md"""
## Diffusion profile (PROXIMITY + CHANGE)

Model:

\[
\frac{\partial c}{\partial t} = D\,\frac{\partial^2 c}{\partial x^2}
\]
"""

# ╔═╡ 8de0e3d1-0f4e-4f9b-8cf1-74c5ff5c7eaf
@bind D Slider(0.1:0.1:2.0, default=0.6, show_value=true)

# ╔═╡ 2db59b9b-4472-4c12-9fb3-c571c6d79a25
@bind t Slider(0.0:0.1:5.0, default=1.0, show_value=true)

# ╔═╡ 2b8be4f6-3ed3-44a1-93ef-88976b2db1f7
begin
	σ0 = 0.6
	σ = sqrt(σ0^2 + 2 * D * t)
	x = range(-5, 5, length=300)
	c = (1 / (σ * sqrt(2 * pi))) .* exp.(-x .^ 2 ./ (2 * σ^2))
	plot(x, c, xlabel="x", ylabel="c(x,t)", title="Diffusion profile", label="")
end

# ╔═╡ 8f21a40a-7a8f-4b9e-9d7e-0e7b13f66c6b
md"""
## First-order kinetics (RATE)

\[
\dot{A} = -k A
\]
"""

# ╔═╡ e1475cb3-cc7e-4f3b-95a9-62e3d1449a22
@bind k Slider(0.05:0.05:1.0, default=0.2, show_value=true)

# ╔═╡ 3b99f97d-d02d-4a8f-9a2e-30c1a6f2f209
begin
	t = range(0, 10, length=300)
	A0 = 1.0
	A = A0 .* exp.(-k .* t)
	plot(t, A, xlabel="t", ylabel="A(t)", title="First-order decay", label="")
end

# ╔═╡ 9bdf3d4a-82d6-47f4-bc7a-2357b52b5a9f
md"""
## Summary

The notebook introduces three formal statements:

- State update: \(\Delta x = S r\)
- Diffusion: \(\partial_t c = D\,\partial_{xx} c\)
- First-order rate law: \(\dot{A} = -kA\)
"""

# ╔═╡ Cell order:
# ╠═6a6b0a9f-0b4d-4b55-8b44-0e6d2a9e0c19
# ╠═1b0b1b33-6b6f-4f0c-9d2c-2d19c4b4c96a
# ╠═35e1cddb-8a6f-4a6b-a7f0-70f7b1b4ccee
# ╠═1d0e2043-bcde-46cb-bbb1-9f5b31cfe6f6
# ╠═3f94d6c5-3f26-45a7-923e-3d2032878b4b
# ╠═2efec9b0-c5df-4f3c-97d3-241a4ecf62f9
# ╠═3ad5b2c7-df6e-4b24-8b19-6f6f2bd84c13
# ╠═9c6b6d22-8f1b-4e1e-a2b9-7b62dca28247
# ╠═4af1cc79-4f9b-4c7e-9e17-1a7a6c17dc04
# ╠═44ab7a32-1b5d-4c5e-bb3c-4f6b6a4b1d06
# ╠═1b2b22ab-2e8b-4a0c-ae7b-6d8d7cfc8a6a
# ╠═3e3b5c03-bd9b-4c6e-9c2b-0a0c193f8c6c
# ╠═8de0e3d1-0f4e-4f9b-8cf1-74c5ff5c7eaf
# ╠═2db59b9b-4472-4c12-9fb3-c571c6d79a25
# ╠═2b8be4f6-3ed3-44a1-93ef-88976b2db1f7
# ╠═8f21a40a-7a8f-4b9e-9d7e-0e7b13f66c6b
# ╠═e1475cb3-cc7e-4f3b-95a9-62e3d1449a22
# ╠═3b99f97d-d02d-4a8f-9a2e-30c1a6f2f209
# ╠═9bdf3d4a-82d6-47f4-bc7a-2357b52b5a9f
