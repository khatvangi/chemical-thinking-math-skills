const state = {
  mode: "builder",
  streak: 0,
  correct: 0,
  total: 0,
  adaptive: true,
  adaptiveQueue: [],
  rigorMode: false,
  labelsLocked: false,
  currentQuestion: null,
  selection: null,
  seriesOrder: [],
  electronTokens: [],
  electronPlacements: {},
  builderKey: null,
  moPlacements: {},
  showOverlap: false,
};

const settingsKey = "bonding-lft-settings";

const modeButtons = Array.from(document.querySelectorAll(".mode-tabs .chip"));
const modeBadge = document.getElementById("modeBadge");
const promptBadge = document.getElementById("promptBadge");
const promptTitle = document.getElementById("promptTitle");
const promptNote = document.getElementById("promptNote");
const diagramPanel = document.getElementById("diagramPanel");
const answerZone = document.getElementById("answerZone");
const feedback = document.getElementById("feedback");
const streak = document.getElementById("streak");
const accuracy = document.getElementById("accuracy");
const questionCount = document.getElementById("questionCount");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const adaptiveToggle = document.getElementById("adaptiveToggle");
const rigorToggle = document.getElementById("rigorToggle");
const overlapToggle = document.getElementById("overlapToggle");

const builderQuestions = [
  {
    id: "d6-octa-weak",
    prompt: "[Fe(H2O)6]2+",
    badge: "d6 octahedral",
    note: "Weak-field ligand; determine high spin filling.",
    dCount: 6,
    geometry: "octahedral",
    spin: "high",
  },
  {
    id: "d6-octa-strong",
    prompt: "[Co(NH3)6]3+",
    badge: "d6 octahedral",
    note: "Stronger field ligand; decide spin state.",
    dCount: 6,
    geometry: "octahedral",
    spin: "low",
  },
  {
    id: "d6-octa-weak-2",
    prompt: "[CoF6]3-",
    badge: "d6 octahedral",
    note: "High-spin expected for weak field ligands.",
    dCount: 6,
    geometry: "octahedral",
    spin: "high",
  },
  {
    id: "d8-square",
    prompt: "[Ni(CN)4]2-",
    badge: "d8 square planar",
    note: "Square planar splitting; low spin.",
    dCount: 8,
    geometry: "square planar",
    spin: "low",
  },
  {
    id: "d5-tetra",
    prompt: "[MnCl4]2-",
    badge: "d5 tetrahedral",
    note: "Tetrahedral complexes are typically high spin.",
    dCount: 5,
    geometry: "tetrahedral",
    spin: "high",
  },
  {
    id: "d5-octa-weak",
    prompt: "[Mn(H2O)6]2+",
    badge: "d5 octahedral",
    note: "Weak field; high spin for d5.",
    dCount: 5,
    geometry: "octahedral",
    spin: "high",
  },
  {
    id: "d5-octa-strong",
    prompt: "[Fe(CN)6]3-",
    badge: "d5 octahedral",
    note: "Strong-field ligand; low spin for d5.",
    dCount: 5,
    geometry: "octahedral",
    spin: "low",
  },
  {
    id: "d6-octa-strong-2",
    prompt: "[Fe(CN)6]4-",
    badge: "d6 octahedral",
    note: "Strong-field ligand; low spin for d6.",
    dCount: 6,
    geometry: "octahedral",
    spin: "low",
  },
];

const seriesQuestions = [
  {
    id: "series-1",
    prompt: "Order ligands by field strength (strong to weak).",
    ligands: ["I-", "CN-", "H2O", "NH3", "Cl-"],
    answer: ["CN-", "NH3", "H2O", "Cl-", "I-"],
  },
  {
    id: "series-2",
    prompt: "Order ligands by field strength (strong to weak).",
    ligands: ["PPh3", "en", "F-", "CO", "NO2-"],
    answer: ["CO", "PPh3", "en", "NO2-", "F-"],
  },
];

const normalizeAnswer = (value) => value.toLowerCase().trim();

