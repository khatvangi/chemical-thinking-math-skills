### A Pluto.jl notebook ###
# v0.19+
using PlutoUI
using Statistics
using CSV, DataFrames
using Random
using SpecialFunctions

md"# Lecture 23 — SPREAD: Expectation & Variance"

df = CSV.read(joinpath(@__DIR__, "..", "assets", "lessons", "23-spread-moments", "data", "measurement_noise.csv"), DataFrame)
x = df.x
μ = mean(x)
σ2 = var(x)
md"Mean μ = **$(round(μ, digits=3))**, Variance σ² = **$(round(σ2, digits=3))**."

md"## Slider: scale and shift rules"
@bind a Slider(-5.0:0.1:5.0, default=2.0, show_value=true)
@bind c Slider(-5.0:0.1:5.0, default=1.0, show_value=true)

begin
    y = a .* x .+ c
    DataFrame(
        μx=mean(x),  σ2x=var(x),
        μy=mean(y),  σ2y=var(y),
        predicted_μy=a*mean(x)+c,
        predicted_σ2y=(a^2)*var(x)
    )
end
