/**
 * 3b1b-style grid-transformation animator (§3.3, §3.4).
 * The whole plane grid eases from the identity to a chosen matrix M;
 * basis vectors ride the columns; the unit square deforms with a live
 * determinant readout (color flips when orientation reverses).
 * Mounts on #gtCanvas with controls #gtPreset, #gtPlay, #gtScrub.
 * Theme-aware; KaTeX readout in #gtReadout.
 */
(function () {
    const canvas = document.getElementById("gtCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const presetEl = document.getElementById("gtPreset");
    const playEl = document.getElementById("gtPlay");
    const scrubEl = document.getElementById("gtScrub");
    const readout = document.getElementById("gtReadout");

    const PRESETS = {
        rot90:    { M: [[0, -1], [1, 0]],       tex: "R(90^\\circ) = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}",  label: "rotation 90°" },
        rot30:    { M: [[0.866, -0.5], [0.5, 0.866]], tex: "R(30^\\circ) = \\begin{pmatrix} 0.87 & -0.5 \\\\ 0.5 & 0.87 \\end{pmatrix}", label: "rotation 30°" },
        shear:    { M: [[1, 1], [0, 1]],        tex: "H = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}",              label: "shear" },
        reflect:  { M: [[-1, 0], [0, 1]],       tex: "\\sigma_v = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}",     label: "reflection" },
        scale:    { M: [[1.5, 0], [0, 0.75]],   tex: "S = \\begin{pmatrix} 1.5 & 0 \\\\ 0 & 0.75 \\end{pmatrix}",         label: "anisotropic scale" },
        singular: { M: [[1, 2], [0.5, 1]],      tex: "K = \\begin{pmatrix} 1 & 2 \\\\ 0.5 & 1 \\end{pmatrix}",            label: "singular collapse" }
    };

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", grid0: "rgba(90,83,72,0.10)", grid: "#0e6862", axis: "#5a5348",
                iHat: "#0e6862", jHat: "#97772a", sqPos: "rgba(14,104,98,0.18)", sqNeg: "rgba(138,53,36,0.28)",
                text: "#5a5348", detPos: "#0e6862", detNeg: "#8a3524" }
            : { bg: "#211e18", grid0: "rgba(169,159,140,0.10)", grid: "#4fb3ab", axis: "#a99f8c",
                iHat: "#4fb3ab", jHat: "#cfa94f", sqPos: "rgba(79,179,171,0.20)", sqNeg: "rgba(208,113,92,0.30)",
                text: "#a99f8c", detPos: "#4fb3ab", detNeg: "#d0715c" };
    }

    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const lerpM = (M, t) => [
        [1 + t * (M[0][0] - 1), t * M[0][1]],
        [t * M[1][0], 1 + t * (M[1][1] - 1)]
    ];

    let t = 0, playing = false, raf = null;

    function arrow(x0, y0, x1, y1, color, width, label) {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 11 * Math.cos(a - 0.4), y1 - 11 * Math.sin(a - 0.4));
        ctx.lineTo(x1 - 11 * Math.cos(a + 0.4), y1 - 11 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
        if (label) {
            ctx.font = "italic 700 17px 'STIX Two Text', serif";
            ctx.fillText(label, x1 + 8, y1 - 8);
        }
    }

    function draw() {
        const p = palette();
        const preset = PRESETS[presetEl.value];
        const M = lerpM(preset.M, ease(t));
        const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];

        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2, cy = canvas.height / 2, s = 55;
        const X = v => cx + (M[0][0] * v[0] + M[0][1] * v[1]) * s;
        const Y = v => cy - (M[1][0] * v[0] + M[1][1] * v[1]) * s;

        // static ghost grid
        ctx.strokeStyle = p.grid0; ctx.lineWidth = 1;
        for (let k = -5; k <= 5; k++) {
            ctx.beginPath(); ctx.moveTo(cx + k * s, 0); ctx.lineTo(cx + k * s, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, cy + k * s); ctx.lineTo(canvas.width, cy + k * s); ctx.stroke();
        }

        // moving grid: transformed lines (linearity keeps them straight)
        ctx.lineWidth = 1;
        for (let k = -5; k <= 5; k++) {
            const heavy = k === 0;
            ctx.strokeStyle = heavy ? p.axis : p.grid;
            ctx.globalAlpha = heavy ? 0.9 : 0.35;
            ctx.lineWidth = heavy ? 1.6 : 1;
            ctx.beginPath(); ctx.moveTo(X([k, -5]), Y([k, -5])); ctx.lineTo(X([k, 5]), Y([k, 5])); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(X([-5, k]), Y([-5, k])); ctx.lineTo(X([5, k]), Y([5, k])); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // unit square -> parallelogram
        ctx.fillStyle = det >= 0 ? p.sqPos : p.sqNeg;
        ctx.beginPath();
        ctx.moveTo(X([0, 0]), Y([0, 0]));
        ctx.lineTo(X([1, 0]), Y([1, 0]));
        ctx.lineTo(X([1, 1]), Y([1, 1]));
        ctx.lineTo(X([0, 1]), Y([0, 1]));
        ctx.closePath(); ctx.fill();

        // basis vectors = columns of M(t)
        arrow(cx, cy, X([1, 0]), Y([1, 0]), p.iHat, 3.5, "î");
        arrow(cx, cy, X([0, 1]), Y([0, 1]), p.jHat, 3.5, "ĵ");

        // live det readout on-canvas
        ctx.font = "600 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = det >= 0 ? p.detPos : p.detNeg;
        ctx.textAlign = "left";
        ctx.fillText("det = " + (Math.round(det * 100) / 100).toFixed(2) +
            "   area ×" + Math.abs(Math.round(det * 100) / 100).toFixed(2) +
            (det < 0 ? "   orientation FLIPPED" : ""), 14, 24);

        scrubEl.value = Math.round(t * 100);
    }

    function texReadout() {
        const preset = PRESETS[presetEl.value];
        const d = preset.M[0][0] * preset.M[1][1] - preset.M[0][1] * preset.M[1][0];
        const tex = s2 => window.katex ? katex.renderToString(s2, { throwOnError: false }) : s2;
        readout.innerHTML = tex(preset.tex) + "&emsp;" +
            tex("\\det = " + (Math.round(d * 100) / 100)) +
            (Math.abs(d) < 1e-9
                ? " — <b>the plane collapses to a line: a forgetting, not a rearrangement</b>"
                : d < 0 ? " — orientation reverses: this motion contains a mirror" : "");
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        t = 0; playing = true;
        const t0 = performance.now(), DUR = 1800;
        (function step(now) {
            t = Math.min(1, (now - t0) / DUR);
            draw();
            if (t < 1 && playing) raf = requestAnimationFrame(step);
            else playing = false;
        })(t0);
    }

    presetEl.addEventListener("change", () => { texReadout(); play(); });
    playEl.addEventListener("click", play);
    scrubEl.addEventListener("input", () => {
        playing = false; if (raf) cancelAnimationFrame(raf);
        t = (+scrubEl.value) / 100; draw();
    });
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    t = 0; draw();
})();
