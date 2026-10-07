/**
 * §4.4 widget: best split of a fixed total concentration C for the initial
 * rate  k [A]^a [B]^b  with [A] + [B] = C.  Plots q/qmax along the budget,
 * the moving point with its tangent, and the optimum [A]* = a C / (a + b).
 * Shows that the best feed is the stoichiometric ratio a : b.
 */
(function () {
    const canvas = document.getElementById("soCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const aEl = document.getElementById("soA");
    const bEl = document.getElementById("soB");
    const cEl = document.getElementById("soC");
    const xEl = document.getElementById("soX");
    const playEl = document.getElementById("soPlay");
    const readout = document.getElementById("soReadout");

    const W = canvas.width, H = canvas.height;
    const YMAX = 1.12;
    const px = (x, C) => 55 + (x / C) * (W - 85);
    const py = y => H - 42 - (y / YMAX) * (H - 70);

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#b7ad9c", curve: "#0e6862", tangent: "#8a3524", point: "#8a3524", best: "#b7893a", text: "#5a5348" }
            : { bg: "#211e18", axis: "#555043", curve: "#4fb3ab", tangent: "#d0715c", point: "#d0715c", best: "#d8b36a", text: "#a99f8c" };
    }

    function katexOrText(el, tex, plain) {
        if (window.katex) el.innerHTML = window.katex.renderToString(tex, { throwOnError: false });
        else el.textContent = plain;
    }

    function draw() {
        const p = palette();
        const a = +aEl.value, b = +bEl.value, C = +cEl.value, frac = +xEl.value;
        const xs = a * C / (a + b);                       // optimum [A]
        const qOf = x => Math.pow(x, a) * Math.pow(C - x, b);
        const qmax = qOf(xs);
        const x = frac * C, B = C - x;
        const q = qOf(x);

        ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);

        // axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(0, C), py(0)); ctx.lineTo(px(C, C), py(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px(0, C), py(0)); ctx.lineTo(px(0, C), py(YMAX)); ctx.stroke();
        ctx.fillStyle = p.text; ctx.font = "italic 13px 'STIX Two Text', serif";
        ctx.fillText("[A] (M)   ← [B] = C − [A] →", px(C, C) - 190, py(0) + 28);
        ctx.fillText("rate / rate at the optimum", px(0, C) + 8, py(YMAX) + 12);
        ctx.font = "11px 'JetBrains Mono', monospace";
        for (let i = 0; i <= 4; i++) {
            const v = C * i / 4;
            ctx.fillText(v.toFixed(2), px(v, C) - 12, py(0) + 14);
        }

        // optimum marker (dashed vertical + gold dot)
        ctx.setLineDash([5, 5]); ctx.strokeStyle = p.best; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px(xs, C), py(0)); ctx.lineTo(px(xs, C), py(1)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(px(xs, C), py(1), 6, 0, Math.PI * 2);
        ctx.strokeStyle = p.best; ctx.lineWidth = 2; ctx.stroke();

        // the profile q/qmax
        ctx.strokeStyle = p.curve; ctx.lineWidth = 2.6; ctx.beginPath();
        for (let i = 0; i <= 400; i++) {
            const xx = C * i / 400;
            const X = px(xx, C), Y = py(qOf(xx) / qmax);
            i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // tangent at the current point (slope of q/qmax in plot units)
        if (x > 1e-9 && B > 1e-9) {
            const dq = q * (a / x - b / B) / qmax;        // d(q/qmax)/dx
            const h = 0.12 * C;
            ctx.save();
            ctx.beginPath(); ctx.rect(px(0, C), py(YMAX), px(C, C) - px(0, C), py(0) - py(YMAX)); ctx.clip();
            ctx.strokeStyle = p.tangent; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px(x - h, C), py(q / qmax - dq * h));
            ctx.lineTo(px(x + h, C), py(q / qmax + dq * h));
            ctx.stroke();
            ctx.restore();
        }

        // the point
        const near = Math.abs(x - xs) < 0.012 * C;
        ctx.beginPath(); ctx.arc(px(x, C), py(q / qmax), 7, 0, Math.PI * 2);
        ctx.fillStyle = near ? p.best : p.point; ctx.fill();

        const tag = near ? "\\ \\text{(at the optimum)}" : "";
        katexOrText(readout,
            `[\\mathrm{A}]=${x.toFixed(3)}\\ \\mathrm{M},\\ [\\mathrm{B}]=${B.toFixed(3)}\\ \\mathrm{M}:\\ \\ [\\mathrm{A}]^{${a}}[\\mathrm{B}]^{${b}}=${q.toExponential(3)}\\ \\mathrm{M}^{${a + b}}${tag}\\quad\\Big|\\quad [\\mathrm{A}]^{*}=\\tfrac{a}{a+b}C=${xs.toFixed(3)}\\ \\mathrm{M},\\ [\\mathrm{B}]^{*}=${(C - xs).toFixed(3)}\\ \\mathrm{M}\\ \\ (\\text{feed ratio } ${a}\\!:\\!${b})`,
            `[A]=${x.toFixed(3)} M, [B]=${B.toFixed(3)} M: [A]^${a}[B]^${b} = ${q.toExponential(3)} M^${a + b}${near ? " (at optimum)" : ""}  |  optimum [A]* = a/(a+b)*C = ${xs.toFixed(3)} M, [B]* = ${(C - xs).toFixed(3)} M  (feed ratio ${a}:${b})`);
    }

    // sweep the point along the budget with an eased animation
    let anim = null;
    const ease = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    playEl.addEventListener("click", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        const t0 = performance.now(), DUR = 6000;
        function step(now) {
            const u = Math.min(1, (now - t0) / DUR);
            xEl.value = (0.005 + 0.99 * ease(u)).toFixed(3);
            draw();
            anim = u < 1 ? requestAnimationFrame(step) : null;
        }
        anim = requestAnimationFrame(step);
    });

    [aEl, bEl, cEl, xEl].forEach(el => el.addEventListener("input", () => {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        draw();
    }));
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
