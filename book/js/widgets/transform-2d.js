/**
 * §3.3 widget: apply symmetry operations and general linear maps to a
 * water molecule; ghost = original sites, solid = transformed. The matrix
 * and each atom's fate are shown in the KaTeX readout. Light/dark aware.
 */
(function () {
    const canvas = document.getElementById("tfCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sel = document.getElementById("tfOp");
    const readout = document.getElementById("tfReadout");

    // water in the plane, C2 axis along y (Å)
    const atoms = [
        { sym: "O", p: [0, 0] },
        { sym: "H", p: [0.76, -0.59] },
        { sym: "H", p: [-0.76, -0.59] }
    ];

    const OPS = {
        c2:    { M: [[-1, 0], [0, 1]],       tex: "C_2 = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}" },
        sx:    { M: [[1, 0], [0, -1]],       tex: "\\sigma_x = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}" },
        sy:    { M: [[-1, 0], [0, 1]],       tex: "\\sigma_v = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}" },
        c4:    { M: [[0, -1], [1, 0]],       tex: "C_4 = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}" },
        scale: { M: [[1.5, 0], [0, 1]],      tex: "S = \\begin{pmatrix} 1.5 & 0 \\\\ 0 & 1 \\end{pmatrix}" },
        shear: { M: [[1, 0.5], [0, 1]],      tex: "H = \\begin{pmatrix} 1 & 0.5 \\\\ 0 & 1 \\end{pmatrix}" }
    };

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#ddd6c8", ghost: "#b9b2a2", O: "#8a3524", H: "#44586b", bond: "#0e6862", text: "#5a5348", label: "#f3efe6" }
            : { bg: "#211e18", axis: "#383327", ghost: "#57503f", O: "#d0715c", H: "#8ba3bb", bond: "#4fb3ab", text: "#a99f8c", label: "#211e18" };
    }

    const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const op = OPS[sel.value];
        const cx = canvas.width / 2, cy = canvas.height / 2 + 20, s = 120;
        const X = q => cx + q[0] * s, Y = q => cy - q[1] * s;

        // axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
        ctx.beginPath(); ctx.moveTo(30, cy); ctx.lineTo(canvas.width - 30, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, canvas.height - 20); ctx.stroke();
        ctx.setLineDash([]);

        const moved = atoms.map(a => ({ sym: a.sym, p: apply(op.M, a.p) }));

        // ghost of the original sites
        function drawMol(list, ghost) {
            // bonds O–H
            ctx.strokeStyle = ghost ? p.ghost : p.bond;
            ctx.lineWidth = ghost ? 2 : 3.5;
            [1, 2].forEach(i => {
                ctx.beginPath();
                ctx.moveTo(X(list[0].p), Y(list[0].p));
                ctx.lineTo(X(list[i].p), Y(list[i].p));
                ctx.stroke();
            });
            list.forEach(a => {
                const r = a.sym === "O" ? 17 : 12;
                ctx.beginPath(); ctx.arc(X(a.p), Y(a.p), r, 0, Math.PI * 2);
                ctx.fillStyle = ghost ? p.ghost : (a.sym === "O" ? p.O : p.H);
                ctx.fill();
                if (!ghost) {
                    ctx.fillStyle = p.label;
                    ctx.font = "700 " + (r < 15 ? 10 : 13) + "px 'JetBrains Mono', monospace";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(a.sym, X(a.p), Y(a.p));
                }
            });
        }
        drawMol(atoms, true);
        drawMol(moved, false);

        // does the transformed set coincide with the original set?
        const close = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6;
        const isSym = atoms.every(a =>
            moved.some(m => m.sym === a.sym && close(m.p, a.p)));

        const f = x => (Math.round(x * 100) / 100).toString();
        const tex = t => window.katex ? katex.renderToString(t, { throwOnError: false }) : t;
        readout.innerHTML =
            tex(op.tex) + "<br>" +
            tex("\\mathrm{H}_1: (0.76, -0.59) \\mapsto (" + f(moved[1].p[0]) + ", " + f(moved[1].p[1]) + ")") +
            "&emsp;" +
            tex("\\mathrm{H}_2: (-0.76, -0.59) \\mapsto (" + f(moved[2].p[0]) + ", " + f(moved[2].p[1]) + ")") +
            "<br><b>" + (isSym
                ? "The molecule occupies its original sites — a symmetry operation of water."
                : "Atoms land on unoccupied positions — not a symmetry of water.") + "</b>";
    }

    sel.addEventListener("change", draw);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
