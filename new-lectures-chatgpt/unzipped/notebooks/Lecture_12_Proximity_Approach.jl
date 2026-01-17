# ╔═╡ 22e35c43-b443-45c8-95bb-b2ee2a964402
### A Pluto.jl notebook ###
# v0.19.x
using Markdown
using InteractiveUtils
using PlutoUI


# ╔═╡ cd45be8d-3cb8-4bb4-92d9-7de853ab01d0
md"# PROXIMITY — As x Approaches…"

# ╔═╡ d8201ec1-df44-4465-8ee6-15cb3f0e4377
md"## Approach a boundary (numerical limit probe)"

# ╔═╡ c36dd924-df77-44d4-bda8-1aa3702e1d8b
x0 = @bind x0 Slider(0.01:0.01:1.0, default=0.2, show_value=true)
f(x) = sin(1/x)
y = f(x0)
md"""x = **$(round(x0,digits=3))** → f(x)=sin(1/x)= **$(round(y,digits=3))**  
Now slide x toward 0 and watch the behavior."""


# ╔═╡ b67e5cc7-9721-424a-b484-4db89051439e
md"## Chem knob: low-pressure ideality proxy"

# ╔═╡ 811cec3e-c8a8-4be2-a740-c65d9d0ce131
P = @bind P Slider(0.0:0.1:10.0, default=1.0, show_value=true)  # atm
Z = 1 + 0.02P
md"""P = **$(round(P,digits=2)) atm** → Z(P)= **$(round(Z,digits=3))**  
As P→0, Z→1 (ideal regime)."""


# ╔═╡ Cell order:
# ╠═╡ 22e35c43-b443-45c8-95bb-b2ee2a964402
# ╠═╡ cd45be8d-3cb8-4bb4-92d9-7de853ab01d0
# ╠═╡ d8201ec1-df44-4465-8ee6-15cb3f0e4377
# ╠═╡ c36dd924-df77-44d4-bda8-1aa3702e1d8b
# ╠═╡ b67e5cc7-9721-424a-b484-4db89051439e
# ╠═╡ 811cec3e-c8a8-4be2-a740-c65d9d0ce131
