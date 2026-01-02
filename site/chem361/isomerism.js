const geometryLayouts = {
  octahedral: {
    positions: ["top", "bottom", "left", "right", "front", "back"],
    coords: {
      top: [0, 0, 1],
      bottom: [0, 0, -1],
      left: [-1, 0, 0],
      right: [1, 0, 0],
      front: [0, 1, 0],
      back: [0, -1, 0],
    },
  },
  "square planar": {
    positions: ["top", "bottom", "left", "right"],
    coords: {
      top: [0, 1, 0],
      bottom: [0, -1, 0],
      left: [-1, 0, 0],
      right: [1, 0, 0],
    },
  },
};

const geometricQuestions = [
  {
    id: "pt-cis",
    topic: "cis/trans",
    formula: "[Pt(NH3)2Cl2]",
    prompt: "Identify the isomer shown.",
    answer: "cis",
    geometry: "square planar",
    diagram: {
      central: "Pt",
      ligands: {
        top: "Cl-",
        bottom: "NH3",
        left: "Cl-",
        right: "NH3",
      },
    },
    compare: {
      label: "trans",
      diagram: {
        central: "Pt",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "Cl-",
          right: "Cl-",
        },
      },
    },
  },
  {
    id: "pt-trans",
    topic: "cis/trans",
    formula: "[Pt(NH3)2Cl2]",
    prompt: "Identify the isomer shown.",
    answer: "trans",
    geometry: "square planar",
    diagram: {
      central: "Pt",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "Cl-",
        right: "Cl-",
      },
    },
    compare: {
      label: "cis",
      diagram: {
        central: "Pt",
        ligands: {
          top: "Cl-",
          bottom: "NH3",
          left: "Cl-",
          right: "NH3",
        },
      },
    },
  },
  {
    id: "co-cis",
    topic: "cis/trans",
    formula: "[Co(NH3)4Cl2]+",
    prompt: "Identify the isomer shown.",
    answer: "cis",
    geometry: "octahedral",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "Cl-",
        front: "NH3",
        back: "Cl-",
      },
    },
    compare: {
      label: "trans",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "NH3",
          right: "NH3",
          front: "Cl-",
          back: "Cl-",
        },
      },
    },
  },
  {
    id: "co-trans",
    topic: "cis/trans",
    formula: "[Co(NH3)4Cl2]+",
    prompt: "Identify the isomer shown.",
    answer: "trans",
    geometry: "octahedral",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "Cl-",
        back: "Cl-",
      },
    },
    compare: {
      label: "cis",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "NH3",
          right: "Cl-",
          front: "NH3",
          back: "Cl-",
        },
      },
    },
  },
  {
    id: "co-fac",
    topic: "fac/mer",
    formula: "[Co(NH3)3Cl3]",
    prompt: "Identify the isomer shown.",
    answer: "fac",
    geometry: "octahedral",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "Cl-",
        left: "NH3",
        right: "Cl-",
        front: "NH3",
        back: "Cl-",
      },
    },
    compare: {
      label: "mer",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "NH3",
          right: "Cl-",
          front: "Cl-",
          back: "Cl-",
        },
      },
    },
  },
  {
    id: "co-mer",
    topic: "fac/mer",
    formula: "[Co(NH3)3Cl3]",
    prompt: "Identify the isomer shown.",
    answer: "mer",
    geometry: "octahedral",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "Cl-",
        front: "Cl-",
        back: "Cl-",
      },
    },
    compare: {
      label: "fac",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "Cl-",
          left: "NH3",
          right: "Cl-",
          front: "NH3",
          back: "Cl-",
        },
      },
    },
  },
  {
    id: "ma-cis",
    topic: "cis/trans",
    formula: "[MA2B2] (square planar)",
    prompt: "Identify the isomer shown.",
    answer: "cis",
    geometry: "square planar",
    diagram: {
      central: "M",
      ligands: {
        top: "A",
        bottom: "B",
        left: "A",
        right: "B",
      },
    },
    compare: {
      label: "trans",
      diagram: {
        central: "M",
        ligands: {
          top: "A",
          bottom: "A",
          left: "B",
          right: "B",
        },
      },
    },
  },
  {
    id: "ma-trans",
    topic: "cis/trans",
    formula: "[MA2B2] (square planar)",
    prompt: "Identify the isomer shown.",
    answer: "trans",
    geometry: "square planar",
    diagram: {
      central: "M",
      ligands: {
        top: "A",
        bottom: "A",
        left: "B",
        right: "B",
      },
    },
    compare: {
      label: "cis",
      diagram: {
        central: "M",
        ligands: {
          top: "A",
          bottom: "B",
          left: "A",
          right: "B",
        },
      },
    },
  },
  {
    id: "ma3b3-fac",
    topic: "fac/mer",
    formula: "[MA3B3] (octahedral)",
    prompt: "Identify the isomer shown.",
    answer: "fac",
    geometry: "octahedral",
    diagram: {
      central: "M",
      ligands: {
        top: "A",
        bottom: "B",
        left: "A",
        right: "B",
        front: "A",
        back: "B",
      },
    },
    compare: {
      label: "mer",
      diagram: {
        central: "M",
        ligands: {
          top: "A",
          bottom: "A",
          left: "A",
          right: "B",
          front: "B",
          back: "B",
        },
      },
    },
  },
  {
    id: "ma3b3-mer",
    topic: "fac/mer",
    formula: "[MA3B3] (octahedral)",
    prompt: "Identify the isomer shown.",
    answer: "mer",
    geometry: "octahedral",
    diagram: {
      central: "M",
      ligands: {
        top: "A",
        bottom: "A",
        left: "A",
        right: "B",
        front: "B",
        back: "B",
      },
    },
    compare: {
      label: "fac",
      diagram: {
        central: "M",
        ligands: {
          top: "A",
          bottom: "B",
          left: "A",
          right: "B",
          front: "A",
          back: "B",
        },
      },
    },
  },
].map((question) => ({
  ...question,
  answer: question.answer.toLowerCase(),
}));

