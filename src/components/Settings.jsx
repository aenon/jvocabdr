import React from 'react';

function Settings({ settings, onSave, onResetData, onBack }) {
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleSave = () => {
    onSave(localSettings);
    alert('Settings saved successfully!');
  };

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
  ];

  const sessionTypes = [
    { id: 'quick', name: 'Quick Practice', description: '10-15 words, 5-10 minutes' },
    { id: 'daily', name: 'Daily Review', description: 'All words due for review' },
    { id: 'new', name: 'New Words', description: 'Learn fresh vocabulary' },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your experience
            </p>
          </div>
          <button
            onClick={onBack}
            className="btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Appearance
          </h2>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setLocalSettings({ ...localSettings, theme: theme.id })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    localSettings.theme === theme.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{theme.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Session Preferences
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Default Session Type
            </label>
            <div className="space-y-2">
              {sessionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setLocalSettings({ ...localSettings, sessionType: type.id })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    localSettings.sessionType === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {type.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.showHints}
                onChange={(e) => setLocalSettings({ ...localSettings, showHints: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                Show hints by default
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.keyboardShortcuts}
                onChange={(e) => setLocalSettings({ ...localSettings, keyboardShortcuts: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                Enable keyboard shortcuts
              </span>
            </label>
          </div>
        </div>

        {/* Data Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Data Management
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => {
                const data = localStorage.getItem('vocabuilder-words');
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vocabuilder-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              📥 Export Data
            </button>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
              >
                🗑️ Reset All Progress
              </button>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-300 mb-3 font-semibold">
                  ⚠️ This will delete all your progress and stats. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onResetData}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 btn-primary"
          >
            Save Settings
          </button>
          <button
            onClick={onBack}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
