/**
 * §4.2 widget: the chain factor in d/dt [A] = -k [A], [A] = 0.80 e^{-kt}.
 * Solid tangent = the correct slope -k[A]; dashed line = the tempting wrong
 * answer +[A] (chain factor dropped), which points the wrong way entirely.
 * Sliders: rate constant k and time t. KaTeX readout, light/dark aware.
 */
(function () {
    const canvas = document.getElementById("cfCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const kEl = document.getElementById("cfK");
    const tEl = document.getElementById("cfT");
    const readout = document.getElementById("cfReadout");

    const W = canvas.width, H = canvas.height;
    const TMIN = 0, TMAX = 20, YMIN = 0, YMAX = 0.9;
    const px = t => 55 + (t - TMIN) / (TMAX - TMIN) * (W - 80);
    const py = y => H - 38 - (y - YMIN) / (YMAX - YMIN) * (H - 62);
    const conc = (k, t) => 0.80 * Math.exp(-k * t);

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#b7ad9c", curve: "#0e6862", right: "#0e6862", wrong: "#8a3524", point: "#b7893a", text: "#5a5348" }
            : { bg: "#211e18", axis: "#555043", curve: "#4fb3ab", right: "#4fb3ab", wrong: "#d0715c", point: "#d8b36a", text: "#a99f8c" };
    }

    function katexOrText(el, tex, plain) {
        if (window.katex) el.innerHTML = window.katex.renderToString(tex, { throwOnError: false });
        else el.textContent = plain;
    }

    function line(x0, y0, x1, y1, color, width, dash) {
        ctx.strokeStyle = color; ctx.lineWidth = width;
        ctx.setLineDash(dash || []);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.setLineDash([]);
    }

    function draw() {
        const p = palette();
        const k = +kEl.value, t = +tEl.value;
        const a = conc(k, t), slope = -k * a;

        ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);

        // axes and labels
        line(px(TMIN), py(0), px(TMAX), py(0), p.axis, 1);
        line(px(0), py(0), px(0), py(YMAX), p.axis, 1);
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("t (min)", px(TMAX) - 44, py(0) + 26);
        ctx.fillText("[A] (M)", px(0) + 8, py(YMAX) + 12);
        ctx.font = "11px 'JetBrains Mono', monospace";
        [0, 5, 10, 15, 20].forEach(v => ctx.fillText(String(v), px(v) - 5, py(0) + 14));

        // curve
        ctx.strokeStyle = p.curve; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let x = 0; x <= TMAX + 1e-9; x += 0.1) {
            const X = px(x), Y = py(conc(k, x));
            x === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // clip the slope lines to the plot area
        ctx.save();
        ctx.beginPath(); ctx.rect(px(0), py(YMAX), px(TMAX) - px(0), py(0) - py(YMAX)); ctx.clip();

        // correct tangent, +/- 2.5 min
        line(px(t - 2.5), py(a - 2.5 * slope), px(t + 2.5), py(a + 2.5 * slope), p.right, 2.5);
        // the tempting wrong slope +[A] (dashed), +/- 0.5 min
        line(px(t - 0.5), py(a - 0.5 * a), px(t + 0.5), py(a + 0.5 * a), p.wrong, 2, [6, 5]);
        ctx.restore();

        // the point
        ctx.beginPath(); ctx.arc(px(t), py(a), 6.5, 0, Math.PI * 2);
        ctx.fillStyle = p.point; ctx.fill();

        const fmt = v => (v >= 0 ? "+" : "\\!-") + Math.abs(v).toFixed(4);
        katexOrText(readout,
            `t=${t.toFixed(1)}\\ \\mathrm{min},\\ k=${k.toFixed(3)}\\ \\mathrm{min^{-1}}:\\quad [\\mathrm{A}]=${a.toFixed(3)}\\ \\mathrm{M},\\quad \\frac{d[\\mathrm{A}]}{dt}=-k[\\mathrm{A}]=${fmt(slope)}\\ \\mathrm{M/min}\\quad\\text{(dashed, wrong: }+[\\mathrm{A}]=+${a.toFixed(3)}\\ \\mathrm{M}\\text{ — no per-minute!)}`,
            `t=${t.toFixed(1)} min, k=${k.toFixed(3)}/min: [A]=${a.toFixed(3)} M, d[A]/dt = -k[A] = ${slope.toFixed(4)} M/min  (dashed wrong answer +[A]: sign wrong, units wrong)`);
    }

    kEl.addEventListener("input", draw);
    tEl.addEventListener("input", draw);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
