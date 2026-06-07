function storedUser() {
  try {
    const user = JSON.parse(localStorage.getItem("jsTutorUser") || "null");
    return user && user.id ? user : null;
  } catch (error) {
    localStorage.removeItem("jsTutorUser");
    return null;
  }
}

let state = {
  user: storedUser(),
  modules: [],
  adaptivePath: [],
  activeModuleId: "intro",
  activeQuizType: "module",
  quizStartedAt: Date.now(),
  authMode: "login",
};

const el = {
  userForm: document.querySelector("#user-form"),
  nameInput: document.querySelector("#name-input"),
  emailInput: document.querySelector("#email-input"),
  passwordInput: document.querySelector("#password-input"),
  loginOpen: document.querySelector("#login-open"),
  registerOpen: document.querySelector("#register-open"),
  authActions: document.querySelector("#auth-actions"),
  authUser: document.querySelector("#auth-user"),
  authUserLabel: document.querySelector("#auth-user-label"),
  logoutBtn: document.querySelector("#logout-btn"),
  authTitle: document.querySelector("#auth-title"),
  authClose: document.querySelector("#auth-close"),
  authSubmit: document.querySelector("#auth-submit"),
  authMessage: document.querySelector("#auth-message"),
  authModeInput: document.querySelector("#auth-mode-input"),
  nameField: document.querySelector("#name-field"),
  moduleSelect: document.querySelector("#module-select"),
  moduleSummary: document.querySelector("#module-summary"),
  lesson: document.querySelector("#lesson"),
  quizTitle: document.querySelector("#quiz-title"),
  quizForm: document.querySelector("#quiz-form"),
  quizResult: document.querySelector("#quiz-result"),
  reviewBtn: document.querySelector("#review-btn"),
  pathList: document.querySelector("#path-list"),
  averageScore: document.querySelector("#average-score"),
  attemptCount: document.querySelector("#attempt-count"),
  activityCount: document.querySelector("#activity-count"),
  completedCount: document.querySelector("#completed-count"),
  studyTime: document.querySelector("#study-time"),
  reportBars: document.querySelector("#report-bars"),
  reportDetails: document.querySelector("#report-details"),
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || `Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function openAuth(mode) {
  state.authMode = mode;
  el.authModeInput.value = mode;
  el.userForm.hidden = false;
  el.authMessage.textContent = "";
  el.authTitle.textContent = mode === "register" ? "Εγγραφή μαθητή" : "Είσοδος μαθητή";
  el.authSubmit.textContent = mode === "register" ? "Δημιουργία λογαριασμού" : "Σύνδεση";
  el.nameField.hidden = mode !== "register";
  el.nameInput.required = mode === "register";
  el.passwordInput.autocomplete = mode === "register" ? "new-password" : "current-password";
  if (mode === "register") {
    el.nameInput.focus();
  } else {
    el.emailInput.focus();
  }
}

window.openAuthPanel = openAuth;

function closeAuth() {
  el.userForm.hidden = true;
  el.authMessage.textContent = "";
}

function renderAuthState() {
  const loggedIn = Boolean(state.user);
  el.authActions.hidden = loggedIn;
  el.authUser.hidden = !loggedIn;
  if (loggedIn) {
    const email = state.user.email ? ` · ${state.user.email}` : "";
    el.authUserLabel.textContent = `Συνδεδεμένος: ${state.user.name}${email}`;
    closeAuth();
    return;
  }
  el.authUserLabel.textContent = "";
}

function moduleStatus(moduleId) {
  return state.adaptivePath?.find((item) => item.module_id === moduleId);
}

async function loadContent() {
  const userParam = state.user ? `?user_id=${state.user.id}` : "";
  const data = await api(`/api/content${userParam}`);
  state.modules = data.modules;
  state.adaptivePath = data.adaptive_path;
  renderModuleSelect();
  renderLesson();
  await loadQuiz("module");
  await loadReport();
}

async function selectModule(moduleId) {
  if (moduleId === state.activeModuleId) return;
  await saveVisit();
  state.activeModuleId = moduleId;
  renderModuleSelect();
  renderLesson();
  await loadQuiz("module");
}

function renderModuleSelect() {
  el.moduleSelect.innerHTML = state.modules
    .map((module) => {
      const label = `${module.title} · ${module.level} · ${module.estimated_minutes}'`;
      return `<option value="${module.id}" ${module.id === state.activeModuleId ? "selected" : ""}>${label}</option>`;
    })
    .join("");
  const active = state.modules.find((module) => module.id === state.activeModuleId);
  if (active) {
    el.moduleSummary.textContent = `${active.level} · ${active.estimated_minutes}' · ${(active.activities || []).length} δραστηριότητες · ${(active.key_terms || []).length} όροι`;
  }
}

