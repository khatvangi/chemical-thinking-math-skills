# CHEM 291-A | Take-home Exam 1: Mini-projects

Four distinct projects, in increasing difficulty (easy → medium). Assign one project; the in-class test is separate. Synthetic teaching data. No differentiation, determinant, or inverse required.

## Project 1: The sample that looks too dark (LEVEL 1  ·  EASY)

**Chemical question:** Can you report both unknown concentrations without using a calibration beyond the range tested?

**Recognition prompts:**
- What do the standard solutions hold fixed, and what changes from vial to vial?
- Why does adding water change concentration but not the amount of solute?
- Which observed quantity is an instrument reading, and which is the chemical quantity you want?

A colorimeter was calibrated with five known concentrations of one dissolved dye. Absorbance is dimensionless. The numbers below are simulated, chosen so you can examine the reasoning.

Concentration (mM) | 0.0 | 1.0 | 2.0 | 3.0 | 4.0
--- | --- | --- | --- | --- | ---
Absorbance | 0.020 | 0.160 | 0.300 | 0.440 | 0.580

Unknown U: absorbance 0.370. Unknown V: absorbance 0.720. Equal volumes of V and pure water are then mixed; the diluted V reads 0.370.

1. **Make the observation visible.** Plot the five standards as absorbance versus concentration; mark U and the undiluted V as horizontal reading levels.
2. **Build the simplest useful model.** Find the slope and baseline, with units where appropriate. Write absorbance as a function of concentration and verify one standard you did not use to find the slope.
3. **Find the unknowns.** Determine U from its reading. Determine V from its diluted reading, explicitly showing the dilution calculation.
4. **Make a decision.** Explain why calculating a number from V = 0.720 using the line does not, by itself, justify reporting it as calibrated.
5. **Test your answer.** Predict the absorbance of the diluted V from your reported original concentration and explain why U and diluted V can have identical readings.

**Limit:** Use only the measured standard range to claim calibration validity; model extrapolation is a different claim.

---

## Project 2: The reaction that halves (LEVEL 2  ·  EASY+)

**Chemical question:** What mathematical description explains a constant fractional loss, and when is a short polynomial an acceptable shortcut?

**Recognition prompts:**
- Do equal five-minute intervals remove equal amounts or equal fractions?
- What does a straight line hide or reveal when you change what is on the vertical axis?
- Why should a local approximation be checked before using it for a longer time?

A dissolved species A disappears during a simplified reaction. The following simulated concentration observations are exact for this teaching model.

Time (min) | 0 | 5 | 10 | 15
--- | --- | --- | --- | ---
[A] (M) | 0.800 | 0.400 | 0.200 | 0.100

For this project, use the model [A](t) = [A]_0 exp(−kt). Use a dimensionless ratio inside the logarithm. An exponent of −0.10 corresponds to a short time interval Δt = 0.10/k. Compare exp(−0.10) with 1 − 0.10 and 1 − 0.10 + (0.10)^2/2.

1. **Recognize the pattern.** Compute successive differences and successive ratios. Decide whether a straight line in ordinary [A] versus time is a suitable model.
2. **Change the representation.** Plot or tabulate ln([A]/[A]_0) against time. Extract k, state its units, and explain the meaning of the negative slope.
3. **Predict.** Estimate [A] at 12 min from the model; check that your prediction lies between the 10- and 15-minute observations.
4. **Approximate locally.** Evaluate the linear and quadratic approximations to exp(−0.10), compare each to your calculator, and decide which achieves absolute error below 0.001.
5. **State a boundary.** Explain why an approximation tested at −0.10 should not be assumed accurate at −2.

**Limit:** These data support a useful mathematical model; they do not independently prove a molecular reaction mechanism.

---

## Project 3: The dipole and the fixed meter (LEVEL 3  ·  EASY–MEDIUM)

**Chemical question:** Why can turning an unchanged molecule change what a fixed directional sensor measures?

**Recognition prompts:**
- Which parts of the molecular description are lengths, and which are directions?
- Does changing the direction of the whole molecule change its internal geometry?
- If the meter and molecule both turn together, what should remain the same?

Model water in a 2-D drawing: O = (0,0), H_1 = (0.80, 0.60) Å, H_2 = (0.80, −0.60) Å. Assign each O→H bond a dipole contribution of magnitude 1.50 D, directed along its bond. This is an idealized vector model, not a measured water dipole.

Object | x coordinate / component | y coordinate / component
--- | --- | ---
O | 0.00 Å | 0.00 Å
H<sub>1</sub> | +0.80 Å | +0.60 Å
H<sub>2</sub> | +0.80 Å | −0.60 Å

The meter reads the dot product of the total dipole with a fixed unit sensing direction e_x = (1,0). The molecule is rotated 90° counterclockwise using the matrix R = [[0, −1], [1, 0]].

1. **Draw before computing.** Sketch both O→H vectors, their individual dipole contributions, and the fixed +x meter direction.
2. **Add the physical contributions.** Find each bond unit vector, each bond dipole vector, and the total dipole μ. Give components and magnitude in D.
3. **Let a matrix act.** Multiply Rμ. Then separately compute Rμ_1 + Rμ_2 and compare with R(μ_1 + μ_2).
4. **Ask what the meter reads.** Compute μ·e_x before rotation and (Rμ)·e_x after rotation.
5. **Test what stays the same.** Check the dipole magnitude before and after; now rotate the sensing direction by R too and recompute the dot product. Explain the difference between turning the molecule and merely redescribing the same geometry.

**Limit:** No 3-D rotation formula is needed. The 2-D model isolates the role of direction and representation.

---

## Project 4: Two colors, two readings (LEVEL 4  ·  MEDIUM)

**Chemical question:** When two substances both affect both signals, can two instrument readings distinguish their amounts?

**Recognition prompts:**
- What is mixed physically, and what is mixed in the instrument response?
- Why can the reading at one wavelength be explained by several different mixtures?
- What does the row-by-column product actually calculate?

A sample contains dyes P and Q. A detector reads absorbance at wavelengths λ_1 and λ_2. For this simulated linear model, the calibration sensitivities (in mM^−1) are:

Wavelength | Effect of 1 mM P | Effect of 1 mM Q
--- | --- | ---
λ<sub>1</sub> | 0.40 | 0.10
λ<sub>2</sub> | 0.15 | 0.30

Three prepared controls contain (P,Q) in mM: C_1 = (2,0), C_2 = (0,2), C_3 = (2,1). A blinded mixture produces the readings (A_1, A_2) = (0.90, 0.60). Absorbance is dimensionless.

1. **Draw the coupling.** Sketch arrows from both dyes to both wavelength readings; explain why a single calibration line for P would not suffice.
2. **Represent the mapping.** Form the 2×2 sensitivity matrix M and a 2×3 concentration matrix C whose columns are the three controls. Label rows, columns, and units.
3. **Multiply with meaning.** Compute MC by row-by-column multiplication. Explain one product entry in a complete chemical sentence.
4. **Solve the blind mixture.** Write the two simultaneous equations and solve by substitution or elimination. Verify your concentrations by multiplying M by your result.
5. **Expose a tempting error.** If you pretend Q does not absorb at λ_1, what P concentration would you report? Compare it with the two-wavelength result and explain the discrepancy.

**Limit:** Stay within matrix multiplication and two simultaneous linear equations. Matrix inverse and determinant are not needed.

---

**Submit (for your assigned project):** a 1–2-page scientific note with a graph/diagram, model, reproducible calculation, independent check, and chemical interpretation. Proposed common marking guide: recognition 4; representation 4; calculation 6; check/limitation 4; communication 2 (20 points).
