import React from 'react';

const Settings = ({
  settings,
  setSettings,
  setShowSettings
}) => {
  const questionTypes = [
    { id: 'translation', name: 'Spanish → English', icon: '🇪🇸➡️🇺🇸' },
    { id: 'reverse', name: 'English → Spanish', icon: '🇺🇸➡️🇪🇸' },
    { id: 'multiple', name: 'Multiple Choice', icon: '📝' },
    { id: 'fillblank', name: 'Fill in the Blank', icon: '✏️' },
    { id: 'pronunciation', name: 'Pronunciation', icon: '🔊' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Learning Settings</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Question Type Preferences */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Question Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {questionTypes.map(type => (
                <label key={type.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={settings.questionTypes.includes(type.id)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...settings.questionTypes, type.id]
                        : settings.questionTypes.filter(t => t !== type.id);
                      setSettings({ ...settings, questionTypes: newTypes });
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">{type.icon} {type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Spaced Repetition */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Spaced Repetition</h4>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={settings.spacedRepetitionEnabled}
                onChange={(e) => setSettings({ ...settings, spacedRepetitionEnabled: e.target.checked })}
                className="rounded text-blue-600"
              />
              <div>
                <div className="font-medium">Enable Spaced Repetition</div>
                <div className="text-sm text-gray-600">Optimize review timing based on memory retention</div>
              </div>
            </label>
          </div>

          {/* Pronunciation Hints */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Pronunciation</h4>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={settings.pronunciationHints}
                onChange={(e) => setSettings({ ...settings, pronunciationHints: e.target.checked })}
                className="rounded text-blue-600"
              />
              <div>
                <div className="font-medium">Show Pronunciation Hints</div>
                <div className="text-sm text-gray-600">Display phonetic pronunciation guides</div>
              </div>
            </label>
          </div>

          {/* Difficulty Settings */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Difficulty</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block font-medium mb-2">Mastery Threshold</label>
                <input
                  type="range"
                  min="0.7"
                  max="1.0"
                  step="0.05"
                  value={settings.masteryThreshold}
                  onChange={(e) => setSettings({ ...settings, masteryThreshold: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  Consider words mastered at {(settings.masteryThreshold * 100).toFixed(0)}% proficiency
                </div>
              </div>
            </div>
          </div>

          {/* Reset Progress */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-red-600">Danger Zone</h4>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