const geometryConfigs = {
  octahedral: {
    groups: [
      ["t2g1", "t2g2", "t2g3"],
      ["eg1", "eg2"],
    ],
    labels: {
      t2g1: "t2g",
      t2g2: "t2g",
      t2g3: "t2g",
      eg1: "eg",
      eg2: "eg",
    },
    order: ["t2g1", "t2g2", "t2g3", "eg1", "eg2"],
    energies: {
      t2g1: -0.4,
      t2g2: -0.4,
      t2g3: -0.4,
      eg1: 0.6,
      eg2: 0.6,
    },
  },
  tetrahedral: {
    groups: [
      ["e1", "e2"],
      ["t2_1", "t2_2", "t2_3"],
    ],
    labels: {
      e1: "e",
      e2: "e",
      t2_1: "t2",
      t2_2: "t2",
      t2_3: "t2",
    },
    order: ["e1", "e2", "t2_1", "t2_2", "t2_3"],
    energies: {
      e1: -0.6,
      e2: -0.6,
      t2_1: 0.4,
      t2_2: 0.4,
      t2_3: 0.4,
    },
  },
  "square planar": {
    groups: [
      ["dxz", "dyz"],
      ["dz2"],
      ["dxy"],
      ["dx2-y2"],
    ],
    labels: {
      dxz: "dxz",
      dyz: "dyz",
      dz2: "dz2",
      dxy: "dxy",
      "dx2-y2": "dx2-y2",
    },
    order: ["dxz", "dyz", "dz2", "dxy", "dx2-y2"],
    energies: {
      dxz: -0.4,
      dyz: -0.4,
      dz2: 0.0,
      dxy: 0.6,
      "dx2-y2": 1.0,
    },
  },
};

const initBuilderState = (question) => {
  if (state.builderKey === question.id) {
    return;
  }
  state.builderKey = question.id;
  state.electronTokens = Array.from({ length: question.dCount }, (_, index) => ({
    id: `e-${question.id}-${index}`,
  }));
  state.electronPlacements = {};
};

const buildExpectedOccupancy = (question) => {
  const config = geometryConfigs[question.geometry];
  if (!config) {
    return null;
  }
  const occupancy = {};
  config.order.forEach((orbital) => {
    occupancy[orbital] = { up: 0, down: 0 };
  });
  let remaining = question.dCount;
  if (question.spin === "high") {
    config.groups.forEach((group) => {
      group.forEach((orbital) => {
        if (remaining > 0) {
          occupancy[orbital].up = 1;
          remaining -= 1;
        }
      });
    });
    config.groups.forEach((group) => {
      group.forEach((orbital) => {
        if (remaining > 0 && occupancy[orbital].down === 0) {
          occupancy[orbital].down = 1;
          remaining -= 1;
        }
      });
    });
  } else {
    config.groups.forEach((group) => {
      group.forEach((orbital) => {
        if (remaining >= 2) {
          occupancy[orbital].up = 1;
          occupancy[orbital].down = 1;
          remaining -= 2;
        } else if (remaining === 1) {
          occupancy[orbital].up = 1;
          remaining -= 1;
        }
      });
    });
  }
  return occupancy;
};

const buildUserOccupancy = (question) => {
  const config = geometryConfigs[question.geometry];
  if (!config) {
    return null;
  }
  const occupancy = {};
  config.order.forEach((orbital) => {
    occupancy[orbital] = { up: 0, down: 0 };
  });
  Object.values(state.electronPlacements).forEach((placement) => {
    if (!placement) {
      return;
    }
    if (occupancy[placement.orbital]) {
      occupancy[placement.orbital][placement.spin] += 1;
    }
  });
  return occupancy;
};

const groupStats = (occupancy, group) => {
  let total = 0;
  let paired = 0;
  group.forEach((orbital) => {
    const slot = occupancy[orbital] || { up: 0, down: 0 };
    total += slot.up + slot.down;
    if (slot.up > 0 && slot.down > 0) {
      paired += 1;
    }
  });
  return { total, paired };
};

const calcCFSE = (occupancy, config) => {
  let cfse = 0;
  let paired = 0;
  Object.keys(occupancy).forEach((orbital) => {
    const slot = occupancy[orbital];
    const energy = config.energies[orbital] ?? 0;
    cfse += (slot.up + slot.down) * energy;
    if (slot.up > 0 && slot.down > 0) {
      paired += 1;
    }
  });
  return { cfse, paired };
};

const compareOccupancy = (question) => {
  const config = geometryConfigs[question.geometry];
  if (!config) {
    return false;
  }
  const expected = buildExpectedOccupancy(question);
  const actual = buildUserOccupancy(question);
  if (!expected || !actual) {
    return false;
  }
  const placedCount = Object.values(state.electronPlacements).length;
  if (placedCount !== question.dCount) {
    return false;
  }
  return config.groups.every((group) => {
    const expectedStats = groupStats(expected, group);
    const actualStats = groupStats(actual, group);
    return expectedStats.total === actualStats.total && expectedStats.paired === actualStats.paired;
  });
};

