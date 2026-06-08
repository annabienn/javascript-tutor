const authEl = {
  form: document.querySelector("#user-form"),
  nameInput: document.querySelector("#name-input"),
  emailInput: document.querySelector("#email-input"),
  passwordInput: document.querySelector("#password-input"),
  modeInput: document.querySelector("#auth-mode-input"),
  title: document.querySelector("#auth-title"),
  submit: document.querySelector("#auth-submit"),
  message: document.querySelector("#auth-message"),
  nameField: document.querySelector("#name-field"),
  loginOpen: document.querySelector("#login-open"),
  registerOpen: document.querySelector("#register-open"),
  preview: document.querySelector("#landing-preview"),
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
  authEl.modeInput.value = mode;
  authEl.message.textContent = "";
  authEl.loginOpen.classList.toggle("active-auth-mode", mode === "login");
  authEl.registerOpen.classList.toggle("active-auth-mode", mode === "register");
  authEl.title.textContent = mode === "register" ? "Εγγραφή μαθητή" : "Είσοδος μαθητή";
  authEl.submit.textContent = mode === "register" ? "Δημιουργία λογαριασμού" : "Σύνδεση";
  authEl.nameField.hidden = mode !== "register";
  authEl.nameInput.required = mode === "register";
  authEl.passwordInput.autocomplete = mode === "register" ? "new-password" : "current-password";
  (mode === "register" ? authEl.nameInput : authEl.emailInput).focus();
}

function renderPreview(modules) {
  authEl.preview.innerHTML = modules
    .map((module, index) => {
      const summary = module.content?.[0]?.body || module.goal;
      return `
        <article class="preview-card">
          <div class="preview-card-top">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <small>${module.level}</small>
              <small>${module.estimated_minutes}'</small>
            </div>
          </div>
          <h3>${module.title}</h3>
          <p>${summary}</p>
          <div class="preview-progress" aria-hidden="true"><span style="width: ${Math.min(100, 22 + index * 11)}%"></span></div>
        </article>
      `;
    })
    .join("");
}

authEl.loginOpen.addEventListener("click", () => openAuth("login"));
authEl.registerOpen.addEventListener("click", () => openAuth("register"));

authEl.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  authEl.message.textContent = "";
  const mode = authEl.modeInput.value || "login";
  const name = authEl.nameInput.value.trim() || "Μαθητής";
  const email = authEl.emailInput.value.trim();
  const password = authEl.passwordInput.value;

  try {
    const user = await api("/api/users", {
      method: "POST",
      body: JSON.stringify({ mode, name, email, password }),
    });
    sessionStorage.setItem("jsTutorUser", JSON.stringify(user));
    window.location.href = "/app.html?v=20260608";
  } catch (error) {
    if (mode === "login" && error.status === 404) {
      authEl.message.textContent = "Δεν βρέθηκε χρήστης με αυτό το email. Κάνε πρώτα εγγραφή.";
    } else if (mode === "login" && error.status === 401) {
      authEl.message.textContent = "Λάθος κωδικός. Δοκίμασε ξανά.";
    } else if (mode === "register" && error.status === 409) {
      authEl.message.textContent = "Υπάρχει ήδη λογαριασμός με αυτό το email. Κάνε είσοδο.";
    } else {
      authEl.message.textContent = "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.";
    }
  }
});

openAuth("login");
api("/api/content")
  .then((data) => renderPreview(data.modules || []))
  .catch(() => {
    authEl.preview.innerHTML = `<p class="locked-note">Δεν ήταν δυνατή η φόρτωση των περιλήψεων.</p>`;
  });
