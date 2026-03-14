import React, { useState, useEffect } from 'react';
import { initializeWords, getWordsForSession, updateWordStats, rateAnswer } from './lib/spacedRepetition';
import { storage, defaultStats, defaultSettings } from './lib/storage';
import { initialWords } from './data/initialWords';
import Home from './components/Home';
import Practice from './components/Practice';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

function App() {
  const [view, setView] = useState('home'); // home, practice, dashboard, settings
  const [words, setWords] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [settings, setSettings] = useState(defaultSettings);
  const [sessionWords, setSessionWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data on first load
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    // Load words or initialize
    const savedWords = storage.loadWords();
    if (savedWords) {
      setWords(savedWords);
    } else {
      const initialized = initializeWords(initialWords);
      setWords(initialized);
      storage.saveWords(initialized);
    }

    // Load stats
    const savedStats = storage.loadStats();
    if (savedStats) {
      setStats(savedStats);
    }

    // Load settings
    const savedSettings = storage.loadSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }

    setLoading(false);
  };

  // Update streak when practicing
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const startSession = (type = settings.sessionType) => {
    const wordsForSession = getWordsForSession(words, type);
    if (wordsForSession.length === 0) {
      alert('No words available for this session type!');
      return;
    }
    setSessionWords(wordsForSession);
    setView('practice');
  };

  const completeSession = (sessionResults) => {
    // Update words with results
    const updatedWords = [...words];
    sessionResults.forEach((result, index) => {
      const wordIndex = updatedWords.findIndex(w => w.id === result.word.id);
      if (wordIndex !== -1) {
        const quality = rateAnswer(result.attempts || 1, result.word.word.length, result.correct);
        updatedWords[wordIndex] = updateWordStats(result.word, result.correct, result.attempts, quality);
      }
    });
    setWords(updatedWords);
    storage.saveWords(updatedWords);

    // Update stats
    const updatedStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalWordsReviewed: stats.totalWordsReviewed + sessionResults.length,
      totalCorrect: stats.totalCorrect + sessionResults.filter(r => r.correct).length,
      totalIncorrect: stats.totalIncorrect + sessionResults.filter(r => !r.correct).length,
      lastPracticeDate: new Date().toISOString(),
      practiceDays: updatePracticeDays(stats.practiceDays),
      currentStreak: calculateStreak(stats.practiceDays),
      bestStreak: Math.max(stats.bestStreak, calculateStreak(stats.practiceDays)),
    };
    setStats(updatedStats);
    storage.saveStats(updatedStats);

    setView('dashboard');
  };

  const updatePracticeDays = (practiceDays) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = [...new Set([...practiceDays, today])];
    return updated;
  };

  const calculateStreak = (practiceDays) => {
    if (practiceDays.length === 0) return 0;

    const sorted = [...practiceDays].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
      const day = sorted[i];
      const expectedDate = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      if (day === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      const initialized = initializeWords(initialWords);
      setWords(initialized);
      setStats(defaultStats);
      storage.saveWords(initialized);
      storage.saveStats(defaultStats);
      setView('home');
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading VocaBuilder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {view === 'home' && (
        <Home
          stats={stats}
          onStartSession={startSession}
          setView={setView}
        />
      )}

      {view === 'practice' && (
        <Practice
          words={sessionWords}
          onComplete={completeSession}
          onBack={() => setView('home')}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          words={words}
          stats={stats}
          setView={setView}
          onStartSession={startSession}
        />
      )}

      {view === 'settings' && (
        <Settings
          settings={settings}
          onSave={saveSettings}
          onResetData={resetData}
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}

export default App;
