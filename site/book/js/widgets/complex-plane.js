/**
 * §1.5 widget: Argand-plane explorer.
 * z₁ set in rectangular (sliders), z₂ in polar; operation select shows
 * z₁+z₂ (translation), z₁×z₂ (rotate-and-scale), or z̄₁ (mirror).
 * KaTeX readout gives both representations. Light/dark aware.
 */
(function () {
    const canvas = document.getElementById("cpCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const opEl = document.getElementById("cpOp");
    const reEl = document.getElementById("cpRe"), imEl = document.getElementById("cpIm");
    const rEl = document.getElementById("cpR"), thEl = document.getElementById("cpTh");
    const readout = document.getElementById("cpReadout");

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", axis: "#c9c2b2", circle: "#ddd6c8", z1: "#0e6862", z2: "#97772a", res: "#8a3524", text: "#5a5348" }
            : { bg: "#211e18", axis: "#4a4436", circle: "#383327", z1: "#4fb3ab", z2: "#cfa94f", res: "#d0715c", text: "#a99f8c" };
    }

    function arrow(x0, y0, x1, y1, color, width, dashed) {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        if (dashed) ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.setLineDash([]);
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 10 * Math.cos(a - 0.42), y1 - 10 * Math.sin(a - 0.42));
        ctx.lineTo(x1 - 10 * Math.cos(a + 0.42), y1 - 10 * Math.sin(a + 0.42));
        ctx.closePath(); ctx.fill();
    }

    const deg = x => x * 180 / Math.PI;
    const f = (x, n) => (Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toString();

    function polarTex(name, re, im) {
        const r = Math.hypot(re, im);
        let th = deg(Math.atan2(im, re));
        if (th < 0) th += 360;
        return name + " = " + f(re, 2) + (im >= 0 ? " + " : " - ") + f(Math.abs(im), 2) + "i" +
            " = " + f(r, 2) + "\\,(\\cos " + f(th, 0) + "^\\circ + i\\sin " + f(th, 0) + "^\\circ)";
    }

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2, cy = canvas.height / 2, s = 80;
        const X = re => cx + re * s, Y = im => cy - im * s;

        // axes + unit circle
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(canvas.width - 20, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, 15); ctx.lineTo(cx, canvas.height - 15); ctx.stroke();
        ctx.strokeStyle = p.circle; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = p.text; ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("Re", canvas.width - 38, cy - 8);
        ctx.fillText("Im", cx + 8, 26);
        ctx.fillText("1", X(1) - 3, cy + 16);

        const z1 = [+reEl.value, +imEl.value];
        const th2 = +thEl.value * Math.PI / 180, r2 = +rEl.value;
        const z2 = [r2 * Math.cos(th2), r2 * Math.sin(th2)];
        const op = opEl.value;

        let res, opName;
        if (op === "mul") {
            res = [z1[0] * z2[0] - z1[1] * z2[1], z1[0] * z2[1] + z1[1] * z2[0]];
            opName = "z_1 z_2";
        } else if (op === "add") {
            res = [z1[0] + z2[0], z1[1] + z2[1]];
            opName = "z_1 + z_2";
        } else {
            res = [z1[0], -z1[1]];
            opName = "\\bar{z}_1";
        }

        // arrows
        arrow(cx, cy, X(z1[0]), Y(z1[1]), p.z1, 3);
        if (op !== "conj") arrow(cx, cy, X(z2[0]), Y(z2[1]), p.z2, 2.5);
        if (op === "add") {
            // parallelogram guides
            arrow(X(z1[0]), Y(z1[1]), X(res[0]), Y(res[1]), p.z2, 1.5, true);
        }
        arrow(cx, cy, X(res[0]), Y(res[1]), p.res, 4);

        ctx.font = "italic 700 16px 'STIX Two Text', serif";
        ctx.fillStyle = p.z1; ctx.fillText("z₁", X(z1[0]) + 8, Y(z1[1]) - 6);
        if (op !== "conj") { ctx.fillStyle = p.z2; ctx.fillText("z₂", X(z2[0]) + 8, Y(z2[1]) - 6); }
        ctx.fillStyle = p.res;
        ctx.fillText(op === "mul" ? "z₁z₂" : op === "add" ? "z₁+z₂" : "z̄₁", X(res[0]) + 8, Y(res[1]) + 16);

        const tex = t => window.katex ? katex.renderToString(t, { throwOnError: false }) : t;
        let extra = "";
        if (op === "mul") {
            const r1 = Math.hypot(z1[0], z1[1]);
            let t1 = deg(Math.atan2(z1[1], z1[0])); if (t1 < 0) t1 += 360;
            extra = "<br>" + tex("|z_1 z_2| = " + f(r1, 2) + " \\times " + f(r2, 2) + " = " + f(r1 * r2, 2) +
                ", \\qquad \\theta = " + f(t1, 0) + "^\\circ + " + f(+thEl.value, 0) + "^\\circ = " +
                f((t1 + +thEl.value) % 360, 0) + "^\\circ");
        }
        readout.innerHTML =
            tex(polarTex("z_1", z1[0], z1[1])) + "<br>" +
            (op !== "conj" ? tex(polarTex("z_2", z2[0], z2[1])) + "<br>" : "") +
            tex(polarTex(opName, res[0], res[1])) + extra;
    }

    [opEl, reEl, imEl, rEl, thEl].forEach(el => el.addEventListener("input", draw));
    opEl.addEventListener("change", draw);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
})();
