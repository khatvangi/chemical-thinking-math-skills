### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000024-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    plotly()
end

# ╔═╡ a1000024-0001-0001-0001-000000000002
md"""
# Lecture 24: Synthesis

*The complete map — seeing the whole.*

---

## The Promise

Lecture 1: "By course end, you'll look at any chemical phenomenon and see what kind of thing it is."

**You've built that skill.**
"""

# ╔═╡ a1000024-0001-0001-0001-000000000003
md"""
---
## The Nine Primitives

Select a primitive to explore its tools and chemistry connections.
"""

# ╔═╡ a1000024-0001-0001-0001-000000000004
@bind selected_primitive Select([
    "COLLECTION" => "COLLECTION — There are many",
    "ARRANGEMENT" => "ARRANGEMENT — Order matters",
    "DIRECTION" => "DIRECTION — It points",
    "PROXIMITY" => "PROXIMITY — Near vs far",
    "SAMENESS" => "SAMENESS — Unchanged",
    "CHANGE" => "CHANGE — Becoming",
    "RATE" => "RATE — How fast",
    "ACCUMULATION" => "ACCUMULATION — All together",
    "SPREAD" => "SPREAD — Distributed"
])

# ╔═╡ a1000024-0001-0001-0001-000000000005
begin
    primitive_data = Dict(
        "COLLECTION" => (
            perception = "There are many",
            question = "How many? What's in the set?",
            tools = ["Sets", "Counting", "Factorial", "Combinations", "Permutations"],
            chemistry = ["Moles", "Electron configurations", "Isomer counting", "Statistical weights", "Quantum numbers"],
            lectures = [3],
            color = :blue
        ),
        "ARRANGEMENT" => (
            perception = "Order matters",
            question = "How are they organized?",
            tools = ["Permutations", "Matrices", "Determinants", "Data tables"],
            chemistry = ["Stereoisomers", "Crystal structures", "MO diagrams", "Spectral data"],
            lectures = [7, 8, 9],
            color = :green
        ),
        "DIRECTION" => (
            perception = "It points",
            question = "Where does it point? What angle?",
            tools = ["Vectors", "Dot product", "Cross product", "Basis", "Coordinates"],
            chemistry = ["Bond angles", "Dipole moments", "Orbital orientation", "VSEPR geometry"],
            lectures = [4, 5, 6],
            color = :red
        ),
        "PROXIMITY" => (
            perception = "Near vs far",
            question = "How close? What happens as we approach?",
            tools = ["Functions", "Limits", "Continuity", "Asymptotic behavior"],
            chemistry = ["Potential energy curves", "Titration curves", "Interaction ranges"],
            lectures = [11],
            color = :orange
        ),
        "SAMENESS" => (
            perception = "Unchanged",
            question = "What stays the same? What's conserved?",
            tools = ["Eigenvalues", "Eigenvectors", "Symmetry operations", "Invariants"],
            chemistry = ["Molecular orbitals", "Normal modes", "Point groups", "Conservation laws"],
            lectures = [9, 10],
            color = :purple
        ),
        "CHANGE" => (
            perception = "Becoming",
            question = "How is it transforming?",
            tools = ["Derivatives", "Partial derivatives", "Gradient", "Optimization", "Taylor series"],
            chemistry = ["Reaction rates", "Maxwell relations", "Equilibrium conditions"],
            lectures = [12, 13, 14, 15, 16],
            color = :teal
        ),
        "RATE" => (
            perception = "How fast",
            question = "At what speed?",
            tools = ["Differential equations", "First-order ODEs", "Second-order ODEs", "Numerical methods"],
            chemistry = ["Rate laws", "Radioactive decay", "Oscillations", "Coupled reactions"],
            lectures = [19],
            color = :brown
        ),
        "ACCUMULATION" => (
            perception = "All together",
            question = "What's the total?",
            tools = ["Integrals", "Definite integrals", "Integration techniques", "Improper integrals"],
            chemistry = ["Work (∫PdV)", "Heat (∫CdT)", "Reaction yield", "Normalization"],
            lectures = [17, 18],
            color = :pink
        ),
        "SPREAD" => (
            perception = "Distributed",
            question = "How is probability spread?",
            tools = ["Probability", "Distributions", "Expectation", "Variance", "Error propagation"],
            chemistry = ["Boltzmann distribution", "Maxwell-Boltzmann", "Quantum averages", "Measurement error"],
            lectures = [20, 21, 22],
            color = :cyan
        )
    )

    p = primitive_data[selected_primitive]

    md"""
    ## $(selected_primitive)

    ### The Perception
    **"$(p.perception)"**

    ### You Ask
    $(p.question)

    ### Tools
    $(join(["- " * t for t in p.tools], "\n"))

    ### Chemistry Applications
    $(join(["- " * c for c in p.chemistry], "\n"))

    ### Covered In
    Lecture(s): $(join(string.(p.lectures), ", "))
    """
