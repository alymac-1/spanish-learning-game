import React from 'react';
import { X } from 'lucide-react';

const Settings = ({ settings, setSettings, setShowSettings }) => {
  // Provide default settings structure if undefined
  const safeSettings = {
    masteryThreshold: 0.8,
    spacedRepetitionEnabled: true,
    reviewInterval: 24,
    difficultyAdjustment: true,
    maxReviewsPerSession: 50,
    questionTypes: ['translation', 'multipleChoice', 'fillBlank'],
    enabledQuestionTypes: ['translation', 'multipleChoice', 'fillBlank'],
    enablePronunciation: true,
    enableHints: true,
    sessionGoal: 20,
    streakBonus: true,
    ...settings // Merge with actual settings if they exist
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...safeSettings, [key]: value };
    setSettings(newSettings);
  };

  const handleQuestionTypeToggle = (questionType) => {
    const currentTypes = safeSettings.enabledQuestionTypes || [];
    let newTypes;
    
    if (currentTypes.includes(questionType)) {
      // Remove the question type
      newTypes = currentTypes.filter(type => type !== questionType);
    } else {
      // Add the question type
      newTypes = [...currentTypes, questionType];
    }
    
    // Ensure at least one question type is enabled
    if (newTypes.length === 0) {
      newTypes = ['translation']; // Default fallback
    }
    
    handleSettingChange('enabledQuestionTypes', newTypes);
  };

  const questionTypeOptions = [
    { id: 'translation', label: 'Translation', description: 'Translate words between Spanish and English' },
    { id: 'multipleChoice', label: 'Multiple Choice', description: 'Choose the correct translation from options' },
    { id: 'fillBlank', label: 'Fill in the Blank', description: 'Complete sentences with missing words' },
    { id: 'pronunciation', label: 'Pronunciation', description: 'Listen and type what you hear' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Learning Settings</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Mastery Settings */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-blue-800">Mastery & Progress</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mastery Threshold: {Math.round(safeSettings.masteryThreshold * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.1"
                  value={safeSettings.masteryThreshold}
                  onChange={(e) => handleSettingChange('masteryThreshold', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Words need this accuracy percentage to be considered mastered
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Goal: {safeSettings.sessionGoal} words
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={safeSettings.sessionGoal}
                  onChange={(e) => handleSettingChange('sessionGoal', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Spaced Repetition Settings */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-green-800">Spaced Repetition</h4>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={safeSettings.spacedRepetitionEnabled}
                  onChange={(e) => handleSettingChange('spacedRepetitionEnabled', e.target.checked)}
                  className="rounded text-green-600"
                />
                <span className="ml-2">Enable Spaced Repetition</span>
              </label>

              {safeSettings.spacedRepetitionEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Review Interval: {safeSettings.reviewInterval} hours
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="72"
                    step="1"
                    value={safeSettings.reviewInterval}
                    onChange={(e) => handleSettingChange('reviewInterval', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Reviews per Session: {safeSettings.maxReviewsPerSession}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={safeSettings.maxReviewsPerSession}
                  onChange={(e) => handleSettingChange('maxReviewsPerSession', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Question Types */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-purple-800">Question Types</h4>
            
            <div className="space-y-3">
              {questionTypeOptions.map(option => (
                <label key={option.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={safeSettings.enabledQuestionTypes?.includes(option.id) || false}
                    onChange={() => handleQuestionTypeToggle(option.id)}
                    className="mt-1 rounded text-purple-600"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Learning Features */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-yellow-800">Learning Features</h4>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Adaptive Difficulty</span>
                <input
                  type="checkbox"
                  checked={safeSettings.difficultyAdjustment}
                  onChange={(e) => handleSettingChange('difficultyAdjustment', e.target.checked)}
                  className="rounded text-yellow-600"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Pronunciation Practice</span>
                <input
                  type="checkbox"
                  checked={safeSettings.enablePronunciation}
                  onChange={(e) => handleSettingChange('enablePronunciation', e.target.checked)}
                  className="rounded text-yellow-600"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Hints Available</span>
                <input
                  type="checkbox"
                  checked={safeSettings.enableHints}
                  onChange={(e) => handleSettingChange('enableHints', e.target.checked)}
                  className="rounded text-yellow-600"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Streak Bonus Points</span>
                <input
                  type="checkbox"
                  checked={safeSettings.streakBonus}
                  onChange={(e) => handleSettingChange('streakBonus', e.target.checked)}
                  className="rounded text-yellow-600"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Reset to defaults
              setSettings({
                masteryThreshold: 0.8,
                spacedRepetitionEnabled: true,
                reviewInterval: 24,
                difficultyAdjustment: true,
                maxReviewsPerSession: 50,
                enabledQuestionTypes: ['translation', 'multipleChoice', 'fillBlank'],
                enablePronunciation: true,
                enableHints: true,
                sessionGoal: 20,
                streakBonus: true
              });
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
