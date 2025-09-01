import React from 'react';

const RandomConfig = ({
  selectedLevelsForRandom,
  setSelectedLevelsForRandom,
  setShowRandomConfig,
  startRandomMode
}) => {
  const levels = ['A1', 'A2', 'B1', 'B2'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Smart Random Mode</h3>
          <button
            onClick={() => setShowRandomConfig(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-3">Select Levels</h4>
            <div className="grid grid-cols-2 gap-3">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={selectedLevelsForRandom[level]}
                    onChange={(e) => setSelectedLevelsForRandom({
                      ...selectedLevelsForRandom,
                      [level]: e.target.checked
                    })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-medium">Level {level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">🎯 Smart Learning</h5>
            <p className="text-sm text-blue-700">
              The AI will automatically select words from your chosen levels based on your learning progress,
              focusing on words that need the most practice using spaced repetition.
            </p>
          </div>

          <button
            onClick={startRandomMode}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Start Smart Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomConfig;
