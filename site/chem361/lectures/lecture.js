const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

document.querySelectorAll("[data-stepper]").forEach((stepper) => {
  const steps = Array.from(stepper.querySelectorAll(".step"));
  let index = 0;
  const update = () => {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
  };
  stepper.querySelector(".step-next")?.addEventListener("click", () => {
    index = (index + 1) % steps.length;
    update();
  });
  stepper.querySelector(".step-prev")?.addEventListener("click", () => {
    index = (index - 1 + steps.length) % steps.length;
    update();
  });
  update();
});

document.querySelectorAll("[data-toggle-group]").forEach((group) => {
  const toggles = Array.from(group.querySelectorAll(".toggle"));
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggles.forEach((btn) => btn.classList.remove("active"));
      toggle.classList.add("active");
      const target = group.querySelector(`[data-toggle-target="${toggle.dataset.toggle}"]`);
      group.querySelectorAll("[data-toggle-target]").forEach((panel) => {
        panel.style.display = panel === target ? "block" : "none";
      });
    });
  });
});

document.querySelectorAll("[data-sorter]").forEach((sorter) => {
  const answer = sorter.dataset.answer?.split(",") || [];
  const items = Array.from(sorter.querySelectorAll(".sort-item"));
  const output = sorter.querySelector(".result");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const current = Array.from(sorter.querySelectorAll(".sort-item"));
      const index = current.indexOf(item);
      if (index > 0) {
        sorter.insertBefore(item, current[index - 1]);
      }
    });
  });
  sorter.querySelector(".check")?.addEventListener("click", () => {
    const order = Array.from(sorter.querySelectorAll(".sort-item")).map((i) => i.textContent.trim());
    const ok = order.join(",") === answer.join(",");
    output.textContent = ok ? "Correct order." : `Expected: ${answer.join(" > ")}`;
  });
});

document.querySelectorAll("[data-demo]").forEach((demo) => {
  const frames = Array.from(demo.querySelectorAll(".demo-frame"));
  const dots = Array.from(demo.querySelectorAll(".demo-dot"));
  if (!frames.length) {
    return;
  }
  let index = 0;
  const update = () => {
    frames.forEach((frame, i) => frame.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };
  update();
  setInterval(() => {
    index = (index + 1) % frames.length;
    update();
  }, 3200);
});
