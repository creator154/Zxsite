const app = document.getElementById("app");
const search = document.getElementById("search");
const menuBtn = document.getElementById("menuBtn");
const menuPopup = document.getElementById("menuPopup");

const api = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

let currentBatch = null;
let currentTest = null;
let timerInterval = null;
let remainingSeconds = 0;
let answers = {};

/* =========================
   MENU
========================= */

menuBtn.onclick = () => {
  menuPopup.classList.toggle("show");
};

document.addEventListener("click", (event) => {
  if (!event.target.closest(".toolbar")) {
    menuPopup.classList.remove("show");
  }
});

/* =========================
   HOME
========================= */

async function home() {
  clearInterval(timerInterval);

  menuPopup.classList.remove("show");
  search.value = "";

  app.innerHTML = `
    <div class="container">
      <div class="page-title">
        <h1>Test Series</h1>
        <p>Select your exam, medium and batch.</p>
      </div>

      <div class="filters">
        <button class="filter active" onclick="loadHome('ALL','ALL',this)">
          All
        </button>

        <button class="filter" onclick="loadHome('NEET','ALL',this)">
          NEET
        </button>

        <button class="filter" onclick="loadHome('JEE','ALL',this)">
          JEE
        </button>

        <button class="filter" onclick="loadHome('BOARDS','ALL',this)">
          Boards
        </button>
      </div>

      <div class="medium-switch">
        <button class="medium active" onclick="loadHome('ALL','ALL',this)">
          All Medium
        </button>

        <button class="medium" onclick="loadHome('ALL','English',this)">
          English Medium
        </button>

        <button class="medium" onclick="loadHome('ALL','Hindi',this)">
          Hindi Medium
        </button>
      </div>

      <div id="batchCatalog" class="batch-catalog">
        <div class="loading">Loading batches...</div>
      </div>
    </div>
  `;

  await loadHome("ALL", "ALL");
}