end

# ╔═╡ a1000024-0001-0001-0001-000000000006
md"""
---
## The Decision Tree

Given a problem, ask these questions:
"""

# ╔═╡ a1000024-0001-0001-0001-000000000007
md"""
**Your problem involves:**
"""

# ╔═╡ a1000024-0001-0001-0001-000000000008
@bind problem_type Select([
    "counting" => "Counting things, sets, how many",
    "organization" => "Organization, arrangement, order",
    "geometry" => "Geometry, angles, directions",
    "closeness" => "Distance, approaching, limits",
    "conservation" => "What stays the same, symmetry",
    "transformation" => "Change, transformation, rates",
    "totals" => "Totals, accumulation, integrals",
    "uncertainty" => "Probability, distributions, uncertainty"
])

# ╔═╡ a1000024-0001-0001-0001-000000000009
begin
    recommendations = Dict(
        "counting" => ("COLLECTION", ["Sets", "Factorial", "Combinations"], ["How many isomers?", "Electron configurations", "Statistical weights"]),
        "organization" => ("ARRANGEMENT", ["Matrices", "Permutations"], ["Stereoisomers", "Crystal structures", "Organize spectral data"]),
        "geometry" => ("DIRECTION", ["Vectors", "Dot product"], ["Find bond angle", "Calculate dipole moment", "Orbital orientation"]),
        "closeness" => ("PROXIMITY", ["Functions", "Limits"], ["Potential energy at distance r", "Behavior near equivalence point"]),
        "conservation" => ("SAMENESS", ["Eigenvalues", "Symmetry"], ["Find normal modes", "Molecular orbitals", "Conservation laws"]),
        "transformation" => ("CHANGE + RATE", ["Derivatives", "Differential equations"], ["Rate laws", "Kinetics", "How fast?"]),
        "totals" => ("ACCUMULATION", ["Integrals"], ["Total work", "Heat absorbed", "Reaction yield"]),
        "uncertainty" => ("SPREAD", ["Probability", "Distributions"], ["Boltzmann populations", "Error analysis", "Quantum averages"])
    )

    rec = recommendations[problem_type]

    md"""
    ### Recommendation

    **Primary Primitive:** $(rec[1])

    **Key Tools:** $(join(rec[2], ", "))

    **Example Problems:**
    $(join(["- " * ex for ex in rec[3]], "\n"))
    """
end

# ╔═╡ a1000024-0001-0001-0001-000000000010
md"""
---
## Primitive Connections

Most problems involve multiple primitives. Here are common combinations:
"""

# ╔═╡ a1000024-0001-0001-0001-000000000011
begin
    md"""
    ### The Kinetics Triad
    **CHANGE + RATE + ACCUMULATION**

    - What's transforming? (CHANGE)
    - How fast? (RATE)
    - How much total? (ACCUMULATION)

    ### The Quantum Triad
    **SAMENESS + SPREAD + ACCUMULATION**

    - What's preserved? (eigenvalues)
    - How is probability spread? (|ψ|²)
    - What's the average? (∫ψ*Âψ dx)

    ### Structure Connections
    **COLLECTION + ARRANGEMENT**

    How many things, and how are they organized?

    **DIRECTION + SAMENESS**

    Symmetry operations preserve directional relationships.
    """
end

# ╔═╡ a1000024-0001-0001-0001-000000000012
md"""
---
## Complete Tool Reference

Quick lookup: "When do I use...?"
"""

# ╔═╡ a1000024-0001-0001-0001-000000000013
@bind tool_lookup Select([
    "dot" => "Dot product",
    "cross" => "Cross product",
    "eigen" => "Eigenvalues",
    "deriv" => "Derivative",
    "integral" => "Integral",
    "diffeq" => "Differential equation",
    "prob" => "Probability distribution",
    "fourier" => "Fourier transform",
    "dims" => "Dimensional analysis"
])

