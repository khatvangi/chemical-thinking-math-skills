### A Pluto.jl notebook ###
# v0.19.40

using Markdown
using InteractiveUtils

# ╔═╡ a1000099-0001-0001-0001-000000000001
begin
    using PlutoUI
    using Plots
    using FFTW
    plotly()
end

# ╔═╡ a1000099-0001-0001-0001-000000000002
md"""
# Bonus Lecture: Fourier Analysis

*Decomposing signals into frequencies — the mathematics of spectroscopy.*

---

## The Core Idea

**Any periodic function can be written as a sum of sines and cosines.**

Sines and cosines form a complete basis for periodic functions.
"""

# ╔═╡ a1000099-0001-0001-0001-000000000003
md"""
---
## Building a Square Wave from Harmonics

A square wave is a sum of odd harmonics: sin(x) + sin(3x)/3 + sin(5x)/5 + ...
"""

# ╔═╡ a1000099-0001-0001-0001-000000000004
md"""
**Number of harmonics:**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000005
@bind n_harmonics Slider(1:2:21, default=1, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000006
begin
    x_fourier = range(-π, π, length=500)

    # Build square wave approximation
    function square_approx(x, N)
        result = 0.0
        for n in 1:2:N
            result += sin(n * x) / n
        end
        return (4/π) * result
    end

    # True square wave
    square_true(x) = sign(sin(x))

    y_approx = [square_approx(x, n_harmonics) for x in x_fourier]
    y_true = square_true.(x_fourier)

    p_square = plot(x_fourier, y_true,
        xlabel="x", ylabel="f(x)",
        title="Square Wave: $(div(n_harmonics+1, 2)) harmonic(s)",
        linewidth=1, color=:gray, linestyle=:dash,
        label="True square wave",
        legend=:topright,
        ylim=(-1.5, 1.5),
        size=(700, 400))

    plot!(p_square, x_fourier, y_approx,
        linewidth=3, color=:blue,
        label="Fourier approximation")

    p_square
end

# ╔═╡ a1000099-0001-0001-0001-000000000007
md"""
### Components

The approximation uses harmonics: n = 1, 3, 5, ..., $(n_harmonics)

$f(x) \approx \frac{4}{\pi}\left(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots\right)$

Notice the **Gibbs phenomenon** — the overshoot near discontinuities never fully disappears!
"""

# ╔═╡ a1000099-0001-0001-0001-000000000008
md"""
---
## Gaussian Transform: Uncertainty Principle

