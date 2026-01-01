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
# Lecture 10: What Survives?

*Eigenvalues and eigenvectors — the directions that transformation preserves.*

---

## When to Use Eigenanalysis

| Situation | Eigenanalysis gives you |
|:----------|:------------------------|
| What directions are preserved? | Eigenvectors |
| By how much are they scaled? | Eigenvalues |
| Simplify a matrix? | Diagonalization |
| Molecular orbital energies? | Eigenvalues of H |
| Normal mode frequencies? | √(eigenvalues of Hessian) |
"""

# ╔═╡ a1000009-0001-0001-0001-000000000003
md"""
---
## The Key Idea

Most vectors change direction under transformation.

But **eigenvectors** only get scaled — their direction survives!

$A\mathbf{v} = \lambda \mathbf{v}$
"""

# ╔═╡ a1000009-0001-0001-0001-000000000004
md"""
---
## Eigenvector Visualizer

Watch how vectors transform. Eigenvectors stay on their original line!
"""

# ╔═╡ a1000009-0001-0001-0001-000000000005
md"""
### Enter a 2×2 matrix:
"""

# ╔═╡ a1000009-0001-0001-0001-000000000006
@bind m11 Slider(-3:0.5:3, default=2, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000007
@bind m12 Slider(-3:0.5:3, default=1, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000008
@bind m21 Slider(-3:0.5:3, default=1, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000009
@bind m22 Slider(-3:0.5:3, default=2, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000010
begin
    A = [m11 m12; m21 m22]

    # Compute eigenvalues and eigenvectors
    eig_result = eigen(A)
    λs = eig_result.values
    vs = eig_result.vectors

    # Check if eigenvalues are real
    is_real = all(abs.(imag.(λs)) .< 1e-10)

    tr_A = tr(A)
    det_A = det(A)

    md"""
    ### Matrix and Eigenanalysis

    $A = \begin{pmatrix} $(m11) & $(m12) \\ $(m21) & $(m22) \end{pmatrix}$

    **tr(A) = $(round(tr_A, digits=3))**, **det(A) = $(round(det_A, digits=3))**

    **Characteristic polynomial:** λ² - $(round(tr_A, digits=2))λ + $(round(det_A, digits=2)) = 0

    **Eigenvalues:** $(is_real ? "λ₁ = $(round(real(λs[1]), digits=3)), λ₂ = $(round(real(λs[2]), digits=3))" : "λ = $(round(λs[1], digits=3)) (complex)")

    $(is_real ? "" : "⚠️ Complex eigenvalues — no real eigenvectors (rotation component)")

    **Check:** λ₁ + λ₂ = $(round(real(λs[1] + λs[2]), digits=3)) = tr(A) ✓, λ₁ × λ₂ = $(round(real(λs[1] * λs[2]), digits=3)) = det(A) ✓
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000011
begin
    p_eig = plot(
        xlim=(-4, 4), ylim=(-4, 4),
        aspect_ratio=:equal,
        xlabel="x", ylabel="y",
        title="Eigenvectors: Directions That Survive",
        legend=:topright,
        size=(650, 650)
    )

    # Grid
    hline!(p_eig, [0], color=:gray, linewidth=1, label="")
    vline!(p_eig, [0], color=:gray, linewidth=1, label="")

    # Show many vectors and their images
    n_vecs = 16
    for i in 1:n_vecs
        θ = 2π * (i-1) / n_vecs
        v = [cos(θ), sin(θ)]
        Av = A * v

        # Original vector (faint)
        quiver!(p_eig, [0], [0], quiver=([v[1]], [v[2]]),
            linewidth=1, color=:blue, alpha=0.3, label=(i==1 ? "v" : ""))

        # Transformed vector
        quiver!(p_eig, [0], [0], quiver=([Av[1]], [Av[2]]),
            linewidth=1, color=:red, alpha=0.5, label=(i==1 ? "Av" : ""))
    end

    # Highlight eigenvectors if real
    if is_real
        for j in 1:2
            v = real.(vs[:, j])
            v = v / norm(v) * 2  # Scale for visibility
            Av = A * v

            color = j == 1 ? :purple : :green

            # Eigenvector direction (extended line)
            plot!(p_eig, [-v[1]*2, v[1]*2], [-v[2]*2, v[2]*2],
                linewidth=2, color=color, linestyle=:dash, label="")

            # Eigenvector
            quiver!(p_eig, [0], [0], quiver=([v[1]], [v[2]]),
                linewidth=4, color=color, label="v$(j): λ=$(round(real(λs[j]), digits=2))")

            # Its image (should be parallel!)
            quiver!(p_eig, [0], [0], quiver=([Av[1]], [Av[2]]),
                linewidth=3, color=color, alpha=0.6, linestyle=:dash,
                label="Av$(j) = $(round(real(λs[j]), digits=2))v$(j)")
        end
    end

    p_eig
