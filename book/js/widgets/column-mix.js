/**
 * §3.1 widget: the column picture animated. Av built before your eyes:
 * column 1 stretches to v₁·col₁, column 2 stretches to v₂·col₂, then the
 * second glides tip-to-tail onto the first and the resultant Av appears.
 * Mounts on #cmCanvas; sliders #cmV1, #cmV2; #cmPlay; #cmReadout.
 */
(function () {
    const canvas = document.getElementById("cmCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const v1El = document.getElementById("cmV1");
    const v2El = document.getElementById("cmV2");
    const playEl = document.getElementById("cmPlay");
    const readout = document.getElementById("cmReadout");

    const C1 = [1.2, 0.4], C2 = [0.3, 1.1]; // the matrix's columns

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#d5cebd", c1: "#0e6862", c2: "#97772a", res: "#8a3524", text: "#5a5348" }
            : { bg: "#211e18", axis: "#3d3729", c1: "#4fb3ab", c2: "#cfa94f", res: "#d0715c", text: "#a99f8c" };
    }

    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    let T = 0, raf = null;
    const DUR = 3.2; // s: 0-1 stretch c1, 1-2 stretch c2, 2-3.2 translate + resultant

    function arrow(x0, y0, x1, y1, color, width, label, dashed) {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        if (dashed) ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.setLineDash([]);
        if (Math.hypot(x1 - x0, y1 - y0) > 6) {
            const a = Math.atan2(y1 - y0, x1 - x0);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4));
            ctx.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4));
            ctx.closePath(); ctx.fill();
        }
        if (label) { ctx.font = "600 13px 'JetBrains Mono', monospace"; ctx.fillText(label, x1 + 8, y1 - 6); }
    }

    function draw() {
        const p = palette();
        const v1 = +v1El.value, v2 = +v2El.value;
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = 170, cy = canvas.height - 90, s = 70;
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(canvas.width - 20, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, canvas.height - 20); ctx.stroke();

        const u1 = ease(Math.max(0, Math.min(1, T)));            // stretch factor progress c1
        const u2 = ease(Math.max(0, Math.min(1, T - 1)));        // stretch progress c2
        const u3 = ease(Math.max(0, Math.min(1, (T - 2) / 1.2))); // translation progress

        const k1 = 1 + (v1 - 1) * u1;
        const k2 = 1 + (v2 - 1) * u2;
        const a1 = [C1[0] * k1, C1[1] * k1];
        const a2 = [C2[0] * k2, C2[1] * k2];

        // faint originals
        arrow(cx, cy, cx + C1[0] * s, cy - C1[1] * s, p.c1, 1.2, null, true);
        arrow(cx, cy, cx + C2[0] * s, cy - C2[1] * s, p.c2, 1.2, null, true);

        // scaled column 1 (stays rooted at origin)
        arrow(cx, cy, cx + a1[0] * s, cy - a1[1] * s, p.c1, 3.5,
            "v₁·col₁" + (u1 > 0.9 ? " (×" + v1 + ")" : ""));

        // scaled column 2: roots at origin, then glides to the tip of a1
        const ox = cx + a1[0] * s * u3, oy = cy - a1[1] * s * u3;
        arrow(ox, oy, ox + a2[0] * s, oy - a2[1] * s, p.c2, 3.5,
            "v₂·col₂" + (u2 > 0.9 ? " (×" + v2 + ")" : ""));

        // resultant
        if (u3 > 0.95) {
            const r = [a1[0] + a2[0], a1[1] + a2[1]];
            arrow(cx, cy, cx + r[0] * s, cy - r[1] * s, p.res, 4.5, "Av");
            ctx.fillStyle = p.res; ctx.font = "700 14px 'JetBrains Mono', monospace";
            ctx.fillText("Av = (" + r[0].toFixed(2) + ", " + r[1].toFixed(2) + ")", 24, 30);
        }
    }

    function texReadout() {
        const v1 = +v1El.value, v2 = +v2El.value;
        const r = [C1[0] * v1 + C2[0] * v2, C1[1] * v1 + C2[1] * v2];
        const tex = s => window.katex ? katex.renderToString(s, { throwOnError: false }) : s;
        readout.innerHTML = tex(
            "A\\mathbf{v} = " + v1 + "\\begin{pmatrix} " + C1[0] + " \\\\ " + C1[1] + " \\end{pmatrix} + " +
            v2 + "\\begin{pmatrix} " + C2[0] + " \\\\ " + C2[1] + " \\end{pmatrix} = " +
            "\\begin{pmatrix} " + r[0].toFixed(2) + " \\\\ " + r[1].toFixed(2) + " \\end{pmatrix}");
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        T = 0;
        const t0 = performance.now();
        (function step(now) {
            T = Math.min(DUR, (now - t0) / 1000);
            draw();
            if (T < DUR) raf = requestAnimationFrame(step);
        })(t0);
    }

    [v1El, v2El].forEach(el => el.addEventListener("input", () => { texReadout(); T = DUR; draw(); }));
    playEl.addEventListener("click", play);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    T = DUR; draw();
})();
