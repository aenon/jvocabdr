import React from 'react';

function Home({ stats, onStartSession, setView }) {
  const sessionTypes = [
    {
      id: 'quick',
      name: 'Quick Practice',
      description: '10-15 words, 5-10 minutes',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-600'
    },
    {
      id: 'daily',
      name: 'Daily Review',
      description: 'All words due for review',
      icon: '📅',
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      id: 'new',
      name: 'New Words',
      description: 'Learn fresh vocabulary',
      icon: '✨',
      color: 'from-green-400 to-emerald-600',
      textColor: 'text-green-600'
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VocaBuilder 🦀
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Build your vocabulary with spaced repetition
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats.totalWordsReviewed}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Words Reviewed
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.totalSessions}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Sessions
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {stats.currentStreak}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Day Streak 🔥
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {stats.totalWordsReviewed > 0 ? Math.round((stats.totalCorrect / stats.totalWordsReviewed) * 100) : 0}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Accuracy
            </div>
          </div>
        </div>

        {/* Session Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Start a Session
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sessionTypes.map((session) => (
              <button
                key={session.id}
                onClick={() => onStartSession(session.id)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className="text-4xl mb-3">{session.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                  {session.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {session.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-gray-100">Dashboard</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">View detailed statistics</div>
            </div>
          </button>

          <button
            onClick={() => setView('settings')}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <span className="text-2xl">⚙️</span>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-gray-100">Settings</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Customize your experience</div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>Built with React & Spaced Repetition</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
