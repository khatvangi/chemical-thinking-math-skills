# ╔═╡ a926834a-c605-4cc6-98c4-32256e7dd5af
### A Pluto.jl notebook ###
# v0.19.x
using Markdown
using InteractiveUtils
using PlutoUI


# ╔═╡ fbecfe36-77a1-462c-bd5d-4f6d3bbdeb65
md"# CHANGE — Rules of Change"

# ╔═╡ 9511936e-a129-4868-b1d6-c3250853dfc7
md"## Chain rule sandbox"

# ╔═╡ 9191a9f9-d242-487b-bde9-d693cec0fd63
x = @bind x Slider(0.2:0.1:5.0, default=1.0, show_value=true)
g(x)=1/x
f(u)=exp(-u)
y = f(g(x))
dy = y*(1/x^2)  # derivative of exp(-1/x)
md"""y(x)=exp(-1/x) at x=$(round(x,digits=2)) → y=$(round(y,digits=4))  
dy/dx = $(round(dy,digits=4))"""


# ╔═╡ 78c371ca-a238-499e-ba0c-ff8b7249d4d0
md"## Chem knob: Beer–Lambert linearity"

# ╔═╡ f84ab9d5-2fa9-4eb1-932c-c743a9468fd3
c = @bind c Slider(0.0:0.05:2.0, default=0.5, show_value=true)  # M
ε = 2.0
l = @bind l Slider(0.1:0.1:5.0, default=1.0, show_value=true)   # cm
A = ε*l*c
md"""A = ε l c with ε=$(ε), l=$(round(l,digits=1)) cm, c=$(round(c,digits=2)) M → A=$(round(A,digits=3))"""


# ╔═╡ Cell order:
# ╠═╡ a926834a-c605-4cc6-98c4-32256e7dd5af
# ╠═╡ fbecfe36-77a1-462c-bd5d-4f6d3bbdeb65
# ╠═╡ 9511936e-a129-4868-b1d6-c3250853dfc7
# ╠═╡ 9191a9f9-d242-487b-bde9-d693cec0fd63
# ╠═╡ 78c371ca-a238-499e-ba0c-ff8b7249d4d0
# ╠═╡ f84ab9d5-2fa9-4eb1-932c-c743a9468fd3
