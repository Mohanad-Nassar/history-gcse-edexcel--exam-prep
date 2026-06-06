
/* ══════════════════════════════════════════════
   RENDER FUNCTIONS
══════════════════════════════════════════════ */

function switchTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
}

/* ── Key Learning ── */
function renderTopics() {
    const grid = document.getElementById('topicGrid');
    grid.innerHTML = topics.map((t, i) => `
    <div class="topic-card" onclick="toggleCard(${i})" id="tc${i}">
      <div class="tc-header">
        <div class="tc-title">${t.title}</div>
        <div class="tc-tag">${t.tag}</div>
        <div class="tc-arrow">▶</div>
      </div>
      <div class="tc-body">${t.content}</div>
    </div>
  `).join('');
}
function toggleCard(i) {
    const card = document.getElementById('tc' + i);
    card.classList.toggle('open');
}

/* ── MCQ ── */
let mcqCorrect = 0, mcqAttempted = 0;
function renderMCQ() {
    const wrap = document.getElementById('mcqWrap');
    wrap.innerHTML = mcqData.map((q, qi) => `
    <div class="q-card" id="qcard${qi}">
      <div class="q-num">Q${qi + 1} of ${mcqData.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="opts">
        ${q.opts.map((o, oi) => `
          <button class="opt-btn" onclick="answerMCQ(${qi},${oi})" id="opt${qi}_${oi}">
            <span class="opt-label">${['A', 'B', 'C', 'D'][oi]}</span>${o}
          </button>
        `).join('')}
      </div>
      <div class="q-explain" id="explain${qi}">${q.explain}</div>
    </div>
  `).join('');
}
function answerMCQ(qi, oi) {
    const q = mcqData[qi];
    const btns = document.querySelectorAll(`#qcard${qi} .opt-btn`);
    btns.forEach(b => b.disabled = true);
    btns[oi].classList.add(oi === q.ans ? 'correct' : 'wrong');
    if (oi !== q.ans) btns[q.ans].classList.add('correct');
    document.getElementById(`explain${qi}`).classList.add('show');
    mcqAttempted++;
    if (oi === q.ans) mcqCorrect++;
    document.getElementById('mcqScore').textContent = mcqCorrect;
    document.getElementById('mcqTotal').textContent = mcqAttempted;
}
function resetMCQ() {
    mcqCorrect = 0; mcqAttempted = 0;
    document.getElementById('mcqScore').textContent = 0;
    document.getElementById('mcqTotal').textContent = 0;
    renderMCQ();
}

/* ── Matching ── */
let matchSelected = null, matchCorrect = 0;
let matchLeftData = [], matchRightData = [];
function renderMatch() {
    matchLeftData = [...matchData].map((m, i) => ({ ...m, id: i }));
    matchRightData = [...matchData].map((m, i) => ({ ...m, id: i })).sort(() => Math.random() - 0.5);
    document.getElementById('matchTotal').textContent = matchData.length;
    document.getElementById('matchLeft').innerHTML = matchLeftData.map(m =>
        `<div class="match-item" id="ml${m.id}" onclick="selectLeft(${m.id})">${m.term}</div>`
    ).join('');
    document.getElementById('matchRight').innerHTML = matchRightData.map(m =>
        `<div class="match-item" id="mr${m.id}" onclick="selectRight(${m.id})">${m.def}</div>`
    ).join('');
}
function selectLeft(id) {
    document.querySelectorAll('#matchLeft .match-item').forEach(el => el.classList.remove('selected'));
    const el = document.getElementById('ml' + id);
    if (el.classList.contains('matched')) return;
    matchSelected = id;
    el.classList.add('selected');
}
function selectRight(id) {
    if (matchSelected === null) return;
    const right = document.getElementById('mr' + id);
    if (right.classList.contains('matched')) return;
    if (id === matchSelected) {
        document.getElementById('ml' + id).classList.remove('selected');
        document.getElementById('ml' + id).classList.add('matched');
        right.classList.add('matched');
        matchCorrect++;
        document.getElementById('matchScore').textContent = matchCorrect;
        matchSelected = null;
    } else {
        right.classList.add('wrong-match');
        setTimeout(() => right.classList.remove('wrong-match'), 400);
        document.getElementById('ml' + matchSelected).classList.remove('selected');
        matchSelected = null;
    }
}
function resetMatch() {
    matchSelected = null; matchCorrect = 0;
    document.getElementById('matchScore').textContent = 0;
    renderMatch();
}