const moQuestions = [
  {
    id: "mo-sigma",
    prompt: "Build the MO diagram for a sigma-donor ligand set (e.g., NH3).",
    note: "t2g stays nonbonding, eg is antibonding.",
    t2gLevel: "mid",
    egLevel: "high",
  },
  {
    id: "mo-pi-donor",
    prompt: "Build the MO diagram for a pi-donor ligand set (e.g., Cl-).",
    note: "t2g is raised (antibonding character).",
    t2gLevel: "high",
    egLevel: "high",
  },
  {
    id: "mo-pi-acceptor",
    prompt: "Build the MO diagram for a pi-acceptor ligand set (e.g., CN-, CO).",
    note: "t2g is stabilized (bonding character).",
    t2gLevel: "low",
    egLevel: "high",
  },
];

const spectraQuestions = [
  {
    id: "spectra-1",
    prompt: "Given Delta is large, which spin state is favored?",
    options: ["high spin", "low spin"],
    answer: "low spin",
  },
  {
    id: "spectra-2",
    prompt: "A complex absorbs at longer wavelength (lower energy). What does that imply about Delta?",
    options: ["small Delta", "large Delta"],
    answer: "small delta",
  },
  {
    id: "spectra-3",
    prompt: "Square planar d8 complexes typically show which spin state?",
    options: ["high spin", "low spin"],
    answer: "low spin",
  },
];

const saveSettings = () => {
  const payload = {
    adaptive: state.adaptive,
    rigorMode: state.rigorMode,
    labelsLocked: state.labelsLocked,
    showOverlap: state.showOverlap,
  };
  localStorage.setItem(settingsKey, JSON.stringify(payload));
};

const loadSettings = () => {
  const raw = localStorage.getItem(settingsKey);
  if (!raw) {
    return;
  }
  try {
    const data = JSON.parse(raw);
    if (typeof data.adaptive === "boolean") {
      state.adaptive = data.adaptive;
    }
    if (typeof data.rigorMode === "boolean") {
      state.rigorMode = data.rigorMode;
    }
    if (typeof data.labelsLocked === "boolean") {
      state.labelsLocked = data.labelsLocked;
    }
    if (typeof data.showOverlap === "boolean") {
      state.showOverlap = data.showOverlap;
    }
  } catch (error) {
    localStorage.removeItem(settingsKey);
  }
};

const updateToggleUI = () => {
  adaptiveToggle.textContent = state.adaptive ? "On" : "Off";
  adaptiveToggle.classList.toggle("off", !state.adaptive);
  rigorToggle.textContent = state.rigorMode ? "On" : "Off";
  rigorToggle.classList.toggle("off", !state.rigorMode);
  overlapToggle.classList.toggle("active", state.showOverlap);
};

const updateScore = () => {
  streak.textContent = state.streak;
  questionCount.textContent = state.total;
  const percent = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
  accuracy.textContent = `${percent}%`;
};

