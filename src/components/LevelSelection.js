import React from 'react';
import { Brain, Lightbulb, LightbulbOff, Shuffle, Settings } from 'lucide-react';
import { levels } from '../data/words';

const LevelSelection = ({
  hintsEnabled,
  setHintsEnabled,
  showRandomConfig,
  setShowRandomConfig,
  showSettings,
  setShowSettings,
  startGame,
  selectedLevelsForRandom,
  setSelectedLevelsForRandom,
  startRandomMode,
  settings,
  setSettings
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Enhanced Spanish Learning</h1>
          <p className="text-gray-600 mb-6">Powered by AI-driven spaced repetition and adaptive learning</p>
          
          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setHintsEnabled(!hintsEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hintsEnabled 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {hintsEnabled ? <Lightbulb className="w-5 h-5" /> : <LightbulbOff className="w-5 h-5" />}
              {hintsEnabled ? 'Hints On' : 'Hints Off'}
            </button>
            
            <button
              onClick={() => setShowRandomConfig(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <Shuffle className="w-5 h-5" />
              Smart Random Mode
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {Object.entries(levels).map(([levelKey, level]) => (
            <div key={levelKey} className="border-2 border-blue-200 rounded-xl p-4">
              <h3 className="text-xl font-bold mb-3 text-gray-800">{level.name}</h3>
              <div className="grid gap-2">
                {Object.entries(level.topics).map(([topicKey, words]) => (
                  <button
                    key={`${levelKey}-${topicKey}`}
                    onClick={() => startGame(levelKey, topicKey)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold capitalize">{topicKey}</span>
                      <span className="text-blue-100 text-sm">{words.length} words</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <h4 className="font-bold text-purple-800 mb-2">🧠 Advanced Learning Features:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• <strong>SM2 Spaced Repetition:</strong> Optimal review timing based on forgetting curve</li>
            <li>• <strong>Adaptive Difficulty:</strong> Questions adjust to your learning progress</li>
            <li>• <strong>Mastery Tracking:</strong> Real-time progress monitoring per word</li>
            <li>• <strong>Performance Analytics:</strong> Detailed learning insights and trends</li>
            <li>• <strong>Contextual Learning:</strong> Sentences, pronunciation, and cultural hints</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
