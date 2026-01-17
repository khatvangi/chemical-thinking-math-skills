# ╔═╡ faf73c08-4a81-4140-8267-12c0b33d0bf4
### A Pluto.jl notebook ###
# v0.19.x
using Markdown
using InteractiveUtils
using PlutoUI


# ╔═╡ 284cc1b8-9957-47a5-a94a-76a82607e5ef
md"# PROXIMITY — Regimes & Limits"

# ╔═╡ 2c552e65-ba8c-4061-aee0-cd5b3cc27daa
md"## Approach a boundary (numerical limit probe)"

# ╔═╡ c1bd0de6-14a3-42f2-b333-67c68c79d7b0
x0 = @bind x0 Slider(0.01:0.01:1.0, default=0.2, show_value=true)
f(x) = sin(1/x)
y = f(x0)
md"""x = **$(round(x0,digits=3))** → f(x)=sin(1/x)= **$(round(y,digits=3))**  
Now slide x toward 0 and watch the behavior."""


# ╔═╡ 498c5910-756c-451c-b393-aedb49e8b908
md"## Chem knob: low-pressure ideality proxy"

# ╔═╡ dbd46d8c-7fc3-4d9d-87a1-f8a7782d6cad
P = @bind P Slider(0.0:0.1:10.0, default=1.0, show_value=true)  # atm
Z = 1 + 0.02P
md"""P = **$(round(P,digits=2)) atm** → Z(P)= **$(round(Z,digits=3))**  
As P→0, Z→1 (ideal regime)."""


# ╔═╡ Cell order:
# ╠═╡ faf73c08-4a81-4140-8267-12c0b33d0bf4
# ╠═╡ 284cc1b8-9957-47a5-a94a-76a82607e5ef
# ╠═╡ 2c552e65-ba8c-4061-aee0-cd5b3cc27daa
# ╠═╡ c1bd0de6-14a3-42f2-b333-67c68c79d7b0
# ╠═╡ 498c5910-756c-451c-b393-aedb49e8b908
# ╠═╡ dbd46d8c-7fc3-4d9d-87a1-f8a7782d6cad
