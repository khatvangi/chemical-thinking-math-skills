/**
 * §1.4 widget: interference as complex arithmetic. Two unit-amplitude
 * waves at phase difference φ travel continuously; their sum swells
 * (bonding) or dies (antibonding) as φ moves. Intensity 2 + 2cos φ live.
 * Mounts on #wiCanvas; #wiPhi slider; #wiReadout.
 */
(function () {
    const canvas = document.getElementById("wiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const phiEl = document.getElementById("wiPhi");
    const readout = document.getElementById("wiReadout");

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#d5cebd", w1: "#0e6862", w2: "#97772a", sum: "#8a3524", text: "#5a5348" }
            : { bg: "#211e18", axis: "#3d3729", w1: "#4fb3ab", w2: "#cfa94f", sum: "#d0715c", text: "#a99f8c" };
    }

    let t = 0, raf = null;

    function trace(yMid, amp, phase, color, width) {
        ctx.strokeStyle = color; ctx.lineWidth = width;
        ctx.beginPath();
        for (let px = 40; px <= canvas.width - 40; px += 2) {
            const x = (px - 40) / 60;
            const y = yMid - amp * Math.cos(2 * Math.PI * (x / 2.4) - t + phase) * 26;
            if (px === 40) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();
    }

    function draw() {
        const p = palette();
        const phi = (+phiEl.value) * Math.PI / 180;
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const rows = [70, 150, 260];
        rows.forEach(y => {
            ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(canvas.width - 40, y); ctx.stroke();
        });

        ctx.fillStyle = p.text; ctx.font = "600 12px 'JetBrains Mono', monospace";
        ctx.fillText("ψ₁  (phase 0)", 44, rows[0] - 36);
        ctx.fillText("ψ₂  (phase φ = " + phiEl.value + "°)", 44, rows[1] - 36);
        ctx.fillText("ψ₁ + ψ₂", 44, rows[2] - 62);

        trace(rows[0], 1, 0, p.w1, 2);
        trace(rows[1], 1, phi, p.w2, 2);

        // sum wave: amplitude |1 + e^{iφ}| = 2|cos(φ/2)|, phase φ/2
        const sumAmp = 2 * Math.abs(Math.cos(phi / 2));
        trace(rows[2], sumAmp, phi / 2, p.sum, 3.2);

        const I = 2 + 2 * Math.cos(phi);
        ctx.fillStyle = p.sum; ctx.font = "700 14px 'JetBrains Mono', monospace";
        const verdict = I > 3.6 ? "constructive — bonding" : I < 0.4 ? "destructive — antibonding node" : "partial";
        ctx.fillText("intensity |ψ₁+ψ₂|² = 2 + 2cos φ = " + I.toFixed(2) + "   (" + verdict + ")", 44, canvas.height - 18);
    }

    function texReadout() {
        const phi = +phiEl.value;
        const I = 2 + 2 * Math.cos(phi * Math.PI / 180);
        const tex = s => window.katex ? katex.renderToString(s, { throwOnError: false }) : s;
        readout.innerHTML = tex("\\left| 1 + (\\cos\\varphi + i\\sin\\varphi) \\right|^2 = 2 + 2\\cos\\varphi = " + I.toFixed(2) +
            "\\quad (\\varphi = " + phi + "^\\circ)");
    }

    function loop(now) {
        t = now / 700;
        draw();
        raf = requestAnimationFrame(loop);
    }

    phiEl.addEventListener("input", texReadout);
    // pause the animation loop when the widget scrolls out of view
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
            else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        });
    });
    io.observe(canvas);

    texReadout();
    draw();
})();
