/**
 * §1.3 widget: permutations vs combinations, animated.
 * Phase 1 (ordered): three slots fill from a pool of 5 flasks; the pool
 * visibly shrinks and the running product builds 5 × 4 × 3 = 60.
 * Phase 2 (unordered): the 3! = 6 orderings of one chosen trio glide
 * together and merge into a single panel — the ÷6 made visible.
 * Mounts on #pcCanvas; #pcPlay; #pcReadout.
 */
(function () {
    const canvas = document.getElementById("pcCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const playEl = document.getElementById("pcPlay");
    const readout = document.getElementById("pcReadout");

    const NAMES = ["A", "B", "C", "D", "E"];
    const PICK = [0, 1, 2]; // the trio A, B, C gets chosen in the animation
    const ORDERINGS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];

    function palette() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g) || [250, 248, 243];
        const light = (+m[0] + +m[1] + +m[2]) / 3 > 128;
        return light
            ? { bg: "#f3efe6", pool: "#0e6862", used: "#b9b2a2", slot: "#5a5348", text: "#5a5348",
                fl: ["#0e6862", "#97772a", "#8a3524", "#44586b", "#556b2f"], label: "#f3efe6", merge: "#8a3524" }
            : { bg: "#211e18", pool: "#4fb3ab", used: "#57503f", slot: "#a99f8c", text: "#a99f8c",
                fl: ["#4fb3ab", "#cfa94f", "#d0715c", "#8ba3bb", "#9db36a"], label: "#211e18", merge: "#d0715c" };
    }

    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    // timeline in seconds: 0-1 pick1, 1-2 pick2, 2-3 pick3, 3.4-5.6 merge
    let T = 0, raf = null;
    const DUR = 6.0;

    function flask(x, y, color, name, dim) {
        ctx.globalAlpha = dim ? 0.25 : 1;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        const p = palette();
        ctx.fillStyle = p.label;
        ctx.font = "700 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(name, x, y);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.globalAlpha = 1;
    }

    function draw() {
        const p = palette();
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const poolY = 60, slotY = 150;
        const poolX = i => 120 + i * 70;
        const slotX = k => 200 + k * 90;

        ctx.fillStyle = p.text; ctx.font = "600 13px 'JetBrains Mono', monospace";
        ctx.fillText("pool (order of choosing matters, no repeats):", 60, 28);

        // slots
        for (let k = 0; k < 3; k++) {
            ctx.strokeStyle = p.slot; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.4;
            ctx.strokeRect(slotX(k) - 22, slotY - 22, 44, 44);
            ctx.setLineDash([]);
        }

        // picks: flask PICK[k] flies pool -> slot k during second k..k+1
        const picked = [];
        for (let k = 0; k < 3; k++) {
            const u = Math.max(0, Math.min(1, T - k));
            if (u > 0) picked.push(PICK[k]);
        }
        // pool
        for (let i = 0; i < 5; i++) {
            const k = PICK.indexOf(i);
            const flying = k >= 0 && T > k;
            if (!flying) flask(poolX(i), poolY, p.fl[i], NAMES[i], false);
            else {
                const u = ease(Math.min(1, T - k));
                const x = poolX(i) + (slotX(k) - poolX(i)) * u;
                const y = poolY + (slotY - poolY) * u;
                flask(x, y, p.fl[i], NAMES[i], false);
                // ghost seat left behind in the pool
                ctx.strokeStyle = p.used; ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.arc(poolX(i), poolY, 16, 0, Math.PI * 2); ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // running product
        ctx.font = "700 17px 'JetBrains Mono', monospace";
        ctx.fillStyle = p.text;
        const done = Math.min(3, Math.floor(T));
        const factors = ["5", "4", "3"].slice(0, Math.max(done, T > 0 ? 1 : 0));
        let line = "choices: " + (factors.length ? factors.join(" × ") : "—");
        if (done >= 3) line = "ordered selections: 5 × 4 × 3 = P(5,3) = 60";
        ctx.fillText(line, 60, 230);

        // phase 2: the 3! orderings of {A,B,C} merge
        if (T > 3.2) {
            const v = ease(Math.min(1, (T - 3.4) / 1.8));
            ctx.font = "600 13px 'JetBrains Mono', monospace";
            ctx.fillStyle = p.text;
            ctx.fillText("…but as a PANEL, all 3! = 6 orderings of {A, B, C} are the same choice:", 60, 268);
            const cx = canvas.width / 2, cy = 330;
            ORDERINGS.forEach((ord, j) => {
                const x0 = 100 + j * 78, y0 = 305;
                const x = x0 + (cx - x0) * v, y = y0 + (cy - y0) * v;
                ctx.globalAlpha = j === 0 ? 1 : 1 - v * 0.95;
                ord.forEach((idx, k2) => flask(x + k2 * 26 - 26, y, p.fl[idx], NAMES[idx], false));
                ctx.globalAlpha = 1;
            });
            if (v > 0.95) {
                ctx.strokeStyle = p.merge; ctx.lineWidth = 2;
                ctx.strokeRect(cx - 55, cy - 24, 110, 48);
                ctx.fillStyle = p.merge;
                ctx.font = "700 16px 'JetBrains Mono', monospace";
                ctx.fillText("60 ÷ 3! = C(5,3) = 10 panels", cx - 130, cy + 52);
            }
        }
    }

    function texReadout() {
        const tex = s => window.katex ? katex.renderToString(s, { throwOnError: false }) : s;
        readout.innerHTML =
            tex("P(5,3) = 5 \\times 4 \\times 3 = 60") + "&emsp;" +
            tex("\\binom{5}{3} = \\frac{P(5,3)}{3!} = \\frac{60}{6} = 10") +
            " — the merge <em>is</em> the division in Theorem 1.3.3.";
    }

    function play() {
        if (raf) cancelAnimationFrame(raf);
        T = 0;
        const t0 = performance.now();
        (function step(now) {
            T = Math.min(DUR, (now - t0) / 1000);
            draw();
            if (T < DUR) raf = requestAnimationFrame(step);
        })(t0);
    }

    playEl.addEventListener("click", play);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    texReadout();
    T = DUR; draw();
})();