function renderLesson() {
  const module = state.modules.find((item) => item.id === state.activeModuleId);
  const status = moduleStatus(module.id);
  const adaptiveText =
    status?.action === "review"
      ? module.remedial
      : status?.action === "challenge"
        ? module.challenge
        : "Ολοκλήρωσε τη θεωρία και απάντησε στο quiz για να ενημερωθεί η εξατομικευμένη διαδρομή.";

  const outcomesHtml = (module.outcomes || [])
    .map((outcome) => `<li>${outcome}</li>`)
    .join("");
  const keyTermsHtml = (module.key_terms || [])
    .map((term) => `<span class="term-chip">${term}</span>`)
    .join("");
  const practiceHtml = (module.practice_tasks || [])
    .map((task) => `<li>${task}</li>`)
    .join("");
  const projectHtml = module.mini_project
    ? `
      <section class="project-card">
        <div>
          <p class="section-kicker">Mini project</p>
          <h3>${module.mini_project.title}</h3>
          <p>${module.mini_project.description}</p>
        </div>
        <ol>
          ${(module.mini_project.steps || []).map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>
    `
    : "";
  const guideSteps = [
    ["1", "Μελέτη", "Διάβασε τα μαθησιακά αποτελέσματα και τη θεωρία."],
    ["2", "Εξάσκηση", "Κάνε τις πρακτικές εργασίες και τις δραστηριότητες."],
    ["3", "Project", "Σύνδεσε τις έννοιες στο mini project."],
    ["4", "Quiz", "Ολοκλήρωσε την αυτοαξιολόγηση και δες την πρόοδο."],
  ]
    .map(
      ([number, title, text]) => `
        <div class="guide-step" data-step="${number}">
          <span>${number}</span>
          <strong>${title}</strong>
          <small>${text}</small>
        </div>
      `,
    )
    .join("");

  const activitiesHtml = (module.activities || [])
    .map(
      (activity) => `
        <div class="activity" data-title="${escapeHtml(activity.title)}">
          <h4>${activity.title}</h4>
          <p>${activity.task}</p>
          <textarea class="activity-answer" rows="4" placeholder="Γράψε εδώ την απάντησή σου"></textarea>
          <div class="activity-actions">
            <button type="button" class="activity-check" data-terms="${escapeHtml(encodeURIComponent(JSON.stringify(activity.checks || [])))}">Έλεγχος</button>
            <span class="activity-feedback" aria-live="polite"></span>
          </div>
          <details>
            <summary>Ενδεικτική λύση</summary>
            <pre><code>${escapeHtml(activity.solution)}</code></pre>
          </details>
        </div>
      `,
    )
    .join("");

  el.lesson.innerHTML = `
    <div class="lesson-header">
      <div>
        <h2>${module.title}</h2>
        <p>${module.goal}</p>
      </div>
      <span class="badge">${module.level} · ${module.estimated_minutes}'</span>
    </div>
    <section class="guide-strip">${guideSteps}</section>
    <section class="lesson-map">
      <div>
        <h3>Μαθησιακά αποτελέσματα</h3>
        <ul>${outcomesHtml}</ul>
      </div>
      <div>
        <h3>Όροι-κλειδιά</h3>
        <div class="term-list">${keyTermsHtml}</div>
      </div>
    </section>
    ${module.content
      .map(
        (block, index) => `
          <details class="content-block" ${index === 0 ? "open" : ""}>
            <summary>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h3>${block.heading}</h3>
            </summary>
            <p>${block.body}</p>
            <pre><code>${escapeHtml(block.code)}</code></pre>
          </details>
        `,
      )
      .join("")}
    <section class="practice-panel">
      <h3>Πρακτική εξάσκηση</h3>
      <ul>${practiceHtml}</ul>
    </section>
    ${projectHtml}
    <section class="activities">
      <h3>Δραστηριότητες εξάσκησης</h3>
      ${activitiesHtml}
    </section>
    <p class="adaptive-note"><strong>Προσαρμοσμένη πρόταση:</strong> ${adaptiveText}</p>
  `;
}

async function loadQuiz(type) {
  state.activeQuizType = type;
  state.quizStartedAt = Date.now();
  const id = type === "review" ? "review" : state.activeModuleId;
  const data = await api(`/api/quiz/${id}`);
  el.quizTitle.textContent = type === "review" ? "Επαναληπτικό Quiz" : "Quiz ενότητας";
  el.quizResult.innerHTML = "";
  el.quizForm.innerHTML = data.questions
    .map(
      (question, index) => `
        <fieldset class="question">
          <p>${index + 1}. ${question.prompt}</p>
          ${question.options
            .map(
              (option) => `
                <label class="option">
                  <input type="radio" name="${question.id}" value="${escapeHtml(option)}" required>
                  ${option}
                </label>
              `,
            )
            .join("")}
          <small class="hint">Hint: ${question.hint}</small>
        </fieldset>
      `,
    )
    .join("");
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Υποβολή απαντήσεων";
  el.quizForm.appendChild(submit);
}

