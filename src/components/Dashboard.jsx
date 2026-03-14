import React, { useMemo } from 'react';

function Dashboard({ words, stats, setView, onStartSession }) {
  const wordStats = useMemo(() => {
    return {
      total: words.length,
      new: words.filter(w => w.state === 'new').length,
      learning: words.filter(w => w.state === 'learning').length,
      review: words.filter(w => w.state === 'review').length,
      mastered: words.filter(w => w.state === 'mastered').length,
    };
  }, [words]);

  const categoryStats = useMemo(() => {
    const categories = {};
    words.forEach(word => {
      const cat = word.category || 'other';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories).sort((a, b) => b[1] - a[1]);
  }, [words]);

  const today = new Date().toISOString().split('T')[0];
  const practicedToday = stats.practiceDays?.includes(today);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {practicedToday ? '✅ You practiced today!' : '📅 No practice yet today'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('home')}
              className="btn-ghost"
            >
              Home
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.currentStreak}</div>
            <div className="text-blue-100">Current Streak</div>
            {stats.currentStreak > 0 && <div className="text-2xl mt-1">🔥</div>}
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalWordsReviewed}</div>
            <div className="text-purple-100">Total Words</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold mb-1">
              {stats.totalWordsReviewed > 0 ? Math.round((stats.totalCorrect / stats.totalWordsReviewed) * 100) : 0}%
            </div>
            <div className="text-green-100">Accuracy</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalSessions}</div>
            <div className="text-orange-100">Sessions</div>
          </div>
        </div>

        {/* Word Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Word Progress
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-blue-600 font-semibold">New</span>
                <span className="text-gray-600 dark:text-gray-400">{wordStats.new} words</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(wordStats.new / wordStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-yellow-600 font-semibold">Learning</span>
                <span className="text-gray-600 dark:text-gray-400">{wordStats.learning} words</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(wordStats.learning / wordStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-purple-600 font-semibold">Review</span>
                <span className="text-gray-600 dark:text-gray-400">{wordStats.review} words</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(wordStats.review / wordStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-green-600 font-semibold">Mastered</span>
                <span className="text-gray-600 dark:text-gray-400">{wordStats.mastered} words</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(wordStats.mastered / wordStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Words by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categoryStats.slice(0, 6).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onStartSession('quick')}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Quick Practice
            </button>
            <button
              onClick={() => onStartSession('daily')}
              className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Daily Review
            </button>
            <button
              onClick={() => onStartSession('new')}
              className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              New Words
            </button>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
          <div className="flex justify-center gap-4 flex-wrap">
            <span>🏆 Best Streak: {stats.bestStreak} days</span>
            <span>✅ Correct: {stats.totalCorrect}</span>
            <span>❌ Incorrect: {stats.totalIncorrect}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
