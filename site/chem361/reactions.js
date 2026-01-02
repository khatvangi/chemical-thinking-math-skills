const state = {
  mode: "rate",
  streak: 0,
  correct: 0,
  total: 0,
  adaptive: true,
  adaptiveQueue: [],
  rigorMode: false,
  currentQuestion: null,
  selection: null,
};

const settingsKey = "coordination-reactions-settings";

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

const rateQuestions = [
  {
    id: "rate-d",
    prompt: "Rate = k[ML5X]",
    note: "Entering ligand does not appear in the rate law.",
    answer: "D",
  },
  {
    id: "rate-a",
    prompt: "Rate = k[ML4X][Y]",
    note: "Entering ligand appears in the rate law.",
    answer: "A",
  },
  {
    id: "rate-i",
    prompt: "Rate = k[ML5X][Y]^0.5",
    note: "Partial dependence on entering ligand.",
    answer: "I",
  },
  {
    id: "rate-i2",
    prompt: "Rate = k[ML5X][Y]^0.2",
    note: "Weak dependence on entering ligand.",
    answer: "I",
  },
];

const pathQuestions = [
  {
    id: "path-sp",
    prompt: "Square planar Pt(II) substitution with strong nucleophile.",
    note: "Predict dominant pathway.",
    answer: "A",
  },
  {
    id: "path-octa",
    prompt: "Octahedral Co(III) complex, inert, rate independent of Y.",
    note: "Predict dominant pathway.",
    answer: "D",
  },
  {
    id: "path-inter",
    prompt: "Octahedral complex, rate weakly depends on Y.",
    note: "Predict dominant pathway.",
    answer: "I",
  },
];

const stereoQuestions = [
  {
    id: "stereo-ret",
    prompt: "Five-coordinate intermediate retains configuration.",
    note: "Predict stereochemical outcome.",
    answer: "retention",
  },
  {
    id: "stereo-alt",
    prompt: "Five-coordinate intermediate rearranges before substitution.",
    note: "Predict stereochemical outcome.",
    answer: "alteration",
  },
  {
    id: "stereo-mix",
    prompt: "Both trigonal bipyramidal and square pyramidal pathways available.",
    note: "Predict stereochemical outcome.",
    answer: "mixture",
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
  if (state.mode === "rate") {
    diagramPanel.innerHTML = `<p class="question-note">${question.note}</p>`;
  } else if (state.mode === "path") {
    diagramPanel.innerHTML = `<p class="question-note">Use kinetics + geometry clues.</p>`;
  } else {
    diagramPanel.innerHTML = `<p class="question-note">Retention vs alteration depends on pathway.</p>`;
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
  if (state.mode === "rate" || state.mode === "path") {
    options = ["D", "I", "A"];
  } else {
    options = ["retention", "alteration", "mixture"];
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
  if (state.mode === "rate") {
    return rateQuestions;
  }
  if (state.mode === "path") {
    return pathQuestions;
  }
  return stereoQuestions;
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
  promptBadge.textContent = state.mode === "rate" ? "Rate law" : state.mode === "path" ? "Mechanism" : "Stereochemistry";
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
