### A Pluto.jl notebook ###
# v0.19.38

#> [frontmatter]
#> title = "Lesson 02 — Existence (Number Systems)"
#> layout = "layout.jlhtml"
#> description = "What kinds of numbers are allowed?"
#> tags = ["lecture", "existence", "numbers", "chemistry"]

using Markdown
using InteractiveUtils

# ╔═╡ d5a645d1-29b6-4c6a-9ab0-5b5c1ef2f8f7
md"""
# Lesson 02 — Existence (Number Systems)

A chemical description is only as precise as the number system that encodes it. This notebook places exact representations next to floating approximations and treats units as part of the number itself.
"""

# ╔═╡ 04d515c5-1a21-4d08-8a7c-3fe11b326c3d
begin
	using PlutoUI
	using LinearAlgebra
	using Printf
end

# ╔═╡ 2f9efad9-0a7c-4c45-90ed-3c7b1a2d4f35
md"""
## Rational vs floating representation

A rational number has an exact repeating decimal expansion. Floating arithmetic truncates it. We compare exact rationals with floating approximations and compute the period length using modular arithmetic.
"""

# ╔═╡ 9f3f9a6a-2f7d-4b0f-9b2f-8d6f9a3f0b2a
rvals = [2//3, 4//9, 3//7]

# ╔═╡ 6d5b76f3-0830-4a5c-8d9a-9f8f3b1c62f4
[r => Float64(r) for r in rvals]

# ╔═╡ 12b3f0d2-49e4-4a7f-9ef7-8b7b0d85ff21
function period_length(q)
	q = Int(q)
	while q % 2 == 0
		q ÷= 2
	end
	while q % 5 == 0
		q ÷= 5
	end
	if q == 1
		return 0
	end
	k = 1
	pow = 10 % q
	while pow != 1
		pow = (pow * 10) % q
		k += 1
	end
	return k
end

# ╔═╡ 4c2f6c44-4bdb-4f52-8b6b-8c5c2a8d2f14
[(r, denominator(r), period_length(denominator(r))) for r in rvals]

# ╔═╡ 8a01d202-6a0e-4f5f-8e42-7e5cfd82f0b6
@bind prec Slider(16:16:256, default=64, show_value=true)

# ╔═╡ 2c10fdd4-0f83-4f9a-8b8a-0d12031b5c7a
begin
	setprecision(prec) do
		[(r, BigFloat(r)) for r in rvals]
	end
end

# ╔═╡ 4f3bcb1a-1c33-44b7-932f-20d8d7b4e1c1
md"""
## Unit conversion as representation

A number without units is not a measurement. These conversions enforce dimensional consistency.
"""

# ╔═╡ b4f0a5b3-8b8a-4a9c-89f1-fb35a7b6f7b2
begin
	eV_to_J = 1.6022e-19
	E = 13.6 * eV_to_J
	mi_to_m = 1609.344
	v = 55 * mi_to_m / 3600
	l = 24.17 * mi_to_m
	v2 = 7.53e-9 * 1e12
	(; E, l, v, v2)
end

# ╔═╡ 2b8f3b52-6e19-4b5d-9e9a-0d67b3e4c9f2
md"""
## Dimension vectors

We encode dimensions as integer exponent vectors of base units (M, L, T). This enforces well‑formedness.
"""

# ╔═╡ 6e4a70e6-84d2-4a1f-a9e0-7c6f7db8c3c7
begin
	# M, L, T exponents
	energy = [1, 2, -2]   # ML^2 T^-2
	time = [0, 0, 1]
	rate = energy .- time
	(; energy, time, rate)
end

# ╔═╡ 2c8d6d64-6eb0-4f1a-93f0-2aa2a6d5c5b1
md"""
## Complex plane as coordinates

The complex plane is a coordinate system for a two‑component state. Phase becomes geometry.
"""

# ╔═╡ 65e3318b-5b32-4d3e-9c4f-0a2d3fd9b3c4
@bind θ Slider(0:1:180, default=45, show_value=true)

# ╔═╡ 3a6a2a9f-9d1f-4b5a-9f2d-6d8a0f2f2b59
begin
	using Plots
	default(fontfamily="Computer Modern", linewidth=2, size=(600, 360))
	z = cis(deg2rad(θ))
	plot([0, real(z)], [0, imag(z)], xlabel="Re", ylabel="Im", label="z", xlim=(-1.1, 1.1), ylim=(-1.1, 1.1), aspect_ratio=:equal)
	scatter!([real(z)], [imag(z)], label="")
end

# ╔═╡ 71dc8d8b-1b90-4b41-9f1a-9df6a8a7c4d9
md"""
## Precision and representation error

A real number like \(\sqrt{2}\) has no finite decimal expansion. Precision therefore controls the truncation error.
"""

# ╔═╡ 14f2d0f8-3a4e-4b6c-8c90-9a0a70f72d2d
@bind digits Slider(10:5:80, default=30, show_value=true)

# ╔═╡ 8af9a25e-7f52-4f0f-8f05-8fa7d0f3e2e6
begin
	setprecision(256) do
		ref = BigFloat(2)^(BigFloat(1)/2)
		setprecision(digits) do
			approx = BigFloat(2)^(BigFloat(1)/2)
			err = abs(ref - approx)
			(ref=ref, approx=approx, err=err)
		end
	end
end

# ╔═╡ Cell order:
# ╠═d5a645d1-29b6-4c6a-9ab0-5b5c1ef2f8f7
# ╠═04d515c5-1a21-4d08-8a7c-3fe11b326c3d
# ╠═2f9efad9-0a7c-4c45-90ed-3c7b1a2d4f35
# ╠═9f3f9a6a-2f7d-4b0f-9b2f-8d6f9a3f0b2a
# ╠═6d5b76f3-0830-4a5c-8d9a-9f8f3b1c62f4
# ╠═12b3f0d2-49e4-4a7f-9ef7-8b7b0d85ff21
# ╠═4c2f6c44-4bdb-4f52-8b6b-8c5c2a8d2f14
# ╠═8a01d202-6a0e-4f5f-8e42-7e5cfd82f0b6
# ╠═2c10fdd4-0f83-4f9a-8b8a-0d12031b5c7a
# ╠═4f3bcb1a-1c33-44b7-932f-20d8d7b4e1c1
# ╠═b4f0a5b3-8b8a-4a9c-89f1-fb35a7b6f7b2
# ╠═2b8f3b52-6e19-4b5d-9e9a-0d67b3e4c9f2
# ╠═6e4a70e6-84d2-4a1f-a9e0-7c6f7db8c3c7
# ╠═2c8d6d64-6eb0-4f1a-93f0-2aa2a6d5c5b1
# ╠═65e3318b-5b32-4d3e-9c4f-0a2d3fd9b3c4
# ╠═3a6a2a9f-9d1f-4b5a-9f2d-6d8a0f2f2b59
# ╠═71dc8d8b-1b90-4b41-9f1a-9df6a8a7c4d9
# ╠═14f2d0f8-3a4e-4b6c-8c90-9a0a70f72d2d
# ╠═8af9a25e-7f52-4f0f-8f05-8fa7d0f3e2e6
