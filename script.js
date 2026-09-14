// Lógica do simulado interativo V/F - Plantas Forrageiras

(function () {
  "use strict";

  // ---------- Estado ----------
  let sessionQuestions = []; // { ...questao, modulo, respondida:false, acertou:null, escolha:null }
  let currentIndex = 0;
  let score = 0;

  // ---------- Elementos ----------
  const screens = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
    review: document.getElementById("screen-review"),
  };

  const moduleChecksEl = document.getElementById("module-checks");
  const countInfoEl = document.getElementById("count-info");
  const btnStart = document.getElementById("btn-start");

  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const scoreText = document.getElementById("score-text");
  const questionModuleEl = document.getElementById("question-module");
  const questionTextEl = document.getElementById("question-text");
  const btnV = document.getElementById("btn-verdadeiro");
  const btnF = document.getElementById("btn-falso");
  const feedbackEl = document.getElementById("feedback");
  const feedbackResultEl = document.getElementById("feedback-result");
  const feedbackJustEl = document.getElementById("feedback-justificativa");
  const btnNext = document.getElementById("btn-next");

  const resultScoreEl = document.getElementById("result-score");
  const resultMsgEl = document.getElementById("result-msg");
  const resultBreakdownEl = document.getElementById("result-breakdown");
  const btnReview = document.getElementById("btn-review");
  const btnRestart = document.getElementById("btn-restart");

  const reviewListEl = document.getElementById("review-list");
  const btnBackResult = document.getElementById("btn-back-result");

  // ---------- Utilidades ----------
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.add("hidden"));
    screens[name].classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Tela inicial: montar checkboxes de módulos ----------
  function buildModuleChecks() {
    moduleChecksEl.innerHTML = "";
    QUIZ_DATA.forEach((mod, idx) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = idx;
      checkbox.checked = true;
      checkbox.addEventListener("change", updateCountInfo);
      label.appendChild(checkbox);
      label.appendChild(
        document.createTextNode(`${mod.icone} ${mod.modulo} (${mod.questoes.length} questões)`)
      );
      moduleChecksEl.appendChild(label);
    });
    updateCountInfo();
  }

  function getSelectedModuleIndexes() {
    return Array.from(moduleChecksEl.querySelectorAll("input[type=checkbox]:checked")).map((cb) =>
      Number(cb.value)
    );
  }

  function updateCountInfo() {
    const selected = getSelectedModuleIndexes();
    let total = 0;
    selected.forEach((i) => (total += QUIZ_DATA[i].questoes.length));
    countInfoEl.textContent = `${total} questão(ões) selecionada(s).`;
    btnStart.disabled = total === 0;
    btnStart.style.opacity = total === 0 ? 0.5 : 1;
  }

  // ---------- Iniciar simulado ----------
  function startQuiz() {
    const selectedIdx = getSelectedModuleIndexes();
    let questions = [];
    selectedIdx.forEach((i) => {
      QUIZ_DATA[i].questoes.forEach((q) => {
        questions.push({ ...q, modulo: QUIZ_DATA[i].modulo, icone: QUIZ_DATA[i].icone });
      });
    });

    const order = document.querySelector('input[name="order"]:checked').value;
    if (order === "aleatoria") {
      questions = shuffle(questions);
    }

    sessionQuestions = questions.map((q) => ({
      ...q,
      respondida: false,
      acertou: null,
      escolha: null,
    }));
    currentIndex = 0;
    score = 0;

    showScreen("quiz");
    renderQuestion();
  }

  // ---------- Renderizar questão ----------
  function renderQuestion() {
    const q = sessionQuestions[currentIndex];

    progressText.textContent = `Questão ${currentIndex + 1} de ${sessionQuestions.length}`;
    progressFill.style.width = `${(currentIndex / sessionQuestions.length) * 100}%`;
    scoreText.textContent = score;

    questionModuleEl.textContent = `${q.icone} ${q.modulo}`;
    questionTextEl.textContent = `${q.n}. ${q.texto}`;

    btnV.disabled = false;
    btnF.disabled = false;
    btnV.classList.remove("correct", "incorrect");
    btnF.classList.remove("correct", "incorrect");

    feedbackEl.classList.add("hidden");
  }

  // ---------- Responder ----------
  function answer(escolhaBool) {
    const q = sessionQuestions[currentIndex];
    if (q.respondida) return;

    q.respondida = true;
    q.escolha = escolhaBool;
    q.acertou = escolhaBool === q.resposta;
    if (q.acertou) score++;

    const btnEscolhido = escolhaBool ? btnV : btnF;
    const btnCorreto = q.resposta ? btnV : btnF;

    btnV.disabled = true;
    btnF.disabled = true;

    if (q.acertou) {
      btnEscolhido.classList.add("correct");
    } else {
      btnEscolhido.classList.add("incorrect");
      btnCorreto.classList.add("correct");
    }

    feedbackResultEl.textContent = q.acertou
      ? "✔ Resposta correta!"
      : `✘ Resposta incorreta. O correto era: ${q.resposta ? "Verdadeiro" : "Falso"}.`;
    feedbackResultEl.className = "feedback-result " + (q.acertou ? "ok" : "no");
    feedbackJustEl.textContent = q.justificativa;

    feedbackEl.classList.remove("hidden");
    scoreText.textContent = score;

    btnNext.textContent =
      currentIndex === sessionQuestions.length - 1 ? "Ver resultado →" : "Próxima questão →";
  }

  // ---------- Próxima questão ----------
  function nextQuestion() {
    if (currentIndex < sessionQuestions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  // ---------- Finalizar ----------
  function finishQuiz() {
    progressFill.style.width = "100%";
    const total = sessionQuestions.length;
    const pct = Math.round((score / total) * 100);

    resultScoreEl.textContent = `${score} / ${total} (${pct}%)`;

    let msg;
    if (pct >= 90) msg = "Excelente! Você domina o conteúdo. 🌟";
    else if (pct >= 70) msg = "Muito bom! Revise os pontos que errou.";
    else if (pct >= 50) msg = "Razoável. Vale a pena revisar os módulos com mais erros.";
    else msg = "Continue estudando — revise a justificativa de cada questão errada.";
    resultMsgEl.textContent = msg;

    // Breakdown por módulo
    const byModule = {};
    sessionQuestions.forEach((q) => {
      if (!byModule[q.modulo]) byModule[q.modulo] = { certas: 0, total: 0, icone: q.icone };
      byModule[q.modulo].total++;
      if (q.acertou) byModule[q.modulo].certas++;
    });

    resultBreakdownEl.innerHTML = "";
    Object.entries(byModule).forEach(([modulo, stats]) => {
      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `<span>${stats.icone} ${modulo}</span><span>${stats.certas}/${stats.total}</span>`;
      resultBreakdownEl.appendChild(row);
    });

    const erradas = sessionQuestions.filter((q) => !q.acertou);
    btnReview.classList.toggle("hidden", erradas.length === 0);
    if (erradas.length === 0) {
      resultMsgEl.textContent += " Você acertou todas! 🎉";
    }

    showScreen("result");
  }

  // ---------- Revisão ----------
  function renderReview() {
    const erradas = sessionQuestions.filter((q) => !q.acertou);
    reviewListEl.innerHTML = "";
    erradas.forEach((q) => {
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `
        <div class="rq-num">${q.icone} Questão ${q.n} — ${q.modulo}</div>
        <p class="rq-text">${q.texto}</p>
        <div class="rq-answers">
          Sua resposta: <span class="rq-your">${q.escolha ? "Verdadeiro" : "Falso"}</span>
          &nbsp;|&nbsp; Correta: <span class="rq-correct">${q.resposta ? "Verdadeiro" : "Falso"}</span>
        </div>
        <p class="rq-just">${q.justificativa}</p>
      `;
      reviewListEl.appendChild(item);
    });
    showScreen("review");
  }

  // ---------- Eventos ----------
  btnStart.addEventListener("click", startQuiz);
  btnV.addEventListener("click", () => answer(true));
  btnF.addEventListener("click", () => answer(false));
  btnNext.addEventListener("click", nextQuestion);
  btnReview.addEventListener("click", renderReview);
  btnBackResult.addEventListener("click", () => showScreen("result"));
  btnRestart.addEventListener("click", () => {
    buildModuleChecks();
    showScreen("start");
  });

  // ---------- Init ----------
  buildModuleChecks();
})();
