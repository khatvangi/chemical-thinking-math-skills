/**
 * §2.3 widget: bond-angle calculator.
 * Select a molecule; the widget shows the two bond vectors, computes the
 * dot product, and walks the full chain cos θ = b1·b2 / (|b1||b2|) → θ.
 * Colors sampled from the page at draw time (light/dark aware).
 */
(function () {
    const canvas = document.getElementById("baCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const select = document.getElementById("baMolecule");
    const readout = document.getElementById("baReadout");

    // experimental-ish geometries, bond vectors from the central atom (Å)
    const molecules = {
        water:   { center: "O", sym: ["H", "H"], b: [[0.958, 0, 0], [-0.240, 0.927, 0]] },
        ammonia: { center: "N", sym: ["H", "H"], b: [[0.940, 0, -0.380], [-0.470, 0.814, -0.380]] },
        methane: { center: "C", sym: ["H", "H"], b: [[0.63, 0.63, 0.63], [0.63, -0.63, -0.63]] },
        co2:     { center: "C", sym: ["O", "O"], b: [[1.16, 0, 0], [-1.16, 0, 0]] },
        bf3:     { center: "B", sym: ["F", "F"], b: [[1.30, 0, 0], [-0.65, 1.126, 0]] }
    };

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", bond: "#0e6862", arc: "#97772a", center: "#211d17", outer: "#44586b", text: "#5a5348", label: "#f3efe6" }
            : { bg: "#211e18", bond: "#4fb3ab", arc: "#cfa94f", center: "#e9e3d5", outer: "#8ba3bb", text: "#a99f8c", label: "#211e18" };
    }

    const mag = v => Math.hypot(v[0], v[1], v[2]);
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const mol = molecules[select.value];
        const [b1, b2] = mol.b;
        const d = dot(b1, b2), m1 = mag(b1), m2 = mag(b2);
        // clamp: floating point can stray a hair outside [-1, 1]
        const cosT = Math.max(-1, Math.min(1, d / (m1 * m2)));
        const theta = Math.acos(cosT) * 180 / Math.PI;

        // draw in the plane spanned by the two bonds: b1 along +x,
        // b2 at the true angle theta from it (projection-faithful for the angle)
        const cx = canvas.width / 2, cy = canvas.height / 2 + 30, s = 130;
        const t = Math.acos(cosT);
        const tips = [
            [cx + s * (m1 / m1), cy],                                  // b1 along +x, normalized length
            [cx + s * Math.cos(t) * (m2 / m1), cy - s * Math.sin(t) * (m2 / m1)]
        ];

        // angle arc
        ctx.strokeStyle = p.arc; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 46, 0, -t, true); ctx.stroke();
        ctx.fillStyle = p.arc; ctx.font = "italic 600 15px 'STIX Two Text', serif";
        ctx.fillText("θ = " + theta.toFixed(1) + "°", cx + 54, cy - 18);

        // bonds
        ctx.strokeStyle = p.bond; ctx.lineWidth = 4;
        tips.forEach(tp => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tp[0], tp[1]); ctx.stroke(); });

        // atoms
        function atom(x, y, r, fill, label) {
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = fill; ctx.fill();
            ctx.fillStyle = p.label; ctx.font = "700 " + (r < 22 ? 12 : 15) + "px 'JetBrains Mono', monospace";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(label, x, y);
        }
        atom(cx, cy, 24, p.center, mol.center);
        tips.forEach((tp, i) => atom(tp[0], tp[1], 17, p.outer, mol.sym[i]));

        const f = x => x.toFixed(3);
        // typeset with katex so symbols match the surrounding prose
        const tex = s => window.katex
            ? katex.renderToString(s, { throwOnError: false })
            : s;
        readout.innerHTML =
            tex("\\mathbf{b}_1 = (" + b1.map(f).join(",\\ ") + ")\\ \\text{Å}, \\quad " +
                "\\mathbf{b}_2 = (" + b2.map(f).join(",\\ ") + ")\\ \\text{Å}") +
            "<br>" + tex("\\mathbf{b}_1 \\cdot \\mathbf{b}_2 = " + f(d) + "\\ \\text{Å}^2, \\quad " +
                "|\\mathbf{b}_1| = " + f(m1) + ", \\quad |\\mathbf{b}_2| = " + f(m2)) +
            "<br>" + tex("\\cos\\theta = \\dfrac{" + f(d) + "}{(" + f(m1) + ")(" + f(m2) + ")} = " + f(cosT) +
                "\\ \\Rightarrow\\ \\theta = " + theta.toFixed(1) + "^\\circ");
    }

    select.addEventListener("change", draw);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