end

# ╔═╡ a1000009-0001-0001-0001-000000000012
md"""
---
## Step-by-Step Eigenvalue Finder

The characteristic equation: **det(A - λI) = 0**
"""

# ╔═╡ a1000009-0001-0001-0001-000000000013
begin
    md"""
    ### Derivation for current matrix

    $A - \lambda I = \begin{pmatrix} $(m11) - \lambda & $(m12) \\ $(m21) & $(m22) - \lambda \end{pmatrix}$

    $\det(A - \lambda I) = ($(m11) - \lambda)($(m22) - \lambda) - ($(m12))($(m21))$

    $= \lambda^2 - $(m11 + m22)\lambda + $(m11*m22 - m12*m21)$

    $= \lambda^2 - $(round(tr_A, digits=2))\lambda + $(round(det_A, digits=2)) = 0$

    **Discriminant:** $(round(tr_A, digits=2))² - 4($(round(det_A, digits=2))) = $(round(tr_A^2 - 4*det_A, digits=2))

    $(tr_A^2 - 4*det_A < 0 ? "**Negative → Complex eigenvalues**" : tr_A^2 - 4*det_A == 0 ? "**Zero → Repeated eigenvalue**" : "**Positive → Two distinct real eigenvalues**")
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000014
md"""
---
## Finding Eigenvectors

For each eigenvalue λ, solve **(A - λI)v = 0**
"""

# ╔═╡ a1000009-0001-0001-0001-000000000015
begin
    if is_real
        λ1, λ2 = real.(λs)

        # For λ1
        A_minus_λ1 = A - λ1 * I

        md"""
        ### For λ₁ = $(round(λ1, digits=3)):

        $A - \lambda_1 I = \begin{pmatrix} $(round(A_minus_λ1[1,1], digits=3)) & $(round(A_minus_λ1[1,2], digits=3)) \\ $(round(A_minus_λ1[2,1], digits=3)) & $(round(A_minus_λ1[2,2], digits=3)) \end{pmatrix}$

        Solve $(A - λ_1 I)\mathbf{v} = \mathbf{0}$:

        **Eigenvector v₁** ∝ ($(round(real(vs[1,1]), digits=3)), $(round(real(vs[2,1]), digits=3)))

        ### For λ₂ = $(round(λ2, digits=3)):

        **Eigenvector v₂** ∝ ($(round(real(vs[1,2]), digits=3)), $(round(real(vs[2,2]), digits=3)))

        ### Verification:

        Av₁ = $(round.(A * real.(vs[:,1]), digits=3)) = $(round(λ1, digits=3)) × $(round.(real.(vs[:,1]), digits=3)) ✓

        Av₂ = $(round.(A * real.(vs[:,2]), digits=3)) = $(round(λ2, digits=3)) × $(round.(real.(vs[:,2]), digits=3)) ✓
        """
    else
        md"""
        ### Complex eigenvalues

        λ = $(round(λs[1], digits=3))

        No real eigenvectors exist. The transformation includes rotation.
        """
    end
end

# ╔═╡ a1000009-0001-0001-0001-000000000016
md"""
---
## Diagonalization

If A has n independent eigenvectors, we can write **A = PDP⁻¹**