/* ── FIB ── */
let fibCorrect = 0;
function renderFIB() {
    const wrap = document.getElementById('fibWrap');
    let totalBlanks = 0;
    wrap.innerHTML = fibData.map((s, si) => {
        let html = s.display;
        let bi = 1;
        html = html.replace(/_____/g, () => {
            const key = 'B' + bi;
            const correct = s.blanks[key];
            const opts = shuffleArr([correct, ...fibWords.filter(w => w !== correct)].slice(0, 7));
            bi++;
            totalBlanks++;
            return `<select onchange="checkFIB(this,'${correct}')" id="fib_${si}_${key}">
        <option value="">— choose —</option>
        ${opts.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>`;
        });
        return `<div class="fib-sentence">${html}</div>`;
    }).join('');
    document.getElementById('fibTotal').textContent = totalBlanks;
}
function checkFIB(sel, correct) {
    if (sel.value === correct) {
        sel.classList.add('correct-ans');
        sel.classList.remove('wrong-ans');
        sel.disabled = true;
        fibCorrect++;
        document.getElementById('fibScore').textContent = fibCorrect;
    } else if (sel.value !== '') {
        sel.classList.add('wrong-ans');
        setTimeout(() => { sel.classList.remove('wrong-ans'); sel.value = ''; }, 600);
    }
}
function resetFIB() {
    fibCorrect = 0;
    document.getElementById('fibScore').textContent = 0;
    renderFIB();
}
function shuffleArr(a) { return [...a].sort(() => Math.random() - 0.5); }

/* ── Misconceptions ── */
function renderMisc() {
    document.getElementById('miscList').innerHTML = miscData.map(m => `
    <div class="misc-card">
      <div class="misc-wrong"><div class="misc-icon">❌</div><div class="misc-wrong-text">"${m.wrong}"</div></div>
      <div class="misc-correct"><div class="misc-icon">✅</div><div class="misc-correct-text">${m.correct}</div></div>
    </div>
  `).join('');
}

/* ── Exam Tips ── */
function renderTips() {
    document.getElementById('tipsGrid').innerHTML = examTips.map(t => `
    <div class="tip-card">
      <div class="tip-type">${t.type}</div>
      <div class="tip-title">${t.title}</div>
      <div class="tip-content">${t.content}</div>
      <div class="pills">${t.pills.map(p => `<span class="pill">${p}</span>`).join('')}</div>
    </div>
  `).join('');
}