const renderOrbitalDiagram = (question) => {
  initBuilderState(question);
  diagramPanel.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "intro-card";
  panel.innerHTML = `<strong>${question.geometry}</strong> electron placement`;

  const config = geometryConfigs[question.geometry];
  if (!config) {
    const note = document.createElement("p");
    note.className = "question-note";
    note.textContent = "No interactive diagram for this geometry.";
    panel.appendChild(note);
    diagramPanel.appendChild(panel);
    return;
  }

  const frame = document.createElement("div");
  frame.className = "orbital-frame";
  const axis = document.createElement("div");
  axis.className = "energy-axis";
  const grid = document.createElement("div");
  grid.className = "orbital-grid";

  config.order.forEach((orbital) => {
    const row = document.createElement("div");
    row.className = "orbital-row";
    const label = document.createElement("div");
    label.className = "orbital-label";
    label.textContent = config.labels[orbital] || orbital;
    const slots = document.createElement("div");
    slots.className = "orbital-slots";

    ["up", "down"].forEach((spin) => {
      const slot = document.createElement("div");
      slot.className = "orbital-slot";
      slot.dataset.orbital = orbital;
      slot.dataset.spin = spin;
      slot.addEventListener("dragover", (event) => {
        event.preventDefault();
        slot.classList.add("active");
      });
      slot.addEventListener("dragleave", () => slot.classList.remove("active"));
      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        slot.classList.remove("active");
        const tokenId = event.dataTransfer.getData("text/plain");
        const occupied = Object.values(state.electronPlacements).some(
          (placement) => placement.orbital === orbital && placement.spin === spin
        );
        if (occupied) {
          return;
        }
        state.electronPlacements[tokenId] = { orbital, spin };
        renderOrbitalDiagram(question);
      });

      const placedTokenId = Object.keys(state.electronPlacements).find(
        (tokenId) =>
          state.electronPlacements[tokenId].orbital === orbital &&
          state.electronPlacements[tokenId].spin === spin
      );
      if (placedTokenId) {
        const token = document.createElement("div");
        token.className = "electron-token";
        token.draggable = true;
        token.textContent = spin === "up" ? "U" : "D";
        token.dataset.id = placedTokenId;
        token.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("text/plain", placedTokenId);
        });
        slot.appendChild(token);
      }
      slots.appendChild(slot);
    });

    row.appendChild(label);
    row.appendChild(slots);
    grid.appendChild(row);
  });

  frame.appendChild(axis);
  frame.appendChild(grid);
  panel.appendChild(frame);

  const bank = document.createElement("div");
  bank.className = "electron-bank";
  bank.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  bank.addEventListener("drop", (event) => {
    event.preventDefault();
    const tokenId = event.dataTransfer.getData("text/plain");
    delete state.electronPlacements[tokenId];
    renderOrbitalDiagram(question);
  });

  state.electronTokens.forEach((token) => {
    if (state.electronPlacements[token.id]) {
      return;
    }
    const tokenEl = document.createElement("div");
    tokenEl.className = "electron-token";
    tokenEl.draggable = true;
    tokenEl.textContent = "e-";
    tokenEl.dataset.id = token.id;
    tokenEl.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", token.id);
    });
    bank.appendChild(tokenEl);
  });
  panel.appendChild(bank);

  const occupancy = buildUserOccupancy(question);
  if (occupancy) {
    const { cfse, paired } = calcCFSE(occupancy, config);
    const cfsePanel = document.createElement("div");
    cfsePanel.className = "cfse-panel";
    cfsePanel.innerHTML = `<div><strong>CFSE</strong>: ${cfse.toFixed(2)} Delta_o units</div><div><strong>Pairing count</strong>: ${paired} P</div>`;
    panel.appendChild(cfsePanel);
  }
  diagramPanel.appendChild(panel);
};

const renderSeriesGame = (question) => {
  diagramPanel.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "intro-card";
  panel.innerHTML = `<strong>Spectrochemical ordering</strong><p class="question-note">Click a ligand to move it left (stronger).</p>`;
  const list = document.createElement("div");
  list.className = "option-grid";
  state.seriesOrder.forEach((ligand) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "option-button";
    chip.textContent = ligand;
    chip.addEventListener("click", () => {
      const index = state.seriesOrder.indexOf(ligand);
      if (index > 0) {
        [state.seriesOrder[index - 1], state.seriesOrder[index]] = [state.seriesOrder[index], state.seriesOrder[index - 1]];
        renderSeriesGame(question);
      }
    });
    list.appendChild(chip);
  });
  panel.appendChild(list);
  diagramPanel.appendChild(panel);
};