where D is diagonal with eigenvalues.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000017
begin
    if is_real && abs(λs[1] - λs[2]) > 1e-10
        P = real.(vs)
        D = Diagonal(real.(λs))
        P_inv = inv(P)

        # Verify
        A_reconstructed = P * D * P_inv

        md"""
        ### Diagonalization of A

        **P** (eigenvectors as columns):
        $P = \begin{pmatrix} $(round(P[1,1], digits=3)) & $(round(P[1,2], digits=3)) \\ $(round(P[2,1], digits=3)) & $(round(P[2,2], digits=3)) \end{pmatrix}$

        **D** (eigenvalues on diagonal):
        $D = \begin{pmatrix} $(round(D[1,1], digits=3)) & 0 \\ 0 & $(round(D[2,2], digits=3)) \end{pmatrix}$

        **Verify P⁻¹AP = D:** $(isapprox(P_inv * A * P, D, atol=1e-10) ? "✓" : "✗")

        **Verify A = PDP⁻¹:** $(isapprox(A_reconstructed, A, atol=1e-10) ? "✓" : "✗")

        ---

        ### Power of Diagonalization

        **A² = PD²P⁻¹** where D² = diag($(round(D[1,1]^2, digits=2)), $(round(D[2,2]^2, digits=2)))

        **A¹⁰ = PD¹⁰P⁻¹** where D¹⁰ = diag($(round(D[1,1]^10, digits=1)), $(round(D[2,2]^10, digits=1)))
        """
    else
        md"""
        ### Diagonalization

        $(is_real ? "Repeated eigenvalue — may not be diagonalizable" : "Complex eigenvalues — real diagonalization not possible")
        """
    end
end

# ╔═╡ a1000009-0001-0001-0001-000000000018
md"""
---
## Chemistry: Hückel Molecular Orbitals

Orbital energies are eigenvalues of the Hückel Hamiltonian.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000019
@bind huckel_mol Select([
    "ethylene" => "Ethylene (2 C)",
    "allyl" => "Allyl (3 C)",
    "butadiene" => "Butadiene (4 C)",
    "cyclobutadiene" => "Cyclobutadiene (4 C, ring)",
    "benzene" => "Benzene (6 C)"
])

# ╔═╡ a1000009-0001-0001-0001-000000000020
begin
    # Build Hückel matrices (α = 0, β = -1)
    if huckel_mol == "ethylene"
        H_mol = [0 -1; -1 0]
        n_c = 2
    elseif huckel_mol == "allyl"
        H_mol = [0 -1 0; -1 0 -1; 0 -1 0]
        n_c = 3
    elseif huckel_mol == "butadiene"
        H_mol = [0 -1 0 0; -1 0 -1 0; 0 -1 0 -1; 0 0 -1 0]
        n_c = 4
    elseif huckel_mol == "cyclobutadiene"
        H_mol = [0 -1 0 -1; -1 0 -1 0; 0 -1 0 -1; -1 0 -1 0]
        n_c = 4
    else  # benzene
        H_mol = zeros(6, 6)
        for i in 1:6
            H_mol[i, mod1(i+1, 6)] = -1
            H_mol[i, mod1(i-1, 6)] = -1
        end
        n_c = 6
    end

    # Eigenanalysis
    eig_mol = eigen(H_mol)
    E_orbitals = sort(real.(eig_mol.values))

    # Find eigenvector for each sorted eigenvalue
    sorted_idx = sortperm(real.(eig_mol.values))

    md"""
    ### $(huckel_mol) — Hückel Analysis

    **Hamiltonian** (α = 0, β = -1):

    $(Text(repr("text/plain", H_mol)))

    **Orbital Energies** (eigenvalues, in units of |β| relative to α):
    $(join(["E$(i) = $(round(E_orbitals[i], digits=3))" for i in 1:n_c], ", "))

    **Total π energy** ($(huckel_mol == "allyl" ? "3" : huckel_mol == "ethylene" ? "2" : huckel_mol == "benzene" ? "6" : "4") electrons):
    $(huckel_mol == "ethylene" ? "2 × $(round(E_orbitals[1], digits=3)) = $(round(2*E_orbitals[1], digits=3))" :
      huckel_mol == "allyl" ? "2 × $(round(E_orbitals[1], digits=3)) + 1 × $(round(E_orbitals[2], digits=3)) = $(round(2*E_orbitals[1] + E_orbitals[2], digits=3))" :
      huckel_mol == "benzene" ? "2 × ($(round(E_orbitals[1], digits=3)) + $(round(E_orbitals[2], digits=3)) + $(round(E_orbitals[3], digits=3))) = $(round(2*(E_orbitals[1]+E_orbitals[2]+E_orbitals[3]), digits=3))" :
      "2 × ($(round(E_orbitals[1], digits=3)) + $(round(E_orbitals[2], digits=3))) = $(round(2*(E_orbitals[1]+E_orbitals[2]), digits=3))")
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000021
begin
    # Energy level diagram
    p_mo = plot(
        xlim=(0, 4), ylim=(minimum(E_orbitals)-0.5, maximum(E_orbitals)+0.5),
        xlabel="", ylabel="Energy (units of |β|)",
        title="$(huckel_mol) — π Orbital Energies",
        legend=false,
        xticks=[],
        size=(400, 450)
    )

    # Reference line at α (= 0)
    hline!(p_mo, [0], color=:gray, linestyle=:dash, linewidth=1)
    annotate!(p_mo, 0.3, 0.15, text("α (nonbonding)", 8, :left))

    # Draw energy levels and fill electrons
    n_electrons = huckel_mol == "allyl" ? 3 : huckel_mol == "ethylene" ? 2 : huckel_mol == "benzene" ? 6 : 4
    electrons_placed = 0

    # Group degenerate levels
    tol = 1e-6
    unique_E = Float64[]
    degeneracies = Int[]
    for e in E_orbitals
        if isempty(unique_E) || abs(e - unique_E[end]) > tol
            push!(unique_E, e)
            push!(degeneracies, 1)
        else
            degeneracies[end] += 1
        end
    end

    for (i, (e, deg)) in enumerate(zip(unique_E, degeneracies))
        # Draw level(s)
        if deg == 1
            plot!(p_mo, [1.5, 2.5], [e, e], linewidth=3, color=:blue)
        else
            # Split degenerate levels slightly for visibility
            for d in 1:deg
                offset = (d - (deg+1)/2) * 0.3
                plot!(p_mo, [1.5+offset, 2.5+offset], [e, e], linewidth=3, color=:blue)
            end
        end

        # Fill electrons (2 per orbital)
        for d in 1:deg
            if electrons_placed < n_electrons
                offset = deg == 1 ? 0 : (d - (deg+1)/2) * 0.3
                # First electron (up arrow)
                electrons_placed += 1
                annotate!(p_mo, 1.85+offset, e+0.08, text("↑", 12))
                if electrons_placed < n_electrons
                    # Second electron (down arrow)
                    electrons_placed += 1
                    annotate!(p_mo, 2.15+offset, e+0.08, text("↓", 12))
                end
            end
        end

        # Label
        annotate!(p_mo, 3.2, e, text("$(round(e, digits=2))", 9, :left))
    end

    p_mo
