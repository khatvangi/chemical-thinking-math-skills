### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000009-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    using LinearAlgebra
    plotly()
end

# ╔═╡ a1000009-0001-0001-0001-000000000002
md"""
# Lecture 9: What Doesn't Change?

*Invariants — the properties that survive transformation.*

---

## The Key Insight

When we change coordinates, most things change. But some properties stay the same.

These **invariants** are what's physically real — independent of our description.

| Changes with coordinates | Stays the same (invariant) |
|:-------------------------|:---------------------------|
| Matrix entries | Determinant |
| Atomic positions | Bond lengths |
| Eigenvector components | Eigenvalues |
| Dipole vector | Dipole magnitude |
"""

# ╔═╡ a1000009-0001-0001-0001-000000000003
md"""
---
## Similarity Invariants

Two matrices are **similar** if B = P⁻¹AP for some invertible P.

Similar matrices represent the **same transformation** in different bases.

**They must have the same:** trace, determinant, eigenvalues, rank.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000004
md"""
---
## Similarity Tester

Enter two matrices and check if they could be similar:
"""

# ╔═╡ a1000009-0001-0001-0001-000000000005
md"""
### Matrix A:
"""

# ╔═╡ a1000009-0001-0001-0001-000000000006
@bind a11 Slider(-5:1:5, default=4, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000007
@bind a12 Slider(-5:1:5, default=-2, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000008
@bind a21 Slider(-5:1:5, default=1, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000009
@bind a22 Slider(-5:1:5, default=1, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000010
md"""
### Matrix B:
"""

# ╔═╡ a1000009-0001-0001-0001-000000000011
@bind b11 Slider(-5:1:5, default=3, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000012
@bind b12 Slider(-5:1:5, default=0, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000013
@bind b21 Slider(-5:1:5, default=0, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000014
@bind b22 Slider(-5:1:5, default=2, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000015
begin
    A = [a11 a12; a21 a22]
    B = [b11 b12; b21 b22]

    tr_A = tr(A)
    tr_B = tr(B)
    det_A = det(A)
    det_B = det(B)

    eig_A = sort(real.(eigvals(A)))
    eig_B = sort(real.(eigvals(B)))

    rank_A = rank(A)
    rank_B = rank(B)

    # Check invariants
    tr_match = isapprox(tr_A, tr_B, atol=1e-10)
    det_match = isapprox(det_A, det_B, atol=1e-10)
    eig_match = isapprox(eig_A, eig_B, atol=1e-10)
    rank_match = rank_A == rank_B

    all_match = tr_match && det_match && eig_match && rank_match

    md"""
    ### Invariant Comparison

    | Invariant | Matrix A | Matrix B | Match? |
    |:----------|:---------|:---------|:-------|
    | **Trace** | $(round(tr_A, digits=3)) | $(round(tr_B, digits=3)) | $(tr_match ? "✓" : "✗") |
    | **Determinant** | $(round(det_A, digits=3)) | $(round(det_B, digits=3)) | $(det_match ? "✓" : "✗") |
    | **Eigenvalues** | $(round.(eig_A, digits=3)) | $(round.(eig_B, digits=3)) | $(eig_match ? "✓" : "✗") |
    | **Rank** | $(rank_A) | $(rank_B) | $(rank_match ? "✓" : "✗") |

    ### Verdict: $(all_match ? "**Possibly similar** (all invariants match)" : "**Not similar** (invariants differ)")

    $(all_match ? "*Note: Matching invariants is necessary but not always sufficient for similarity.*" : "")
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000016
md"""
---
## The Trace-Determinant Plane

For 2×2 matrices, trace and determinant determine eigenvalue type:

$\lambda = \frac{\text{tr} \pm \sqrt{\text{tr}^2 - 4\det}}{2}$

The discriminant tr² - 4det determines whether eigenvalues are real or complex.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000017
md"""
### Choose trace and determinant:
"""

# ╔═╡ a1000009-0001-0001-0001-000000000018
@bind tr_val Slider(-5:0.5:5, default=2, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000019
@bind det_val Slider(-5:0.5:5, default=1, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000020
begin
    disc = tr_val^2 - 4*det_val

    if disc > 0.01
        λ1 = (tr_val + sqrt(disc)) / 2
        λ2 = (tr_val - sqrt(disc)) / 2
        eig_type = "Two distinct real eigenvalues"
        eig_str = "λ₁ = $(round(λ1, digits=3)), λ₂ = $(round(λ2, digits=3))"
    elseif disc < -0.01
        re_part = tr_val / 2
        im_part = sqrt(-disc) / 2
        eig_type = "Complex conjugate pair"
        eig_str = "λ = $(round(re_part, digits=3)) ± $(round(im_part, digits=3))i"
    else
        λ = tr_val / 2
        eig_type = "Repeated real eigenvalue"
        eig_str = "λ = $(round(λ, digits=3)) (multiplicity 2)"
    end

    md"""
    ### Classification

    **Trace:** $(tr_val), **Determinant:** $(det_val)

    **Discriminant:** tr² - 4det = $(round(tr_val, digits=2))² - 4($(round(det_val, digits=2))) = **$(round(disc, digits=3))**

    **Type:** $(eig_type)

    **Eigenvalues:** $(eig_str)

    **Verification:** λ₁ + λ₂ = $(round(tr_val, digits=3)) = tr ✓, λ₁λ₂ = $(round(det_val, digits=3)) = det ✓
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000021
begin
    # Trace-determinant plane
    p_td = plot(
        xlim=(-6, 6), ylim=(-6, 6),
        xlabel="Trace", ylabel="Determinant",
        title="Trace-Determinant Classification",
        legend=:topleft,
        aspect_ratio=:equal,
        size=(550, 550)
    )

    # Parabola: det = tr²/4
    tr_range = range(-6, 6, length=200)
    det_parabola = tr_range.^2 / 4
    plot!(p_td, tr_range, det_parabola,
        linewidth=2, color=:black, label="det = tr²/4")

    # Shade regions
    tr_fill = range(-6, 6, length=100)
    det_upper = fill(6, 100)
    det_parab = tr_fill.^2 / 4
    plot!(p_td, tr_fill, det_upper, fillrange=det_parab,
        fillalpha=0.2, fillcolor=:blue, linewidth=0, label="Complex λ")

    det_lower = fill(-6, 100)
    plot!(p_td, tr_fill, det_parab, fillrange=det_lower,
        fillalpha=0.2, fillcolor=:green, linewidth=0, label="Real λ")

    # Axes
    hline!(p_td, [0], color=:gray, linewidth=1, label="")
    vline!(p_td, [0], color=:gray, linewidth=1, label="")

    # Current point
    scatter!(p_td, [tr_val], [det_val],
        markersize=12, color=:red, label="Current ($(tr_val), $(det_val))")

    p_td
