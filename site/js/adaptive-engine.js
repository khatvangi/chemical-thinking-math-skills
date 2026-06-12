/**
 * Chemical Thinking — Adaptive Exercise Engine
 *
 * Pure client-side. No backend, no network. Mounts on any page that has
 * one or more <div data-skill="topic-id"></div> elements, provided the
 * matching skill module has registered itself on window.AdaptiveSkills.
 *
 * Behavior (see docs/plans/2026-06-12-adaptive-exercises-design.md):
 *   - wrong answer  -> diagnose the misconception, give a graduated nudge,
 *                      serve a fresh variant; escalate nudge level if the
 *                      SAME misconception persists; hold the tier.
 *   - right (clean) -> climb one difficulty tier; mastery at the top tier.
 *   - right (after nudges) -> hold the tier, serve another variant.
 *   - progress persists to localStorage per skill id.
 */

(function () {
    "use strict";

    // ---- helpers exposed to skill authors via window.Adaptive ----
    const Adaptive = {
        // pick a random element from an array
        rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
        // random integer in [lo, hi]
        randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); },
        // round to n decimals, returned as a number
        round(x, n) { const f = Math.pow(10, n); return Math.round(x * f) / f; }
    };
    window.Adaptive = Adaptive;

    const TIER_NAMES = ["Easy", "Medium", "Hard"];
    const MAX_UNRECOGNIZED = 3; // reveal the answer after this many unreadable tries

    // ---- per-mount controller ----
    class AdaptiveWidget {
        constructor(mountEl, skill) {
            this.el = mountEl;
            this.skill = skill;
            this.storeKey = "adaptive:" + skill.id;
            mountEl.__aeWidget = this; // handle for tests / debugging

            // restored / fresh state
            const saved = this.load();
            this.tier = saved.tier || 0;                 // current difficulty tier index
            this.mastered = saved.mastered || false;     // reached clean Tier-3 solve
            // depth[misconceptionKey] = how many times this misconception was hit
            // (persists across variants so escalation survives fresh problems)
            this.depth = saved.depth || {};

            // per-problem volatile state
            this.problem = null;
            this.usedNudge = false;
            this.unrecognized = 0;

            this.renderShell();
            if (this.mastered) { this.showMastery(true); }
            else { this.newProblem(); }
        }

        // ---------- persistence ----------
        load() {
            try { return JSON.parse(localStorage.getItem(this.storeKey)) || {}; }
            catch (e) { return {}; }
        }
        save() {
            try {
                localStorage.setItem(this.storeKey, JSON.stringify({
                    tier: this.tier, mastered: this.mastered, depth: this.depth
                }));
            } catch (e) { /* storage may be disabled; loop still works in-memory */ }
        }

        // ---------- problem lifecycle ----------
        newProblem() {
            this.usedNudge = false;
            this.unrecognized = 0;
            this.problem = this.skill.tiers[this.tier].gen();
            this.renderProblem();
        }

        // numeric closeness test
        near(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9); }

        // stable key for a misconception so escalation survives regenerated variants
        mkey(m, i) { return m.id || m.why || ("m" + i); }

        check() {
            const p = this.problem;
            if (p.choices) return this.checkChoice();

            const raw = this.input.value.trim();
            if (raw === "" || isNaN(parseFloat(raw))) {
                this.unrecognized++;
                return this.handleUnrecognized("Enter a number to check.");
            }
            const ans = parseFloat(raw);

            if (this.near(ans, p.correct, p.tol)) return this.handleCorrect();

            // does the answer match a known misconception value?
            const list = p.misconceptions || [];
            for (let i = 0; i < list.length; i++) {
                const m = list[i];
                if (m.value === undefined) continue;
                if (this.near(ans, m.value, m.tol !== undefined ? m.tol : p.tol)) {
                    return this.handleMisconception(m, i);
                }
            }
            this.unrecognized++;
            return this.handleUnrecognized("Not quite — and it doesn't match a common slip.");
        }

        checkChoice() {
            const p = this.problem;
            const sel = this.el.querySelector('input[name="ae-choice"]:checked');
            if (!sel) return this.handleUnrecognized("Select an option first.");
            const choice = p.choices[parseInt(sel.value, 10)];
            if (choice.correct) return this.handleCorrect();
            // a distractor carries its own diagnosis + nudges
            return this.handleMisconception(choice, parseInt(sel.value, 10));
        }

        handleCorrect() {
            const cleanly = !this.usedNudge;
            if (cleanly && this.tier >= this.skill.tiers.length - 1) {
                this.mastered = true; this.save();
                return this.showMastery(false);
            }
            if (cleanly) {
                this.tier++;                       // climb
                this.save();
                this.feedback("correct",
                    "Correct, cleanly. Climbing to <strong>" + TIER_NAMES[this.tier] + "</strong>.");
            } else {
                this.feedback("correct",
                    "Correct — now lock it in with one more at this level.");
            }
            this.nextButton();
        }

        handleMisconception(m, i) {
            this.usedNudge = true;
            const key = this.mkey(m, i);
            this.depth[key] = (this.depth[key] || 0) + 1;
            this.save();
            const nudges = m.nudges || [];
            const level = Math.min(this.depth[key], nudges.length) - 1;
            const nudge = nudges[Math.max(0, level)] || "Re-check your steps.";
            const escalated = this.depth[key] > 1 && nudges.length > 1;
            this.feedback("nudge",
                '<div class="ae-why">' + (m.why || "Not quite.") + "</div>" +
                '<div class="ae-nudge">' + (escalated ? "<em>Let's go more concrete.</em><br>" : "") +
                nudge + "</div>" +
                '<div class="ae-again">Here\'s a fresh one — try again:</div>');
            this.nextButton("Try this one");
        }

        handleUnrecognized(msg) {
            this.usedNudge = true;
            if (this.unrecognized >= MAX_UNRECOGNIZED) {
                const ans = this.problem.choices
                    ? this.problem.choices.find(c => c.correct).label
                    : this.problem.correct;
                this.feedback("reveal",
                    msg + "<br>The answer was <strong>" + ans +
                    "</strong>. Study it, then take a fresh variant.");
                this.nextButton("New problem");
            } else {
                this.feedback("hint", msg + " (" +
                    (MAX_UNRECOGNIZED - this.unrecognized) + " tries before the answer is shown)");
            }
        }

        // ---------- rendering ----------
        renderShell() {
            injectStyles();
            this.el.classList.add("ae-widget");
            this.el.innerHTML =
                '<div class="ae-head">' +
                    '<span class="ae-title">' + esc(this.skill.title) + "</span>" +
                    '<div class="ae-tiers"></div>' +
                "</div>" +
                '<div class="ae-prompt"></div>' +
                '<div class="ae-answer"></div>' +
                '<div class="ae-feedback" style="display:none"></div>' +
                '<div class="ae-controls"></div>';
            this.tierEl = this.el.querySelector(".ae-tiers");
            this.promptEl = this.el.querySelector(".ae-prompt");
            this.answerEl = this.el.querySelector(".ae-answer");
            this.feedbackEl = this.el.querySelector(".ae-feedback");
            this.controlsEl = this.el.querySelector(".ae-controls");
            this.renderTiers();
        }

        renderTiers() {
            this.tierEl.innerHTML = TIER_NAMES.map((name, i) => {
                let cls = "ae-tier";
                if (this.mastered || i < this.tier) cls += " done";
                else if (i === this.tier) cls += " active";
                return '<span class="' + cls + '">' + name + "</span>";
            }).join('<span class="ae-arrow">→</span>');
        }

        renderProblem() {
            this.renderTiers();
            const p = this.problem;
            this.promptEl.innerHTML = p.prompt;
            this.feedbackEl.style.display = "none";

            if (p.choices) {
                this.answerEl.innerHTML = p.choices.map((c, i) =>
                    '<label class="ae-choice"><input type="radio" name="ae-choice" value="' +
                    i + '"> <span>' + c.label + "</span></label>").join("");
            } else {
                this.answerEl.innerHTML =
                    '<input type="text" class="ae-input" placeholder="Your answer…" autocomplete="off">';
                this.input = this.answerEl.querySelector(".ae-input");
                this.input.addEventListener("keydown", e => {
                    if (e.key === "Enter") this.check();
                });
            }

            this.controlsEl.innerHTML =
                '<button class="ae-btn ae-check">Check</button>';
            this.controlsEl.querySelector(".ae-check")
                .addEventListener("click", () => this.check());
            this.typeset();
            if (this.input) this.input.focus();
        }

        feedback(kind, html) {
            this.feedbackEl.className = "ae-feedback ae-" + kind;
            this.feedbackEl.style.display = "block";
            this.feedbackEl.innerHTML = html;
            this.typeset(this.feedbackEl);
        }

        nextButton(label) {
            this.controlsEl.innerHTML =
                '<button class="ae-btn ae-next">' + (label || "Next problem") + "</button>";
            this.controlsEl.querySelector(".ae-next")
                .addEventListener("click", () => this.newProblem());
        }

        showMastery(restored) {
            this.renderTiers();
            this.promptEl.innerHTML = "";
            this.answerEl.innerHTML = "";
            this.feedback("mastery",
                "<strong>Mastered.</strong> You clean-solved every tier of <em>" +
                esc(this.skill.title) + "</em>" +
                (restored ? " in an earlier session." : ".") +
                '<div class="ae-again">Want more practice anyway?</div>');
            this.controlsEl.innerHTML =
                '<button class="ae-btn ae-ghost ae-reset">Practice again</button>';
            this.controlsEl.querySelector(".ae-reset").addEventListener("click", () => {
                this.mastered = false; this.tier = 0; this.depth = {}; this.save();
                this.newProblem();
            });
        }

        // render any KaTeX inside an element (no-op if KaTeX absent)
        typeset(scope) {
            if (window.renderMathInElement) {
                try {
                    window.renderMathInElement(scope || this.el, {
                        delimiters: [
                            { left: "$$", right: "$$", display: true },
                            { left: "$", right: "$", display: false }
                        ],
                        ignoredClasses: ["money", "ae-input"]
                    });
                } catch (e) { /* ignore typeset errors */ }
            }
        }
    }

    // ---------- shared utilities ----------
    function esc(s) {
        return String(s).replace(/[&<>"]/g, c =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    }

    function injectStyles() {
        if (document.getElementById("ae-styles")) return;
        const css = `
        .ae-widget {
            border: 1px solid var(--accent-blue, #4a9eff);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            background: var(--bg-secondary, #12121a);
            font-family: 'Inter', -apple-system, sans-serif;
        }
        .ae-head { display:flex; justify-content:space-between; align-items:center;
            flex-wrap:wrap; gap:.75rem; margin-bottom:1rem; }
        .ae-title { font-weight:600; color: var(--text-primary, #e8e6e3); }
        .ae-tiers { display:flex; align-items:center; gap:.4rem; font-size:.75rem; }
        .ae-tier { padding:.2rem .55rem; border-radius:4px; text-transform:uppercase;
            letter-spacing:.04em; background: var(--bg-tertiary, #1a1a24);
            color: var(--text-secondary, #a0a0a0); }
        .ae-tier.active { background: rgba(74,158,255,.2); color: var(--accent-blue,#4a9eff);
            font-weight:700; }
        .ae-tier.done { background: rgba(16,185,129,.2); color: var(--accent-green,#10b981); }
        .ae-arrow { color: var(--text-muted,#6b6965); }
        .ae-prompt { font-size:1.05rem; line-height:1.6; margin-bottom:1rem;
            color: var(--text-primary,#e8e6e3); }
        .ae-input { width:100%; max-width:260px; padding:.6rem .8rem; font-size:1rem;
            border-radius:6px; border:1px solid var(--bg-tertiary,#2a2a34);
            background: var(--bg-primary,#0a0a0f); color: var(--text-primary,#e8e6e3);
            font-family:'JetBrains Mono',monospace; }
        .ae-input:focus { outline:none; border-color: var(--accent-blue,#4a9eff); }
        .ae-choice { display:flex; align-items:center; gap:.5rem; padding:.5rem .7rem;
            margin:.4rem 0; border-radius:6px; cursor:pointer;
            background: var(--bg-tertiary,#1a1a24); color: var(--text-primary,#e8e6e3); }
        .ae-choice:hover { background: rgba(74,158,255,.12); }
        .ae-controls { margin-top:1rem; }
        .ae-btn { background: var(--accent-blue,#4a9eff); color:#0a0a0f; border:none;
            padding:.55rem 1.2rem; border-radius:6px; cursor:pointer; font-size:.95rem;
            font-weight:600; }
        .ae-btn:hover { filter:brightness(1.1); }
        .ae-btn.ae-ghost { background:transparent; border:1px solid var(--accent-blue,#4a9eff);
            color: var(--accent-blue,#4a9eff); }
        .ae-feedback { margin-top:1rem; padding:1rem; border-radius:8px; line-height:1.6;
            color: var(--text-primary,#e8e6e3); }
        .ae-feedback.ae-correct { background: rgba(16,185,129,.12);
            border-left:3px solid var(--accent-green,#10b981); }
        .ae-feedback.ae-nudge, .ae-feedback.ae-hint { background: rgba(245,158,11,.1);
            border-left:3px solid var(--accent-orange,#f59e0b); }
        .ae-feedback.ae-reveal { background: rgba(239,68,68,.1);
            border-left:3px solid var(--accent-red,#ef4444); }
        .ae-feedback.ae-mastery { background: rgba(16,185,129,.15);
            border-left:3px solid var(--accent-green,#10b981); }
        .ae-why { font-weight:600; margin-bottom:.4rem; }
        .ae-nudge { color: var(--text-secondary,#a0a0a0); }
        .ae-again { margin-top:.6rem; font-size:.9rem; color: var(--text-muted,#6b6965); }
        `;
        const tag = document.createElement("style");
        tag.id = "ae-styles";
        tag.textContent = css;
        document.head.appendChild(tag);
    }

    // ---------- bootstrap ----------
    function mountAll() {
        const mounts = document.querySelectorAll("[data-skill]");
        mounts.forEach(el => {
            if (el.dataset.aeMounted) return;
            const id = el.dataset.skill;
            const skill = (window.AdaptiveSkills || {})[id];
            if (!skill) {
                el.innerHTML = '<em style="color:#a0a0a0">Adaptive skill "' +
                    esc(id) + '" not loaded.</em>';
                return;
            }
            el.dataset.aeMounted = "1";
            new AdaptiveWidget(el, skill);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountAll);
    } else {
        mountAll();
    }
    // expose for manual re-mount if skills load late
    window.AdaptiveEngine = { mountAll };
})();
