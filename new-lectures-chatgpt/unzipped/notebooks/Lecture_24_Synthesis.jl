### A Pluto.jl notebook ###
# v0.19+
using PlutoUI
using Statistics
using CSV, DataFrames
using Random
using SpecialFunctions

md"# Lecture 24 — Synthesis: The Complete Map"

mapdf = CSV.read(joinpath(@__DIR__, "..", "assets", "lessons", "24-synthesis-map", "data", "primitive_map.csv"), DataFrame)

@bind idx Slider(1:nrow(mapdf), default=1, show_value=true)

begin
    row = mapdf[idx, :]
    md"**Primitive:** $(row.primitive)\n\n**Core diagnostic question:** $(row.question)"
end

md"## Invariance habit checklist"
checklist = [
    "Relabeling (names change, object same)",
    "Unit conversion (numbers change, quantity same)",
    "Basis rotation (components change, vector same)",
    "Binning change (bars change, total mass same)"
]