const opticalQuestions = [
  {
    id: "lambda",
    topic: "Lambda/Delta",
    formula: "[Co(en)3]3+",
    prompt: "Identify the enantiomer shown.",
    answer: "lambda",
    model: "lambda",
    compare: "delta",
  },
  {
    id: "delta",
    topic: "Lambda/Delta",
    formula: "[Co(en)3]3+",
    prompt: "Identify the enantiomer shown.",
    answer: "delta",
    model: "delta",
    compare: "lambda",
  },
  {
    id: "lambda-ox",
    topic: "Lambda/Delta",
    formula: "[Cr(ox)3]3-",
    prompt: "Identify the enantiomer shown.",
    answer: "lambda",
    model: "lambda",
    compare: "delta",
  },
  {
    id: "delta-ox",
    topic: "Lambda/Delta",
    formula: "[Cr(ox)3]3-",
    prompt: "Identify the enantiomer shown.",
    answer: "delta",
    model: "delta",
    compare: "lambda",
  },
].map((question) => ({
  ...question,
  answer: question.answer.toLowerCase(),
}));

const structuralQuestions = [
  {
    id: "ionization",
    prompt: `Classify the isomer pair:\n[Co(NH3)5Br]SO4 vs [Co(NH3)5SO4]Br`,
    answer: "ionization",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "linkage",
    prompt: `Classify the isomer pair:\n[Co(NH3)5(NO2)]Cl2 vs [Co(NH3)5(ONO)]Cl2`,
    answer: "linkage",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "coordination",
    prompt: `Classify the isomer pair:\n[Co(NH3)6][Cr(CN)6] vs [Cr(NH3)6][Co(CN)6]`,
    answer: "coordination",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "hydrate",
    prompt: `Classify the isomer pair:\n[Cr(H2O)6]Cl3 vs [Cr(H2O)5Cl]Cl2.H2O`,
    answer: "hydrate/solvate",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "linkage-2",
    prompt: `Classify the isomer pair:\n[Co(NH3)5(NCS)]Cl2 vs [Co(NH3)5(SCN)]Cl2`,
    answer: "linkage",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "hydrate-2",
    prompt: `Classify the isomer pair:\n[Cr(H2O)4Cl2]Cl.2H2O vs [Cr(H2O)5Cl]Cl2.H2O`,
    answer: "hydrate/solvate",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "ionization-2",
    prompt: `Classify the isomer pair:\n[Co(NH3)5Cl]Br2 vs [Co(NH3)5Br]Cl2`,
    answer: "ionization",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
  {
    id: "coordination-2",
    prompt: `Classify the isomer pair:\n[Cu(NH3)4][PtCl4] vs [Pt(NH3)4][CuCl4]`,
    answer: "coordination",
    options: ["ionization", "linkage", "coordination", "hydrate/solvate"],
  },
].map((question) => ({
  ...question,
  answer: question.answer.toLowerCase(),
}));

const modelLibrary = {
  lambda: {
    central: "Co",
    atoms: [
      { label: "en", element: "N", x: 1.2, y: 0.2, z: 1.1 },
      { label: "en", element: "N", x: 0.2, y: 1.2, z: 0.9 },
      { label: "en", element: "N", x: -1.0, y: 0.5, z: 1.0 },
      { label: "en", element: "N", x: -1.1, y: -0.4, z: -0.9 },
      { label: "en", element: "N", x: -0.1, y: -1.2, z: -1.0 },
      { label: "en", element: "N", x: 1.0, y: -0.3, z: -1.1 },
    ],
  },
  delta: {
    central: "Co",
    atoms: [
      { label: "en", element: "N", x: -1.2, y: 0.2, z: 1.1 },
      { label: "en", element: "N", x: -0.2, y: 1.2, z: 0.9 },
      { label: "en", element: "N", x: 1.0, y: 0.5, z: 1.0 },
      { label: "en", element: "N", x: 1.1, y: -0.4, z: -0.9 },
      { label: "en", element: "N", x: 0.1, y: -1.2, z: -1.0 },
      { label: "en", element: "N", x: -1.0, y: -0.3, z: -1.1 },
    ],
  },
};

const state = {
  mode: "geometric",
  streak: 0,
  correct: 0,
  total: 0,
  adaptive: true,
  adaptiveQueue: [],
  showLabels: true,
  colorMode: "donor",
  rigorMode: false,
  labelsLocked: false,
  currentQuestion: null,
  selection: null,
  compareActive: false,
  mirrorMode: false,
};

const settingsKey = "coordination-isomerism-settings";

const modeButtons = Array.from(document.querySelectorAll(".mode-tabs .chip"));
const modeBadge = document.getElementById("modeBadge");
const topicBadge = document.getElementById("topicBadge");
const promptTitle = document.getElementById("promptTitle");
const promptNote = document.getElementById("promptNote");
const answerZone = document.getElementById("answerZone");
const feedback = document.getElementById("feedback");
const streak = document.getElementById("streak");
const accuracy = document.getElementById("accuracy");
const questionCount = document.getElementById("questionCount");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const adaptiveToggle = document.getElementById("adaptiveToggle");
const rigorToggle = document.getElementById("rigorToggle");
const labelToggle = document.getElementById("labelToggle");
const colorToggle = document.getElementById("colorToggle");
const compareBtn = document.getElementById("compareBtn");
const mirrorBtn = document.getElementById("mirrorBtn");
const viewerNote = document.getElementById("viewerNote");
const viewerElement = document.getElementById("viewer3d");

let viewer3d = null;

const elementColorMap = {
  Cl: "#4b6cb7",
  N: "#1f8a8a",
  O: "#d06b28",
  S: "#7a6a5e",
  C: "#6b5c4b",
  M: "#0f3d3e",
};

const chargeColorMap = {
  metal: "#0f3d3e",
  neutral: "#d66b2d",
  anionic: "#2b6cb0",
};

const saveSettings = () => {
  const payload = {
    adaptive: state.adaptive,
    showLabels: state.showLabels,
    colorMode: state.colorMode,
    rigorMode: state.rigorMode,
    labelsLocked: state.labelsLocked,
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
    if (typeof data.showLabels === "boolean") {
      state.showLabels = data.showLabels;
    }
    if (typeof data.colorMode === "string") {
      state.colorMode = data.colorMode;
    }
    if (typeof data.rigorMode === "boolean") {
      state.rigorMode = data.rigorMode;
    }
    if (typeof data.labelsLocked === "boolean") {
      state.labelsLocked = data.labelsLocked;
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
  if (state.labelsLocked) {
    labelToggle.textContent = "Locked";
    labelToggle.classList.add("off");
    labelToggle.disabled = true;
  } else {
    labelToggle.textContent = state.showLabels ? "On" : "Off";
    labelToggle.classList.toggle("off", !state.showLabels);
    labelToggle.disabled = false;
  }
  colorToggle.textContent = `Color: ${state.colorMode}`;
  if (state.mode === "optical") {
    mirrorBtn.style.display = "inline-flex";
  } else {
    mirrorBtn.style.display = "none";
  }
};

const render3DModel = (question) => {
  if (!viewerElement || !window.$3Dmol) {
    return;
  }
  if (!viewer3d) {
    viewer3d = window.$3Dmol.createViewer(viewerElement, { backgroundColor: "white" });
  }
  viewer3d.clear();

  if (state.mode === "structural") {
    viewerNote.textContent = "No 3D model for structural isomers.";
    viewer3d.render();
    return;
  }

  if (state.mode === "optical") {
    const modelKey = state.compareActive ? question.compare : question.model;
    const modelData = modelLibrary[modelKey];
    viewerNote.textContent = state.mirrorMode
      ? "Mirror view enabled. Compare helicity."
      : "Rotate to observe helicity of chelate rings.";
    const atoms = [
      { element: modelData.central, x: 0, y: 0, z: 0, label: modelData.central, role: "metal" },
      ...modelData.atoms.map((atom) => ({
        element: atom.element,
        x: state.mirrorMode ? -atom.x : atom.x,
        y: atom.y,
        z: atom.z,
        label: atom.label,
        role: "neutral",
      })),
    ];
    const lines = [
      `${atoms.length}`,
      `${question.formula} ${modelKey}`,
      ...atoms.map((atom) => `${atom.element} ${atom.x.toFixed(4)} ${atom.y.toFixed(4)} ${atom.z.toFixed(4)}`),
    ];
    viewer3d.addModel(lines.join("\n"), "xyz");
    viewer3d.setStyle({}, { stick: { radius: 0.12 }, sphere: { scale: 0.5 } });
    const model = viewer3d.getModel();
    const selected = model.selectedAtoms({});
    selected.forEach((atom, index) => {
      const meta = atoms[index];
      let color = elementColorMap[meta.element] || elementColorMap.M;
      if (state.colorMode === "charge") {
        color = chargeColorMap[meta.role] || chargeColorMap.neutral;
      }
      const selector = atom.serial ? { serial: atom.serial } : { index };
      viewer3d.setStyle(selector, {
        stick: { radius: 0.12, color },
        sphere: { scale: meta.role === "metal" ? 0.6 : 0.45, color },
      });
      if (state.showLabels && meta.role !== "metal") {
        viewer3d.addLabel(meta.label, {
          position: { x: meta.x, y: meta.y, z: meta.z },
          backgroundColor: "rgba(255,255,255,0.8)",
          fontColor: "#1c1b1a",
          fontSize: 11,
          borderColor: "rgba(28,27,26,0.12)",
        });
      }
    });
    viewer3d.addLabel(modelData.central, {
      position: { x: 0, y: 0, z: 0 },
      backgroundColor: "rgba(15,61,62,0.85)",
      fontColor: "white",
      fontSize: 11,
      borderColor: "transparent",
    });
    viewer3d.zoomTo();
    viewer3d.render();
    return;
  }

  const diagram = state.compareActive && question.compare ? question.compare.diagram : question.diagram;
  const layout = geometryLayouts[question.geometry];
  if (!layout) {
    viewerNote.textContent = "3D model not available for this geometry.";
    viewer3d.render();
    return;
  }
  viewerNote.textContent = "Rotate to inspect ligand positions.";
  const atoms = [
    {
      element: diagram.central.replace(/[^A-Za-z]/g, ""),
      x: 0,
      y: 0,
      z: 0,
      label: diagram.central,
      role: "metal",
    },
  ];
  const scale = 2.2;
  layout.positions.forEach((position) => {
    const coord = layout.coords[position];
    if (!coord) {
      return;
    }
    const label = diagram.ligands[position];
    if (!label) {
      return;
    }
    const [x, y, z] = coord.map((value) => value * scale);
    let element = "N";
    if (label.startsWith("Cl")) {
      element = "Cl";
    } else if (label.startsWith("NH")) {
      element = "N";
    } else if (label.startsWith("O")) {
      element = "O";
    }
    atoms.push({
      element,
      x,
      y,
      z,
      label,
      role: label.includes("-") ? "anionic" : "neutral",
    });
  });

  const lines = [
    `${atoms.length}`,
    `${question.formula} ${question.answer}`,
    ...atoms.map((atom) => `${atom.element} ${atom.x.toFixed(4)} ${atom.y.toFixed(4)} ${atom.z.toFixed(4)}`),
  ];
  viewer3d.addModel(lines.join("\n"), "xyz");
  viewer3d.setStyle({}, { stick: { radius: 0.12 }, sphere: { scale: 0.45 } });
  const model = viewer3d.getModel();
  const selected = model.selectedAtoms({});
  selected.forEach((atom, index) => {
    const meta = atoms[index];
    let color = elementColorMap[meta.element] || elementColorMap.M;
    if (state.colorMode === "charge") {
      color = chargeColorMap[meta.role] || chargeColorMap.neutral;
    }
    const selector = atom.serial ? { serial: atom.serial } : { index };
    viewer3d.setStyle(selector, {
      stick: { radius: 0.12, color },
      sphere: { scale: meta.role === "metal" ? 0.55 : 0.45, color },
    });
    if (state.showLabels && meta.role !== "metal") {
      viewer3d.addLabel(meta.label, {
        position: { x: meta.x, y: meta.y, z: meta.z },
        backgroundColor: "rgba(255,255,255,0.8)",
        fontColor: "#1c1b1a",
        fontSize: 11,
        borderColor: "rgba(28,27,26,0.12)",
      });
    }
  });
  viewer3d.addLabel(diagram.central, {
    position: { x: 0, y: 0, z: 0 },
    backgroundColor: "rgba(15,61,62,0.85)",
    fontColor: "white",
    fontSize: 11,
    borderColor: "transparent",
  });
  viewer3d.zoomTo();
  viewer3d.render();
};

const createOptionButton = (label) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-button";
  button.textContent = label;
  button.addEventListener("click", () => {
    state.selection = label;
    const siblings = button.parentElement.querySelectorAll(".option-button");
    siblings.forEach((sibling) => sibling.classList.remove("active"));
    button.classList.add("active");
  });
  return button;
};

const renderOptions = (question) => {
  answerZone.innerHTML = "";
  const block = document.createElement("div");
  block.className = "answer-block";
  const heading = document.createElement("h4");
  heading.textContent = "Select the correct classification";
  block.appendChild(heading);
  const grid = document.createElement("div");
  grid.className = "option-grid";

  let options = [];
  if (state.mode === "geometric") {
    options = question.topic === "fac/mer" ? ["fac", "mer"] : ["cis", "trans"];
  } else if (state.mode === "optical") {
    options = ["lambda", "delta"];
  } else {
    options = question.options;
  }

  options.forEach((option) => grid.appendChild(createOptionButton(option)));
  block.appendChild(grid);
  answerZone.appendChild(block);
};

const updateScore = () => {
  streak.textContent = state.streak;
  questionCount.textContent = state.total;
  const percent = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
  accuracy.textContent = `${percent}%`;
};

const checkMastery = () => {
  if (!state.rigorMode || state.labelsLocked) {
    return;
  }
  const accuracyRate = state.total === 0 ? 0 : state.correct / state.total;
  if (state.total >= 10 && accuracyRate >= 0.8 && state.streak >= 5) {
    state.labelsLocked = true;
    state.showLabels = false;
    updateToggleUI();
    saveSettings();
    render3DModel(state.currentQuestion);
  }
};

const getPool = () => {
  if (state.mode === "geometric") {
    return geometricQuestions;
  }
  if (state.mode === "optical") {
    return opticalQuestions;
  }
  return structuralQuestions;
};

const enqueueAdaptive = (question) => {
  if (!state.adaptive) {
    return;
  }
  const pool = getPool().filter((item) => item.id !== question.id);
  const pick = pool.find((item) => item.topic === question.topic || item.answer === question.answer);
  if (pick) {
    state.adaptiveQueue.push(pick);
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
  state.compareActive = false;
  state.mirrorMode = false;
  modeBadge.textContent = state.mode === "geometric" ? "Geometric" : state.mode === "optical" ? "Optical" : "Structural";
  topicBadge.textContent = question.topic || question.answer;
  promptTitle.textContent = question.formula || "Classification";
  promptNote.innerHTML = question.prompt.replace(/\n/g, "<br>");
  renderOptions(question);
  feedback.className = "feedback";
  feedback.textContent = "";
  if (state.mode === "structural" || !question.compare) {
    compareBtn.style.display = "none";
  } else {
    compareBtn.style.display = "inline-flex";
    compareBtn.textContent = state.mode === "optical" ? "Compare enantiomer" : "Compare isomer";
  }
  updateToggleUI();
  render3DModel(question);
};

const checkAnswer = () => {
  const question = state.currentQuestion;
  if (!question || !state.selection) {
    return;
  }
  const isCorrect = state.selection.toLowerCase() === question.answer;
  state.total += 1;
  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
    enqueueAdaptive(question);
  }
  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
  feedback.textContent = isCorrect
    ? "Correct."
    : `Expected: ${question.answer}.`;
  updateScore();
  checkMastery();
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
  state.adaptiveQueue = [];
  saveSettings();
});

rigorToggle.addEventListener("click", () => {
  state.rigorMode = !state.rigorMode;
  if (!state.rigorMode) {
    state.labelsLocked = false;
    state.showLabels = true;
  } else {
    checkMastery();
  }
  updateToggleUI();
  saveSettings();
  render3DModel(state.currentQuestion);
});

labelToggle.addEventListener("click", () => {
  if (state.labelsLocked) {
    return;
  }
  state.showLabels = !state.showLabels;
  updateToggleUI();
  saveSettings();
  render3DModel(state.currentQuestion);
});

colorToggle.addEventListener("click", () => {
  state.colorMode = state.colorMode === "donor" ? "charge" : "donor";
  updateToggleUI();
  saveSettings();
  render3DModel(state.currentQuestion);
});

compareBtn.addEventListener("click", () => {
  if (state.mode === "structural") {
    return;
  }
  state.compareActive = !state.compareActive;
  render3DModel(state.currentQuestion);
});

mirrorBtn.addEventListener("click", () => {
  if (state.mode !== "optical") {
    return;
  }
  state.mirrorMode = !state.mirrorMode;
  render3DModel(state.currentQuestion);
});

loadSettings();
if (state.labelsLocked) {
  state.showLabels = false;
}
updateToggleUI();
updateScore();
loadQuestion();
