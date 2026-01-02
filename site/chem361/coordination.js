const geometryLayouts = {
  octahedral: {
    cn: 6,
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
  tetrahedral: {
    cn: 4,
    positions: ["top", "bottom", "left", "right"],
    coords: {
      top: [1, 1, 1],
      bottom: [-1, -1, 1],
      left: [-1, 1, -1],
      right: [1, -1, -1],
    },
  },
  "square planar": {
    cn: 4,
    positions: ["top", "bottom", "left", "right"],
    coords: {
      top: [0, 1, 0],
      bottom: [0, -1, 0],
      left: [-1, 0, 0],
      right: [1, 0, 0],
    },
  },
  "trigonal bipyramidal": {
    cn: 5,
    positions: ["top", "bottom", "left", "right", "front"],
    coords: {
      top: [0, 0, 1],
      bottom: [0, 0, -1],
      left: [-1, 0, 0],
      right: [1, 0, 0],
      front: [0, 1, 0],
    },
  },
  "square pyramidal": {
    cn: 5,
    positions: ["top", "left", "right", "front", "back"],
    coords: {
      top: [0, 0, 1],
      left: [-1, 0, 0],
      right: [1, 0, 0],
      front: [0, 1, 0],
      back: [0, -1, 0],
    },
  },
  "pentagonal bipyramidal": {
    cn: 7,
    positions: ["top", "bottom", "eq1", "eq2", "eq3", "eq4", "eq5"],
    coords: {
      top: [0, 0, 1],
      bottom: [0, 0, -1],
      eq1: [1, 0, 0],
      eq2: [0.309, 0.951, 0],
      eq3: [-0.809, 0.588, 0],
      eq4: [-0.809, -0.588, 0],
      eq5: [0.309, -0.951, 0],
    },
  },
  "square antiprismatic": {
    cn: 8,
    positions: ["t1", "t2", "t3", "t4", "b1", "b2", "b3", "b4"],
    coords: {
      t1: [1, 0, 0.8],
      t2: [0, 1, 0.8],
      t3: [-1, 0, 0.8],
      t4: [0, -1, 0.8],
      b1: [0.707, 0.707, -0.8],
      b2: [-0.707, 0.707, -0.8],
      b3: [-0.707, -0.707, -0.8],
      b4: [0.707, -0.707, -0.8],
    },
  },
  linear: {
    cn: 2,
    positions: ["left", "right"],
    coords: {
      left: [-1, 0, 0],
      right: [1, 0, 0],
    },
  },
};

const geometryList = Object.keys(geometryLayouts);

const matchQuestions = [
  {
    prompt: "[Co(en)2Cl2]+",
    note: "en is bidentate. Determine CN and geometry.",
    cn: 6,
    geometry: "octahedral",
    ligands: ["en", "en", "Cl-", "Cl-"]
  },
  {
    prompt: "[Ni(CN)4]2-",
    note: "d8 metal, strong field.",
    cn: 4,
    geometry: "square planar",
    ligands: ["CN-", "CN-", "CN-", "CN-"]
  },
  {
    prompt: "[ZnCl4]2-",
    note: "Main group metal, weak field.",
    cn: 4,
    geometry: "tetrahedral",
    ligands: ["Cl-", "Cl-", "Cl-", "Cl-"]
  },
  {
    prompt: "[Ag(NH3)2]+",
    note: "Coordination number 2.",
    cn: 2,
    geometry: "linear",
    ligands: ["NH3", "NH3"]
  },
  {
    prompt: "[Fe(CN)6]4-",
    note: "Classic octahedral coordination.",
    cn: 6,
    geometry: "octahedral",
    ligands: ["CN-", "CN-", "CN-", "CN-", "CN-", "CN-"]
  },
  {
    prompt: "[Ni(CO)4]",
    note: "Zero oxidation state, tetrahedral.",
    cn: 4,
    geometry: "tetrahedral",
    ligands: ["CO", "CO", "CO", "CO"]
  },
  {
    prompt: "[Pt(NH3)2Cl2]",
    note: "Square planar d8 complex.",
    cn: 4,
    geometry: "square planar",
    ligands: ["NH3", "NH3", "Cl-", "Cl-"]
  },
  {
    prompt: "[Fe(H2O)6]2+",
    note: "Hexaaqua complex.",
    cn: 6,
    geometry: "octahedral",
    ligands: ["H2O", "H2O", "H2O", "H2O", "H2O", "H2O"]
  },
];

const buildQuestions = [
  {
    prompt: "Ligands: en x2, Cl- x2",
    note: "Compute CN from denticity before choosing geometry.",
    metal: "Co",
    cn: 6,
    geometry: "octahedral",
    ligands: ["en (bidentate)", "en (bidentate)", "Cl-", "Cl-"]
  },
  {
    prompt: "Ligands: bpy x3 (each bidentate)",
    note: "Each bpy occupies two sites.",
    metal: "Fe",
    cn: 6,
    geometry: "octahedral",
    ligands: ["bpy", "bpy", "bpy"]
  },
  {
    prompt: "Ligands: PPh3 x4",
    note: "Neutral monodentate ligands.",
    metal: "Ni",
    cn: 4,
    geometry: "tetrahedral",
    ligands: ["PPh3", "PPh3", "PPh3", "PPh3"]
  },
  {
    prompt: "Ligands: en x2",
    note: "Two bidentate ligands.",
    metal: "Pt",
    cn: 4,
    geometry: "square planar",
    ligands: ["en", "en"]
  },
  {
    prompt: "Ligands: EDTA4- (hexadentate)",
    note: "Single ligand wraps around the metal.",
    metal: "Ca",
    cn: 6,
    geometry: "octahedral",
    ligands: ["EDTA (hexadentate)"]
  },
  {
    prompt: "Ligands: NO2- x5",
    note: "CN 5 candidates: trigonal bipyramidal vs square pyramidal.",
    metal: "Fe",
    cn: 5,
    geometry: "trigonal bipyramidal",
    ligands: ["NO2-", "NO2-", "NO2-", "NO2-", "NO2-"]
  },
];

const ambiguityQuestions = [
  {
    prompt: "CN = 4, metal = Pt(II), strong field ligands",
    note: "Choose geometry and justify.",
    metal: "Pt",
    cn: 4,
    geometry: "square planar",
    justification: "d8 strong field favors square planar",
    options: ["square planar", "tetrahedral"],
    justifications: [
      "d8 strong field favors square planar",
      "weak field favors tetrahedral",
    ],
  },
  {
    prompt: "CN = 4, metal = Zn(II), halide ligands",
    note: "Choose geometry and justify.",
    metal: "Zn",
    cn: 4,
    geometry: "tetrahedral",
    justification: "d10 weak field favors tetrahedral",
    options: ["square planar", "tetrahedral"],
    justifications: [
      "d8 strong field favors square planar",
      "d10 weak field favors tetrahedral",
    ],
  },
  {
    prompt: "CN = 5, metal = Fe(III) with mixed ligands",
    note: "Choose the more common geometry.",
    metal: "Fe",
    cn: 5,
    geometry: "square pyramidal",
    justification: "square pyramidal slightly more common for CN 5",
    options: ["square pyramidal", "trigonal bipyramidal"],
    justifications: [
      "square pyramidal slightly more common for CN 5",
      "trigonal bipyramidal dominates for CN 5",
    ],
  },
];

const rareQuestions = [
  {
    prompt: "Identify the geometry for CN 5 model.",
    note: "Use the 3D structure cues.",
    metal: "Fe",
    cn: 5,
    geometry: "trigonal bipyramidal",
  },
  {
    prompt: "Identify the geometry for CN 5 model.",
    note: "Use the 3D structure cues.",
    metal: "Fe",
    cn: 5,
    geometry: "square pyramidal",
  },
  {
    prompt: "Identify the geometry for CN 7 model.",
    note: "Two axial + five equatorial.",
    metal: "Zr",
    cn: 7,
    geometry: "pentagonal bipyramidal",
  },
  {
    prompt: "Identify the geometry for CN 8 model.",
    note: "Look for a twisted square antiprism.",
    metal: "La",
    cn: 8,
    geometry: "square antiprismatic",
  },
];

const questionPools = {
  match: matchQuestions,
  build: buildQuestions,
  ambiguity: ambiguityQuestions,
  rare: rareQuestions,
};

const state = {
  mode: "match",
  streak: 0,
  correct: 0,
  total: 0,
  used: new Set(),
  adaptiveQueue: [],
  adaptive: true,
  showLabels: true,
  colorMode: "donor",
  rigorMode: false,
  labelsLocked: false,
  currentQuestion: null,
  selections: {},
};

const settingsKey = "coordination-structures-settings";

const modeButtons = Array.from(document.querySelectorAll(".mode-tabs .chip"));
const modeBadge = document.getElementById("modeBadge");
const cnBadge = document.getElementById("cnBadge");
const geometryBadge = document.getElementById("geometryBadge");
const promptTitle = document.getElementById("promptTitle");
const promptNote = document.getElementById("promptNote");
const answerZone = document.getElementById("answerZone");
const feedback = document.getElementById("feedback");
const streak = document.getElementById("streak");
const accuracy = document.getElementById("accuracy");
const questionCount = document.getElementById("questionCount");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const adaptiveToggle = document.getElementById("adaptiveToggle");
const rigorToggle = document.getElementById("rigorToggle");
const labelToggle = document.getElementById("labelToggle");
const colorToggle = document.getElementById("colorToggle");
const viewerNote = document.getElementById("viewerNote");
const viewerElement = document.getElementById("viewer3d");

let viewer3d = null;

const elementColorMap = {
  Cl: "#4b6cb7",
  N: "#1f8a8a",
  O: "#d06b28",
  S: "#7a6a5e",
  C: "#6b5c4b",
  P: "#ad6c1c",
  M: "#0f3d3e",
};

const chargeColorMap = {
  metal: "#0f3d3e",
  neutral: "#d66b2d",
  anionic: "#2b6cb0",
};

const normalize = (value) => value.toLowerCase().trim();

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
};

