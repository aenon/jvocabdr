(() => {
  // ─── State & Storage ──────────────────────
  const STORAGE_KEY = 'xvocabdr_words';

  function loadWords() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveWords(words) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }

  let words = loadWords();
  let quizQuestions = [];
  let currentQuizIndex = 0;
  let dictionaries = {};

  // ─── Dictionaries ─────────────────────────
  const DICT_FILES = [
    'beginner.json',
    'intermediate.json',
    'advanced.json',
    'advanced-tech.json',
    'advanced-medical.json',
    'advanced-legal.json',
    'advanced-business.json',
    'advanced-science.json'
  ];

  async function loadDictionaries() {
    const promises = DICT_FILES.map(async file => {
      try {
        const res = await fetch(`dictionaries/${file}`);
        if (!res.ok) return null;
        const data = await res.json();
        return { key: file.replace('.json', ''), data };
      } catch { return null; }
    });

    const results = await Promise.all(promises);
    results.forEach(r => { if (r) dictionaries[r.key] = r.data; });

    renderDictionarySelector();
    renderDictionarySampleWords();
  }

  // ─── UI Helpers ───────────────────────────
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.animation = 'none'; void el.offsetWidth;
    el.style.animation = '';
  }

  function setView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector(`.view[data-view="${viewName}"]`).classList.add('active');
    document.querySelectorAll('.nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.view === viewName);
    });
    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'add') renderDictionarySampleWords();
  }

  // ─── Dashboard ────────────────────────────
  function renderDashboard() {
    const total = words.length;
    const inReview = words.filter(w => w.seenTimes < 3).length;
    const mastered = total - inReview;

    document.getElementById('total-words').textContent = total;
    document.getElementById('review-words').textContent = inReview;
    document.getElementById('mastered-words').textContent = mastered;

    const ul = document.getElementById('progress-list');
    if (total === 0) {
      ul.innerHTML = '<li style="color:#64748b;">No words added yet.</li>';
      document.getElementById('recent-activity').innerHTML = '<li>No activity yet.</li>';
      return;
    }

    ul.innerHTML = words
      .sort((a, b) => (b.seenTimes || 0) - (a.seenTimes || 0))
      .map(w => {
        const pct = Math.min((w.seenTimes || 0) * 33, 100);
        const tag = w.source ? `<span style="font-size:0.75rem;color:#60a5fa;margin-left:auto">${w.source}</span>` : '';
        return `
          <li>
            <span class="word-title">${w.word}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <span class="seen">${w.seenTimes || 0} / 3</span>
            ${tag}
          </li>`;
      }).join('');

    const recent = words.slice(-5).reverse();
    document.getElementById('recent-activity').innerHTML =
      recent.map(w => `<li>✅ "${w.word}" — ${w.seenTimes || 0} review(s)</li>`).join('');
  }

  // ─── Add Word ─────────────────────────────
  document.getElementById('add-word-form').addEventListener('submit', e => {
    e.preventDefault();
    const word = document.getElementById('word-input').value.trim().toLowerCase();
    const definition = document.getElementById('definition-input').value.trim();
    const example = document.getElementById('example-input').value.trim();
    if (!word || !definition || !example) return;
    addWord(word, definition, example, 'custom');
    document.getElementById('add-word-form').reset();
  });

  function addWord(word, definition, example, source = 'custom') {
    const exists = words.some(w => w.word === word);
    if (exists) { toast(`"${word}" already exists!`); return false; }

    words.push({
      id: Date.now() + Math.random(),
      word, definition, example,
      source, seenTimes: 0, addedAt: Date.now()
    });
    saveWords(words);
    toast(`Added "${word}"`);
    renderDashboard();
    renderDictionarySampleWords();
    return true;
  }

  function addAllFromDict(dictKey) {
    const dict = dictionaries[dictKey];
    if (!dict) { toast('Dictionary not loaded'); return; }

    let added = 0;
    const existing = new Set(words.map(w => w.word));

    dict.words.forEach(entry => {
      if (existing.has(entry.word)) return;
      words.push({
        id: Date.now() + Math.random(),
        word: entry.word,
        definition: entry.definition,
        example: entry.example,
        source: dict.name || dictKey,
        seenTimes: 0, addedAt: Date.now()
      });
      added++;
    });

    if (added > 0) {
      saveWords(words);
      toast(`Added ${added} words from ${dict.name || dictKey}`);
      renderDashboard();
      renderDictionarySampleWords();
    } else {
      toast('All words already added');
    }
  }

  function renderDictionarySampleWords() {
    const container = document.getElementById('dictionary-samples');
    if (!container) return;

    const existing = new Set(words.map(w => w.word));
    const html = Object.entries(dictionaries).map(([key, dict]) => {
      const remaining = dict.words.filter(w => !existing.has(w.word)).length;
      const total = dict.words.length;
      return `
        <div class="dict-card">
          <div class="dict-header">
            <strong>${dict.name || key}</strong>
            <span class="dict-badge">${total - remaining}/${total}</span>
          </div>
          <p class="dict-desc">${dict.description || ''}</p>
          <div class="dict-actions">
            <button onclick="addAllFromDict('${key}')">Add All</button>
            <button onclick="addRandomFromDict('${key}', 5)">Add 5 Random</button>
          </div>
          <div class="dict-words">
            ${dict.words.slice(0, 3).map(w => `<span>${w.word}</span>`).join('')}
            ${dict.words.length > 3 ? `<span>+${dict.words.length - 3} more</span>` : ''}
          </div>
        </div>`;
    }).join('');

    container.innerHTML = html || '<p style="color:#64748b">No dictionaries found. Place JSON files in <code>dictionaries/</code> folder.</p>';
  }

  function addRandomFromDict(dictKey, count) {
    const dict = dictionaries[dictKey];
    if (!dict) { toast('Dictionary not loaded'); return; }

    const existing = new Set(words.map(w => w.word));
    const available = dict.words.filter(w => !existing.has(w.word));
    const shuffled = shuffle([...available]).slice(0, count);

    let added = 0;
    shuffled.forEach(entry => {
      words.push({
        id: Date.now() + Math.random(),
        word: entry.word,
        definition: entry.definition,
        example: entry.example,
        source: dict.name || dictKey,
        seenTimes: 0, addedAt: Date.now()
      });
      added++;
    });

    if (added > 0) {
      saveWords(words);
      toast(`Added ${added} random words from ${dict.name || dictKey}`);
      renderDashboard();
      renderDictionarySampleWords();
    } else {
      toast('No new words available');
    }
  }

  // ─── Quiz ─────────────────────────────────
  function renderDictionarySelector() {
    const container = document.getElementById('dict-selector');
    if (!container) return;

    const keys = Object.keys(dictionaries);
    if (keys.length === 0) {
      container.innerHTML = '<p style="color:#64748b">No dictionaries loaded.</p>';
      return;
    }

    const existing = new Set(words.map(w => w.word));

    container.innerHTML = `
      <label>Choose words from:</label>
      <select id="quiz-dict-select">
        <option value="__all__">All my words</option>
        ${keys.map(k => {
          const dict = dictionaries[k];
          const remaining = dict.words.filter(w => !existing.has(w.word)).length;
          return `<option value="${k}">${dict.name || k} (${dict.words.length} words)</option>`;
        }).join('')}
      </select>
      <div class="quiz-mode">
        <label><input type="radio" name="quiz-mode" value="random" checked> Random subset</label>
        <label><input type="radio" name="quiz-mode" value="sequential"> Sequential</label>
      </div>
      <div class="quiz-size">
        <label>Words per quiz:</label>
        <input type="number" id="quiz-size" value="10" min="1" max="50">
      </div>
    `;
  }

  function startQuiz() {
    const select = document.getElementById('quiz-dict-select');
    const dictKey = select ? select.value : '__all__';
    const mode = document.querySelector('input[name="quiz-mode"]:checked')?.value || 'random';
    const size = parseInt(document.getElementById('quiz-size')?.value || '10', 10);

    let sourceWords = [];

    if (dictKey === '__all__') {
      sourceWords = words.filter(w => w.seenTimes < 3);
      if (sourceWords.length === 0) {
        toast('No words in review. All words mastered!');
        return;
      }
    } else {
      const dict = dictionaries[dictKey];
      if (!dict) { toast('Dictionary not found'); return; }

      // Add missing dictionary words to user's list first
      const existing = new Set(words.map(w => w.word));
      dict.words.forEach(entry => {
        if (!existing.has(entry.word)) {
          words.push({
            id: Date.now() + Math.random(),
            word: entry.word,
            definition: entry.definition,
            example: entry.example,
            source: dict.name || dictKey,
            seenTimes: 0, addedAt: Date.now()
          });
        }
      });
      saveWords(words);

      sourceWords = words.filter(w => {
        const fromDict = w.source === (dict.name || dictKey);
        return fromDict && w.seenTimes < 3;
      });

      if (sourceWords.length === 0) {
        toast(`All ${dict.name || dictKey} words mastered!`);
        return;
      }
    }

    if (mode === 'random') {
      quizQuestions = shuffle([...sourceWords]).slice(0, Math.min(size, sourceWords.length));
    } else {
      quizQuestions = sourceWords.slice(0, Math.min(size, sourceWords.length));
    }

    currentQuizIndex = 0;
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('quiz-result').classList.add('hidden');
    renderQuestion();
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderQuestion() {
    const container = document.getElementById('quiz-container');
    const q = quizQuestions[currentQuizIndex];
    if (!q) { showQuizResult(); return; }

    const w = q.word;
    const len = w.length;

    // Pre-fill hints: first + last for 4+, first only for 2-3
    const slots = Array.from({ length: len }, (_, i) => {
      let prefill = '';
      let cls = '';
      if (len <= 3 && i === 0) {
        prefill = w[0];
        cls = 'hinted';
      } else if (len >= 4 && (i === 0 || i === len - 1)) {
        prefill = w[i];
        cls = 'hinted';
      }
      return `<div class="letter-slot ${cls}" data-index="${i}" tabindex="0" data-value="${prefill}">${prefill}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="question-card">
        <p class="q-stem">Spell the word (${len} letters):</p>
        <p class="q-definition">${escapeHtml(q.definition)}</p>
        <p class="q-example">"${escapeHtml(q.example).replace(q.word, '___')}"</p>
        <div class="letter-slots" id="letter-slots">${slots}</div>
        <div class="quiz-actions">
          <button class="btn btn-primary" onclick="checkSpelling()">Check</button>
        </div>
        <p id="spelling-feedback" class="spelling-feedback"></p>
      </div>`;

    setupLetterInput(q.word);
    document.getElementById('quiz-score').textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;
  }

  function setupLetterInput(targetWord) {
    const slots = document.querySelectorAll('.letter-slot');

    function isHinted(i) {
      return slots[i]?.classList.contains('hinted');
    }

    function nextEditable(i) {
      for (let j = i + 1; j < slots.length; j++) if (!isHinted(j)) return j;
      return -1;
    }

    function prevEditable(i) {
      for (let j = i - 1; j >= 0; j--) if (!isHinted(j)) return j;
      return -1;
    }

    function focusSlot(i) {
      if (i >= 0 && i < slots.length && !isHinted(i)) slots[i].focus();
    }

    function setSlotValue(i, char) {
      slots[i].textContent = char;
      slots[i].dataset.value = char;
    }

    slots.forEach((slot, i) => {
      if (isHinted(i)) {
        slot.style.cursor = 'default';
        return;
      }

      slot.addEventListener('keydown', e => {
        e.preventDefault();

        if (e.key === 'Backspace') {
          if (slot.textContent) {
            setSlotValue(i, '');
          } else {
            const prev = prevEditable(i);
            if (prev >= 0) { setSlotValue(prev, ''); focusSlot(prev); }
          }
          return;
        }

        if (e.key === 'ArrowLeft') { focusSlot(prevEditable(i)); return; }
        if (e.key === 'ArrowRight') { focusSlot(nextEditable(i)); return; }
        if (e.key === 'Enter') { checkSpelling(); return; }

        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
          setSlotValue(i, e.key.toLowerCase());
          const next = nextEditable(i);
          if (next >= 0) focusSlot(next);
        }
      });
    });

    // Focus first editable slot
    for (let i = 0; i < slots.length; i++) {
      if (!isHinted(i)) { slots[i].focus(); break; }
    }
  }

  function getSpelledWord() {
    const slots = document.querySelectorAll('.letter-slot');
    return Array.from(slots).map(s => s.dataset.value || '').join('');
  }

  function checkSpelling() {
    const q = quizQuestions[currentQuizIndex];
    const answer = getSpelledWord();
    const feedback = document.getElementById('spelling-feedback');
    const correct = answer === q.word.toLowerCase();

    if (answer.length < q.word.length) {
      feedback.textContent = 'Fill in all letters first.';
      feedback.className = 'spelling-feedback neutral';
      return;
    }

    document.querySelectorAll('.letter-slot').forEach(s => s.blur());

    if (correct) {
      feedback.innerHTML = `✅ Correct!`;
      feedback.className = 'spelling-feedback correct';
      document.querySelectorAll('.letter-slot').forEach(s => s.classList.add('correct'));
    } else {
      feedback.innerHTML = `❌ The answer was <strong>${escapeHtml(q.word)}</strong>`;
      feedback.className = 'spelling-feedback wrong';
      // Show the correct letters
      const slots = document.querySelectorAll('.letter-slot');
      q.word.split('').forEach((char, i) => {
        if (slots[i].dataset.value !== char) {
          slots[i].textContent = char;
          slots[i].classList.add('wrong');
        } else {
          slots[i].classList.add('correct');
        }
      });
    }

    const idx = words.findIndex(w => w.word === q.word);
    if (idx >= 0) {
      words[idx].seenTimes++;
      if (correct) words[idx].seenTimes++;
      saveWords(words);
    }

    setTimeout(() => {
      currentQuizIndex++;
      if (currentQuizIndex < quizQuestions.length) renderQuestion();
      else showQuizResult();
    }, correct ? 1000 : 1800);
  }

  function showQuizResult() {
    document.getElementById('quiz-container').innerHTML = '';
    const resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden');

    const fromQuiz = quizQuestions.filter(q => {
      const w = words.find(w2 => w2.word === q.word);
      return w && w.seenTimes > 0;
    }).length;

    document.getElementById('quiz-result-score').textContent =
      `Session complete! You reviewed ${fromQuiz} words. Keep building your vocabulary!`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escapeJs(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  // ─── Event Listeners ──────────────────────
  document.getElementById('start-quiz')?.addEventListener('click', startQuiz);
  document.getElementById('retake-quiz')?.addEventListener('click', startQuiz);
  document.getElementById('back-to-review')?.addEventListener('click', () => setView('dashboard'));

  document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  // ─── Init ─────────────────────────────────
  loadDictionaries();
  renderDashboard();
})();
