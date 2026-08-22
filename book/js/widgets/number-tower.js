/**
 * §1.1 widget: the number tower as nested sets (Venn-style), with each
 * ESCAPE animated: a question dot tries to stay in its set, balks at the
 * boundary, then breaks through into the next ring where the answer lands.
 * Mounts on #ntCanvas; controls #ntEscape, #ntPlay; readout #ntReadout.
 */
(function () {
    const canvas = document.getElementById("ntCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const selEl = document.getElementById("ntEscape");
    const playEl = document.getElementById("ntPlay");
    const readout = document.getElementById("ntReadout");

    // nested rings, innermost first: [halfW, halfH, label, sample chips]
    const RINGS = [
        [70, 42, "ℕ", ["6", "12"]],
        [140, 82, "ℤ", ["−2", "−7"]],
        [210, 122, "ℚ", ["1/3", "0.75"]],
        [280, 158, "ℝ", ["√2", "π"]],
        [318, 178, "ℂ", ["i", "2+11i"]]
    ];

    const ESCAPES = {
        sub:  { from: 0, q: "3 − 5", a: "−2",     sentence: "subtraction escapes ℕ: no count answers 3 − 5 — the integers ℤ are forced into existence" },
        div:  { from: 1, q: "1 ÷ 3", a: "1/3",    sentence: "division escapes ℤ: no integer answers 1 ÷ 3 — the rationals ℚ are forced" },
        sqrt: { from: 2, q: "x² = 2", a: "√2",    sentence: "roots escape ℚ: Theorem 1.1.2 — no fraction squares to 2; the reals ℝ are forced" },
        imag: { from: 3, q: "x² = −1", a: "i",    sentence: "x² = −1 escapes ℝ: squares of reals are never negative — ℂ is forced (§1.4)" }
    };

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", ring: "#b9b2a2", ringHot: "#8a3524", label: "#5a5348", chip: "#0e6862",
                dot: "#8a3524", answer: "#0e6862" }
            : { bg: "#211e18", ring: "#57503f", ringHot: "#d0715c", label: "#a99f8c", chip: "#4fb3ab",
                dot: "#d0715c", answer: "#4fb3ab" };
    }

    let t = 0, raf = null;
    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    function rr(cx, cy, hw, hh, r) {
        ctx.beginPath();
        ctx.moveTo(cx - hw + r, cy - hh);
        ctx.arcTo(cx + hw, cy - hh, cx + hw, cy + hh, r);
        ctx.arcTo(cx + hw, cy + hh, cx - hw, cy + hh, r);
        ctx.arcTo(cx - hw, cy + hh, cx - hw, cy - hh, r);
        ctx.arcTo(cx - hw, cy - hh, cx + hw, cy - hh, r);
        ctx.closePath();
    }

    function draw() {
        const p = palette();
        const esc = ESCAPES[selEl.value];
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2, cy = canvas.height / 2;

        // rings, outermost first so inner ones draw on top
        for (let i = RINGS.length - 1; i >= 0; i--) {
            const [hw, hh, label, chips] = RINGS[i];
            const crossing = i === esc.from && t > 0.3 && t < 0.65;
            ctx.strokeStyle = crossing ? p.ringHot : p.ring;
            ctx.lineWidth = crossing ? 2.5 : 1.4;
            if (i === 4) ctx.setLineDash([6, 5]); // C drawn as the open frontier
            rr(cx, cy, hw, hh, 18);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = p.label;
            ctx.font = "700 17px 'STIX Two Text', serif";
            ctx.fillText(label, cx - hw + 10, cy - hh + 22);
            // sample chips sit in this ring's exclusive band, right side
            ctx.fillStyle = p.chip;
            ctx.font = "600 13px 'JetBrains Mono', monospace";
            const bandX = cx + (i === 0 ? 0 : (RINGS[i - 1][0] + hw) / 2);
            chips.forEach((c, k) => {
                ctx.fillText(c, i === 0 ? cx - 14 + k * 26 : bandX - 14, cy - 10 + k * 22 + (i === 0 ? 14 : 0));
            });
        }

        // escaping dot: start inside 'from' ring, cross its boundary rightward
        const fr = RINGS[esc.from], nx = RINGS[esc.from + 1];
        const x0 = cx - fr[0] * 0.45, y0 = cy + fr[1] * 0.45;
        const xB = cx - fr[0], yB = y0 - (y0 - cy) * 0.3;          // boundary point (left wall)
        const x1 = cx - (fr[0] + nx[0]) / 2, y1 = yB;               // lands in next band
        const e = ease(t);
        let dx, dy, shake = 0;
        if (e < 0.4) { const u = e / 0.4; dx = x0 + (xB - x0) * u; dy = y0 + (yB - y0) * u; }
        else if (e < 0.6) { dx = xB; dy = yB; shake = Math.sin(e * 90) * 3 * (1 - (e - 0.4) / 0.2); }
        else { const u = (e - 0.6) / 0.4; dx = xB + (x1 - xB) * u; dy = yB; }

        ctx.beginPath();
        ctx.arc(dx + shake, dy, 7, 0, Math.PI * 2);
        ctx.fillStyle = p.dot; ctx.fill();
        ctx.fillStyle = p.dot;
        ctx.font = "600 13px 'JetBrains Mono', monospace";
        ctx.fillText(esc.q, dx + shake + 10, dy - 10);

        // answer label appears at landing
        if (e > 0.92) {
            ctx.fillStyle = p.answer;
            ctx.font = "700 16px 'JetBrains Mono', monospace";
            ctx.globalAlpha = (e - 0.92) / 0.08;
            ctx.fillText("= " + esc.a, x1 - 8, y1 + 26);
            ctx.globalAlpha = 1;
        }
    }

    function texReadout() {
        const esc = ESCAPES[selEl.value];
        const tex = s => window.katex ? katex.renderToString(s, { throwOnError: false }) : s;
        readout.innerHTML = tex("\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}") +
            "<br>" + esc.sentence;
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        t = 0;
        const t0 = performance.now(), DUR = 2400;
        (function step(now) {
            t = Math.min(1, (now - t0) / DUR);
            draw();
            if (t < 1) raf = requestAnimationFrame(step);
        })(t0);
    }

    selEl.addEventListener("change", () => { texReadout(); play(); });
    playEl.addEventListener("click", play);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    t = 1; draw();
})();
