### A Pluto.jl notebook ###
# v0.19+
using PlutoUI
using Statistics
using CSV, DataFrames
using Random
using SpecialFunctions

md"# Lecture 21 — SPREAD: Probability Basics"

md"## Binomial model (n, p) → distribution"
@bind n Slider(1:200, default=20, show_value=true)
@bind p Slider(0:0.01:1, default=0.55, show_value=true)

begin
    ks = 0:n
    logC = [loggamma(n+1) - loggamma(k+1) - loggamma(n-k+1) for k in ks]
    pmf = exp.(logC .+ ks .* log(p + 1e-12) .+ (n .- ks) .* log(1-p + 1e-12))
    pmf ./= sum(pmf)
    (ks, pmf, sum(pmf))
end

md"## Empirical estimate from CSV (order does not matter)"
df = CSV.read(joinpath(@__DIR__, "..", "assets", "lessons", "21-spread-probability", "data", "coin_trials.csv"), DataFrame)
p̂ = mean(df.success)
md"Empirical success fraction: **$(round(p̂, digits=3))**."

@bind seed Slider(1:999, default=17, show_value=true)
begin
    Random.seed!(seed)
    shuffled = df[shuffle(1:nrow(df)), :]
    (mean(df.success), mean(shuffled.success))
end