const renderMOMatch = (question) => {
  diagramPanel.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "intro-card";
  panel.innerHTML = `<strong>MO Diagram Builder</strong><p class=\"question-note\">Place t2g and eg on the MO ladder (eg is antibonding).</p>`;

  const diagram = document.createElement("div");
  diagram.className = "mo-diagram";

  const ligandCol = document.createElement("div");
  ligandCol.className = "mo-column";
  ligandCol.innerHTML = `<h4>Ligand SALCs</h4>`;
  const ligandList = document.createElement("div");
  ligandList.className = "mo-list";
  ligandList.innerHTML = `<div><span class="mo-symbol">sigma</span>ligand SALCs</div><div><span class="mo-symbol">pi</span>ligand SALCs</div>`;
  ligandCol.appendChild(ligandList);

  const metalCol = document.createElement("div");
  metalCol.className = "mo-column";
  metalCol.innerHTML = `<h4>Metal d</h4>`;
  const metalList = document.createElement("div");
  metalList.className = "mo-list";
  metalList.innerHTML = `<div><span class=\"mo-symbol\">t2g</span>dxy, dxz, dyz</div><div><span class=\"mo-symbol\">eg</span>dz2, dx2-y2</div>`;
  metalCol.appendChild(metalList);

  const moCol = document.createElement("div");
  moCol.className = "mo-column";
  moCol.innerHTML = `<h4>MO Levels</h4>`;
  moCol.classList.toggle("overlap", state.showOverlap);
  if (state.showOverlap) {
    const bands = document.createElement("div");
    bands.className = "mo-bands";
    const sigmaBand = document.createElement("div");
    sigmaBand.className = "mo-band sigma";
    sigmaBand.textContent = "sigma overlap";
    const piBand = document.createElement("div");
    piBand.className = "mo-band pi";
    piBand.textContent = "pi overlap";
    bands.appendChild(sigmaBand);
    bands.appendChild(piBand);
    moCol.appendChild(bands);
  }

  const frame = document.createElement("div");
  frame.className = "orbital-frame";
  const axis = document.createElement("div");
  axis.className = "energy-axis";
  const grid = document.createElement("div");
  grid.className = "orbital-grid";

  const levels = ["low", "mid", "high"];
  levels.forEach((level) => {
    const row = document.createElement("div");
    row.className = "orbital-row";
    const label = document.createElement("div");
    label.className = "orbital-label";
    label.textContent = level.toUpperCase();
    const slots = document.createElement("div");
    slots.className = "orbital-slots";

    ["t2g", "eg"].forEach((orbital) => {
      const slot = document.createElement("div");
      slot.className = "orbital-slot";
      slot.dataset.level = level;
      slot.dataset.orbital = orbital;
      slot.addEventListener("dragover", (event) => {
        event.preventDefault();
        slot.classList.add("active");
      });
      slot.addEventListener("dragleave", () => slot.classList.remove("active"));
      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        slot.classList.remove("active");
        const cardId = event.dataTransfer.getData("text/plain");
        state.moPlacements[cardId] = level;
        renderMOMatch(question);
      });

      const placedLevel = state.moPlacements[orbital];
      if (placedLevel === level) {
        const card = document.createElement("div");
        card.className = "mo-card";
        card.textContent = orbital === "eg" ? "eg*" : "t2g";
        card.draggable = true;
        card.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("text/plain", orbital);
        });
        slot.appendChild(card);
      } else {
        const hint = document.createElement("div");
        hint.className = "mo-level-label";
        hint.textContent = orbital === "eg" ? "eg*" : "t2g";
        slot.appendChild(hint);
      }
      slots.appendChild(slot);
    });

    row.appendChild(label);
    row.appendChild(slots);
    grid.appendChild(row);
  });

  frame.appendChild(axis);
  frame.appendChild(grid);
  moCol.appendChild(frame);

  const bank = document.createElement("div");
  bank.className = "mo-bank";
  bank.addEventListener("dragover", (event) => event.preventDefault());
  bank.addEventListener("drop", (event) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    delete state.moPlacements[cardId];
    renderMOMatch(question);
  });

  ["t2g", "eg"].forEach((orbital) => {
    if (state.moPlacements[orbital]) {
      return;
    }
    const card = document.createElement("div");
    card.className = "mo-card";
    card.textContent = orbital === "eg" ? "eg*" : "t2g";
    card.draggable = true;
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", orbital);
    });
    bank.appendChild(card);
  });
  moCol.appendChild(bank);

  diagram.classList.toggle("overlap-active", state.showOverlap);
  diagram.appendChild(ligandCol);
  diagram.appendChild(metalCol);
  diagram.appendChild(moCol);
  panel.appendChild(diagram);
  diagramPanel.appendChild(panel);
};

const renderOptions = (question) => {
  answerZone.innerHTML = "";
  const block = document.createElement("div");
  block.className = "answer-block";
  const heading = document.createElement("h4");
  heading.textContent = state.mode === "series" ? "Arrange the ligands" : "Select the best answer";
  block.appendChild(heading);
  const grid = document.createElement("div");
  grid.className = "option-grid";
  let options = [];
  if (state.mode === "builder") {
    options = ["high spin", "low spin"];
  } else if (state.mode === "spectra") {
    options = question.options;
  } else if (state.mode === "mo") {
    options = [];
  }
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.addEventListener("click", () => {
      state.selection = option.toLowerCase();
      const siblings = button.parentElement.querySelectorAll(".option-button");
      siblings.forEach((sibling) => sibling.classList.remove("active"));
      button.classList.add("active");
    });
    grid.appendChild(button);
  });
  if (options.length) {
    block.appendChild(grid);
  } else {
    const hint = document.createElement("p");
    hint.className = "question-note";
    hint.textContent = state.mode === "mo"
      ? "Drag t2g and eg onto the energy ladder, then click Check."
      : "When you're satisfied, click Check.";
    block.appendChild(hint);
  }
  answerZone.appendChild(block);
};

