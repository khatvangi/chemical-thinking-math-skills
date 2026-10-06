/**
 * §4.1 widget: a diatomic bond as an energy minimum.
 * Lennard-Jones (reduced units) V(r) = r⁻¹² − 2r⁻⁶, minimum at r = 1, V = −1.
 * Slider places the atom on the curve; force arrow shows −dV/dr.
 * "Release" integrates damped motion so the atom oscillates and settles
 * into the minimum — the bond length chooses itself.
 */
(function () {
    const canvas = document.getElementById("bwCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rEl = document.getElementById("bwR");
    const relEl = document.getElementById("bwRelease");
    const readout = document.getElementById("bwReadout");

    const W = canvas.width, H = canvas.height;
    const RMIN = 0.82, RMAX = 2.5, VMIN = -1.25, VMAX = 1.6;

    const V = r => Math.pow(r, -12) - 2 * Math.pow(r, -6);
    const F = r => 12 * Math.pow(r, -13) - 12 * Math.pow(r, -7);   // F = −dV/dr

    const px = r => (r - RMIN) / (RMAX - RMIN) * (W - 30) + 15;
    const py = v => H - 35 - (v - VMIN) / (VMAX - VMIN) * (H - 55);

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#b7ad9c", curve: "#0e6862", atom: "#8a3524", force: "#b7893a", min: "#b7893a", text: "#5a5348" }
            : { bg: "#211e18", axis: "#555043", curve: "#4fb3ab", atom: "#d0715c", force: "#d8b36a", min: "#d8b36a", text: "#a99f8c" };
    }

    function katexOrText(el, tex, plain) {
        if (window.katex) el.innerHTML = window.katex.renderToString(tex, { throwOnError: false });
        else el.textContent = plain;
    }

    let r = +rEl.value, vel = 0, anim = null;

    function draw(settledMsg) {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, W, H);

        // axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(RMIN), py(0)); ctx.lineTo(px(RMAX), py(0)); ctx.stroke();
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("r (bond length)", px(RMAX) - 108, py(0) - 8);
        ctx.fillText("V(r)", px(RMIN) + 6, py(VMAX) + 14);

        // energy curve
        ctx.strokeStyle = p.curve; ctx.lineWidth = 2.5;
        ctx.beginPath();
        let started = false;
        for (let rr = RMIN; rr <= RMAX; rr += 0.004) {
            const v = V(rr);
            if (v > VMAX) { started = false; continue; }
            const X = px(rr), Y = py(v);
            started ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
            started = true;
        }
        ctx.stroke();

        // minimum marker at r = 1
        ctx.beginPath(); ctx.arc(px(1), py(-1), 5.5, 0, Math.PI * 2);
        ctx.strokeStyle = p.min; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = p.text;
        ctx.fillText("dV/dr = 0", px(1) - 30, py(-1) + 24);

        // the atom on the curve
        const v = V(r), f = F(r);
        ctx.beginPath(); ctx.arc(px(r), py(v), 8, 0, Math.PI * 2);
        ctx.fillStyle = p.atom; ctx.fill();

        // force arrow (horizontal, at the atom): sign of −dV/dr
        const fl = Math.max(-70, Math.min(70, f * 18));
        if (Math.abs(fl) > 3) {
            const y0 = py(v) - 20;
            ctx.strokeStyle = p.force; ctx.fillStyle = p.force; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(px(r), y0); ctx.lineTo(px(r) + fl, y0); ctx.stroke();
            const dir = Math.sign(fl);
            ctx.beginPath();
            ctx.moveTo(px(r) + fl, y0);
            ctx.lineTo(px(r) + fl - 9 * dir, y0 - 5);
            ctx.lineTo(px(r) + fl - 9 * dir, y0 + 5);
            ctx.closePath(); ctx.fill();
        }

        if (settledMsg) {
            katexOrText(readout,
                `\\text{settled: } r = 1.00,\\quad \\frac{dV}{dr} = 0,\\quad \\frac{d^2V}{dr^2} = 72 > 0\\ \\text{(stable minimum — a bond)}`,
                "settled: r = 1.00, dV/dr = 0, d2V/dr2 = 72 > 0 (stable minimum - a bond)");
        } else {
            const where = Math.abs(f) < 0.15 ? "zero force — equilibrium" : (f > 0 ? "force pushes outward (too compressed)" : "force pulls inward (too stretched)");
            katexOrText(readout,
                `r = ${r.toFixed(2)}:\\quad V = ${v.toFixed(2)},\\quad F = -\\frac{dV}{dr} = ${f.toFixed(2)}\\ \\text{(${where})}`,
                `r = ${r.toFixed(2)}:  V = ${v.toFixed(2)},  F = -dV/dr = ${f.toFixed(2)} (${where})`);
        }
    }

    // release: damped dynamics m r'' = F − c r'; the atom settles at r = 1
    relEl.addEventListener("click", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        r = +rEl.value; vel = 0;
        let last = null;
        function step(now) {
            if (last === null) last = now;
            let dt = Math.min(0.032, (now - last) / 1000); last = now;
            // substeps for stability on the stiff inner wall
            for (let i = 0; i < 8; i++) {
                const h = dt / 8;
                vel += (F(r) * 2.2 - 1.6 * vel) * h;
                r += vel * h;
                if (r < RMIN + 0.01) { r = RMIN + 0.01; vel = Math.abs(vel) * 0.5; }
                if (r > RMAX - 0.01) { r = RMAX - 0.01; vel = -Math.abs(vel) * 0.5; }
            }
            rEl.value = r.toFixed(3);
            const done = Math.abs(r - 1) < 0.004 && Math.abs(vel) < 0.004;
            draw(done);
            if (!done) anim = requestAnimationFrame(step);
            else { anim = null; }
        }
        anim = requestAnimationFrame(step);
    });

    rEl.addEventListener("input", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        r = +rEl.value; vel = 0;
        draw();
    });
    new MutationObserver(() => draw()).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
