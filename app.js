(() => {
  // ─── State & Storage ──────────────────────
  const STORAGE_KEY = 'xvocabdr_words';

  function loadWords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveWords(words) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }

  let words = loadWords();
  let quizQuestions = [];
  let currentQuizIndex = 0;

  // ─── Sample Words ─────────────────────────
  const sampleWords = [
    { word: 'ephemeral', definition: 'Lasting for a very short time.', example: 'The beauty of the sunset was ephemeral.' },
    { word: 'serendipity', definition: 'The occurrence of events by chance in a happy or beneficial way.', example: 'Finding that book was pure serendipity.' },
    { word: 'ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous in modern society.' },
    { word: 'resilient', definition: 'Able to recover quickly from difficulties.', example: 'She proved resilient through the storm.' },
    { word: 'ambiguous', definition: 'Open to more than one interpretation; unclear.', example: 'The instructions were ambiguous and confusing.' },
    { word: 'articulate', definition: 'Speaking clearly and in a well-organized manner.', example: 'He gave an articulate explanation of the complex topic.' },
    { word: 'profound', definition: 'Having great depth of thought or feeling.', example: 'She had a profound understanding of the issue.' },
    { word: 'meticulous', definition: 'Showing extreme care and attention to detail.', example: 'A meticulous approach helped catch every error.' },
    { word: 'paradox', definition: 'Something that seems self-contradictory or unlikely.', example: 'It is a paradox that the more we share, the less we have.' },
    { word: 'labyrinth', definition: 'A complicated and confusing arrangement of paths or passages.', example: 'The maze was a labyrinth with no clear exit.' },
    { word: 'tranquil', definition: 'Calm and peaceful; free from disturbance.', example: 'The lake was tranquil under the moonlight.' },
    { word: 'vivid', definition: 'Having strong, clear, and realistic qualities.', example: 'She had a vivid memory of that day.' },
    { word: 'eloquent', definition: 'Speaking or writing with fluency and elegance.', example: 'She gave an eloquent speech to the crowd.' },
  ];

  // ─── UI Helpers ───────────────────────────
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }

  function setView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector(`.view[data-view="${viewName}"]`).classList.add('active');
    document.querySelectorAll('.nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.view === viewName);
    });

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'add') renderSampleWords();
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
      return;
    }

    ul.innerHTML = words
      .sort((a, b) => (b.seenTimes || 0) - (a.seenTimes || 0))
      .map(w => {
        const pct = Math.min((w.seenTimes || 0) * 33, 100);
        return `
          <li>
            <span class="word-title">${w.word}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <span class="seen">${w.seenTimes || 0} / 3</span>
          </li>`;
      })
      .join('');

    const recent = words.slice(-5).reverse();
    const actUl = document.getElementById('recent-activity');
    if (total === 0) {
      actUl.innerHTML = '<li>No words added yet.</li>';
    } else {
      actUl.innerHTML = recent.map(w => `<li>✅ "${w.word}" — ${w.seenTimes || 0} review(s)</li>`).join('');
    }
  }

  // ─── Add Word Form ────────────────────────
  document.getElementById('add-word-form').addEventListener('submit', e => {
    e.preventDefault();

    const word = document.getElementById('word-input').value.trim().toLowerCase();
    const definition = document.getElementById('definition-input').value.trim();
    const example = document.getElementById('example-input').value.trim();

    if (!word || !definition || !example) return;

    const exists = words.some(w => w.word === word);
    if (exists) { toast('Word already exists!'); return; }

    const newWord = {
      id: Date.now(),
      word, definition, example, difficulty: 'medium',
      seenTimes: 0, addedAt: Date.now()
    };

    words.push(newWord);
    saveWords(words);
    toast(`Added "${word}"!`);

    document.getElementById('word-input').value = '';
    document.getElementById('definition-input').value = '';
    document.getElementById('example-input').value = '';

    renderSampleWords();
    renderDashboard();
  });

  function renderSampleWords() {
    const container = document.getElementById('sample-words');
    const existing = new Set(words.map(w => w.word));

    container.innerHTML = sampleWords
      .filter(s => !existing.has(s.word))
      .map(s => `
        <button onclick="addSample('${escape(s.word)}', '${escape(s.definition)}', '${escape(s.example)}')">
          ${s.word}
        </button>`
      ).join('');
  }

  function addSample(word, definition, example) {
    const exists = words.some(w => w.word === word);
    if (exists) { toast('Word already exists!'); return; }

    const newWord = {
      id: Date.now(), word, definition, example, difficulty: 'medium',
      seenTimes: 0, addedAt: Date.now()
    };

    words.push(newWord);
    saveWords(words);
    toast(`Added "${word}"!`);

    document.getElementById('add-word-form').reset();
    renderSampleWords();
    renderDashboard();

    setView('dashboard');
  }

  // ─── Quiz ─────────────────────────────────
  function startQuiz() {
    const reviewWords = words.filter(w => w.seenTimes < 3);

    if (reviewWords.length === 0) {
      toast('No words to quiz! Add some first.');
      return;
    }

    const shuffled = shuffleWords(reviewWords);
    quizQuestions = shuffled.slice(0, Math.min(10, shuffled.length));
    currentQuizIndex = 0;

    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('quiz-result').classList.add('hidden');

    renderQuestion();
  }

  function shuffleWords(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderQuestion() {
    const container = document.getElementById('quiz-container');
    const q = quizQuestions[currentQuizIndex];

    if (!q) { showQuizResult(); return; }

    const pool = [...words, ...sampleWords.map(s => ({ word: s.word }))].map(w => w.word)
      .filter(w => w !== q.word).sort(() => Math.random() - 0.5);

    const options = [q.word, ...pool.slice(0, 3)].sort(() => Math.random() - 0.5);
    const isCorrect = options.includes(q.word);

    container.innerHTML = `
      <div class="question-card">
        <p class="q-stem">Fill in the blank:</p>
        <p style="font-size:1.1rem; margin-bottom: 1rem;">
          "${q.example.replace(q.word, '___')}"
        </p>
        <div class="q-options">
          ${options.map(opt => `
            <button class="q-option" onclick="handleQuizAnswer(${currentQuizIndex}, "${opt}")">
              ${opt}
            </button>`).join('')}
        </div>
      </div>`;

    document.getElementById('quiz-score').textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;
  }

  function handleQuizAnswer(index, answer) {
    const q = quizQuestions[index];
    const options = document.querySelectorAll('.q-option');

    options.forEach(opt => {
      if (opt.textContent === q.word) opt.classList.add('correct');
      else if (opt.textContent === answer && answer !== q.word) opt.classList.add('wrong');
    });

    const wordIdx = words.findIndex(w => w.word === q.word);
    if (wordIdx >= 0) {
      words[wordIdx].seenTimes++;
      saveWords(words);

      if (answer === q.word) {
        words[wordIdx].seenTimes++;
        saveWords(words);
      }
    }

    setTimeout(() => {
      currentQuizIndex++;
      if (currentQuizIndex < quizQuestions.length) {
        renderQuestion();
      } else {
        showQuizResult();
      }
    }, 800);
  }

  function showQuizResult() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    const resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden');

    const reviewed = quizQuestions.filter(q => {
      const w = words.find(w2 => w2.word === q.word);
      return w && w.seenTimes > 0;
    }).length;

    document.getElementById('quiz-result-score').textContent = `You reviewed ${reviewed} words! Keep going.`;
  }

  // ─── Event Listeners ──────────────────────
  document.getElementById('start-quiz').addEventListener('click', startQuiz);

  document.getElementById('retake-quiz').addEventListener('click', () => {
    startQuiz();
  });

  document.getElementById('back-to-review').addEventListener('click', () => {
    setView('dashboard');
  });

  document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  // ─── Escape helper for sample words ──────
  function escape(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  // ─── Init ─────────────────────────────────
  renderDashboard();
  renderSampleWords();

})();
