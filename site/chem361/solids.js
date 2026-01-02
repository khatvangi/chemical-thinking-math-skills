const state = {
  mode: "identify",
  streak: 0,
  correct: 0,
  total: 0,
  adaptive: true,
  adaptiveQueue: [],
  rigorMode: false,
  currentQuestion: null,
  selection: null,
};

const settingsKey = "solid-state-settings";

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

const identifyQuestions = [
  {
    id: "sc",
    prompt: "Identify the unit cell type.",
    note: "Corners only.",
    answer: "simple cubic",
    badge: "Cubic",
    image: "assets/solids/lattice-013.png",
  },
  {
    id: "bcc",
    prompt: "Identify the unit cell type.",
    note: "One atom in the body center.",
    answer: "body-centered cubic",
    badge: "Cubic",
    image: "assets/solids/lattice-013.png",
  },
  {
    id: "fcc",
    prompt: "Identify the unit cell type.",
    note: "Atoms at face centers.",
    answer: "face-centered cubic",
    badge: "Cubic",
    image: "assets/solids/lattice-013.png",
  },
];

const countQuestions = [
  {
    id: "count-sc",
    prompt: "How many atoms per unit cell in simple cubic?",
    note: "Corners only.",
    answer: "1",
    badge: "Counting",
  },
  {
    id: "count-bcc",
    prompt: "How many atoms per unit cell in BCC?",
    note: "Corners + one center.",
    answer: "2",
    badge: "Counting",
  },
  {
    id: "count-fcc",
    prompt: "How many atoms per unit cell in FCC?",
    note: "Corners + six faces.",
    answer: "4",
    badge: "Counting",
  },
];

const packingQuestions = [
  {
    id: "pack-sc",
    prompt: "Packing efficiency of simple cubic?",
    note: "Select the closest value.",
    answer: "52%",
    badge: "Packing",
  },
  {
    id: "pack-bcc",
    prompt: "Packing efficiency of BCC?",
    note: "Select the closest value.",
    answer: "68%",
    badge: "Packing",
  },
  {
    id: "pack-fcc",
    prompt: "Packing efficiency of FCC?",
    note: "Select the closest value.",
    answer: "74%",
    badge: "Packing",
  },
];

const latticeQuestions = [
  {
    id: "lattice-cubic",
    prompt: "Identify the lattice system: a = b = c, alpha = beta = gamma = 90°",
    note: "Select the system.",
    answer: "cubic",
    badge: "Systems",
  },
  {
    id: "lattice-hex",
    prompt: "Identify the lattice system: a = b ≠ c, alpha = beta = 90°, gamma = 120°",
    note: "Select the system.",
    answer: "hexagonal",
    badge: "Systems",
  },
  {
    id: "lattice-tetra",
    prompt: "Identify the lattice system: a = b ≠ c, alpha = beta = gamma = 90°",
    note: "Select the system.",
    answer: "tetragonal",
    badge: "Systems",
  },
];

const saveSettings = () => {
  const payload = {
    adaptive: state.adaptive,
    rigorMode: state.rigorMode,
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
  } catch (error) {
    localStorage.removeItem(settingsKey);
  }
};

const updateToggleUI = () => {
  adaptiveToggle.textContent = state.adaptive ? "On" : "Off";
  adaptiveToggle.classList.toggle("off", !state.adaptive);
  rigorToggle.textContent = state.rigorMode ? "On" : "Off";
  rigorToggle.classList.toggle("off", !state.rigorMode);
};

const updateScore = () => {
  streak.textContent = state.streak;
  questionCount.textContent = state.total;
  const percent = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
  accuracy.textContent = `${percent}%`;
};

const renderDiagramPanel = (question) => {
  diagramPanel.innerHTML = "";
  if (question.image) {
    diagramPanel.innerHTML = `<img src="${question.image}" alt="Unit cell" class="chart-image" />`;
  } else {
    diagramPanel.innerHTML = `<p class="question-note">${question.note}</p>`;
  }
};

const renderOptions = (question) => {
  answerZone.innerHTML = "";
  const block = document.createElement("div");
  block.className = "answer-block";
  const heading = document.createElement("h4");
  heading.textContent = "Select the best answer";
  block.appendChild(heading);
  const grid = document.createElement("div");
  grid.className = "option-grid";
  let options = [];
  if (state.mode === "identify") {
    options = ["simple cubic", "body-centered cubic", "face-centered cubic"];
  } else if (state.mode === "count") {
    options = ["1", "2", "4"];
  } else if (state.mode === "packing") {
    options = ["52%", "68%", "74%"];
  } else {
    options = ["cubic", "tetragonal", "hexagonal", "orthorhombic"];
  }
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.addEventListener("click", () => {
      state.selection = option;
      const siblings = button.parentElement.querySelectorAll(".option-button");
      siblings.forEach((sibling) => sibling.classList.remove("active"));
      button.classList.add("active");
    });
    grid.appendChild(button);
  });
  block.appendChild(grid);
  answerZone.appendChild(block);
};

const getPool = () => {
  if (state.mode === "identify") {
    return identifyQuestions;
  }
  if (state.mode === "count") {
    return countQuestions;
  }
  if (state.mode === "packing") {
    return packingQuestions;
  }
  return latticeQuestions;
};

const enqueueAdaptive = (question) => {
  if (!state.adaptive) {
    return;
  }
  const pool = getPool().filter((item) => item.id !== question.id);
  if (pool.length) {
    state.adaptiveQueue.push(pool[Math.floor(Math.random() * pool.length)]);
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
  modeBadge.textContent = modeButtons.find((btn) => btn.dataset.mode === state.mode)?.textContent || "Module";
  promptBadge.textContent = question.badge || "Solid state";
  promptTitle.textContent = question.prompt;
  promptNote.textContent = question.note;
  feedback.className = "feedback";
  feedback.textContent = "";
  renderDiagramPanel(question);
  renderOptions(question);
};

const checkAnswer = () => {
  if (!state.currentQuestion || !state.selection) {
    return;
  }
  const isCorrect = state.selection.toLowerCase() === state.currentQuestion.answer.toLowerCase();
  state.total += 1;
  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
    enqueueAdaptive(state.currentQuestion);
  }
  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
  feedback.textContent = isCorrect ? "Correct." : `Expected: ${state.currentQuestion.answer}.`;
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

loadSettings();
updateToggleUI();
updateScore();
loadQuestion();
