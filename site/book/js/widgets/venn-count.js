/**
 * §1.2 widget: inclusion–exclusion, watched. The solvent shelf of
 * Example 1.2.4 as a Venn diagram; playing the count sweeps |A|, then
 * |B| (the overlap dots get counted a SECOND time and flare), then
 * subtracts the overlap. Mounts on #vcCanvas; #vcPlay; #vcReadout.
 */
(function () {
    const canvas = document.getElementById("vcCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const playEl = document.getElementById("vcPlay");
    const readout = document.getElementById("vcReadout");

    // Example 1.2.4: |U|=30, polar 12, aprotic 9, both 5
    const AONLY = 7, BOTH = 5, BONLY = 4, NEITHER = 14;

    // dot positions, laid out deterministically
    function dots() {
        const cxA = 235, cxB = 405, cy = 200, r = 118;
        const list = [];
        const place = (n, x0, spread, tag) => {
            for (let i = 0; i < n; i++) {
                const row = Math.floor(i / 3), col = i % 3;
                list.push({ x: x0 + col * 28 - 28, y: cy - 40 + row * 34, tag });
            }
        };
        place(AONLY, cxA - 45, 0, "A");
        place(BOTH, (cxA + cxB) / 2, 0, "AB");
        place(BONLY, cxB + 45, 0, "B");
        // neither: along the bottom of the universe box
        for (let i = 0; i < NEITHER; i++) {
            list.push({ x: 80 + i * 36, y: 358, tag: "U" });
        }
        return { list, cxA, cxB, cy, r };
    }

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", box: "#b9b2a2", A: "#0e6862", B: "#97772a", dot: "#5a5348",
                counted: "#0e6862", twice: "#8a3524", text: "#5a5348" }
            : { bg: "#211e18", box: "#57503f", A: "#4fb3ab", B: "#cfa94f", dot: "#a99f8c",
                counted: "#4fb3ab", twice: "#d0715c", text: "#a99f8c" };
    }

    // timeline: phase A count (0..12 ticks), phase B count (9 ticks), subtract (5 ticks)
    const TOTAL_TICKS = 12 + 9 + 5;
    let tick = 0, raf = null;

    function draw() {
        const p = palette();
        const D = dots();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // universe box
        ctx.strokeStyle = p.box; ctx.lineWidth = 1.4;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 60);
        ctx.fillStyle = p.text; ctx.font = "600 13px 'JetBrains Mono', monospace";
        ctx.fillText("U — the shelf, |U| = 30", 52, 62);

        // circles
        ctx.lineWidth = 2;
        ctx.strokeStyle = p.A; ctx.beginPath(); ctx.arc(D.cxA, D.cy, D.r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = p.B; ctx.beginPath(); ctx.arc(D.cxB, D.cy, D.r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = p.A; ctx.font = "700 15px 'STIX Two Text', serif";
        ctx.fillText("P (polar) — 12", D.cxA - 110, D.cy - D.r - 10);
        ctx.fillStyle = p.B;
        ctx.fillText("A (aprotic) — 9", D.cxB + 10, D.cy - D.r - 10);

        // which dots are counted so far?
        const aTicks = Math.min(tick, 12);
        const bTicks = Math.max(0, Math.min(tick - 12, 9));
        const subTicks = Math.max(0, Math.min(tick - 21, 5));
        const aDots = D.list.filter(d => d.tag === "A" || d.tag === "AB");   // 12, AB last
        const aOrdered = D.list.filter(d => d.tag === "A").concat(D.list.filter(d => d.tag === "AB"));
        const bOrdered = D.list.filter(d => d.tag === "B").concat(D.list.filter(d => d.tag === "AB"));

        const countA = new Set(aOrdered.slice(0, aTicks));
        const countB = new Set(bOrdered.slice(0, bTicks));

        let doubleCount = 0;
        D.list.forEach(d => {
            const inA = countA.has(d), inB = countB.has(d);
            const twice = inA && inB;
            if (twice) doubleCount++;
            const uncounted = subTicks > 0 && twice && bOrdered.indexOf(d) - 4 <= subTicks + 3; // subtract in order
            ctx.beginPath();
            ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
            if (twice && subTicks === 0) ctx.fillStyle = p.twice;
            else if (inA || inB) ctx.fillStyle = p.counted;
            else ctx.fillStyle = "transparent";
            if (inA || inB) ctx.fill();
            ctx.strokeStyle = p.dot; ctx.lineWidth = 1.2; ctx.stroke();
            if (twice && subTicks === 0 && bTicks > 4) {
                ctx.fillStyle = p.twice; ctx.font = "700 11px 'JetBrains Mono', monospace";
                ctx.fillText("×2", d.x + 10, d.y - 8);
            }
        });

        // running tally
        const tally = aTicks + bTicks - subTicks;
        ctx.fillStyle = subTicks > 0 ? p.counted : (bTicks > 4 ? p.twice : p.text);
        ctx.font = "700 17px 'JetBrains Mono', monospace";
        let phase;
        if (tick <= 12) phase = "counting P…  " + tally;
        else if (tick <= 21) phase = "counting A…  " + tally + (bTicks > 4 ? "   (the shared 5 are being counted AGAIN)" : "");
        else phase = "subtracting the double-counted overlap…  " + tally;
        if (tick >= TOTAL_TICKS) phase = "|P ∪ A| = 12 + 9 − 5 = 16";
        ctx.fillText(phase, 52, canvas.height - 32);
    }

    function texReadout() {
        const tex = s => window.katex ? katex.renderToString(s, { throwOnError: false }) : s;
        readout.innerHTML = tex("|P \\cup A| = |P| + |A| - |P \\cap A| = 12 + 9 - 5 = 16") +
            " — each shared solvent is counted twice and corrected exactly once.";
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        tick = 0;
        const t0 = performance.now(), PER = 190;
        (function step(now) {
            tick = Math.min(TOTAL_TICKS, Math.floor((now - t0) / PER));
            draw();
            if (tick < TOTAL_TICKS) raf = requestAnimationFrame(step);
        })(t0);
    }

    playEl.addEventListener("click", play);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    tick = TOTAL_TICKS; draw();
})();