end

# ╔═╡ a1000009-0001-0001-0001-000000000022
md"""
---
## Invariance Under Rotation

When we rotate a coordinate system, what stays the same?
"""

# ╔═╡ a1000009-0001-0001-0001-000000000023
md"""
**Rotation angle** (degrees):
"""

# ╔═╡ a1000009-0001-0001-0001-000000000024
@bind rot_angle Slider(0:15:360, default=45, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000025
begin
    θ = deg2rad(rot_angle)
    Q = [cos(θ) -sin(θ); sin(θ) cos(θ)]

    # Transform A by rotation: Q'AQ
    A_rotated = Q' * A * Q

    md"""
    ### Original Matrix A vs Rotated Q'AQ

    **Rotation Q** (by $(rot_angle)°):
    $\begin{pmatrix} $(round(Q[1,1], digits=3)) & $(round(Q[1,2], digits=3)) \\ $(round(Q[2,1], digits=3)) & $(round(Q[2,2], digits=3)) \end{pmatrix}$

    **Original A:**
    $\begin{pmatrix} $(a11) & $(a12) \\ $(a21) & $(a22) \end{pmatrix}$

    **Rotated Q'AQ:**
    $\begin{pmatrix} $(round(A_rotated[1,1], digits=3)) & $(round(A_rotated[1,2], digits=3)) \\ $(round(A_rotated[2,1], digits=3)) & $(round(A_rotated[2,2], digits=3)) \end{pmatrix}$

    ### Invariants Check

    | Property | Original A | Rotated Q'AQ | Preserved? |
    |:---------|:-----------|:-------------|:-----------|
    | Trace | $(round(tr(A), digits=4)) | $(round(tr(A_rotated), digits=4)) | $(isapprox(tr(A), tr(A_rotated), atol=1e-10) ? "✓" : "✗") |
    | Determinant | $(round(det(A), digits=4)) | $(round(det(A_rotated), digits=4)) | $(isapprox(det(A), det(A_rotated), atol=1e-10) ? "✓" : "✗") |
    | Frobenius norm | $(round(norm(A), digits=4)) | $(round(norm(A_rotated), digits=4)) | $(isapprox(norm(A), norm(A_rotated), atol=1e-10) ? "✓" : "✗") |

    *The matrix entries change, but the invariants don't!*
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000026
md"""
---
## Molecular Invariants

A water molecule: same physical properties regardless of coordinate system.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000027
md"""
**Rotate the molecule** (degrees about z-axis):
"""

# ╔═╡ a1000009-0001-0001-0001-000000000028
@bind mol_rot Slider(0:15:360, default=0, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000029
begin
    # Water molecule coordinates (Å)
    O_orig = [0.0, 0.0, 0.0]
    H1_orig = [0.9584, 0.0, 0.0]
    H2_orig = [-0.2400, 0.9270, 0.0]

    # Dipole vector (arbitrary units)
    μ_orig = [0.0, 0.5, 0.0]

    # Rotation matrix about z
    θ_mol = deg2rad(mol_rot)
    R_mol = [cos(θ_mol) -sin(θ_mol) 0; sin(θ_mol) cos(θ_mol) 0; 0 0 1]

    # Rotate everything
    O_rot = R_mol * O_orig
    H1_rot = R_mol * H1_orig
    H2_rot = R_mol * H2_orig
    μ_rot = R_mol * μ_orig

    # Compute invariants
    bond1_orig = norm(H1_orig - O_orig)
    bond2_orig = norm(H2_orig - O_orig)
    bond1_rot = norm(H1_rot - O_rot)
    bond2_rot = norm(H2_rot - O_rot)

    # Bond angle
    v1_orig = H1_orig - O_orig
    v2_orig = H2_orig - O_orig
    angle_orig = acosd(dot(v1_orig, v2_orig) / (norm(v1_orig) * norm(v2_orig)))

    v1_rot = H1_rot - O_rot
    v2_rot = H2_rot - O_rot
    angle_rot = acosd(dot(v1_rot, v2_rot) / (norm(v1_rot) * norm(v2_rot)))

    # Dipole magnitude
    μ_mag_orig = norm(μ_orig)
    μ_mag_rot = norm(μ_rot)

    md"""
    ### Water Molecule — Coordinate-Dependent vs Invariant

    | Property | Original | Rotated $(mol_rot)° | Same? |
    |:---------|:---------|:-----------|:------|
    | O position | $(round.(O_orig, digits=3)) | $(round.(O_rot, digits=3)) | $(O_orig ≈ O_rot ? "✓" : "Changed") |
    | H₁ position | $(round.(H1_orig, digits=3)) | $(round.(H1_rot, digits=3)) | $(H1_orig ≈ H1_rot ? "✓" : "Changed") |
    | Dipole vector | $(round.(μ_orig, digits=3)) | $(round.(μ_rot, digits=3)) | $(μ_orig ≈ μ_rot ? "✓" : "Changed") |
    | **O-H₁ bond length** | $(round(bond1_orig, digits=4)) Å | $(round(bond1_rot, digits=4)) Å | **✓ Invariant** |
    | **O-H₂ bond length** | $(round(bond2_orig, digits=4)) Å | $(round(bond2_rot, digits=4)) Å | **✓ Invariant** |
    | **H-O-H angle** | $(round(angle_orig, digits=2))° | $(round(angle_rot, digits=2))° | **✓ Invariant** |
    | **Dipole magnitude** | $(round(μ_mag_orig, digits=4)) | $(round(μ_mag_rot, digits=4)) | **✓ Invariant** |

    *Positions and vectors change. Lengths, angles, and magnitudes don't.*
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000030
begin
    # 3D plot of molecule
    p_mol = plot3d(
        xlim=(-1.5, 1.5), ylim=(-1.5, 1.5), zlim=(-1, 1),
        xlabel="x", ylabel="y", zlabel="z",
        title="H₂O rotated $(mol_rot)°",
        camera=(30, 30),
        legend=:topright,
        size=(550, 450)
    )

    # Bonds
    plot3d!(p_mol, [O_rot[1], H1_rot[1]], [O_rot[2], H1_rot[2]], [O_rot[3], H1_rot[3]],
        linewidth=4, color=:gray, label="O-H bonds")
    plot3d!(p_mol, [O_rot[1], H2_rot[1]], [O_rot[2], H2_rot[2]], [O_rot[3], H2_rot[3]],
        linewidth=4, color=:gray, label="")

    # Atoms
    scatter3d!(p_mol, [O_rot[1]], [O_rot[2]], [O_rot[3]],
        markersize=10, color=:red, label="O")
    scatter3d!(p_mol, [H1_rot[1], H2_rot[1]], [H1_rot[2], H2_rot[2]], [H1_rot[3], H2_rot[3]],
        markersize=6, color=:white, markerstrokecolor=:black, label="H")

    # Dipole vector
    quiver3d!(p_mol, [O_rot[1]], [O_rot[2]], [O_rot[3]],
        quiver=([μ_rot[1]], [μ_rot[2]], [μ_rot[3]]),
        linewidth=3, color=:blue, label="μ (dipole)")

    p_mol
end

# ╔═╡ a1000009-0001-0001-0001-000000000031
md"""
---
## Why Eigenvalues Are Fundamental

Eigenvalues are invariant under similarity: if B = P⁻¹AP, then A and B have the same eigenvalues.

This means eigenvalues capture **intrinsic** properties of the transformation, independent of basis choice.

**This is why we care about finding them.**
"""

# ╔═╡ a1000009-0001-0001-0001-000000000032
md"""
---
## Summary: What's Invariant Under What?

| Transformation | What's preserved |
|:---------------|:-----------------|
| Similarity P⁻¹AP | det, tr, eigenvalues, rank |
| Orthogonal Q'AQ | Above + Frobenius norm |
| Rotation of molecule | Bond lengths, angles, magnitudes |
| Any coordinate change | Physical observables |

**The invariants are what's physically real.**
"""

# ╔═╡ a1000009-0001-0001-0001-000000000033
md"""
---
## Exercises

1. Compute tr and det for $\begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$. What are its eigenvalues?

2. Two matrices have tr = 5, det = 6. Are they necessarily similar?

3. A rotation matrix has eigenvalues e^(±iθ). What are its trace and determinant?

4. What molecular properties are invariant under translation (moving the whole molecule)?
"""

# ╔═╡ a1000009-0001-0001-0001-000000000034
md"""
---
## Next: Lecture 10

**What Survives? — Finding Eigenvalues and Eigenvectors**

Now that we know eigenvalues are fundamental invariants, how do we compute them?
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
LinearAlgebra = "37e2e46d-f89d-539d-b4ee-838fcccc9c8e"
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"
PlutoUI = "7f904dfe-b85e-4ff6-b463-dae2292396a8"

[compat]
Plots = "~1.39.0"
PlutoUI = "~0.7.54"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised
"""

# ╔═╡ Cell order:
# ╠═a1000009-0001-0001-0001-000000000001
# ╟─a1000009-0001-0001-0001-000000000002
# ╟─a1000009-0001-0001-0001-000000000003
# ╟─a1000009-0001-0001-0001-000000000004
# ╟─a1000009-0001-0001-0001-000000000005
# ╟─a1000009-0001-0001-0001-000000000006
# ╟─a1000009-0001-0001-0001-000000000007
# ╟─a1000009-0001-0001-0001-000000000008
# ╟─a1000009-0001-0001-0001-000000000009
# ╟─a1000009-0001-0001-0001-000000000010
# ╟─a1000009-0001-0001-0001-000000000011
# ╟─a1000009-0001-0001-0001-000000000012
# ╟─a1000009-0001-0001-0001-000000000013
# ╟─a1000009-0001-0001-0001-000000000014
# ╟─a1000009-0001-0001-0001-000000000015
# ╟─a1000009-0001-0001-0001-000000000016
# ╟─a1000009-0001-0001-0001-000000000017
# ╟─a1000009-0001-0001-0001-000000000018
# ╟─a1000009-0001-0001-0001-000000000019
# ╟─a1000009-0001-0001-0001-000000000020
# ╟─a1000009-0001-0001-0001-000000000021
# ╟─a1000009-0001-0001-0001-000000000022
# ╟─a1000009-0001-0001-0001-000000000023
# ╟─a1000009-0001-0001-0001-000000000024
# ╟─a1000009-0001-0001-0001-000000000025
# ╟─a1000009-0001-0001-0001-000000000026
# ╟─a1000009-0001-0001-0001-000000000027
# ╟─a1000009-0001-0001-0001-000000000028
# ╟─a1000009-0001-0001-0001-000000000029
# ╟─a1000009-0001-0001-0001-000000000030
# ╟─a1000009-0001-0001-0001-000000000031
# ╟─a1000009-0001-0001-0001-000000000032
# ╟─a1000009-0001-0001-0001-000000000033
# ╟─a1000009-0001-0001-0001-000000000034
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