/* ── Flashcards ── */
let fcIndex = 0, fcFlipped = false, fcKnownCount = 0, fcUnknownCount = 0;
let fcWrongCards = [], fcDeck = [];
function initFlashcards() {
    fcDeck = [...flashcards];
    fcIndex = 0; fcFlipped = false; fcKnownCount = 0; fcUnknownCount = 0; fcWrongCards = [];
    showCard();
}
function showCard() {
    if (fcDeck.length === 0) return;
    const card = fcDeck[fcIndex];
    document.getElementById('fcTerm').textContent = card.term;
    document.getElementById('fcDef').textContent = card.def;
    document.getElementById('fcProgress').textContent = `Card ${fcIndex + 1} of ${fcDeck.length}`;
    const fc = document.getElementById('flashcard');
    fc.classList.remove('flipped');
    fcFlipped = false;
    document.getElementById('fcNavDefault').style.display = 'flex';
    document.getElementById('fcNavAssess').style.display = 'none';
    document.getElementById('fcScoreBar').style.display = 'flex';
    document.getElementById('fcKnown').textContent = fcKnownCount;
    document.getElementById('fcUnknown').textContent = fcUnknownCount;
    document.getElementById('fcTotalTrack').textContent = fcKnownCount + fcUnknownCount;
}
function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
    fcFlipped = !fcFlipped;
    if (fcFlipped) {
        document.getElementById('fcNavDefault').style.display = 'none';
        document.getElementById('fcNavAssess').style.display = 'flex';
    } else {
        document.getElementById('fcNavDefault').style.display = 'flex';
        document.getElementById('fcNavAssess').style.display = 'none';
    }
}
function markCard(known) {
    if (!known) fcWrongCards.push(fcDeck[fcIndex]);
    known ? fcKnownCount++ : fcUnknownCount++;
    if (fcIndex < fcDeck.length - 1) { fcIndex++; showCard(); }
    else {
        document.getElementById('fcActiveArea').style.display = 'none';
        document.getElementById('fcSummaryArea').style.display = 'block';
        document.getElementById('fcSummaryKnown').textContent = fcKnownCount;
        document.getElementById('fcSummaryTotal').textContent = fcDeck.length;
        document.getElementById('btnReviewWrong').style.display = fcWrongCards.length ? 'inline-block' : 'none';
    }
}
function nextCard() { if (fcIndex < fcDeck.length - 1) { fcIndex++; showCard(); } }
function prevCard() { if (fcIndex > 0) { fcIndex--; showCard(); } }
function reviewWrong() {
    fcDeck = [...fcWrongCards]; fcIndex = 0; fcKnownCount = 0; fcUnknownCount = 0; fcWrongCards = [];
    document.getElementById('fcActiveArea').style.display = 'block';
    document.getElementById('fcSummaryArea').style.display = 'none';
    showCard();
}
function resetFlashcards() {
    document.getElementById('fcActiveArea').style.display = 'block';
    document.getElementById('fcSummaryArea').style.display = 'none';
    initFlashcards();
}

/* ── True/False ── */
let tfCorrect = 0, tfAnswered = 0;
function renderTF() {
    document.getElementById('tfWrap').innerHTML = tfData.map((t, ti) => `
    <div class="tf-card">
      <div class="tf-statement">${ti + 1}. ${t.statement}</div>
      <div class="tf-btns">
        <button class="tf-btn" onclick="answerTF(${ti},true)" id="tft${ti}">✅ True</button>
        <button class="tf-btn" onclick="answerTF(${ti},false)" id="tff${ti}">❌ False</button>
      </div>
      <div class="tf-explain" id="tfe${ti}">${t.explanation}</div>
    </div>
  `).join('');
}
function answerTF(ti, chosen) {
    const t = tfData[ti];
    const correct = chosen === t.answer;
    document.getElementById('tft' + ti).disabled = true;
    document.getElementById('tff' + ti).disabled = true;
    if (chosen) {
        document.getElementById('tft' + ti).classList.add(correct ? 'correct' : 'wrong');
        if (!correct) document.getElementById('tff' + ti).classList.add('correct');
    } else {
        document.getElementById('tff' + ti).classList.add(correct ? 'correct' : 'wrong');
        if (!correct) document.getElementById('tft' + ti).classList.add('correct');
    }
    document.getElementById('tfe' + ti).classList.add('show');
    tfAnswered++;
    if (correct) tfCorrect++;
    document.getElementById('tfScore').textContent = tfCorrect;
    document.getElementById('tfTotal').textContent = tfAnswered;
}
function resetTF() {
    tfCorrect = 0; tfAnswered = 0;
    document.getElementById('tfScore').textContent = 0;
    document.getElementById('tfTotal').textContent = 0;
    renderTF();
}

