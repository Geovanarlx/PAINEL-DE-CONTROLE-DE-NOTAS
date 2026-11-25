const STORAGE_KEY = "academico-painel-notas-v1";
const form = document.querySelector("#grade-form");
const gradeInput = document.querySelector("#grade-input");
const inputWrap = document.querySelector("#input-wrap");
const errorMessage = document.querySelector("#grade-error");
const resultCard = document.querySelector("#result-card");
const resultIcon = document.querySelector("#result-icon");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");
const resultGrade = document.querySelector("#result-grade");
const recordsList = document.querySelector("#records-list");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const averageValue = document.querySelector("#average-value");
const averageFoot = document.querySelector("#average-foot");
const highestValue = document.querySelector("#highest-value");
const headingCount = document.querySelector("#heading-count");
const navCount = document.querySelector("#nav-count");
const recordsSummary = document.querySelector("#records-summary");
const clearButton = document.querySelector("#clear-button");
const todayLabel = document.querySelector("#today-label");

let grades = loadGrades();
let currentPreview = null;

const classificationDetails = {
  excellent: {
    label: "Excelente",
    description: "Resultado de destaque. Parabéns!",
    icon: "✦",
  },
  approved: {
    label: "Aprovado",
    description: "Resultado dentro do esperado.",
    icon: "✓",
  },
  recovery: {
    label: "Recuperação",
    description: "Precisa de um pouco mais de atenção.",
    icon: "↗",
  },
  failed: {
    label: "Reprovado",
    description: "Resultado abaixo da média mínima.",
    icon: "!",
  },
};

function loadGrades() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) =>
      item &&
      Number.isFinite(item.value) &&
      item.value >= 0 &&
      item.value <= 10 &&
      classificationDetails[item.level] &&
      typeof item.time === "string"
    );
  } catch {
    return [];
  }
}

function saveGrades() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
  } catch {
    // A sessão continua utilizável mesmo quando o navegador bloqueia o armazenamento.
  }
}

function formatGrade(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 2,
  });
}

function classifyGrade(value) {
  if (value >= 9) {
    return "excellent";
  } else if (value >= 7) {
    return "approved";
  } else if (value >= 5) {
    return "recovery";
  } else {
    return "failed";
  }
}

function showError(message) {
  inputWrap.classList.add("invalid");
  gradeInput.setAttribute("aria-invalid", "true");
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  inputWrap.classList.remove("invalid");
  gradeInput.removeAttribute("aria-invalid");
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function showResult(value, level) {
  const details = classificationDetails[level];
  resultCard.dataset.level = level;
  resultIcon.textContent = details.icon;
  resultTitle.textContent = details.label;
  resultDescription.textContent = details.description;
  resultGrade.textContent = formatGrade(value);
  resultCard.hidden = false;
}

function renderRecords() {
  recordsList.replaceChildren();

  // Percorre o array para exibir cada nota registrada na sessão.
  for (let index = 0; index < grades.length; index += 1) {
    const grade = grades[index];
    const details = classificationDetails[grade.level];
    const row = document.createElement("div");
    row.className = "record-row";

    const gradeCell = document.createElement("span");
    gradeCell.className = "record-grade";
    gradeCell.append(document.createTextNode(formatGrade(grade.value)));
    const denominator = document.createElement("span");
    denominator.className = "grade-denominator";
    denominator.textContent = " / 10";
    gradeCell.append(denominator);

    const levelCell = document.createElement("span");
    const badge = document.createElement("span");
    badge.className = `level-badge ${grade.level}`;
    badge.textContent = details.label;
    levelCell.append(badge);

    const timeCell = document.createElement("time");
    timeCell.className = "record-time";
    timeCell.dateTime = grade.time;
    timeCell.textContent = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(grade.time));

    row.append(gradeCell, levelCell, timeCell);
    recordsList.append(row);
  }

  const count = grades.length;
  totalCount.textContent = String(count);
  headingCount.textContent = String(count);
  navCount.textContent = String(count);
  recordsSummary.textContent = count === 1 ? "1 nota adicionada" : `${count} notas adicionadas`;
  emptyState.hidden = count > 0;
  clearButton.disabled = count === 0;

  if (count === 0) {
    averageValue.innerHTML = "—<span class=\"value-suffix\"> / 10</span>";
    averageFoot.textContent = "aguardando registros";
    highestValue.innerHTML = "—<span class=\"value-suffix\"> / 10</span>";
    return;
  }

  const sum = grades.reduce((total, grade) => total + grade.value, 0);
  const average = sum / count;
  const highest = Math.max(...grades.map((grade) => grade.value));
  averageValue.innerHTML = `${formatGrade(average)}<span class="value-suffix"> / 10</span>`;
  averageFoot.textContent = count === 1 ? "com base em 1 registro" : `com base em ${count} registros`;
  highestValue.innerHTML = `${formatGrade(highest)}<span class="value-suffix"> / 10</span>`;
}

function updateTodayLabel() {
  todayLabel.textContent = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date()).replace(".", "");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  const rawValue = gradeInput.value.trim();
  if (rawValue === "") {
    currentPreview = null;
    showError("Digite uma nota para continuar.");
    resultCard.hidden = true;
    gradeInput.focus();
    return;
  }

  const normalizedValue = rawValue.replace(",", ".");
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalizedValue)) {
    currentPreview = null;
    showError("Informe somente um valor numérico entre 0 e 10.");
    resultCard.hidden = true;
    gradeInput.focus();
    return;
  }

  const value = Number(normalizedValue);
  if (!Number.isFinite(value) || value < 0 || value > 10) {
    currentPreview = null;
    showError("A nota precisa estar dentro do intervalo de 0 a 10.");
    resultCard.hidden = true;
    gradeInput.focus();
    return;
  }

  const level = classifyGrade(value);
  currentPreview = { value, level };
  showResult(value, level);

  const details = classificationDetails[level];
  const confirmed = window.confirm(
    `Nota ${formatGrade(value)} — ${details.label}.\n\nDeseja confirmar o registro desta nota?`
  );

  if (!confirmed) return;

  grades.push({
    value,
    level,
    time: new Date().toISOString(),
  });
  saveGrades();
  renderRecords();
  gradeInput.value = "";
  gradeInput.focus();
  currentPreview = null;
});

gradeInput.addEventListener("input", () => {
  if (!errorMessage.hidden) clearError();
});

clearButton.addEventListener("click", () => {
  if (grades.length === 0) return;
  const confirmed = window.confirm("Deseja remover todas as notas registradas?");
  if (!confirmed) return;
  grades = [];
  saveGrades();
  renderRecords();
  resultCard.hidden = true;
  currentPreview = null;
});

renderRecords();
updateTodayLabel();
