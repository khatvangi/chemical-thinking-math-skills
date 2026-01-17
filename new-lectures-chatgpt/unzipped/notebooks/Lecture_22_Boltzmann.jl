### A Pluto.jl notebook ###
# v0.19+
using PlutoUI
using Statistics
using CSV, DataFrames
using Random
using SpecialFunctions

md"# Lecture 22 — SPREAD: Distributions (Boltzmann)"

Edf = CSV.read(joinpath(@__DIR__, "..", "assets", "lessons", "22-spread-boltzmann", "data", "energy_levels.csv"), DataFrame)
E = collect(Edf.E_kT_units)

@bind T Slider(0.2:0.05:5.0, default=1.0, show_value=true)

begin
    weights = exp.(-E ./ T)
    Z = sum(weights)
    p = weights ./ Z
    DataFrame(level=Edf.level, E=E, weight=weights, p=p, cumulative=cumsum(p))
end

md"## Invariance: adding a constant to all energies changes nothing"
@bind C Slider(-5.0:0.1:5.0, default=1.0, show_value=true)
begin
    w1 = exp.(-E ./ T); p1 = w1 ./ sum(w1)
    w2 = exp.(-(E .+ C) ./ T); p2 = w2 ./ sum(w2)
    maximum(abs.(p1 .- p2))
end
