/**
 * §4.4 widget: two bodies share a fixed total energy E = E1 + E2 = 10.
 * Entropy S = a ln E1 + b ln E2 (k_B = 1; a, b = f/2 quadratic modes).
 * Top: total entropy vs E1 with the tangent whose slope is 1/T1 - 1/T2.
 * Bottom: the two inverse temperatures as bars; they equalize at the maximum.
 * "let heat flow" relaxes E1 up the entropy slope (heat flows hot -> cold).
 */
(function () {
    const canvas = document.getElementById("ssCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const aEl = document.getElementById("ssA");
    const bEl = document.getElementById("ssB");
    const eEl = document.getElementById("ssE1");
    const relaxEl = document.getElementById("ssRelax");
    const readout = document.getElementById("ssReadout");

    // e1State is the true state; the slider's step would quantize any value read back from it
    let e1State = +eEl.value;
    const W = canvas.width, H = canvas.height;
    const E = 10, LO = 0.2, HI = 9.8, YLO = -3.2, YHI = 0.25, BARMAX = 4;
    const px = e => 55 + (e - 0) / E * (W - 85);
    const py = s => 215 - (s - YLO) / (YHI - YLO) * 190;       // top panel y in [25, 215]

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#b7ad9c", curve: "#0e6862", tangent: "#8a3524", point: "#8a3524", best: "#b7893a", bar1: "#0e6862", bar2: "#8a3524", text: "#5a5348" }
            : { bg: "#211e18", axis: "#555043", curve: "#4fb3ab", tangent: "#d0715c", point: "#d0715c", best: "#d8b36a", bar1: "#4fb3ab", bar2: "#d0715c", text: "#a99f8c" };
    }

    function katexOrText(el, tex, plain) {
        if (window.katex) el.innerHTML = window.katex.renderToString(tex, { throwOnError: false });
        else el.textContent = plain;
    }

    function draw() {
        const p = palette();
        const a = +aEl.value, b = +bEl.value, e1 = e1State, e2 = E - e1;
        const eStar = a * E / (a + b);
        const S = x => a * Math.log(x) + b * Math.log(E - x);
        const sMax = S(eStar);
        const g = a / e1 - b / e2;                              // dS/dE1 = 1/T1 - 1/T2
        const inv1 = a / e1, inv2 = b / e2;
        const T1 = e1 / a, T2 = e2 / b;

        ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);

        // top panel axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(0), py(YLO)); ctx.lineTo(px(E), py(YLO)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px(0), py(YLO)); ctx.lineTo(px(0), py(YHI)); ctx.stroke();
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("energy of body 1, E₁   (E₂ = 10 − E₁)", px(E) - 235, py(YLO) + 26);
        ctx.fillText("total entropy S − S_max  (k_B)", px(0) + 8, 20);
        ctx.font = "11px 'JetBrains Mono', monospace";
        [0, 2, 4, 6, 8, 10].forEach(v => ctx.fillText(String(v), px(v) - 5, py(YLO) + 13));

        // optimum marker
        ctx.setLineDash([5, 5]); ctx.strokeStyle = p.best; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px(eStar), py(YLO)); ctx.lineTo(px(eStar), py(0)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(px(eStar), py(0), 6, 0, Math.PI * 2); ctx.strokeStyle = p.best; ctx.lineWidth = 2; ctx.stroke();

        // total-entropy curve (clipped to the panel)
        ctx.save();
        ctx.beginPath(); ctx.rect(px(0), py(YHI), px(E) - px(0), py(YLO) - py(YHI)); ctx.clip();
        ctx.strokeStyle = p.curve; ctx.lineWidth = 2.6; ctx.beginPath();
        let first = true;
        for (let x = LO; x <= HI + 1e-9; x += 0.02) {
            const X = px(x), Y = py(S(x) - sMax);
            first ? (ctx.moveTo(X, Y), first = false) : ctx.lineTo(X, Y);
        }
        ctx.stroke();
        // tangent: slope 1/T1 - 1/T2 in entropy-per-energy
        const h = 1.1, s0 = S(e1) - sMax;
        ctx.strokeStyle = p.tangent; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px(e1 - h), py(s0 - g * h)); ctx.lineTo(px(e1 + h), py(s0 + g * h)); ctx.stroke();
        ctx.restore();

        // the point
        const eq = Math.abs(g) < 0.03;
        ctx.beginPath(); ctx.arc(px(e1), py(s0), 7, 0, Math.PI * 2);
        ctx.fillStyle = eq ? p.best : p.point; ctx.fill();

        // bottom panel: the two inverse temperatures
        const bx = 200, bw = W - 230;
        const bar = (y, v, color, label) => {
            ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
            ctx.fillText(label, 55, y + 14);
            ctx.fillStyle = color; ctx.globalAlpha = 0.85;
            ctx.fillRect(bx, y, Math.min(v, BARMAX) / BARMAX * bw, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = p.text; ctx.font = "12px 'JetBrains Mono', monospace";
            ctx.fillText(v.toFixed(3) + (v > BARMAX ? "  (off scale)" : ""), bx + Math.min(v, BARMAX) / BARMAX * bw + 8, y + 14);
        };
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("the two slopes  dS/dE = 1/T :", 55, 262);
        bar(272, inv1, p.bar1, "1/T₁ = a/E₁");
        bar(304, inv2, p.bar2, "1/T₂ = b/E₂");
        if (eq) {
            ctx.strokeStyle = p.best; ctx.lineWidth = 2;
            ctx.strokeRect(bx - 3, 268, bw + 6, 60);
            ctx.fillStyle = p.best; ctx.font = "13px 'STIX Two Text', serif";
            ctx.fillText("equal slopes → equal temperatures → equilibrium", bx, 352);
        }

        const dir = Math.abs(g) < 0.03 ? "equilibrium" : (g > 0 ? "body 2 hotter: energy flows to body 1" : "body 1 hotter: energy flows to body 2");
        katexOrText(readout,
            `E_1=${e1.toFixed(2)},\\ E_2=${e2.toFixed(2)}:\\quad T_1=E_1/a=${T1.toFixed(2)},\\ T_2=E_2/b=${T2.toFixed(2)},\\quad \\frac{dS}{dE_1}=\\frac1{T_1}-\\frac1{T_2}=${(g >= 0 ? "+" : "\\!-") + Math.abs(g).toFixed(3)}\\ \\text{(${dir})}`,
            `E1=${e1.toFixed(2)}, E2=${e2.toFixed(2)}: T1=${T1.toFixed(2)}, T2=${T2.toFixed(2)}, dS/dE1=${g.toFixed(3)} (${dir})`);
    }

    // heat flow: climb the total-entropy slope (hot -> cold), clamped for stability
    let anim = null;
    relaxEl.addEventListener("click", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        function step() {
            const a = +aEl.value, b = +bEl.value;
            const g = a / e1State - b / (E - e1State);
            const dE = Math.max(-0.12, Math.min(0.12, 0.35 * g));
            e1State = Math.max(0.5, Math.min(9.5, e1State + dE));
            eEl.value = e1State;            // display only
            draw();
            if (Math.abs(g) > 0.004) anim = requestAnimationFrame(step); else anim = null;
        }
        anim = requestAnimationFrame(step);
    });

    [aEl, bEl, eEl].forEach(el => el.addEventListener("input", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        e1State = +eEl.value;
        draw();
    }));
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