A Gaussian transforms to a Gaussian. Narrow in time → wide in frequency.
"""

# ╔═╡ a1000099-0001-0001-0001-000000000009
md"""
**Width parameter σ:**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000010
@bind σ_gauss Slider(0.2:0.1:2.0, default=0.5, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000011
begin
    t_gauss = range(-5, 5, length=500)
    ω_gauss = range(-10, 10, length=500)

    # Time domain Gaussian
    f_t = exp.(-t_gauss.^2 ./ (2σ_gauss^2))

    # Frequency domain Gaussian (analytical)
    # FT of exp(-t²/2σ²) = σ√(2π) exp(-σ²ω²/2)
    σ_ω = 1/σ_gauss  # reciprocal relationship
    f_ω = exp.(-ω_gauss.^2 ./ (2σ_ω^2))

    # Normalize for display
    f_t_norm = f_t ./ maximum(f_t)
    f_ω_norm = f_ω ./ maximum(f_ω)

    p_uncertainty = plot(layout=(1,2), size=(800, 350))

    plot!(p_uncertainty[1], t_gauss, f_t_norm,
        xlabel="Time t", ylabel="f(t)",
        title="Time Domain (σₜ = $(σ_gauss))",
        linewidth=3, color=:blue,
        fill=true, fillalpha=0.3,
        legend=false)

    plot!(p_uncertainty[2], ω_gauss, f_ω_norm,
        xlabel="Frequency ω", ylabel="f̂(ω)",
        title="Frequency Domain (σω = $(round(σ_ω, digits=2)))",
        linewidth=3, color=:red,
        fill=true, fillalpha=0.3,
        legend=false)

    p_uncertainty
end

# ╔═╡ a1000099-0001-0001-0001-000000000012
md"""
### Uncertainty Principle

$\Delta t \cdot \Delta \omega \geq \frac{1}{2}$

- **Narrow in time** (small σₜ) → **Wide in frequency** (large σω)
- **Wide in time** (large σₜ) → **Narrow in frequency** (small σω)

Current: σₜ × σω = $(round(σ_gauss * σ_ω, digits=2)) (minimum = 1 for Gaussian)

**This is why ultrashort laser pulses have broad spectra!**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000013
md"""
---
## Spectral Lineshapes

Different decay mechanisms produce different lineshapes.
"""

# ╔═╡ a1000099-0001-0001-0001-000000000014
md"""
**Lineshape:**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000015
@bind lineshape Select([
    "lorentzian" => "Lorentzian (natural/lifetime)",
    "gaussian" => "Gaussian (Doppler)",
    "voigt" => "Voigt (both)"
])

# ╔═╡ a1000099-0001-0001-0001-000000000016
md"""
**Width γ (Lorentzian) or σ (Gaussian):**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000017
@bind line_width Slider(0.1:0.1:2.0, default=0.5, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000018
begin
    ν_line = range(-5, 5, length=500)
    ν0 = 0  # center

    lorentzian(ν, γ) = (γ/π) ./ ((ν .- ν0).^2 .+ γ^2)
    gaussian_line(ν, σ) = exp.(-(ν .- ν0).^2 ./ (2σ^2)) ./ (σ * sqrt(2π))

    # Simple Voigt approximation (convolution)
    function voigt_approx(ν, γ, σ)
        # Pseudo-Voigt: weighted sum
        η = 1.36603 * (γ/σ) - 0.47719 * (γ/σ)^2 + 0.11116 * (γ/σ)^3
        η = clamp(η, 0, 1)
        fwhm_g = 2.355 * σ
        fwhm_l = 2 * γ
        fwhm_v = 0.5346 * fwhm_l + sqrt(0.2166 * fwhm_l^2 + fwhm_g^2)
        return η .* lorentzian(ν, fwhm_v/2) .+ (1-η) .* gaussian_line(ν, fwhm_v/2.355)
    end

    if lineshape == "lorentzian"
        I_line = lorentzian(ν_line, line_width)
        line_title = "Lorentzian (γ = $(line_width))"
        line_color = :red
    elseif lineshape == "gaussian"
        I_line = gaussian_line(ν_line, line_width)
        line_title = "Gaussian (σ = $(line_width))"
        line_color = :blue
    else
        I_line = voigt_approx(ν_line, line_width/2, line_width/2)
        line_title = "Voigt (γ = σ = $(line_width/2))"
        line_color = :purple
    end

    p_line = plot(ν_line, I_line,
        xlabel="Frequency (ν - ν₀)", ylabel="Intensity",
        title=line_title,
        linewidth=3, color=line_color,
        fill=true, fillalpha=0.3,
        legend=false,
        size=(700, 400))

    p_line
end

# ╔═╡ a1000099-0001-0001-0001-000000000019
md"""
### Lineshape Origins

| Lineshape | Origin | Time Domain |
|:----------|:-------|:------------|
| **Lorentzian** | Lifetime/natural | Exponential decay |
| **Gaussian** | Doppler/inhomogeneous | Gaussian distribution |
| **Voigt** | Both mechanisms | Convolution |

Lorentzian has broader wings; Gaussian falls off faster.
"""

# ╔═╡ a1000099-0001-0001-0001-000000000020
md"""
---
## FT-IR: Interferogram to Spectrum

The Fourier transform converts mirror position data to frequency spectrum.
"""

# ╔═╡ a1000099-0001-0001-0001-000000000021
md"""
**Peak 1 position (cm⁻¹):**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000022
@bind peak1 Slider(500:100:2000, default=1000, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000023
md"""
**Peak 2 position (cm⁻¹):**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000024
@bind peak2 Slider(500:100:2000, default=1500, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000025
begin
    # Mirror position (in cm)
    x_mirror = range(-0.1, 0.1, length=1024)

    # Simulate interferogram: sum of cosines
    # I(x) ∝ Σ B(ν̃) cos(2πν̃x)
    interferogram = cos.(2π * peak1 .* x_mirror) .+ 0.7 .* cos.(2π * peak2 .* x_mirror)

    # Add some decay (apodization)
    apod = exp.(-abs.(x_mirror) ./ 0.05)
    interferogram_apod = interferogram .* apod

    # FFT to get spectrum
    N_fft = length(x_mirror)
    dx = x_mirror[2] - x_mirror[1]
    spectrum_fft = abs.(fft(interferogram_apod))

    # Frequency axis
    freq_axis = fftfreq(N_fft, 1/dx)

    # Take positive frequencies only
    pos_idx = freq_axis .>= 0
    freq_pos = freq_axis[pos_idx]
    spec_pos = spectrum_fft[pos_idx]

    p_ftir = plot(layout=(2,1), size=(700, 500))

    plot!(p_ftir[1], x_mirror .* 10, interferogram_apod,
        xlabel="Mirror position (mm)", ylabel="Intensity",
        title="Interferogram",
        linewidth=1.5, color=:blue,
        legend=false)

    plot!(p_ftir[2], freq_pos[freq_pos .< 3000], spec_pos[freq_pos .< 3000],
        xlabel="Wavenumber (cm⁻¹)", ylabel="Intensity",
        title="Spectrum (Fourier Transform)",
        linewidth=2, color=:red,
        legend=false)

    p_ftir
end

# ╔═╡ a1000099-0001-0001-0001-000000000026
md"""
### FT-IR Process

1. **Interferogram:** Intensity vs mirror position — complex oscillations
2. **Fourier Transform:** Computer calculates FT
3. **Spectrum:** Intensity vs wavenumber — peaks at $(peak1) and $(peak2) cm⁻¹

**Advantages:** All frequencies measured simultaneously (multiplex advantage).
"""

# ╔═╡ a1000099-0001-0001-0001-000000000027
md"""
---
## Sampling and Aliasing

Undersampling causes high frequencies to appear as low frequencies.
"""

# ╔═╡ a1000099-0001-0001-0001-000000000028
md"""
**True frequency (Hz):**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000029
@bind f_true Slider(1:1:20, default=5, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000030
md"""
**Sampling rate (Hz):**
"""

# ╔═╡ a1000099-0001-0001-0001-000000000031
@bind f_sample Slider(5:5:50, default=20, show_value=true)

# ╔═╡ a1000099-0001-0001-0001-000000000032
begin
    # Continuous signal
    t_cont = range(0, 2, length=1000)
    y_cont = sin.(2π * f_true .* t_cont)

    # Sampled signal
    dt_sample = 1/f_sample
    t_sampled = 0:dt_sample:2
    y_sampled = sin.(2π * f_true .* t_sampled)

    # Nyquist frequency
    f_nyquist = f_sample / 2

    # Check for aliasing
    aliased = f_true > f_nyquist
    f_apparent = aliased ? abs(f_true - f_sample * round(f_true/f_sample)) : f_true

    p_alias = plot(t_cont, y_cont,
        xlabel="Time (s)", ylabel="Amplitude",
        title="Sampling: f = $(f_true) Hz, sample rate = $(f_sample) Hz",
        linewidth=1, color=:lightblue,
        label="True signal",
        legend=:topright,
        size=(700, 400))

    scatter!(p_alias, t_sampled, y_sampled,
        markersize=6, color=:red,
        label="Samples")

    if aliased
        y_alias = sin.(2π * f_apparent .* t_cont)
        plot!(p_alias, t_cont, y_alias,
            linewidth=2, color=:orange, linestyle=:dash,
            label="Aliased (appears as $(round(f_apparent, digits=1)) Hz)")
    end

    p_alias
end

# ╔═╡ a1000099-0001-0001-0001-000000000033
md"""
### Nyquist Theorem

**Nyquist frequency:** f_Nyquist = $(f_nyquist) Hz (half the sampling rate)

**Rule:** To capture frequency f, must sample at ≥ 2f.

$(aliased ? "⚠️ **ALIASED!** True frequency $(f_true) Hz > Nyquist $(f_nyquist) Hz. Appears as $(round(f_apparent, digits=1)) Hz." : "✓ Properly sampled. f = $(f_true) Hz < Nyquist = $(f_nyquist) Hz.")
"""

# ╔═╡ a1000099-0001-0001-0001-000000000034
md"""
---
## Summary

| Time Domain | Frequency Domain |
|:------------|:-----------------|
| f(t) | f̂(ω) |
| Narrow | Wide |
| Wide | Narrow |
| Convolution | Multiplication |
| Exponential decay | Lorentzian |
| Gaussian | Gaussian |

### Key Applications
- **FT-IR:** Interferogram → spectrum
- **NMR:** Free induction decay → spectrum
- **Quantum mechanics:** Position ↔ momentum wavefunctions
"""

# ╔═╡ a1000099-0001-0001-0001-000000000035
md"""
---
## Exercises

1. How many harmonics are needed to approximate a square wave to within 10% at the midpoint?

2. If a laser pulse has Δt = 50 fs, estimate its spectral width in nm (around 800 nm).

3. A peak has τ = 1 ps lifetime. What is its natural linewidth?

4. What sampling rate is needed to measure up to 4000 cm⁻¹ in FT-IR?
"""

# ╔═╡ 00000000-0000-0000-0000-000000000001
PLUTO_PROJECT_TOML_CONTENTS = """
[deps]
FFTW = "7a1cc6ca-52ef-59f5-83cd-3a7055c09341"
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"
PlutoUI = "7f904dfe-b85e-4ff6-b463-dae2292396a8"

[compat]
FFTW = "~1.7.1"
Plots = "~1.39.0"
PlutoUI = "~0.7.54"
"""

# ╔═╡ 00000000-0000-0000-0000-000000000002
PLUTO_MANIFEST_TOML_CONTENTS = """
# This file is machine-generated - editing it directly is not advised
"""

# ╔═╡ Cell order:
# ╠═a1000099-0001-0001-0001-000000000001
# ╟─a1000099-0001-0001-0001-000000000002
# ╟─a1000099-0001-0001-0001-000000000003
# ╟─a1000099-0001-0001-0001-000000000004
# ╟─a1000099-0001-0001-0001-000000000005
# ╟─a1000099-0001-0001-0001-000000000006
# ╟─a1000099-0001-0001-0001-000000000007
# ╟─a1000099-0001-0001-0001-000000000008
# ╟─a1000099-0001-0001-0001-000000000009
# ╟─a1000099-0001-0001-0001-000000000010
# ╟─a1000099-0001-0001-0001-000000000011
# ╟─a1000099-0001-0001-0001-000000000012
# ╟─a1000099-0001-0001-0001-000000000013
# ╟─a1000099-0001-0001-0001-000000000014
# ╟─a1000099-0001-0001-0001-000000000015
# ╟─a1000099-0001-0001-0001-000000000016
# ╟─a1000099-0001-0001-0001-000000000017
# ╟─a1000099-0001-0001-0001-000000000018
# ╟─a1000099-0001-0001-0001-000000000019
# ╟─a1000099-0001-0001-0001-000000000020
# ╟─a1000099-0001-0001-0001-000000000021
# ╟─a1000099-0001-0001-0001-000000000022
# ╟─a1000099-0001-0001-0001-000000000023
# ╟─a1000099-0001-0001-0001-000000000024
# ╟─a1000099-0001-0001-0001-000000000025
# ╟─a1000099-0001-0001-0001-000000000026
# ╟─a1000099-0001-0001-0001-000000000027
# ╟─a1000099-0001-0001-0001-000000000028
# ╟─a1000099-0001-0001-0001-000000000029
# ╟─a1000099-0001-0001-0001-000000000030
# ╟─a1000099-0001-0001-0001-000000000031
# ╟─a1000099-0001-0001-0001-000000000032
# ╟─a1000099-0001-0001-0001-000000000033
# ╟─a1000099-0001-0001-0001-000000000034
# ╟─a1000099-0001-0001-0001-000000000035
# ╟─00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
