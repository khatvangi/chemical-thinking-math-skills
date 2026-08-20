/**
 * §2.3 widget: projection / dot-product explorer.
 * Fixed vector w along +x; movable v controlled by angle & magnitude sliders.
 * Shows the signed shadow (scalar projection) and the dot product live.
 * Colors are sampled from the page at draw time so light/dark both work.
 */
(function () {
    const canvas = document.getElementById("dpProjCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const angleEl = document.getElementById("dpAngle");
    const magEl = document.getElementById("dpMag");
    const readout = document.getElementById("dpReadout");

    // palette keyed to page brightness (matches the textbook scss tokens)
    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#ddd6c8", w: "#8a3524", v: "#0e6862", proj: "#97772a", text: "#5a5348" }
            : { bg: "#211e18", axis: "#383327", w: "#d0715c", v: "#4fb3ab", proj: "#cfa94f", text: "#a99f8c" };
    }

    function arrow(x0, y0, x1, y1, color, width) {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 11 * Math.cos(a - 0.42), y1 - 11 * Math.sin(a - 0.42));
        ctx.lineTo(x1 - 11 * Math.cos(a + 0.42), y1 - 11 * Math.sin(a + 0.42));
        ctx.closePath(); ctx.fill();
    }

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const ox = 110, oy = canvas.height - 70;
        const theta = (+angleEl.value) * Math.PI / 180;
        const magPx = +magEl.value;
        const wPx = 400;                       // 100 px = 1 unit, so |w| = 4.0
        const vux = Math.cos(theta), vuy = Math.sin(theta);
        const vx = vux * magPx, vy = vuy * magPx;
        const projPx = vx;                     // shadow of v on w (w is along +x)

        // baseline through w
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(20, oy); ctx.lineTo(canvas.width - 20, oy); ctx.stroke();
        ctx.setLineDash([]);

        // drop line from tip of v to its shadow
        ctx.strokeStyle = p.text; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(ox + vx, oy - vy); ctx.lineTo(ox + projPx, oy); ctx.stroke();
        ctx.setLineDash([]);

        // w, projection, v
        arrow(ox, oy, ox + wPx, oy, p.w, 3);
        if (Math.abs(projPx) > 4) arrow(ox, oy, ox + projPx, oy, p.proj, 5);
        arrow(ox, oy, ox + vx, oy - vy, p.v, 3);

        ctx.font = "600 15px 'JetBrains Mono', monospace";
        ctx.fillStyle = p.w; ctx.fillText("w", ox + wPx - 6, oy + 24);
        ctx.fillStyle = p.v; ctx.fillText("v", ox + vx + 10, oy - vy - 8);
        if (Math.abs(projPx) > 24) {
            ctx.fillStyle = p.proj;
            ctx.fillText("shadow", ox + projPx / 2 - 26, oy + 24);
        }

        // numbers in abstract units: 100 px = 1 unit, |w| fixed
        const u = 100;
        const vlen = magPx / u, wlen = wPx / u;
        const dot = vlen * wlen * Math.cos(theta);
        const comp = vlen * Math.cos(theta);
        const sign = dot > 1e-9 ? "positive — acute" : dot < -1e-9 ? "negative — obtuse" : "zero — orthogonal";
        readout.innerHTML =
            "θ = " + (+angleEl.value) + "°   |v| = " + vlen.toFixed(2) + "   |w| = " + wlen.toFixed(2) +
            "<br>comp<sub>w</sub> v = |v| cos θ = " + comp.toFixed(3) +
            "<br><b>v · w = |v||w| cos θ = " + dot.toFixed(3) + "</b>   (" + sign + ")";
    }

    angleEl.addEventListener("input", draw);
    magEl.addEventListener("input", draw);
    // redraw when the reader flips the light/dark toggle
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