const getPool = () => {
  if (state.mode === "builder") {
    return builderQuestions;
  }
  if (state.mode === "series") {
    return seriesQuestions;
  }
  if (state.mode === "mo") {
    return moQuestions;
  }
  return spectraQuestions;
};

const enqueueAdaptive = (question) => {
  if (!state.adaptive) {
    return;
  }
  const pool = getPool().filter((item) => item.id !== question.id);
  if (pool.length > 0) {
    state.adaptiveQueue.push(pool[0]);
  }
};

const getNextQuestion = () => {
  const pool = getPool();
  if (state.adaptive && state.adaptiveQueue.length > 0) {
    return state.adaptiveQueue.shift();
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

const loadQuestion = () => {
  const question = getNextQuestion();
  state.currentQuestion = question;
  state.selection = null;
  state.moPlacements = {};
  if (state.mode !== "builder") {
    state.builderKey = null;
    state.electronPlacements = {};
  }
  modeBadge.textContent = modeButtons.find((btn) => btn.dataset.mode === state.mode)?.textContent || "Module";
  const badgeLabel = state.mode === "series"
    ? "Spectrochemical series"
    : state.mode === "mo"
      ? "MO diagram"
      : state.mode;
  promptBadge.textContent = question.badge || badgeLabel;
  promptTitle.textContent = question.prompt;
  promptNote.textContent = question.note || "";
  feedback.className = "feedback";
  feedback.textContent = "";

  if (state.mode === "builder") {
    renderOrbitalDiagram(question);
  } else if (state.mode === "series") {
    state.seriesOrder = [...question.ligands].sort(() => Math.random() - 0.5);
    renderSeriesGame(question);
  } else if (state.mode === "mo") {
    renderMOMatch(question);
  } else {
    diagramPanel.innerHTML = "";
  }
  renderOptions(question);
};

const checkAnswer = () => {
  const question = state.currentQuestion;
  if (!question) {
    return;
  }
  if ((state.mode === "builder" || state.mode === "spectra") && !state.selection) {
    return;
  }
  let isCorrect = false;
  if (state.mode === "builder") {
    const placementCorrect = compareOccupancy(question);
    isCorrect = placementCorrect && state.selection === question.spin;
  } else if (state.mode === "series") {
    isCorrect = JSON.stringify(state.seriesOrder) === JSON.stringify(question.answer);
  } else if (state.mode === "mo") {
    isCorrect =
      state.moPlacements.t2g === question.t2gLevel &&
      state.moPlacements.eg === question.egLevel;
  } else {
    isCorrect = normalizeAnswer(state.selection || "") === normalizeAnswer(question.answer);
  }

  state.total += 1;
  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
    enqueueAdaptive(question);
  }
  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
  if (isCorrect) {
    feedback.textContent = "Correct.";
  } else if (state.mode === "series") {
    feedback.textContent = `Expected: ${question.answer.join(" > ")}.`;
  } else if (state.mode === "mo") {
    feedback.textContent = "Place t2g and eg at the correct energy levels.";
  } else if (state.mode === "builder") {
    feedback.textContent = `Expected ${question.spin} spin with correct orbital filling.`;
  } else {
    feedback.textContent = `Expected: ${question.answer}.`;
  }
  updateScore();
};

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    state.mode = button.dataset.mode;
    state.adaptiveQueue = [];
    loadQuestion();
  });
});

checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", loadQuestion);

adaptiveToggle.addEventListener("click", () => {
  state.adaptive = !state.adaptive;
  updateToggleUI();
  saveSettings();
});

rigorToggle.addEventListener("click", () => {
  state.rigorMode = !state.rigorMode;
  updateToggleUI();
  saveSettings();
});

overlapToggle.addEventListener("click", () => {
  state.showOverlap = !state.showOverlap;
  overlapToggle.classList.toggle("active", state.showOverlap);
  if (state.mode === "mo") {
    renderMOMatch(state.currentQuestion);
  }
});

loadSettings();
updateToggleUI();
updateScore();
loadQuestion();