/* ── Exam Practice ── */
function renderEP() {
    document.getElementById('epList').innerHTML = examQuestions.map((q, qi) => {
        if (q.type === 'mcq') {
            return `<div class="ep-card">
        <div class="ep-header"><span class="ep-qnum">${q.num}</span><span class="ep-marks">${q.marks} mark${q.marks !== 1 ? 's' : ''}</span></div>
        <div class="ep-question">${q.question}</div>
        <div class="ep-mcq-opts" id="epmcq${qi}">
          ${q.options.map((o, oi) => `<button class="opt-btn" onclick="answerEPMCQ(${qi},${oi})" id="epo${qi}_${oi}"><span class="opt-label">${['A', 'B', 'C', 'D'][oi]}</span>${o}</button>`).join('')}
        </div>
        <div class="ep-actions">
          <button class="ep-btn" onclick="toggleHint(${qi})">💡 Hint</button>
          <button class="ep-btn" onclick="toggleStarter(${qi})">✍️ Sentence Starter</button>
          <button class="ep-btn primary" onclick="showMarkScheme(${qi})">📋 See Mark Scheme</button>
        </div>
        <div class="ep-hint-box" id="eph${qi}">${q.hint}</div>
        <div class="ep-starter-box" id="eps${qi}">${q.starter}</div>
        <div class="ep-reveal" id="epr${qi}">
          <div class="marks-section">${q.markScheme}</div>
        </div>
      </div>`;
        }
        return `<div class="ep-card">
      <div class="ep-header"><span class="ep-qnum">${q.num}</span><span class="ep-marks">${q.marks} mark${q.marks !== 1 ? 's' : ''}</span></div>
      ${q.caseStudy ? `<div class="ep-case"><strong>Source / Case Study</strong>${q.caseStudy}</div>` : ''}
      <div class="ep-question">${q.question}</div>
      <textarea class="ep-textarea" placeholder="Write your answer here..." rows="6"></textarea>
      <div class="ep-actions">
        <button class="ep-btn" onclick="toggleHint(${qi})">💡 Hint</button>
        <button class="ep-btn" onclick="toggleStarter(${qi})">✍️ Sentence Starter</button>
        <button class="ep-btn primary" onclick="showMarkScheme(${qi})">📋 Submit &amp; See Mark Scheme</button>
      </div>
      <div class="ep-hint-box" id="eph${qi}">${q.hint}</div>
      <div class="ep-starter-box" id="eps${qi}">${q.starter}</div>
      <div class="ep-reveal" id="epr${qi}">
        <div class="marks-section">${q.markScheme}</div>
        ${q.modelAnswer ? `<div class="model-answer-box"><h6>Model Answer</h6>${q.modelAnswer.replace(/\n/g, '<br>')}</div>` : ''}
      </div>
    </div>`;
    }).join('');
}
function toggleHint(qi) { document.getElementById('eph' + qi).classList.toggle('show'); }
function toggleStarter(qi) { document.getElementById('eps' + qi).classList.toggle('show'); }
function showMarkScheme(qi) { document.getElementById('epr' + qi).classList.add('show'); }
function answerEPMCQ(qi, oi) {
    const q = examQuestions[qi];
    const btns = document.querySelectorAll(`#epmcq${qi} .opt-btn`);
    btns.forEach(b => b.disabled = true);
    btns[oi].classList.add(oi === q.answer ? 'correct' : 'wrong');
    if (oi !== q.answer) btns[q.answer].classList.add('correct');
    document.getElementById('epr' + qi).classList.add('show');
}

/* ── Apply metadata on load ── */
document.addEventListener('DOMContentLoaded', () => {
    const badgeEl = document.querySelector('.badge');
    const h1El = document.querySelector('header h1');
    const subEl = document.querySelector('header p');
    const titleEl = document.querySelector('title');

    if (badgeEl) badgeEl.innerHTML = pageMeta.badge;
    if (h1El) h1El.textContent = pageMeta.title;
    if (subEl) subEl.textContent = pageMeta.subtitle;
    if (titleEl) titleEl.textContent = pageMeta.title.replace(/&amp;/g, '&');
});

/* ── Init ── */
renderTopics();
renderMCQ();
renderMatch();
renderFIB();
renderMisc();
renderTips();
renderTF();
renderEP();
initFlashcards();
