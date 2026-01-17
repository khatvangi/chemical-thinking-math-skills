### A Pluto.jl notebook ###
# v0.19.47

using Markdown
using PlutoUI
using Plots
using LinearAlgebra

# ╔═╡ 0f2c2c6a-8a4f-4a1e-a1e1-0d0b6e2a0200
md"""
# Lecture 02 — EXISTENCE
**What kinds of numbers?**  
Representation must support the operations reality demands.

Card map:
- **02.1** Deficits → \(\mathbb{Z}\)
- **02.2** Ratios → \(\mathbb{Q}\)
- **02.3** Measurement (\(\sqrt2\)) → \(\mathbb{R}\)
- **02.4** Phase/oscillation → \(\mathbb{C}\)
"""

# ╔═╡ 7b8b2e3a-0f4e-4b2a-9ee1-3e1d9f6f2b10
md"""
## Card 02.1 — Deficits force \(\mathbb{Z}\)
Move the sliders. Watch subtraction leave \(\mathbb{N}\).
"""

# ╔═╡ 2dfc6a46-03c7-4f2b-90aa-fc0d1e9dbf05
@bind a Slider(0:20, default=3, show_value=true)

# ╔═╡ 9a9f1f1a-271b-49cb-a1f4-4a64da0ad4d7
@bind b Slider(0:20, default=7, show_value=true)

# ╔═╡ 6d32d2b0-1b0d-44fd-b8a6-3c0a3f6b6d6e
let
    d = a - b
    inN = d ≥ 0
    md"""
**Compute:** \(a-b = $d\)

- In \(\mathbb{N}\)? **$(inN ? "allowed" : "not allowed")**
- In \(\mathbb{Z}\)? **always allowed**
"""
end

# ╔═╡ 1d1c62bd-5f87-4c2e-9b68-7ac2f0bb1a2a
md"""
## Card 02.2 — Ratios force \(\mathbb{Q}\)
Integers fail closure under division.
"""

# ╔═╡ 63ad5bb7-f4fb-49f4-a4c9-1f2bcff507f9
@bind p Slider(-20:20, default=1, show_value=true)

# ╔═╡ 8b7a1be1-70f4-4e3c-9c28-c5a17c2ac1c6
@bind q Slider(1:20, default=8, show_value=true)

# ╔═╡ 9d228c53-2adf-4b6e-90e2-b8cc31a92b71
let
    g = gcd(p, q)
    pr, qr = div(p, g), div(q, g)
    val = p / q
    inZ = (p % q == 0)
    md"""
**Ratio:** \(\dfrac{$p}{$q} = \dfrac{$pr}{$qr} = $(round(val, digits=6))\)

- In \(\mathbb{Z}\)? **$(inZ ? "yes" : "no")**
- In \(\mathbb{Q}\)? **yes**
"""
end

# ╔═╡ 7d19a5d3-0e2c-4b39-ae2a-5f7aa2c24f0d
md"""
## Card 02.3 — Measurement forces \(\mathbb{R}\) (via \(\sqrt2\))
You can approximate \(\sqrt2\) by rationals, but you never reach zero error.
"""

# ╔═╡ 4c40b4cc-8b58-4a6c-b0e5-31a22b8c0bb1
@bind qmax Slider(1:500, default=50, show_value=true)

# ╔═╡ 14f96c2d-9d1b-4a62-b8f8-2e7b5d2b3d7a
@bind ε Slider(0.0:1e-4:0.05, default=0.001, show_value=true)

# ╔═╡ 0b6064de-bc3e-4ef9-a1d6-f45f650e0b38
let
    x = sqrt(2)
    best_p, best_q, best_err = 0, 1, Inf
    for qq in 1:qmax
        pp = round(Int, x*qq)
        err = abs(pp/qq - x)
        if err < best_err
            best_p, best_q, best_err = pp, qq, err
        end
    end
    hit = best_err ≤ ε
    md"""
Best approximation with \(q \le $qmax\):

- \(p/q = $best_p / $best_q = $(round(best_p/best_q, digits=10))\)
- error \(= |p/q-\sqrt2| = $(round(best_err, digits=10))\)
- below tolerance \(\varepsilon=$ε\)? **$(hit ? "yes (approximation)" : "no")**

Even when the tolerance test passes, **error is not zero**.
"""
end

# ╔═╡ 4b90b6b5-3f0f-42bb-b49d-6b2ce0aa37f2
md"""
## Card 02.4 — Phase/oscillation forces \(\mathbb{C}\)
A real oscillation is the projection of a rotating complex phasor.
"""

# ╔═╡ 1a28b0c6-8b5e-4d4e-8f3b-2de1b0f2a0c4
@bind A Slider(0:0.1:5, default=2.0, show_value=true)

# ╔═╡ 2b7e5d3f-52a5-4f2e-9e91-414b3f7d8b0c
@bind ϕ Slider(-pi:0.01:pi, default=pi/4, show_value=true)

# ╔═╡ 77f31f3a-5d57-4a11-a2a0-4bcf63b0d3b2
@bind ω Slider(0.5:0.1:10, default=3.0, show_value=true)

# ╔═╡ c1e1b15c-1b3e-45f4-8d6f-4f8d6f3c2b11
let
    T = 2pi
    t = range(0, T; length=800)
    s_cos = A .* cos.(ω .* t .+ ϕ)
    s_cplx = real.(A .* exp.(im .* (ω .* t .+ ϕ)))
    maxdiff = maximum(abs.(s_cos .- s_cplx))

    plt1 = plot(t, s_cos; xlabel="t", ylabel="s(t)", title="Real signal")
    plt2 = plot(real.(A .* exp.(im .* (ω .* t .+ ϕ))),
                imag.(A .* exp.(im .* (ω .* t .+ ϕ)));
                xlabel="Re", ylabel="Im", title="Phasor trace", aspect_ratio=:equal)

    md"""
**Invariance test:** \(\max_t |A\cos(\omega t+\varphi) - \Re(Ae^{i(\omega t+\varphi)})| = $(round(maxdiff, digits=12))\)

$(plt1)

$(plt2)
"""
end

# ╔═╡ 7a2a9b8e-2a3b-4f2a-8e1c-2b3f4a5c6d7e
md"""
## Closure ladder (quick diagnosis)
Pick a number system and an operation. The output tells you whether the operation stays inside.
"""

# ╔═╡ 3a57c1ab-9b8e-4a6f-9f2b-3a1b2c3d4e5f
@bind system Select(["ℕ","ℤ","ℚ","ℝ","ℂ"], default="ℕ")

# ╔═╡ 5b3a1d2c-8f9e-4b0a-8c2d-1e2f3a4b5c6d
@bind op Select(["subtract (3−7)","divide (1/2)","sqrt(2)","solve x²+1=0"], default="subtract (3−7)")

# ╔═╡ 2c1b0a9f-8e7d-4c3b-9a2f-1b0c9d8e7f6a
let
    allowed = false
    witness = ""
    if op == "subtract (3−7)"
        allowed = system ∈ ["ℤ","ℚ","ℝ","ℂ"]
        witness = "3−7 = −4"
    elseif op == "divide (1/2)"
        allowed = system ∈ ["ℚ","ℝ","ℂ"]
        witness = "1/2"
    elseif op == "sqrt(2)"
        allowed = system ∈ ["ℝ","ℂ"]
        witness = "√2"
    elseif op == "solve x²+1=0"
        allowed = system == "ℂ"
        witness = "±i"
    end

    md"""
**System:** $system  
**Operation:** $op  
**Result:** $(allowed ? "allowed" : "not allowed")  
**Witness:** $witness
"""
end