end

# ╔═╡ a1000009-0001-0001-0001-000000000022
md"""
### MO Coefficients (Eigenvectors)

The eigenvector components give the contribution of each atomic orbital.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000023
@bind show_mo Slider(1:size(H_mol, 1), default=1, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000024
begin
    mo_idx = sorted_idx[show_mo]
    mo_coeffs = real.(eig_mol.vectors[:, mo_idx])
    mo_energy = real.(eig_mol.values[mo_idx])

    # Normalize for display
    mo_coeffs = mo_coeffs / maximum(abs.(mo_coeffs))

    # Classify
    if mo_energy < -0.01
        mo_type = "Bonding"
    elseif mo_energy > 0.01
        mo_type = "Antibonding"
    else
        mo_type = "Nonbonding"
    end

    md"""
    ### MO $(show_mo): E = $(round(mo_energy, digits=3)) — **$(mo_type)**

    **Coefficients** (contribution from each carbon p-orbital):

    $(join(["C$(i): $(round(mo_coeffs[i], digits=3))" for i in 1:n_c], " | "))

    $(mo_type == "Bonding" ? "All coefficients same sign → constructive overlap" :
      mo_type == "Antibonding" ? "Alternating signs → nodes between atoms" :
      "Node at certain positions")
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000025
begin
    # Visualize MO coefficients
    p_coeffs = bar(
        1:n_c, mo_coeffs,
        xlabel="Carbon atom", ylabel="Coefficient",
        title="MO $(show_mo) Coefficients (E = $(round(mo_energy, digits=2)))",
        legend=false,
        color=[c > 0 ? :blue : :red for c in mo_coeffs],
        ylim=(-1.2, 1.2),
        size=(500, 300)
    )

    hline!(p_coeffs, [0], color=:gray, linewidth=1)

    p_coeffs
end

# ╔═╡ a1000009-0001-0001-0001-000000000026
md"""
---
## Complex Eigenvalues: Rotation

When eigenvalues are complex, the matrix includes rotation.

The eigenvalues lie on a circle in the complex plane.
"""

