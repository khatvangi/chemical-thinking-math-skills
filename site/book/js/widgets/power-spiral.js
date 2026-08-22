/**
 * De Moivre power spiral (§1.5), 3b1b-flavored: z^t animated continuously
 * for t from 0 to n, tracing the spiral r^t · cis(tθ) with dots at the
 * integer powers. Mounts on #psCanvas; controls #psR, #psTh, #psPlay.
 */
(function () {
    const canvas = document.getElementById("psCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rEl = document.getElementById("psR");
    const thEl = document.getElementById("psTh");
    const playEl = document.getElementById("psPlay");
    const readout = document.getElementById("psReadout");
    const N = 6;

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#c9c2b2", circle: "#ddd6c8", trail: "#0e6862", dot: "#8a3524", point: "#8a3524", text: "#5a5348" }
            : { bg: "#211e18", axis: "#4a4436", circle: "#383327", trail: "#4fb3ab", dot: "#d0715c", point: "#d0715c", text: "#a99f8c" };
    }

    let t = 0, raf = null;

    function zAt(tt) {
        const r = +rEl.value, th = (+thEl.value) * Math.PI / 180;
        const mod = Math.pow(r, tt), ang = th * tt;
        return [mod * Math.cos(ang), mod * Math.sin(ang)];
    }

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2, cy = canvas.height / 2;
        const r = +rEl.value;
        // scale so the largest point in play fits
        const maxMod = Math.max(1.2, Math.pow(r, N));
        const s = Math.min(cx, cy) * 0.85 / maxMod;
        const X = z => cx + z[0] * s, Y = z => cy - z[1] * s;

        // axes + unit circle
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(15, cy); ctx.lineTo(canvas.width - 15, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, 15); ctx.lineTo(cx, canvas.height - 15); ctx.stroke();
        ctx.strokeStyle = p.circle; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        // spiral trail up to current t
        ctx.strokeStyle = p.trail; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let tt = 0; tt <= t + 1e-9; tt += 0.02) {
            const z = zAt(tt);
            if (tt === 0) ctx.moveTo(X(z), Y(z)); else ctx.lineTo(X(z), Y(z));
        }
        ctx.stroke();

        // dots at integer powers reached so far
        ctx.font = "600 13px 'JetBrains Mono', monospace";
        for (let k = 0; k <= Math.floor(t + 1e-9); k++) {
            const z = zAt(k);
            ctx.beginPath(); ctx.arc(X(z), Y(z), 4.5, 0, Math.PI * 2);
            ctx.fillStyle = p.dot; ctx.fill();
            ctx.fillStyle = p.text;
            ctx.fillText("z" + (k === 1 ? "" : "^" + k).replace("^", "^"), X(z) + 8, Y(z) - 8);
        }

        // moving point + radius line
        const zc = zAt(t);
        ctx.strokeStyle = p.point; ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(X(zc), Y(zc)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(X(zc), Y(zc), 6, 0, Math.PI * 2);
        ctx.fillStyle = p.point; ctx.fill();

        // live numbers on-canvas
        const mod = Math.pow(r, t), ang = ((+thEl.value) * t) % 360;
        ctx.fillStyle = p.text; ctx.font = "600 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText("t = " + t.toFixed(2) + "   |z^t| = " + mod.toFixed(2) +
            "   angle = " + ang.toFixed(0) + "°", 14, 22);
    }

    function texReadout() {
        const r = +rEl.value, th = +thEl.value;
        const tex = s2 => window.katex ? katex.renderToString(s2, { throwOnError: false }) : s2;
        readout.innerHTML =
            tex("z = " + r + "\\,(\\cos " + th + "^\\circ + i \\sin " + th + "^\\circ)") + "&emsp;" +
            tex("z^{" + N + "} = " + (Math.round(Math.pow(r, N) * 100) / 100) +
                "\\,\\operatorname{cis}(" + (N * th) % 360 + "^\\circ)") +
            "&emsp;<em>" + (r > 1 ? "modulus > 1: the spiral grows" : r < 1 ? "modulus < 1: the spiral decays inward" : "modulus 1: the point stays on the unit circle — pure rotation") + "</em>";
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        t = 0;
        const t0 = performance.now(), DUR = 4200;
        (function step(now) {
            t = Math.min(N, (now - t0) / DUR * N);
            draw();
            if (t < N) raf = requestAnimationFrame(step);
        })(t0);
    }

    [rEl, thEl].forEach(el => el.addEventListener("input", () => { texReadout(); t = 0; draw(); }));
    playEl.addEventListener("click", play);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    draw();
})();
