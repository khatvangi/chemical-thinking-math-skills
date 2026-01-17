### A Pluto.jl notebook ###
# v0.1 — Lecture 03: COLLECTION (Counting Things)

using PlutoUI
using Random
using Printf

# -------------------------------------------------------------------
# Helper constants
const N_A = 6.02214076e23              # mol⁻¹ (exact by SI definition)
const R_atm = 0.082057338              # L·atm·K⁻¹·mol⁻¹

md"""
# Lecture 03 — COLLECTION: Counting Things

This notebook has three parts:

1. **Ideal gas as a counting machine**: (P,V,T) → n → N  
2. **Limiting reagent bookkeeping** (stoichiometry as counting)  
3. **Invariance test**: shuffle dots, count stays the same
"""

# -------------------------------------------------------------------
# PART 1 — Ideal gas: P,V,T -> n -> N
md"## 1) Ideal gas as a counting machine"

@bind P_atm Slider(0.20:0.05:3.00, default=1.00, show_value=true)
@bind V_L   Slider(0.50:0.10:10.0, default=2.00, show_value=true)
@bind T_K   Slider(200:1:500, default=298, show_value=true)

n = (P_atm * V_L) / (R_atm * T_K)
N = n * N_A

md"""
**Inputs (measurable):**  
- Pressure: **$(P_atm)** atm  
- Volume: **$(V_L)** L  
- Temperature: **$(T_K)** K  

**Computed count:**  
- Moles: **$(@sprintf("%.4f", n)) mol**  
- Molecules: **$(@sprintf("%.3e", N))**
"""

md"""
**Chemically interpretable slider:** T (temperature).  
At fixed P,V, increasing T decreases n — fewer moles in the same volume at higher temperature.
"""

# -------------------------------------------------------------------
# PART 2 — Limiting reagent bookkeeping
md"## 2) Limiting reagent (counting with constraints)"

@bind aA Slider(1:1:4, default=2, show_value=true)  # stoich coefficient for A
@bind bB Slider(1:1:4, default=1, show_value=true)  # stoich coefficient for B
@bind nA0 Slider(0.00:0.01:1.50, default=0.50, show_value=true)
@bind nB0 Slider(0.00:0.01:1.50, default=0.10, show_value=true)

# Reaction: aA A + bB B -> products
ξ = min(nA0 / aA, nB0 / bB)
nA_left = nA0 - aA*ξ
nB_left = nB0 - bB*ξ

limiting = (nA0 / aA < nB0 / bB) ? "A" : ((nA0 / aA > nB0 / bB) ? "B" : "tie")

md"""
Reaction: **$(aA) A + $(bB) B → products**

Starting amounts:
- n_A^0 = **$(nA0) mol**
- n_B^0 = **$(nB0) mol**

Extent:
- ξ = **$(@sprintf("%.3f", ξ)) mol**

Leftover:
- n_A = **$(@sprintf("%.3f", nA_left)) mol**  
- n_B = **$(@sprintf("%.3f", nB_left)) mol**  

**Limiting reagent:** **$(limiting)**
"""

md"""
Sanity check: leftovers are never negative. If you see a negative, your bookkeeping is wrong.
"""

# -------------------------------------------------------------------
# PART 3 — Invariance test: shuffle dots, count remains invariant
md"## 3) Invariance test: shuffle dots, count must not change"

@bind n_dots Slider(5:1:60, default=20, show_value=true)
@bind seed Slider(1:1:1000, default=42, show_value=true)

Random.seed!(seed)

# Generate dot positions in a unit square; then "shuffle" by permuting the list representation.
xs = rand(n_dots)
ys = rand(n_dots)

perm = randperm(n_dots)
xs_perm = xs[perm]
ys_perm = ys[perm]

count_before = length(xs)
count_after  = length(xs_perm)

function dot_summary(x, y; k=8)
    k = min(k, length(x))
    pairs = [@sprintf("(%.2f, %.2f)", x[i], y[i]) for i in 1:k]
    return join(pairs, ", ")
end

md"""
We generate **$(n_dots)** dots. Then we permute their order (a different description).

- Count before: **$(count_before)**
- Count after: **$(count_after)**

**Invariant:** the count stayed the same.

Sample (original):
`$(dot_summary(xs, ys))`

Sample (after permutation):
`$(dot_summary(xs_perm, ys_perm))`
"""

md"""
If anything “meaningful” changes when you permute the list, you are not doing COLLECTION — you smuggled in ARRANGEMENT.
"""