async function saveVisit() {
  if (!state.user) return;
  const seconds = Math.max(5, Math.round((Date.now() - state.quizStartedAt) / 1000));
  await api("/api/visit", {
    method: "POST",
    body: JSON.stringify({
      user_id: state.user.id,
      module_id: state.activeModuleId,
      seconds,
    }),
  });
}

async function loadReport() {
  if (!state.user) {
    renderPath([]);
    el.averageScore.textContent = "0%";
    el.attemptCount.textContent = "0";
    el.activityCount.textContent = "0";
    el.completedCount.textContent = `0/${state.modules.length || 0}`;
    el.studyTime.textContent = "0'";
    el.reportBars.innerHTML = "";
    renderReportDetails(null);
    return;
  }
  const report = await api(`/api/report?user_id=${state.user.id}`);
  state.adaptivePath = report.adaptive_path;
  el.averageScore.textContent = `${report.average}%`;
  el.attemptCount.textContent = report.attempts.length;
  el.activityCount.textContent = report.activity_attempts?.length || 0;
  el.completedCount.textContent = `${report.completed_modules}/${report.total_modules}`;
  el.studyTime.textContent = formatStudyTime(report.total_study_seconds || 0);
  renderPath(report.adaptive_path);
  renderBars(report.adaptive_path);
  renderReportDetails(report);
}

function renderPath(path) {
  const source = path.length
    ? path
    : state.modules.map((module, index) => ({
        module_id: module.id,
        status: index === 0 ? "Σύνδεση μαθητή για καταγραφή" : "Αναμονή προόδου",
        score: null,
        visits: 0,
        action: "study",
      }));
  el.pathList.innerHTML = source
    .map((item) => {
      const module = state.modules.find((entry) => entry.id === item.module_id);
      const score = item.score === null || item.score === undefined ? "χωρίς quiz" : `${item.score}%`;
      return `
        <div class="path-item path-${item.action || "study"}">
          <strong>${module?.title || item.module_id}</strong>
          <small>${item.status} · Επίδοση: ${score} · Επισκέψεις: ${item.visits}</small>
        </div>
      `;
    })
    .join("");
}

function renderBars(path) {
  el.reportBars.innerHTML = path
    .map((item) => {
      const module = state.modules.find((entry) => entry.id === item.module_id);
      const score = item.score || 0;
      return `
        <div class="bar">
          <label><span>${module?.title || item.module_id}</span><span>${score}%</span></label>
          <div class="bar-track"><div class="bar-fill" style="width: ${score}%"></div></div>
        </div>
      `;
    })
    .join("");
}

function renderReportDetails(report) {
  if (!report) {
    el.reportDetails.innerHTML = `
      <div class="empty-report">
        Ξεκίνα με όνομα μαθητή για να εμφανιστούν αναλυτικές αναφορές.
      </div>
    `;
    return;
  }

  const recent = (report.recent_attempts || [])
    .map((attempt) => {
      const module = state.modules.find((entry) => entry.id === attempt.module_id);
      const percent = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
      return `<li><strong>${module?.title || attempt.module_id}</strong><span>${percent}% · ${attempt.quiz_type === "review" ? "Επανάληψη" : "Ενότητα"}</span></li>`;
    })
    .join("");

  const errors = (report.common_errors || [])
    .map((error) => `<li><strong>${error.mistakes}x</strong><span>${error.prompt}</span></li>`)
    .join("");

  const difficulties = (report.activity_difficulties || [])
    .map((item) => `<li><strong>${item.misses}x</strong><span>${item.activity_title}</span></li>`)
    .join("");

  el.reportDetails.innerHTML = `
    <section class="report-block">
      <h3>Πρόσφατες προσπάθειες</h3>
      <ul>${recent || "<li><span>Δεν υπάρχουν ακόμη προσπάθειες quiz.</span></li>"}</ul>
    </section>
    <section class="report-block">
      <h3>Συχνότερα λάθη</h3>
      <ul>${errors || "<li><span>Δεν έχουν καταγραφεί λάθη.</span></li>"}</ul>
    </section>
    <section class="report-block">
      <h3>Σημεία δυσκολίας</h3>
      <ul>${difficulties || "<li><span>Δεν έχουν καταγραφεί δυσκολίες σε δραστηριότητες.</span></li>"}</ul>
    </section>
  `;
}

