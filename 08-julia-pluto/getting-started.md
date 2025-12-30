# Julia & Pluto Setup Guide

## Installation

### Julia
- **Download:** https://julialang.org/downloads/
- **Documentation:** https://docs.julialang.org/
- **Version:** Use current stable release (1.10+)

### Pluto.jl
```julia
# In Julia REPL
using Pkg
Pkg.add("Pluto")

# To run
using Pluto
Pluto.run()
```

## Key Packages for Course

### Visualization
- **Plots.jl** - General plotting: https://docs.juliaplots.org/
- **Makie.jl** - High-performance: https://makie.juliaplots.org/
- **PlutoUI.jl** - Interactive widgets (cloned to ../07-visualization/)

### Scientific
- Unitful.jl - Physical units
- DifferentialEquations.jl - ODEs/PDEs
- LinearAlgebra (stdlib) - Matrix operations

### Chemistry-Specific
- Chemfiles.jl - Molecular file formats
- MolecularGraph.jl - Molecular structures

## Resources

### Learning Julia
- **YouTube:** https://www.youtube.com/c/julialang
- **Julia Academy:** https://juliaacademy.com/
- **Think Julia (book):** https://benlauwens.github.io/ThinkJulia.jl/

### Pluto Examples
- **Featured notebooks:** https://featured.plutojl.org/
- **MIT course notebooks:** See ../02-pedagogical-models/mit-computational-thinking/

## Why Julia + Pluto for This Course
1. Reactive notebooks - changes propagate automatically
2. Reproducible - notebooks are plain Julia files
3. Mathematical syntax - code reads like math
4. Fast - near-C performance for numerical work
5. Free and open source
