/**
 * §2.4 widget: the coordinate grid glides from lab axes to a crystal's
 * skewed cell basis while the PHYSICAL arrow stays frozen — only its
 * coordinates re-negotiate. Mounts on #bcCanvas; #bcPlay; #bcScrub;
 * #bcReadout.
 */
(function () {
    const canvas = document.getElementById("bcCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const playEl = document.getElementById("bcPlay");
    const scrubEl = document.getElementById("bcScrub");
    const readout = document.getElementById("bcReadout");

    // crystal basis (columns), deliberately skewed and unequal
    const B = [[1.3, 0.45], [0.15, 1.0]];
    const V = [1.9, 1.3]; // the fixed physical vector (lab coordinates)

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", grid0: "rgba(90,83,72,0.10)", grid: "#97772a", axis: "#5a5348",
                vec: "#8a3524", e1: "#0e6862", e2: "#97772a", text: "#5a5348" }
            : { bg: "#211e18", grid0: "rgba(169,159,140,0.10)", grid: "#cfa94f", axis: "#a99f8c",
                vec: "#d0715c", e1: "#4fb3ab", e2: "#cfa94f", text: "#a99f8c" };
    }

    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const lerpB = t => [
        [1 + t * (B[0][0] - 1), t * B[0][1]],
        [t * B[1][0], 1 + t * (B[1][1] - 1)]
    ];
    const inv2 = M => {
        const d = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        return [[M[1][1] / d, -M[0][1] / d], [-M[1][0] / d, M[0][0] / d]];
    };

    let t = 0, raf = null;

    function arrow(x0, y0, x1, y1, color, width, label) {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4));
        ctx.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
        if (label) { ctx.font = "italic 700 16px 'STIX Two Text', serif"; ctx.fillText(label, x1 + 7, y1 - 7); }
    }

    function draw() {
        const p = palette();
        const M = lerpB(ease(t));
        const Minv = inv2(M);
        const coords = [Minv[0][0] * V[0] + Minv[0][1] * V[1], Minv[1][0] * V[0] + Minv[1][1] * V[1]];

        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2 - 60, cy = canvas.height / 2 + 60, s = 85;
        const X = v => cx + (M[0][0] * v[0] + M[0][1] * v[1]) * s;
        const Y = v => cy - (M[1][0] * v[0] + M[1][1] * v[1]) * s;

        // static lab grid ghost
        ctx.strokeStyle = p.grid0; ctx.lineWidth = 1;
        for (let k = -4; k <= 4; k++) {
            ctx.beginPath(); ctx.moveTo(cx + k * s, 0); ctx.lineTo(cx + k * s, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, cy + k * s); ctx.lineTo(canvas.width, cy + k * s); ctx.stroke();
        }
        // moving basis grid
        for (let k = -4; k <= 4; k++) {
            ctx.strokeStyle = k === 0 ? p.axis : p.grid;
            ctx.globalAlpha = k === 0 ? 0.9 : 0.35;
            ctx.lineWidth = k === 0 ? 1.5 : 1;
            ctx.beginPath(); ctx.moveTo(X([k, -4]), Y([k, -4])); ctx.lineTo(X([k, 4]), Y([k, 4])); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(X([-4, k]), Y([-4, k])); ctx.lineTo(X([4, k]), Y([4, k])); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // basis vectors of the current frame
        arrow(cx, cy, X([1, 0]), Y([1, 0]), p.e1, 3, "a");
        arrow(cx, cy, X([0, 1]), Y([0, 1]), p.e2, 3, "b");

        // the FIXED physical vector (lab coordinates never move)
        arrow(cx, cy, cx + V[0] * s, cy - V[1] * s, p.vec, 4, "v");

        // on-canvas live coordinates
        ctx.fillStyle = p.vec; ctx.font = "700 14px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText("coordinates of v in the CURRENT grid: (" +
            coords[0].toFixed(2) + ", " + coords[1].toFixed(2) + ")", 14, 24);
        ctx.fillStyle = p.text; ctx.font = "600 12px 'JetBrains Mono', monospace";
        ctx.fillText("the arrow has not moved — only its description has", 14, 44);

        scrubEl.value = Math.round(t * 100);
    }

    function texReadout() {
        const tex = s => window.katex ? katex.renderToString(s, { throwOnError: false }) : s;
        const Minv = inv2(B);
        const u = Minv[0][0] * V[0] + Minv[0][1] * V[1], w = Minv[1][0] * V[0] + Minv[1][1] * V[1];
        readout.innerHTML =
            tex("\\text{lab frame: } \\mathbf{v} = (" + V[0] + ", " + V[1] + ")") + "&emsp;" +
            tex("\\text{cell frame: } \\mathbf{v} = " + u.toFixed(2) + "\\,\\mathbf{a} + " + w.toFixed(2) + "\\,\\mathbf{b}") +
            " — same arrow, new numbers: coordinates are a relationship, not a property.";
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        const t0 = performance.now(), DUR = 2200, from = t > 0.5 ? 1 : 0, to = 1 - from;
        (function step(now) {
            const u = Math.min(1, (now - t0) / DUR);
            t = from + (to - from) * u;
            draw();
            if (u < 1) raf = requestAnimationFrame(step);
        })(t0);
    }

    playEl.addEventListener("click", play);
    scrubEl.addEventListener("input", () => {
        if (raf) cancelAnimationFrame(raf);
        t = (+scrubEl.value) / 100; draw();
    });
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    t = 0; draw();
})();