function formatStudyTime(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}'`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}ω ${rest}'`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

el.userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  el.authMessage.textContent = "";
  const name = el.nameInput.value.trim() || "Μαθητής";
  const email = el.emailInput.value.trim();
  const password = el.passwordInput.value;
  state.authMode = el.authModeInput.value || state.authMode;
  try {
    state.user = await api("/api/users", {
      method: "POST",
      body: JSON.stringify({ mode: state.authMode, name, email, password }),
    });
    el.passwordInput.value = "";
    localStorage.setItem("jsTutorUser", JSON.stringify(state.user));
    renderAuthState();
    await loadContent();
  } catch (error) {
    if (state.authMode === "login" && error.status === 404) {
      el.authMessage.textContent = "Δεν βρέθηκε χρήστης με αυτό το email. Κάνε πρώτα εγγραφή.";
    } else if (state.authMode === "login" && error.status === 401) {
      el.authMessage.textContent = "Λάθος κωδικός. Δοκίμασε ξανά.";
    } else if (state.authMode === "register" && error.status === 409) {
      el.authMessage.textContent = "Υπάρχει ήδη λογαριασμός με αυτό το email. Κάνε είσοδο.";
    } else {
      el.authMessage.textContent = "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.";
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#login-open")) {
    openAuth("login");
  }
  if (event.target.closest("#register-open")) {
    openAuth("register");
  }
});
el.authClose.addEventListener("click", closeAuth);

el.logoutBtn.addEventListener("click", async () => {
  await saveVisit();
  localStorage.removeItem("jsTutorUser");
  state.user = null;
  renderAuthState();
  await loadContent();
});

el.quizForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) {
    el.quizResult.textContent = "Πρώτα γράψε όνομα μαθητή για να αποθηκευτεί η πρόοδος.";
    return;
  }

  const formData = new FormData(el.quizForm);
  const answers = {};
  for (const [key, value] of formData.entries()) {
    answers[key] = value;
  }

  await saveVisit();
  const seconds = Math.round((Date.now() - state.quizStartedAt) / 1000);
  const result = await api("/api/quiz/submit", {
    method: "POST",
    body: JSON.stringify({
      user_id: state.user.id,
      module_id: state.activeQuizType === "review" ? "review" : state.activeModuleId,
      quiz_type: state.activeQuizType,
      answers,
      seconds,
    }),
  });

  el.quizResult.innerHTML = `
    <h3>Αποτέλεσμα: ${result.score}/${result.total} (${result.percentage}%)</h3>
    <p>${result.recommendation}</p>
    ${result.details
      .map(
        (detail) => `
          <p class="${detail.is_correct ? "correct" : "wrong"}">
            ${detail.is_correct ? "Σωστό" : "Λάθος"}: ${detail.explanation}
          </p>
        `,
      )
      .join("")}
  `;
  await loadReport();
  renderLesson();
});

el.reviewBtn.addEventListener("click", () => loadQuiz("review"));

el.moduleSelect.addEventListener("change", (event) => {
  selectModule(event.target.value);
});

el.lesson.addEventListener("click", async (event) => {
  const button = event.target.closest(".activity-check");
  if (!button) return;

  const activity = button.closest(".activity");
  const answerRaw = activity.querySelector(".activity-answer").value;
  const answer = answerRaw.toLowerCase();
  const feedback = activity.querySelector(".activity-feedback");
  const terms = JSON.parse(decodeURIComponent(button.dataset.terms || "%5B%5D"));
  const missing = terms.filter((term) => !answer.includes(String(term).toLowerCase()));

  if (!answer.trim()) {
    feedback.className = "activity-feedback wrong";
    feedback.textContent = "Γράψε πρώτα μία απάντηση.";
    return;
  }

  if (state.user) {
    try {
      await api("/api/activity/submit", {
        method: "POST",
        body: JSON.stringify({
          user_id: state.user.id,
          module_id: state.activeModuleId,
          title: activity.dataset.title,
          answer: answerRaw,
          terms,
        }),
      });
      await loadReport();
    } catch (error) {
      feedback.className = "activity-feedback wrong";
      feedback.textContent = "Η απάντηση ελέγχθηκε, αλλά δεν αποθηκεύτηκε στη βάση.";
      return;
    }
  }

  if (missing.length === 0) {
    feedback.className = "activity-feedback correct";
    feedback.textContent = "Η απάντηση περιέχει τα βασικά σημεία.";
  } else {
    feedback.className = "activity-feedback wrong";
    feedback.textContent = `Λείπουν βασικά σημεία: ${missing.join(", ")}`;
  }
});

if (state.user) {
  el.nameInput.value = state.user.name;
  el.emailInput.value = state.user.email || "";
}

renderAuthState();

loadContent().catch((error) => {
  el.lesson.innerHTML = `<p>Σφάλμα φόρτωσης: ${error.message}</p>`;
});
