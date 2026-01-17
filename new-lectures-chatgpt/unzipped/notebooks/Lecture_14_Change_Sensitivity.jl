# ╔═╡ 4e02272a-9ea6-49ca-bd06-a15d5d82534a
### A Pluto.jl notebook ###
# v0.19.x
using Markdown
using InteractiveUtils
using PlutoUI


# ╔═╡ 160f235b-e9c4-47f2-805f-d3562c6c5177
md"# CHANGE — Instantaneous Sensitivity"

# ╔═╡ e91cb775-0003-46ad-a8a9-1dafdf2ab03f
md"## Slope from secants → tangent (sensitivity)"

# ╔═╡ ec9dd5ac-3f7b-4104-93b3-aeb64e40d1a7
x0 = @bind x0 Slider(-2.0:0.1:2.0, default=1.0, show_value=true)
h  = @bind h  Slider(0.001:0.001:0.1, default=0.05, show_value=true)
f(x)=x^3
sec = (f(x0+h)-f(x0))/h
tan = 3x0^2
md"""x0=$(round(x0,digits=2)), h=$(round(h,digits=3))  
secant slope ≈ **$(round(sec,digits=4))**  
derivative = **$(round(tan,digits=4))**"""


# ╔═╡ 7c2540e5-b58d-43f0-853b-2cb1e36e2442
md"## Chem knob: force from potential"

# ╔═╡ b43613b5-f5f1-4cbd-beec-8e5fdaa25d60
x = @bind x Slider(-2.0:0.1:2.0, default=0.5, show_value=true)
U(x)=x^2
F(x)=-2x
md"""U(x)=x² at x=$(round(x,digits=2)) gives force F = **$(round(F(x),digits=3))** (arbitrary units)."""


# ╔═╡ Cell order:
# ╠═╡ 4e02272a-9ea6-49ca-bd06-a15d5d82534a
# ╠═╡ 160f235b-e9c4-47f2-805f-d3562c6c5177
# ╠═╡ e91cb775-0003-46ad-a8a9-1dafdf2ab03f
# ╠═╡ ec9dd5ac-3f7b-4104-93b3-aeb64e40d1a7
# ╠═╡ 7c2540e5-b58d-43f0-853b-2cb1e36e2442
# ╠═╡ b43613b5-f5f1-4cbd-beec-8e5fdaa25d60