const tagQuestion = (question, mode) => {
  const tags = new Set([mode, `cn${question.cn}`, question.geometry]);
  if (question.ligands) {
    question.ligands.forEach((ligand) => {
      const token = ligand.split(" ")[0].toLowerCase();
      tags.add(token);
    });
  }
  return Array.from(tags);
};

const getPool = () => questionPools[state.mode];

const getSimilarQuestion = (question) => {
  const pool = getPool();
  const targetTags = new Set(question.tags || []);
  const scored = pool
    .filter((candidate) => candidate !== question)
    .map((candidate) => {
      const overlap = (candidate.tags || []).filter((tag) => targetTags.has(tag)).length;
      return { candidate, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);
  if (!scored.length) {
    return null;
  }
  return scored[0].candidate;
};

const enqueueAdaptive = (question) => {
  if (!state.adaptive) {
    return;
  }
  const pick = getSimilarQuestion(question);
  if (pick && !state.adaptiveQueue.includes(pick)) {
    state.adaptiveQueue.push(pick);
  }
};

const metalSymbolFromPrompt = (question) => {
  if (question.metal) {
    return question.metal;
  }
  const match = question.prompt.match(/[A-Z][a-z]?/);
  return match ? match[0] : "M";
};

const ligandToElement = (label) => {
  if (!label) {
    return "C";
  }
  if (label.startsWith("Cl")) {
    return "Cl";
  }
  if (label.startsWith("NH")) {
    return "N";
  }
  if (label.startsWith("H2O") || label.startsWith("OH")) {
    return "O";
  }
  if (label.startsWith("CN")) {
    return "C";
  }
  if (label.startsWith("CO")) {
    return "C";
  }
  if (label.startsWith("NO")) {
    return "N";
  }
  if (label.startsWith("P")) {
    return "P";
  }
  return "C";
};

const buildXYZModel = (question) => {
  const layout = geometryLayouts[question.geometry];
  if (!layout) {
    return null;
  }
  const ligands = question.ligands || Array(layout.cn).fill("L");
  const atoms = [];
  atoms.push({
    element: metalSymbolFromPrompt(question),
    x: 0,
    y: 0,
    z: 0,
    label: "M",
    role: "metal",
  });
  const scale = 2.2;
  layout.positions.forEach((position, index) => {
    const coord = layout.coords[position];
    if (!coord) {
      return;
    }
    const [x, y, z] = coord.map((value) => value * scale);
    const label = ligands[index] || "L";
    atoms.push({
      element: ligandToElement(label),
      x,
      y,
      z,
      label,
      role: label.includes("-") ? "anionic" : "neutral",
    });
  });
  const lines = [
    `${atoms.length}`,
    `${question.prompt} geometry model`,
    ...atoms.map((atom) => `${atom.element} ${atom.x.toFixed(4)} ${atom.y.toFixed(4)} ${atom.z.toFixed(4)}`),
  ];
  return { xyz: lines.join("\n"), atoms };
};

const render3DModel = (question) => {
  if (!viewerElement || !window.$3Dmol) {
    return;
  }
  if (!viewer3d) {
    viewer3d = window.$3Dmol.createViewer(viewerElement, { backgroundColor: "white" });
  }
  viewer3d.clear();
  const modelData = buildXYZModel(question);
  if (!modelData) {
    viewerNote.textContent = "3D model not available for this geometry.";
    viewer3d.render();
    return;
  }
  viewerNote.textContent = "Idealized 3D geometry model. Rotate and zoom for spatial orientation.";
  viewer3d.addModel(modelData.xyz, "xyz");
  viewer3d.setStyle({}, { stick: { radius: 0.12 }, sphere: { scale: 0.45 } });
  const model = viewer3d.getModel();
  const atoms = model.selectedAtoms({});
  atoms.forEach((atom, index) => {
    const meta = modelData.atoms[index];
    if (!meta) {
      return;
    }
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
  viewer3d.addLabel("M", {
    position: { x: 0, y: 0, z: 0 },
    backgroundColor: "rgba(15,61,62,0.85)",
    fontColor: "white",
    fontSize: 11,
    borderColor: "transparent",
  });
  viewer3d.zoomTo();
  viewer3d.render();
};

const createOptionButton = (label, group) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-button";
  button.textContent = label;
  button.addEventListener("click", () => {
    state.selections[group] = label;
    const siblings = button.parentElement.querySelectorAll(".option-button");
    siblings.forEach((sibling) => sibling.classList.remove("active"));
    button.classList.add("active");
  });
  return button;
};

const renderMatchOptions = (question) => {
  answerZone.innerHTML = "";
  const cnBlock = document.createElement("div");
  cnBlock.className = "answer-block";
  cnBlock.innerHTML = "<h4>Coordination number</h4>";
  const cnGrid = document.createElement("div");
  cnGrid.className = "option-grid";
  [2, 4, 5, 6, 7, 8].forEach((value) => cnGrid.appendChild(createOptionButton(`${value}`, "cn")));
  cnBlock.appendChild(cnGrid);

  const geomBlock = document.createElement("div");
  geomBlock.className = "answer-block";
  geomBlock.innerHTML = "<h4>Geometry</h4>";
  const geomGrid = document.createElement("div");
  geomGrid.className = "option-grid";
  geometryList.forEach((value) => geomGrid.appendChild(createOptionButton(value, "geometry")));
  geomBlock.appendChild(geomGrid);

  answerZone.appendChild(cnBlock);
  answerZone.appendChild(geomBlock);
};

const renderBuildOptions = (question) => {
  answerZone.innerHTML = "";
  const ligands = document.createElement("div");
  ligands.className = "answer-block";
  ligands.innerHTML = "<h4>Ligands</h4>";
  const list = document.createElement("div");
  question.ligands.forEach((ligand) => {
    const chip = document.createElement("span");
    chip.className = "hint-chip";
    chip.textContent = ligand;
    list.appendChild(chip);
  });
  ligands.appendChild(list);

  const cnBlock = document.createElement("div");
  cnBlock.className = "answer-block";
  cnBlock.innerHTML = "<h4>Coordination number</h4>";
  const cnGrid = document.createElement("div");
  cnGrid.className = "option-grid";
  [2, 4, 5, 6, 7, 8].forEach((value) => cnGrid.appendChild(createOptionButton(`${value}`, "cn")));
  cnBlock.appendChild(cnGrid);

  const geomBlock = document.createElement("div");
  geomBlock.className = "answer-block";
  geomBlock.innerHTML = "<h4>Geometry</h4>";
  const geomGrid = document.createElement("div");
  geomGrid.className = "option-grid";
  geometryList.forEach((value) => geomGrid.appendChild(createOptionButton(value, "geometry")));
  geomBlock.appendChild(geomGrid);

  answerZone.appendChild(ligands);
  answerZone.appendChild(cnBlock);
  answerZone.appendChild(geomBlock);
};

const renderAmbiguityOptions = (question) => {
  answerZone.innerHTML = "";
  const geomBlock = document.createElement("div");
  geomBlock.className = "answer-block";
  geomBlock.innerHTML = "<h4>Geometry</h4>";
  const geomGrid = document.createElement("div");
  geomGrid.className = "option-grid";
  question.options.forEach((value) => geomGrid.appendChild(createOptionButton(value, "geometry")));
  geomBlock.appendChild(geomGrid);

  const justBlock = document.createElement("div");
  justBlock.className = "answer-block";
  justBlock.innerHTML = "<h4>Justification</h4>";
  const justGrid = document.createElement("div");
  justGrid.className = "option-grid";
  question.justifications.forEach((value) => justGrid.appendChild(createOptionButton(value, "justification")));
  justBlock.appendChild(justGrid);

  answerZone.appendChild(geomBlock);
  answerZone.appendChild(justBlock);
};

const renderRareOptions = () => {
  answerZone.innerHTML = "";
  const geomBlock = document.createElement("div");
  geomBlock.className = "answer-block";
  geomBlock.innerHTML = "<h4>Geometry</h4>";
  const geomGrid = document.createElement("div");
  geomGrid.className = "option-grid";
  ["square pyramidal", "trigonal bipyramidal", "pentagonal bipyramidal", "square antiprismatic"].forEach(
    (value) => geomGrid.appendChild(createOptionButton(value, "geometry"))
  );
  geomBlock.appendChild(geomGrid);
  answerZone.appendChild(geomBlock);
};

const renderAnswerZone = (question) => {
  state.selections = {};
  if (state.mode === "match") {
    renderMatchOptions(question);
  } else if (state.mode === "build") {
    renderBuildOptions(question);
  } else if (state.mode === "ambiguity") {
    renderAmbiguityOptions(question);
  } else {
    renderRareOptions(question);
  }
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
  if (state.total >= 12 && accuracyRate >= 0.8 && state.streak >= 6) {
    state.labelsLocked = true;
    state.showLabels = false;
    updateToggleUI();
    saveSettings();
    render3DModel(state.currentQuestion);
  }
};

const getNextQuestion = () => {
  const pool = getPool();
  if (state.adaptiveQueue.length > 0 && state.adaptive) {
    return state.adaptiveQueue.shift();
  }
  if (state.used.size >= pool.length) {
    state.used.clear();
  }
  let pick = pool[Math.floor(Math.random() * pool.length)];
  while (state.used.has(pick)) {
    pick = pool[Math.floor(Math.random() * pool.length)];
  }
  state.used.add(pick);
  return pick;
};

const loadQuestion = () => {
  const question = getNextQuestion();
  question.tags = question.tags || tagQuestion(question, state.mode);
  state.currentQuestion = question;
  modeBadge.textContent = modeButtons.find((btn) => btn.dataset.mode === state.mode)?.textContent || "Module";
  cnBadge.textContent = `CN ${question.cn}`;
  geometryBadge.textContent = question.geometry;
  promptTitle.textContent = question.prompt;
  promptNote.textContent = question.note;
  feedback.className = "feedback";
  feedback.textContent = "";
  renderAnswerZone(question);
  render3DModel(question);
};

const markOptions = (group, correctValue) => {
  const buttons = answerZone.querySelectorAll(".option-button");
  buttons.forEach((button) => {
    if (!button.textContent || !button.parentElement) {
      return;
    }
    if (button.parentElement.parentElement.querySelector("h4")?.textContent.toLowerCase().includes(group)) {
      if (button.textContent === correctValue) {
        button.classList.add("correct");
      } else if (button.classList.contains("active")) {
        button.classList.add("wrong");
      }
    }
  });
};

const checkAnswer = () => {
  const question = state.currentQuestion;
  if (!question) {
    return;
  }
  let isCorrect = false;
  if (state.mode === "ambiguity") {
    isCorrect =
      normalize(state.selections.geometry || "") === question.geometry &&
      normalize(state.selections.justification || "") === question.justification;
  } else {
    isCorrect =
      Number(state.selections.cn) === question.cn &&
      normalize(state.selections.geometry || "") === question.geometry;
  }

  state.total += 1;
  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
    enqueueAdaptive(question);
  }

  if (state.mode === "ambiguity") {
    markOptions("geometry", question.geometry);
    markOptions("justification", question.justification);
  } else {
    markOptions("coordination", `${question.cn}`);
    markOptions("geometry", question.geometry);
  }

  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
  feedback.textContent = isCorrect
    ? "Correct. Geometry and coordination number match."
    : `Expected: CN ${question.cn}, ${question.geometry}.`;

  updateScore();
  checkMastery();
};

const resetSession = () => {
  state.streak = 0;
  state.correct = 0;
  state.total = 0;
  state.used.clear();
  state.adaptiveQueue = [];
  updateScore();
  loadQuestion();
};

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    state.mode = button.dataset.mode;
    state.used.clear();
    state.adaptiveQueue = [];
    loadQuestion();
  });
});

checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", loadQuestion);
resetBtn.addEventListener("click", resetSession);

adaptiveToggle.addEventListener("click", () => {
  state.adaptive = !state.adaptive;
  updateToggleUI();
  if (!state.adaptive) {
    state.adaptiveQueue = [];
  }
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

matchQuestions.forEach((question) => {
  question.tags = tagQuestion(question, "match");
});

buildQuestions.forEach((question) => {
  question.tags = tagQuestion(question, "build");
});

ambiguityQuestions.forEach((question) => {
  question.tags = tagQuestion(question, "ambiguity");
});

rareQuestions.forEach((question) => {
  question.tags = tagQuestion(question, "rare");
});

loadSettings();
if (state.labelsLocked) {
  state.showLabels = false;
}
updateToggleUI();
updateScore();
loadQuestion();