# ╔═╡ a1000024-0001-0001-0001-000000000014
begin
    tool_info = Dict(
        "dot" => (
            name = "Dot Product",
            use = "Finding angles, projections, 'how much in this direction'",
            primitive = "DIRECTION",
            examples = ["Bond angle from vectors", "Work = F⃗·d⃗", "Orbital overlap"]
        ),
        "cross" => (
            name = "Cross Product",
            use = "Finding perpendicular vectors, areas, torques",
            primitive = "DIRECTION",
            examples = ["Normal to a plane", "Angular momentum", "Magnetic force"]
        ),
        "eigen" => (
            name = "Eigenvalues/Eigenvectors",
            use = "Finding what's preserved under transformation",
            primitive = "SAMENESS",
            examples = ["Molecular orbitals", "Normal modes", "Principal axes"]
        ),
        "deriv" => (
            name = "Derivative",
            use = "Finding instantaneous rate of change",
            primitive = "CHANGE",
            examples = ["Reaction rate", "Slope of PV curve", "Optimization"]
        ),
        "integral" => (
            name = "Integral",
            use = "Finding total accumulation",
            primitive = "ACCUMULATION",
            examples = ["Work ∫PdV", "Heat ∫CdT", "Normalization ∫|ψ|²dx"]
        ),
        "diffeq" => (
            name = "Differential Equation",
            use = "Relating a quantity to its rate of change",
            primitive = "RATE",
            examples = ["d[A]/dt = -k[A]", "Schrödinger equation", "Diffusion"]
        ),
        "prob" => (
            name = "Probability Distribution",
            use = "Describing uncertain outcomes, populations",
            primitive = "SPREAD",
            examples = ["Boltzmann distribution", "Gaussian errors", "Quantum |ψ|²"]
        ),
        "fourier" => (
            name = "Fourier Transform",
            use = "Converting between conjugate domains",
            primitive = "Multiple",
            examples = ["FT-IR", "NMR", "Time ↔ frequency"]
        ),
        "dims" => (
            name = "Dimensional Analysis",
            use = "Checking equations, deriving relationships, estimating",
            primitive = "Meta-tool",
            examples = ["Verify formulas", "Find scaling laws", "Fermi estimation"]
        )
    )

    t = tool_info[tool_lookup]

    md"""
    ### $(t.name)

    **Use when:** $(t.use)

    **Primitive:** $(t.primitive)

    **Examples:**
    $(join(["- " * ex for ex in t.examples], "\n"))
    """
end

# ╔═╡ a1000024-0001-0001-0001-000000000015
md"""
---
## Course Map

### Module 1: Structure (Lectures 1-10)
COLLECTION, ARRANGEMENT, DIRECTION, SAMENESS

### Module 2: Change (Lectures 11-19)
PROXIMITY, CHANGE, RATE, ACCUMULATION

### Module 3: Probability (Lectures 20-23)
SPREAD, Error Analysis, Dimensional Analysis

### Bonus
Fourier Analysis

### Synthesis (This Lecture)
Connecting everything
"""

# ╔═╡ a1000024-0001-0001-0001-000000000016
md"""
---
## The Method

```
     REALITY
        ↓
   RECOGNITION
  (What primitive?)
        ↓
      TOOL
  (What math?)
        ↓
    SOLUTION
        ↓
 INTERPRETATION
  (Back to chemistry)
```

**This is what you've learned.**
"""

# ╔═╡ a1000024-0001-0001-0001-000000000017
md"""
---
## Final Reflection

You didn't just learn mathematics.

You learned to **see patterns**.

The patterns were always there — in the molecules, in the equations, in reality.

Now you can see them too.

---

*Chemical Thinking: The Grammar of Reality*
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
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
# ╠═a1000024-0001-0001-0001-000000000001
# ╟─a1000024-0001-0001-0001-000000000002
# ╟─a1000024-0001-0001-0001-000000000003
# ╟─a1000024-0001-0001-0001-000000000004
# ╟─a1000024-0001-0001-0001-000000000005
# ╟─a1000024-0001-0001-0001-000000000006
# ╟─a1000024-0001-0001-0001-000000000007
# ╟─a1000024-0001-0001-0001-000000000008
# ╟─a1000024-0001-0001-0001-000000000009
# ╟─a1000024-0001-0001-0001-000000000010
# ╟─a1000024-0001-0001-0001-000000000011
# ╟─a1000024-0001-0001-0001-000000000012
# ╟─a1000024-0001-0001-0001-000000000013
# ╟─a1000024-0001-0001-0001-000000000014
# ╟─a1000024-0001-0001-0001-000000000015
# ╟─a1000024-0001-0001-0001-000000000016
# ╟─a1000024-0001-0001-0001-000000000017
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
