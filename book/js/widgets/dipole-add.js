/**
 * §2.1 widget: net molecular dipole from two bond dipoles at angle θ.
 * Bond dipole magnitude fixed at 1.52 D (O–H); resultant along the bisector
 * with magnitude 2 μ cos(θ/2). KaTeX readout; light/dark aware.
 */
(function () {
    const canvas = document.getElementById("daCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const angleEl = document.getElementById("daAngle");
    const readout = document.getElementById("daReadout");
    const MU = 1.52; // D per bond

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", bond: "#0e6862", net: "#8a3524", text: "#5a5348", atomO: "#8a3524", atomH: "#44586b", label: "#f3efe6" }
            : { bg: "#211e18", bond: "#4fb3ab", net: "#d0715c", text: "#a99f8c", atomO: "#d0715c", atomH: "#8ba3bb", label: "#211e18" };
    }

    function arrow(x0, y0, x1, y1, color, width) {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 10 * Math.cos(a - 0.42), y1 - 10 * Math.sin(a - 0.42));
        ctx.lineTo(x1 - 10 * Math.cos(a + 0.42), y1 - 10 * Math.sin(a + 0.42));
        ctx.closePath(); ctx.fill();
    }

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const theta = (+angleEl.value) * Math.PI / 180;
        const cx = canvas.width / 2, cy = canvas.height - 60;
        const s = 95; // px per bond dipole

        // bisector vertical: bonds at ±θ/2 from the +y direction (upward)
        const half = theta / 2;
        const b1 = [Math.sin(-half) * s, Math.cos(-half) * s];
        const b2 = [Math.sin(half) * s, Math.cos(half) * s];
        const net = [b1[0] + b2[0], b1[1] + b2[1]]; // = [0, 2 s cos(θ/2)]

        // bond dipole arrows (H → O direction shown pointing to the O at center: draw outward for clarity, from O to H reversed)
        arrow(cx + b1[0], cy - b1[1], cx, cy, p.bond, 3);
        arrow(cx + b2[0], cy - b2[1], cx, cy, p.bond, 3);

        // net dipole from O along bisector
        const netMag = 2 * MU * Math.cos(half);
        if (Math.abs(net[1]) > 3) arrow(cx, cy, cx + net[0] * 0.7, cy - net[1] * 0.7, p.net, 5);

        // atoms
        function atom(x, y, r, fill, label) {
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = fill; ctx.fill();
            ctx.fillStyle = p.label; ctx.font = "700 " + (r < 20 ? 11 : 14) + "px 'JetBrains Mono', monospace";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(label, x, y);
        }
        atom(cx, cy, 20, p.atomO, "O");
        atom(cx + b1[0], cy - b1[1], 14, p.atomH, "H");
        atom(cx + b2[0], cy - b2[1], 14, p.atomH, "H");

        ctx.fillStyle = p.net;
        ctx.font = "italic 600 15px 'STIX Two Text', serif";
        if (netMag > 0.05) ctx.fillText("μ", cx + 16, cy - net[1] * 0.7 + 4);

        const tex = s2 => window.katex ? katex.renderToString(s2, { throwOnError: false }) : s2;
        readout.innerHTML =
            tex("\\theta = " + (+angleEl.value) + "^\\circ, \\qquad \\mu_b = " + MU + "\\ \\text{D per bond}") +
            "<br>" + tex("\\mu_{\\text{net}} = 2\\,\\mu_b \\cos(\\theta/2) = 2(" + MU + ")(" +
                Math.cos(half).toFixed(3) + ") = " + netMag.toFixed(2) + "\\ \\text{D}");
    }

    angleEl.addEventListener("input", draw);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
