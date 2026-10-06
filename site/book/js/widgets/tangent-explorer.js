/**
 * §4.1 widget: tangent-line explorer on the yield curve y(t) = 6t² − t³.
 * Slider moves the point; the tangent line, y′ and y″ readouts update live.
 * Stationary points (y′ = 0) marked; play button sweeps t with easing.
 * Light/dark aware; KaTeX readout with plain-text fallback.
 */
(function () {
    const canvas = document.getElementById("teCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const tEl = document.getElementById("teT");
    const playEl = document.getElementById("tePlay");
    const readout = document.getElementById("teReadout");

    const W = canvas.width, H = canvas.height;
    const TMIN = -0.3, TMAX = 6.4, YMIN = -8, YMAX = 42;

    const f = t => 6 * t * t - t * t * t;
    const f1 = t => 12 * t - 3 * t * t;
    const f2 = t => 12 - 6 * t;

    const px = t => (t - TMIN) / (TMAX - TMIN) * (W - 30) + 15;
    const py = y => H - 35 - (y - YMIN) / (YMAX - YMIN) * (H - 55);

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#b7ad9c", curve: "#0e6862", tangent: "#8a3524", point: "#8a3524", flat: "#b7893a", text: "#5a5348" }
            : { bg: "#211e18", axis: "#555043", curve: "#4fb3ab", tangent: "#d0715c", point: "#d0715c", flat: "#d8b36a", text: "#a99f8c" };
    }

    function katexOrText(el, tex, plain) {
        if (window.katex) el.innerHTML = window.katex.renderToString(tex, { throwOnError: false });
        else el.textContent = plain;
    }

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, W, H);

        // axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(TMIN), py(0)); ctx.lineTo(px(TMAX), py(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px(0), py(YMIN)); ctx.lineTo(px(0), py(YMAX)); ctx.stroke();
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("t (h)", px(TMAX) - 34, py(0) + 18);
        ctx.fillText("y (g)", px(0) + 8, py(YMAX) + 14);

        // curve
        ctx.strokeStyle = p.curve; ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let t = 0; t <= 6.3; t += 0.04) {
            const X = px(t), Y = py(f(t));
            t === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // stationary points: t = 0 and t = 4
        [0, 4].forEach(ts => {
            ctx.beginPath(); ctx.arc(px(ts), py(f(ts)), 6, 0, Math.PI * 2);
            ctx.strokeStyle = p.flat; ctx.lineWidth = 2; ctx.stroke();
        });

        const t = +tEl.value;
        const y = f(t), s = f1(t), c = f2(t);

        // tangent segment, length ±0.9 in t
        ctx.strokeStyle = p.tangent; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px(t - 0.9), py(y - 0.9 * s));
        ctx.lineTo(px(t + 0.9), py(y + 0.9 * s));
        ctx.stroke();

        // the point (fills gold when the tangent is flat)
        ctx.beginPath(); ctx.arc(px(t), py(y), 6.5, 0, Math.PI * 2);
        ctx.fillStyle = Math.abs(s) < 0.25 ? p.flat : p.point;
        ctx.fill();

        const dir = Math.abs(s) < 0.25 ? "stationary" : (s > 0 ? "rising" : "falling");
        const cupSym = c > 0 ? "\\cup" : "\\cap";
        const cupPlain = c > 0 ? "curving up" : "curving down";
        katexOrText(readout,
            `t=${t.toFixed(2)}\\ \\mathrm{h}:\\quad y'=${s.toFixed(1)}\\ \\mathrm{g/h}\\ (\\text{${dir}}),\\quad y''=${c.toFixed(1)}\\ \\mathrm{g/h^2}\\ (\\text{${cupPlain} }${cupSym})`,
            `t=${t.toFixed(2)} h:  y' = ${s.toFixed(1)} g/h (${dir}),  y'' = ${c.toFixed(1)} g/h^2 (${cupPlain})`);
    }

    // play: sweep t from 0 to 6 with easing
    let anim = null;
    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    playEl.addEventListener("click", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        const t0 = performance.now(), DUR = 5000;
        function step(now) {
            const u = Math.min(1, (now - t0) / DUR);
            tEl.value = (ease(u) * 6).toFixed(2);
            draw();
            if (u < 1) anim = requestAnimationFrame(step);
            else anim = null;
        }
        anim = requestAnimationFrame(step);
    });

    tEl.addEventListener("input", draw);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
