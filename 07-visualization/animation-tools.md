# Visualization & Animation Tools

## Manim (3Blue1Brown's Animation Engine)

### Community Edition (Recommended)
- **Website:** https://www.manim.community/
- **Documentation:** https://docs.manim.community/
- **GitHub:** https://github.com/ManimCommunity/manim

### Installation
```bash
pip install manim
```

### Use Cases
- Mathematical animations for lectures
- Visual explanations of concepts
- High-quality video production

## Julia Visualization Stack

### Plots.jl
- **Docs:** https://docs.juliaplots.org/
- **Use:** Quick plots, multiple backends
- **Backends:** GR, Plotly, PyPlot

### Makie.jl
- **Docs:** https://makie.juliaplots.org/
- **Use:** High-performance, interactive
- **Variants:** GLMakie (GPU), CairoMakie (static), WGLMakie (web)

### PlutoUI.jl
- **GitHub:** Cloned to this folder
- **Use:** Sliders, buttons, interactive widgets in Pluto
- **Key widgets:** Slider, NumberField, CheckBox, Select

## Integration Strategy

### For Course Development
1. Use Manim for pre-recorded explanation videos
2. Use Makie/Plots in Pluto notebooks for interactive exploration
3. PlutoUI for student-manipulable parameters

### Quick Visualization Workflow
```julia
using Plots

# Simple function plot
plot(x -> sin(x), -2π, 2π, label="sin(x)")

# With PlutoUI slider
@bind frequency Slider(1:10)
plot(x -> sin(frequency * x), -2π, 2π)
```
