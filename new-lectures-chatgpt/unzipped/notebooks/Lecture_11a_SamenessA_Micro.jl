# ╔═╡ 108102ae-01b8-4143-b7d5-15b27bde0691
### A Pluto.jl notebook ###
# v0.19.x
using Markdown
using InteractiveUtils
using PlutoUI


# ╔═╡ fd02206f-7f81-47e9-b1b3-2e462d24f505
md"# SAMENESS-A Micro — Same State, Different Description"

# ╔═╡ c7bd14dd-840d-42df-b23b-af1f6459b49f
md"## Rotate-and-compare (invariance test)"

# ╔═╡ 20e28ba0-39ab-40f7-ae70-acb79a3f54ca
θ = @bind θ Slider(0:5:360, default=0, show_value=true)
v = [1.0, 0.0]
R = [cosd(θ) -sind(θ); sind(θ) cosd(θ)]
v_rot = R*v
mag = sqrt(sum(v.^2))
mag_rot = sqrt(sum(v_rot.^2))
md"""Rotation angle = **$(θ)°**  
v = $(v), Rv = $(round.(v_rot, digits=3))  
|v| = $(round(mag,digits=3)), |Rv| = $(round(mag_rot,digits=3))  """


# ╔═╡ fb4d913a-b10f-4f6e-b98f-387aaa366a6a
md"## Chem knob: unit conversion as same state"

# ╔═╡ 2cc622fd-6373-42d6-a00c-0d96479a303e
c_M = @bind c_M Slider(0.0:0.01:1.0, default=0.10, show_value=true)
c_mM = 1000c_M
md"""Concentration: **$(round(c_M,digits=3)) M** = **$(round(c_mM,digits=1)) mM** (same state)"""


# ╔═╡ Cell order:
# ╠═╡ 108102ae-01b8-4143-b7d5-15b27bde0691
# ╠═╡ fd02206f-7f81-47e9-b1b3-2e462d24f505
# ╠═╡ c7bd14dd-840d-42df-b23b-af1f6459b49f
# ╠═╡ 20e28ba0-39ab-40f7-ae70-acb79a3f54ca
# ╠═╡ fb4d913a-b10f-4f6e-b98f-387aaa366a6a
# ╠═╡ 2cc622fd-6373-42d6-a00c-0d96479a303e