# ╔═╡ a1000009-0001-0001-0001-000000000027
md"""
**Rotation angle** (degrees):
"""

# ╔═╡ a1000009-0001-0001-0001-000000000028
@bind rot_deg Slider(0:5:180, default=60, show_value=true)

# ╔═╡ a1000009-0001-0001-0001-000000000029
begin
    θ_rot = deg2rad(rot_deg)
    R = [cos(θ_rot) -sin(θ_rot); sin(θ_rot) cos(θ_rot)]

    λ_rot = eigvals(R)

    md"""
    ### Rotation by $(rot_deg)°

    $R = \begin{pmatrix} $(round(cos(θ_rot), digits=3)) & $(round(-sin(θ_rot), digits=3)) \\ $(round(sin(θ_rot), digits=3)) & $(round(cos(θ_rot), digits=3)) \end{pmatrix}$

    **Eigenvalues:** λ = $(round(λ_rot[1], digits=3)), $(round(λ_rot[2], digits=3))

    **In polar form:** λ = e^(±i$(rot_deg)°) = cos($(rot_deg)°) ± i·sin($(rot_deg)°)

    **|λ| = 1** (on unit circle — pure rotation, no scaling)

    $(rot_deg == 0 ? "At 0°: λ = 1, 1 (identity)" : rot_deg == 180 ? "At 180°: λ = -1, -1 (real, but still 'rotation' by π)" : "Complex eigenvalues — no real direction is preserved!")
    """
end

# ╔═╡ a1000009-0001-0001-0001-000000000030
begin
    # Plot eigenvalues in complex plane
    p_complex = plot(
        xlim=(-1.5, 1.5), ylim=(-1.5, 1.5),
        aspect_ratio=:equal,
        xlabel="Real", ylabel="Imaginary",
        title="Eigenvalues of Rotation Matrix",
        legend=:topright,
        size=(450, 450)
    )

    # Unit circle
    θ_circle = range(0, 2π, length=100)
    plot!(p_complex, cos.(θ_circle), sin.(θ_circle),
        linewidth=1, color=:gray, linestyle=:dash, label="Unit circle")

    # Axes
    hline!(p_complex, [0], color=:gray, linewidth=1, label="")
    vline!(p_complex, [0], color=:gray, linewidth=1, label="")

    # Eigenvalues
    scatter!(p_complex, [real(λ_rot[1])], [imag(λ_rot[1])],
        markersize=10, color=:red, label="λ₁ = e^(i$(rot_deg)°)")
    scatter!(p_complex, [real(λ_rot[2])], [imag(λ_rot[2])],
        markersize=10, color=:blue, label="λ₂ = e^(-i$(rot_deg)°)")

    # Angle arc
    if rot_deg > 0 && rot_deg < 180
        arc_θ = range(0, θ_rot, length=30)
        plot!(p_complex, 0.3*cos.(arc_θ), 0.3*sin.(arc_θ),
            linewidth=2, color=:green, label="θ = $(rot_deg)°")
    end

    p_complex
end

# ╔═╡ a1000009-0001-0001-0001-000000000031
md"""
---
## Summary: Eigenvalue Toolkit

| Step | Method |
|:-----|:-------|
| Find eigenvalues | Solve det(A - λI) = 0 |
| Find eigenvectors | Solve (A - λI)v = 0 |
| Diagonalize | A = PDP⁻¹ where P = [v₁ \| v₂ \| ...] |
| Compute Aᵏ | Aᵏ = PDᵏP⁻¹ |
"""

# ╔═╡ a1000009-0001-0001-0001-000000000032
md"""
---
## Exercises

1. Find eigenvalues of $\begin{pmatrix} 3 & 1 \\ 1 & 3 \end{pmatrix}$. Verify sum = trace, product = det.

2. For the matrix above, find eigenvectors. Are they orthogonal? Why?

3. What are the eigenvalues of a 90° rotation matrix? What does this say geometrically?

4. For allyl (3-carbon chain), which MO has a node at the central carbon?
"""

# ╔═╡ a1000009-0001-0001-0001-000000000033
md"""
---
## Next: Lecture 11

**Symmetry**

Molecular symmetry operations and group theory. Why symmetric matrices have orthogonal eigenvectors.
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
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
