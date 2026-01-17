# ╔═╡ d8c4cf55-9d56-476d-b570-358c90ac270c
### A Pluto.jl notebook ###
# v0.19.x
using Markdown
using InteractiveUtils
using PlutoUI


# ╔═╡ 84f05a8a-6ced-40ad-a18a-80abc24c60f9
md"# SAMENESS-B — Symmetry (Preview)"

# ╔═╡ 7aa165e6-090c-44cf-a97f-73819bbe8739
md"## Rotate-and-compare (invariance test)"

# ╔═╡ 8f7429f4-a191-451d-a8ba-1daabe38cc2e
θ = @bind θ Slider(0:5:360, default=0, show_value=true)
v = [1.0, 0.0]
R = [cosd(θ) -sind(θ); sind(θ) cosd(θ)]
v_rot = R*v
mag = sqrt(sum(v.^2))
mag_rot = sqrt(sum(v_rot.^2))
md"""Rotation angle = **$(θ)°**  
v = $(v), Rv = $(round.(v_rot, digits=3))  
|v| = $(round(mag,digits=3)), |Rv| = $(round(mag_rot,digits=3))  """


# ╔═╡ 96ac451c-a2e5-43fc-a143-c5f5af84fbfd
md"## Chem knob: unit conversion as same state"

# ╔═╡ d68d3d01-b8a3-4a29-8f97-a6ba41841508
c_M = @bind c_M Slider(0.0:0.01:1.0, default=0.10, show_value=true)
c_mM = 1000c_M
md"""Concentration: **$(round(c_M,digits=3)) M** = **$(round(c_mM,digits=1)) mM** (same state)"""


# ╔═╡ Cell order:
# ╠═╡ d8c4cf55-9d56-476d-b570-358c90ac270c
# ╠═╡ 84f05a8a-6ced-40ad-a18a-80abc24c60f9
# ╠═╡ 7aa165e6-090c-44cf-a97f-73819bbe8739
# ╠═╡ 8f7429f4-a191-451d-a8ba-1daabe38cc2e
# ╠═╡ 96ac451c-a2e5-43fc-a143-c5f5af84fbfd
# ╠═╡ d68d3d01-b8a3-4a29-8f97-a6ba41841508