async function loadHome(exam = "ALL", medium = "ALL") {
  const box = document.getElementById("batchCatalog");

  if (!box) return;

  box.innerHTML = `
    <div class="loading">
      Loading batches...
    </div>
  `;

  let query = [];

  if (exam !== "ALL") {
    query.push(`exam=${encodeURIComponent(exam)}`);
  }

  if (medium !== "ALL") {
    query.push(`medium=${encodeURIComponent(medium)}`);
  }

  const url =
    "/api/batches" +
    (query.length ? "?" + query.join("&") : "");

  const batches = await api(url);

  if (!batches.length) {
    box.innerHTML = `
      <div class="empty">
        No batches found.
      </div>
    `;
    return;
  }

  const grouped = {};

  batches.forEach((batch) => {
    const key = `${batch.exam}-${batch.medium}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(batch);
  });

  box.innerHTML = Object.entries(grouped)
    .map(([key, items]) => {
      const [groupExam, groupMedium] = key.split("-");

      return `
        <section class="batch-section">

          <div class="batch-section-head">
            <div>
              <span class="section-label">
                ${esc(groupExam)}
              </span>

              <h2>
                ${esc(groupMedium)} Medium
              </h2>
            </div>

            <span class="batch-count">
              ${items.length} Batches
            </span>
          </div>

          <div class="batch-grid">
            ${items.map(batchCard).join("")}
          </div>

        </section>
      `;
    })
    .join("");
}

function batchCard(batch) {
  return `
    <button
      class="batch-card"
      onclick="batch('${esc(batch.id)}')"
    >

      <div class="batch-card-top">
        <span class="batch-exam">
          ${esc(batch.exam)}
        </span>

        <span class="batch-medium">
          ${esc(batch.medium)}
        </span>
      </div>

      <h3>
        ${esc(batch.name)}
      </h3>

      <div class="batch-bottom">
        <span>
          ${batch.count} Tests
        </span>

        <b>›</b>
      </div>

    </button>
  `;
}

/* =========================
   BATCH PAGE
========================= */

async function batch(id) {
  clearInterval(timerInterval);

  const batches = await api("/api/batches");
  const selected = batches.find((b) => b.id === id);

  if (!selected) {
    home();
    return;
  }

  currentBatch = selected;

  const tests = await api(
    `/api/batches/${encodeURIComponent(id)}/tests`
  );

  app.innerHTML = `
    <div class="page">

      <button class="back" onclick="home()">
        ← Back
      </button>

      <div class="batch-hero">

        <span>
          ${esc(selected.exam)} •
          ${esc(selected.medium)} Medium
        </span>

        <h1>
          ${esc(selected.name)}
        </h1>

        <p>
          ${tests.length} available tests
        </p>

      </div>

      <h2 class="section-heading">
        Available Tests
      </h2>

      <div class="tests-list">
        ${
          tests.length
            ? tests.map(testCard).join("")
            : `<div class="empty">No tests available.</div>`
        }
      </div>

    </div>
  `;
}

function testCard(test) {
  return `
    <article class="test-card">

      <div class="test-number">
        TEST
      </div>

      <h3>
        ${esc(test.name)}
      </h3>

      <div class="meta">

        <span>
          📝 ${test.questions} Questions
        </span>

        <span>
          ⏱ ${test.duration} Minutes
        </span>

        <span>
          📅 ${esc(test.date)}
        </span>

      </div>

      <div class="buttons">

        <button
          class="btn"
          onclick="instructions('${esc(test.id)}')"
        >
          Instructions
        </button>

        <button
          class="btn start"
          onclick="start('${esc(test.id)}')"
        >
          Start Test
        </button>

      </div>

    </article>
  `;
}

/* =========================
   INSTRUCTIONS
========================= */

async function instructions(id) {
  const test = await api(
    `/api/tests/${encodeURIComponent(id)}`
  );

  currentTest = test;

  app.innerHTML = `
    <div class="page">

      <button
        class="back"
        onclick="batch('${esc(test.batch.id)}')"
      >
        ← Back
      </button>

      <div class="instruction-card">

        <span class="section-label">
          ${esc(test.batch.exam)}
        </span>

        <h1>
          Test Instructions
        </h1>

        <h2>
          ${esc(test.name)}
        </h2>

        <div class="instruction-info">

          <span>
            ${test.questions} Questions
          </span>

          <span>
            ${test.duration} Minutes
          </span>

          <span>
            ${esc(test.batch.medium)} Medium
          </span>

        </div>

        <h3>
          Instructions
        </h3>

        <ul>
          ${test.instructions
            .map((item) => `<li>${esc(item)}</li>`)
            .join("")}
        </ul>

        <button
          class="btn start full"
          onclick="start('${esc(id)}')"
        >
          Start Test
        </button>

      </div>

    </div>
  `;
}

/* =========================
   START TEST
========================= */

async function start(id) {
  clearInterval(timerInterval);

  const test = await api(
    `/api/tests/${encodeURIComponent(id)}`
  );

  currentTest = test;
  answers = {};

  const totalQuestions = Math.min(
    10,
    test.questions
  );

  remainingSeconds = test.duration * 60;

  app.innerHTML = `
    <div class="exam-page">

      <div class="exam-header">

        <div>
          <small>
            ${esc(test.batch.name)}
          </small>

          <h2>
            ${esc(test.name)}
          </h2>
        </div>

        <div
          id="timer"
          class="timer"
        >
          ${formatTime(remainingSeconds)}
        </div>

      </div>

      <div class="question-layout">

        <main id="questions">
          ${Array.from(
            { length: totalQuestions },
            (_, index) =>
              questionHTML(index + 1)
          ).join("")}
        </main>

        <aside class="question-nav">

          <h3>
            Questions
          </h3>

          <div class="question-buttons">
            ${Array.from(
              { length: totalQuestions },
              (_, index) => `
                <button
                  onclick="scrollToQuestion(${index + 1})"
                  id="nav-${index + 1}"
                >
                  ${index + 1}
                </button>
              `
            ).join("")}
          </div>

        </aside>

      </div>

      <button
        class="submit-test"
        onclick="submitTest()"
      >
        Submit Test
      </button>

    </div>
  `;

  startTimer();
}

function questionHTML(number) {
  const options = [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ];

  return `
    <article
      class="question"
      id="question-${number}"
    >

      <div class="question-title">
        <span>Q${number}</span>

        <h3>
          Sample practice question ${number}
        </h3>
      </div>

      <div class="options">

        ${options
          .map(
            (option, index) => `
              <label>

                <input
                  type="radio"
                  name="q${number}"
                  value="${index}"
                  onchange="saveAnswer(${number},${index})"
                >

                <span>
                  ${String.fromCharCode(65 + index)}.
                  ${option}
                </span>

              </label>
            `
          )
          .join("")}

      </div>

    </article>
  `;
}

/* =========================
   TIMER
========================= */

function startTimer() {
  updateTimer();

  timerInterval = setInterval(() => {
    remainingSeconds--;

    updateTimer();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      submitTest(true);
    }
  }, 1000);
}

function updateTimer() {
  const timer = document.getElementById("timer");

  if (!timer) return;

  timer.textContent =
    formatTime(remainingSeconds);

  if (remainingSeconds <= 60) {
    timer.classList.add("danger");
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, "0")}:${String(
    sec
  ).padStart(2, "0")}`;
}

/* =========================
   ANSWERS
========================= */

function saveAnswer(question, answer) {
  answers[question] = answer;

  const nav = document.getElementById(
    `nav-${question}`
  );

  if (nav) {
    nav.classList.add("answered");
  }
}

function scrollToQuestion(number) {
  document
    .getElementById(`question-${number}`)
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

/* =========================
   SUBMIT
========================= */

function submitTest(autoSubmit = false) {
  clearInterval(timerInterval);

  const total = document.querySelectorAll(
    ".question"
  ).length;

  const attempted = Object.keys(answers).length;

  const score = Math.round(
    (attempted / total) * 100
  );

  resultPage(
    score,
    total,
    attempted,
    autoSubmit
  );
}

function resultPage(
  score,
  total,
  attempted,
  autoSubmit
) {
  app.innerHTML = `
    <div class="page">

      <div class="result-card">

        <div class="result-icon">
          ✓
        </div>

        <h1>
          Test Submitted
        </h1>

        ${
          autoSubmit
            ? `<p class="auto-message">
                Time ended. Your test was submitted automatically.
              </p>`
            : ""
        }

        <div class="result-score">
          ${score}%
        </div>

        <div class="result-stats">

          <div>
            <strong>${total}</strong>
            <span>Total Questions</span>
          </div>

          <div>
            <strong>${attempted}</strong>
            <span>Attempted</span>
          </div>

          <div>
            <strong>${total - attempted}</strong>
            <span>Unattempted</span>
          </div>

        </div>

        <button
          class="btn start full"
          onclick="batch('${esc(currentTest.batch.id)}')"
        >
          Back to Tests
        </button>

        <button
          class="btn full"
          onclick="home()"
        >
          Home
        </button>

      </div>

    </div>
  `;
}

/* =========================
   SEARCH
========================= */

search.oninput = () => {
  clearTimeout(window.searchTimer);

  window.searchTimer = setTimeout(
    async () => {
      const query = search.value.trim();

      if (!query) {
        home();
        return;
      }

      const results = await api(
        `/api/batches?q=${encodeURIComponent(query)}`
      );

      app.innerHTML = `
        <div class="page">

          <button
            class="back"
            onclick="home()"
          >
            ← Home
          </button>

          <h1>
            Search Results
          </h1>

          <p class="page-sub">
            Batches matching "${esc(query)}"
          </p>

          <div class="batch-grid">

            ${
              results.length
                ? results.map(batchCard).join("")
                : `
                  <div class="empty">
                    No batches found.
                  </div>
                `
            }

          </div>

        </div>
      `;
    },
    200
  );
};

/* =========================
   MENU ITEMS
========================= */

menuPopup
  .querySelectorAll("[data-nav]")
  .forEach((button) => {
    button.onclick = () => {
      const nav = button.dataset.nav;

      if (nav === "home") {
        home();
      }

      if (nav === "dpps") {
        simplePage(
          "DPP's",
          "Daily Practice Problems"
        );
      }

      if (nav === "login") {
        simplePage(
          "Login",
          "Login system will be connected with backend."
        );
      }

      if (nav === "signup") {
        simplePage(
          "Sign Up",
          "Create your Zxsite account."
        );
      }
    };
  });

function simplePage(title, description) {
  menuPopup.classList.remove("show");

  app.innerHTML = `
    <div class="page">

      <button
        class="back"
        onclick="home()"
      >
        ← Home
      </button>

      <h1>${esc(title)}</h1>

      <p class="page-sub">
        ${esc(description)}
      </p>

      <div class="simple">
        <h2>
          ${esc(title)}
        </h2>

        <p>
          This section is ready for backend integration.
        </p>
      </div>

    </div>
  `;
}

/* =========================
   START
========================= */

home();
