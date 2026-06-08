function storedUser() {
  try {
    const user = JSON.parse(sessionStorage.getItem("jsTutorUser") || "null");
    return user && user.id ? user : null;
  } catch (error) {
    sessionStorage.removeItem("jsTutorUser");
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
  appTopbar: document.querySelector("#app-topbar"),
  appLayout: document.querySelector("#app-layout"),
  authUser: document.querySelector("#auth-user"),
  authUserLabel: document.querySelector("#auth-user-label"),
  logoutBtn: document.querySelector("#logout-btn"),
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

function renderAuthState() {
  const email = state.user.email ? ` · ${state.user.email}` : "";
  el.authUserLabel.textContent = `Συνδεδεμένος: ${state.user.name}${email}`;
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

function studyNotesForModule(module) {
  const notes = {
    intro: {
      focus: "Η JavaScript δίνει συμπεριφορά στη σελίδα. Πριν πας στο quiz, πρέπει να μπορείς να ξεχωρίζεις καθαρά τι κάνει η HTML, τι κάνει η CSS και τι αναλαμβάνει η JavaScript.",
      method: "Διάβασε πρώτα τα παραδείγματα σαν σενάρια χρήσης: ο χρήστης πατάει ένα κουμπί, η σελίδα διαβάζει το συμβάν και μετά εμφανίζει αποτέλεσμα. Μετά δοκίμασε να αλλάξεις τα μηνύματα στα snippets.",
      beforeQuiz: "Αν μπορείς να εξηγήσεις με μία πρόταση τι είναι event, console και browser, είσαι έτοιμος για την αξιολόγηση.",
    },
    basics: {
      focus: "Οι μεταβλητές κρατούν δεδομένα, οι τύποι εξηγούν τι είδους δεδομένα είναι και οι συνθήκες αποφασίζουν ποια διαδρομή θα ακολουθήσει το πρόγραμμα.",
      method: "Για κάθε παράδειγμα, σημείωσε ποια τιμή αλλάζει, ποια μένει σταθερή και ποια σύγκριση οδηγεί στο τελικό μήνυμα. Δώσε ιδιαίτερη προσοχή στη διαφορά =, == και ===.",
      beforeQuiz: "Πριν το quiz, δοκίμασε τρεις διαφορετικές τιμές score και πρόβλεψε μόνος σου ποιο branch του if/else θα εκτελεστεί.",
    },
    functions: {
      focus: "Οι συναρτήσεις οργανώνουν επαναχρησιμοποιήσιμη λογική. Η βασική ιδέα είναι είσοδος, επεξεργασία και αποτέλεσμα.",
      method: "Διάβασε κάθε function ψάχνοντας πρώτα τις παραμέτρους και μετά το return. Μην αποστηθίζεις τη σύνταξη μόνο, προσπάθησε να περιγράψεις τι πρόβλημα λύνει η συνάρτηση.",
      beforeQuiz: "Είσαι έτοιμος όταν μπορείς να γράψεις μία function που παίρνει βαθμό και επιστρέφει μήνυμα feedback χωρίς να επαναλαμβάνεις τον ίδιο κώδικα.",
    },
    arrays: {
      focus: "Οι πίνακες κρατούν πολλές τιμές μαζί και τα loops επιτρέπουν να εφαρμόσεις την ίδια λογική σε κάθε στοιχείο.",
      method: "Ακολούθησε νοητά το loop βήμα βήμα: ποιο είναι το πρώτο στοιχείο, ποια μεταβλητή αλλάζει, πότε σταματάει η επανάληψη και τι αποτέλεσμα παράγεται.",
      beforeQuiz: "Πριν προχωρήσεις, βεβαιώσου ότι μπορείς να υπολογίσεις μέσο όρο βαθμών από έναν πίνακα και να εξηγήσεις γιατί ένα loop είναι καλύτερο από επανάληψη χειροκίνητων εντολών.",
    },
    objects: {
      focus: "Τα objects μοντελοποιούν πραγματικές οντότητες με ιδιότητες, ενώ το JSON είναι μορφή ανταλλαγής δεδομένων που χρησιμοποιείται πολύ σε web εφαρμογές.",
      method: "Διάβασε κάθε object σαν καρτέλα πληροφοριών. Βρες τα property names, τις τιμές τους και μετά δες πώς η function χρησιμοποιεί αυτά τα δεδομένα.",
      beforeQuiz: "Είσαι έτοιμος όταν μπορείς να σχεδιάσεις object για ερώτηση quiz με prompt, options και σωστή απάντηση.",
    },
    dom_async: {
      focus: "Το DOM συνδέει τον κώδικα με τα στοιχεία της σελίδας, τα events καταγράφουν ενέργειες χρήστη και το async επιτρέπει επικοινωνία με δεδομένα χωρίς να παγώνει η εφαρμογή.",
      method: "Για κάθε snippet, εντόπισε πρώτα ποιο στοιχείο επιλέγεται, μετά ποιο event ακούει ο κώδικας και τέλος τι αλλάζει στη σελίδα ή ποια δεδομένα φορτώνονται.",
      beforeQuiz: "Πριν το quiz, πρέπει να μπορείς να εξηγήσεις τη σειρά: selector, event listener, callback, αλλαγή DOM ή fetch.",
    },
    debug_project: {
      focus: "Το debugging είναι διαδικασία εντοπισμού αιτίας, όχι απλή δοκιμή στην τύχη. Το τελικό project συνδυάζει δεδομένα, UI, events, έλεγχο απαντήσεων και αποθήκευση προόδου.",
      method: "Όταν βλέπεις λάθος, διάβασε πρώτα το μήνυμα, εντόπισε τη γραμμή, τύπωσε ενδιάμεσες τιμές με console.log και επιβεβαίωσε αν η πραγματική συμπεριφορά ταιριάζει με την αναμενόμενη.",
      beforeQuiz: "Είσαι έτοιμος όταν μπορείς να περιγράψεις πώς θα έφτιαχνες ένα μικρό quiz app από την αρχή μέχρι την αποθήκευση σκορ.",
    },
  };

  const fallback = {
    focus: module.goal,
    method: "Διάβασε την ενότητα σε μικρά βήματα, εκτέλεσε τα παραδείγματα και κράτησε σημειώσεις για τις έννοιες που εμφανίζονται συχνότερα.",
    beforeQuiz: "Πριν πας στο quiz, προσπάθησε να εξηγήσεις τους βασικούς όρους χωρίς να κοιτάς τη θεωρία.",
  };

  return notes[module.id] || fallback;
}

function extendedTheoryForModule(module) {
  const theory = {
    intro: [
      ["Βασική ιδέα", "Η JavaScript δεν είναι απλώς ένας τρόπος να γράφουμε εντολές. Είναι η γλώσσα που δίνει ζωή στη σελίδα: διαβάζει ενέργειες του χρήστη, αλλάζει περιεχόμενο, εμφανίζει μηνύματα και επικοινωνεί με δεδομένα. Σκέψου τη HTML ως σκελετό, τη CSS ως εμφάνιση και τη JavaScript ως συμπεριφορά."],
      ["Παράδειγμα χρήσης", "Σε μία φόρμα εγγραφής, η HTML περιέχει τα πεδία, η CSS τα κάνει ευανάγνωστα και η JavaScript ελέγχει αν το email είναι σωστό, αν ο κωδικός έχει αρκετούς χαρακτήρες και αν πρέπει να εμφανιστεί μήνυμα επιτυχίας ή λάθους."],
      ["Συχνή παρεξήγηση", "Πολλοί αρχάριοι πιστεύουν ότι η JavaScript αλλάζει μόνο χρώματα ή εμφανίζει alerts. Στην πράξη μπορεί να χειριστεί σύνθετη λογική, αποθήκευση, API, quiz, παιχνίδια και ολόκληρες εφαρμογές."],
      ["Πριν το quiz", "Να μπορείς να κοιτάξεις ένα μικρό σενάριο και να πεις ποιο μέρος ανήκει στη HTML, ποιο στη CSS και ποιο στη JavaScript."],
    ],
    basics: [
      ["Βασική ιδέα", "Ένα πρόγραμμα χρειάζεται μνήμη για να κρατά πληροφορίες. Οι μεταβλητές είναι ο τρόπος με τον οποίο ονομάζουμε αυτές τις πληροφορίες, ώστε να μπορούμε να τις ξαναχρησιμοποιούμε και να τις αλλάζουμε όταν χρειάζεται."],
      ["Τύποι δεδομένων", "Το string είναι κείμενο, το number είναι αριθμός, το boolean είναι αλήθεια ή ψέμα. Αν δεν προσέξεις τον τύπο, μπορεί να συγκρίνεις τιμές που μοιάζουν ίδιες αλλά δεν είναι, όπως το '5' και το 5."],
      ["Συνθήκες", "Με το if/else το πρόγραμμα παίρνει αποφάσεις. Σε εκπαιδευτικό λογισμικό, αυτό μπορεί να σημαίνει: αν ο χρήστης πέτυχε υψηλό σκορ, προτείνεται προχωρημένη άσκηση, αλλιώς προτείνεται επανάληψη."],
      ["Πριν το quiz", "Να μπορείς να προβλέψεις τι θα εμφανιστεί όταν αλλάζει μία τιμή, για παράδειγμα όταν score = 45 ή score = 90."],
    ],
    functions: [
      ["Βασική ιδέα", "Μία συνάρτηση είναι ένα μικρό ανεξάρτητο κομμάτι λογικής με όνομα. Τη γράφουμε μία φορά και την καλούμε όσες φορές χρειάζεται. Έτσι ο κώδικας γίνεται πιο καθαρός και πιο εύκολος στη διόρθωση."],
      ["Παράμετροι και αποτέλεσμα", "Οι παράμετροι είναι οι τιμές που δίνουμε στη συνάρτηση. Το return είναι το αποτέλεσμα που επιστρέφει. Αν μία συνάρτηση ελέγχει βαθμό, η παράμετρος μπορεί να είναι το score και το αποτέλεσμα ένα μήνυμα feedback."],
      ["Συχνό λάθος", "Μην μπερδεύεις το console.log με το return. Το console.log εμφανίζει κάτι για έλεγχο, ενώ το return δίνει αποτέλεσμα που μπορεί να χρησιμοποιηθεί αλλού στο πρόγραμμα."],
      ["Πριν το quiz", "Να μπορείς να εξηγήσεις τι μπαίνει στη συνάρτηση, τι επεξεργάζεται και τι βγαίνει ως αποτέλεσμα."],
    ],
    arrays: [
      ["Βασική ιδέα", "Ένας πίνακας κρατά πολλές τιμές με μία σειρά. Αντί να έχεις score1, score2, score3, μπορείς να έχεις έναν πίνακα scores. Αυτό είναι πιο πρακτικό όταν τα δεδομένα μεγαλώνουν."],
      ["Loops", "Τα loops επιτρέπουν να περάσεις από όλα τα στοιχεία ενός πίνακα. Για παράδειγμα, μπορείς να υπολογίσεις πόσες σωστές απαντήσεις υπάρχουν ή ποιος είναι ο μέσος όρος των quiz."],
      ["Array methods", "Μέθοδοι όπως map, filter και reduce βοηθούν να μετατρέπεις, φιλτράρεις ή συνοψίζεις δεδομένα. Δεν είναι απαραίτητο να τις ξέρεις όλες από έξω, αλλά πρέπει να καταλαβαίνεις τι πρόβλημα λύνουν."],
      ["Πριν το quiz", "Να μπορείς να ακολουθήσεις βήμα βήμα ένα loop και να ξέρεις ποια τιμή εξετάζεται κάθε φορά."],
    ],
    objects: [
      ["Βασική ιδέα", "Ένα object ομαδοποιεί πληροφορίες που ανήκουν στην ίδια οντότητα. Για παράδειγμα, ένας μαθητής μπορεί να έχει name, email, score και completedModules."],
      ["Πρόσβαση σε δεδομένα", "Με το student.name παίρνεις την τιμή της ιδιότητας name. Αυτό κάνει τον κώδικα πιο κατανοητό, γιατί φαίνεται καθαρά ποια πληροφορία χρησιμοποιείται."],
      ["JSON", "Το JSON μοιάζει με object και χρησιμοποιείται για αποστολή δεδομένων ανάμεσα σε client και server. Όταν η εφαρμογή αποθηκεύει πρόοδο, συνήθως στέλνει δεδομένα σε μορφή JSON."],
      ["Πριν το quiz", "Να μπορείς να σχεδιάσεις ένα object για ερώτηση με κείμενο, επιλογές και σωστή απάντηση."],
    ],
    dom_async: [
      ["Βασική ιδέα", "Το DOM είναι ο τρόπος που η JavaScript βλέπει τη HTML ως αντικείμενα. Όταν επιλέγεις ένα κουμπί με querySelector, ουσιαστικά βρίσκεις ένα στοιχείο της σελίδας για να το αλλάξεις ή να του προσθέσεις συμπεριφορά."],
      ["Events", "Τα events είναι σήματα ότι κάτι έγινε: click, input, submit. Η JavaScript μπορεί να ακούει αυτά τα events και να τρέχει κώδικα όταν συμβούν."],
      ["Ασύγχρονη λογική", "Με fetch και async/await η εφαρμογή μπορεί να ζητήσει δεδομένα από server χωρίς να σταματήσει η σελίδα. Αυτό είναι σημαντικό για αναφορές προόδου, φόρτωση quiz και αποθήκευση απαντήσεων."],
      ["Πριν το quiz", "Να μπορείς να περιγράψεις τη σειρά: βρίσκω στοιχείο, ακούω event, εκτελώ callback, αλλάζω σελίδα ή στέλνω δεδομένα."],
    ],
    debug_project: [
      ["Βασική ιδέα", "Το debugging είναι συστηματική αναζήτηση του σημείου όπου η πραγματική συμπεριφορά διαφέρει από την αναμενόμενη. Δεν αλλάζουμε τυχαία κώδικα, αλλά ελέγχουμε υποθέσεις."],
      ["Τύποι λαθών", "Syntax error σημαίνει ότι ο κώδικας δεν είναι γραμματικά σωστός. Runtime error σημαίνει ότι ο κώδικας ξεκινά, αλλά αποτυγχάνει κατά την εκτέλεση. Logical error σημαίνει ότι τρέχει, αλλά δίνει λάθος αποτέλεσμα."],
      ["Τελικό project", "Ένα μικρό quiz app συνδυάζει όλες τις έννοιες: δεδομένα ερωτήσεων, rendering στο DOM, events για απαντήσεις, έλεγχο αποτελέσματος, feedback και αποθήκευση σκορ."],
      ["Πριν το quiz", "Να μπορείς να εξηγήσεις ποια δεδομένα χρειάζεται ένα quiz app και με ποια σειρά θα υλοποιούσες τα βασικά του βήματα."],
    ],
  };

  return theory[module.id] || [
    ["Βασική ιδέα", module.goal],
    ["Μελέτη", "Διάβασε τα παραδείγματα, εντόπισε τις μεταβλητές και προσπάθησε να εξηγήσεις τι αλλάζει σε κάθε βήμα."],
    ["Πριν το quiz", "Βεβαιώσου ότι μπορείς να απαντήσεις στους βασικούς όρους της ενότητας χωρίς να κοιτάς τη θεωρία."],
  ];
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
  const studyNotes = studyNotesForModule(module);
  const studyNotesHtml = `
    <section class="study-depth">
      <div class="study-depth-head">
        <p class="section-kicker">Μάθημα / Διάβασμα</p>
        <h3>Προετοιμασία πριν την αξιολόγηση</h3>
        <p>Διάβασε αυτά τα σημεία πριν απαντήσεις στις ασκήσεις και στο quiz της ενότητας.</p>
      </div>
      <div class="study-note-grid">
        <article class="study-note">
          <span>01</span>
          <h4>Τι πρέπει να καταλάβεις</h4>
          <p>${studyNotes.focus}</p>
        </article>
        <article class="study-note">
          <span>02</span>
          <h4>Πώς να το μελετήσεις</h4>
          <p>${studyNotes.method}</p>
        </article>
        <article class="study-note">
          <span>03</span>
          <h4>Έλεγχος ετοιμότητας</h4>
          <p>${studyNotes.beforeQuiz}</p>
        </article>
      </div>
    </section>
  `;
  const extendedTheoryHtml = `
    <section class="extended-theory">
      <div class="study-depth-head">
        <p class="section-kicker">Αναλυτική θεωρία</p>
        <h3>Περισσότερη εξήγηση με απλά βήματα</h3>
        <p>Αυτό το κομμάτι σε βοηθά να καταλάβεις την έννοια πριν περάσεις σε πρακτική εξάσκηση και αυτοαξιολόγηση.</p>
      </div>
      <div class="theory-grid">
        ${extendedTheoryForModule(module)
          .map(
            ([title, text], index) => `
              <article class="theory-card">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h4>${title}</h4>
                <p>${text}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
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
          ${
            state.user
              ? `
                <textarea class="activity-answer" rows="4" placeholder="Γράψε εδώ την απάντησή σου"></textarea>
                <div class="activity-actions">
                  <button type="button" class="activity-check" data-terms="${escapeHtml(encodeURIComponent(JSON.stringify(activity.checks || [])))}">Έλεγχος</button>
                  <span class="activity-feedback" aria-live="polite"></span>
                </div>
              `
              : `<p class="locked-note">Συνδέσου ή κάνε εγγραφή για να υποβάλεις απάντηση και να καταγραφεί η πρόοδός σου.</p>`
          }
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
    ${studyNotesHtml}
    ${extendedTheoryHtml}
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
  if (!state.user) {
    el.quizTitle.textContent = type === "review" ? "Επαναληπτικό Quiz" : "Quiz ενότητας";
    el.quizResult.innerHTML = "";
    el.quizForm.innerHTML = `
      <div class="quiz-locked">
        <h3>Το quiz είναι διαθέσιμο μετά τη σύνδεση</h3>
        <p>Κάνε είσοδο ή εγγραφή για να απαντήσεις, να αποθηκευτούν οι επιλογές σου και να ενημερωθούν τα στατιστικά προόδου.</p>
        <button type="button" onclick="window.showAuthFallback && window.showAuthFallback('login')">Είσοδος</button>
      </div>
    `;
    return;
  }
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

el.logoutBtn.addEventListener("click", async () => {
  await saveVisit();
  sessionStorage.removeItem("jsTutorUser");
  state.user = null;
  window.location.href = "/";
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

if (!state.user) {
  window.location.href = "/";
} else {
  renderAuthState();
  loadContent().catch((error) => {
    el.lesson.innerHTML = `<p>Σφάλμα φόρτωσης: ${error.message}</p>`;
  });
}
