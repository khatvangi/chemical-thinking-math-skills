/**
 * §4.5 widget: Maclaurin polynomial of increasing order against the true function.
 * Functions: e^x, sin x, ln(1+x). Slider N sets the highest power kept; slider x
 * marks a test point and the readout shows polynomial value, exact value and error.
 */
(function () {
    const canvas = document.getElementById("tfCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const fEl = document.getElementById("tfFunc");
    const nEl = document.getElementById("tfN");
    const xEl = document.getElementById("tfX");
    const readout = document.getElementById("tfReadout");

    const W = canvas.width, H = canvas.height;
    const XMIN = -3, XMAX = 3, YMIN = -4, YMAX = 8;
    const px = x => 40 + (x - XMIN) / (XMAX - XMIN) * (W - 70);
    const py = y => H - 30 - (y - YMIN) / (YMAX - YMIN) * (H - 50);
    const fact = n => n <= 1 ? 1 : n * fact(n - 1);

    // exact function and its Maclaurin coefficient of x^k
    const FUNCS = {
        exp: { f: Math.exp, c: k => 1 / fact(k), tex: "e^{x}" },
        sin: { f: Math.sin, c: k => k % 2 ? ((k - 1) / 2 % 2 ? -1 : 1) / fact(k) : 0, tex: "\\sin x" },
        ln:  { f: x => Math.log(1 + x), c: k => k === 0 ? 0 : (k % 2 ? 1 : -1) / k, tex: "\\ln(1+x)" }
    };

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#b7ad9c", curve: "#0e6862", poly: "#8a3524", point: "#b7893a", text: "#5a5348" }
            : { bg: "#211e18", axis: "#555043", curve: "#4fb3ab", poly: "#d0715c", point: "#d8b36a", text: "#a99f8c" };
    }

    function katexOrText(el, tex, plain) {
        if (window.katex) el.innerHTML = window.katex.renderToString(tex, { throwOnError: false });
        else el.textContent = plain;
    }

    const poly = (F, N, x) => { let s = 0; for (let k = 0; k <= N; k++) s += F.c(k) * Math.pow(x, k); return s; };

    function trace(fn, color, width, lo, hi) {
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
        let pen = false;
        for (let x = lo; x <= hi + 1e-9; x += 0.01) {
            const y = fn(x);
            if (!isFinite(y) || y < YMIN - 2 || y > YMAX + 2) { pen = false; continue; }
            pen ? ctx.lineTo(px(x), py(y)) : ctx.moveTo(px(x), py(y));
            pen = true;
        }
        ctx.stroke();
    }

    function draw() {
        const p = palette(), F = FUNCS[fEl.value], N = +nEl.value, x0 = +xEl.value;
        const lo = fEl.value === "ln" ? -0.995 : XMIN;
        ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(XMIN), py(0)); ctx.lineTo(px(XMAX), py(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px(0), py(YMIN)); ctx.lineTo(px(0), py(YMAX)); ctx.stroke();
        ctx.save();
        ctx.beginPath(); ctx.rect(px(XMIN), py(YMAX), px(XMAX) - px(XMIN), py(YMIN) - py(YMAX)); ctx.clip();
        trace(x => poly(F, N, x), p.poly, 2.4, XMIN, XMAX);
        trace(F.f, p.curve, 3, lo, XMAX);
        ctx.restore();
        if (x0 > lo) {
            const e = F.f(x0), q = poly(F, N, x0);
            ctx.beginPath(); ctx.arc(px(x0), py(Math.max(YMIN, Math.min(YMAX, e))), 6, 0, Math.PI * 2);
            ctx.fillStyle = p.point; ctx.fill();
            katexOrText(readout,
                `${F.tex}\\ \\text{ at } x=${x0.toFixed(2)}:\\ \\ \\text{exact}=${e.toFixed(4)},\\ \\ \\text{polynomial (through } x^{${N}})=${q.toFixed(4)},\\ \\ \\text{error}=${Math.abs(q - e).toFixed(4)}`,
                `x=${x0.toFixed(2)}: exact ${e.toFixed(4)}, polynomial(x^${N}) ${q.toFixed(4)}, error ${Math.abs(q - e).toFixed(4)}`);
        } else {
            readout.textContent = "ln(1+x) is undefined for x ≤ −1";
        }
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("teal: true function    red: polynomial", px(XMIN) + 8, py(YMAX) + 14);
    }

    [fEl, nEl, xEl].forEach(el => el.addEventListener("input", draw));
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
