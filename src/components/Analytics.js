import React from 'react';

const Analytics = ({
  sessionStats,
  wordStats,
  settings,
  setShowAnalytics,
  wordsCompleted // Add this prop
}) => {
  const getAnalyticsData = () => {
    const totalWords = wordStats.size;
    const masteredWords = Array.from(wordStats.values()).filter(stat => stat.masteryLevel >= settings.masteryThreshold).length;
    const averageAccuracy = sessionStats.questionsAnswered > 0 ? (sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100 : 0;
    const sessionTime = sessionStats.startTime ? (Date.now() - sessionStats.startTime) / 1000 / 60 : 0;
    
    return {
      totalWords,
      masteredWords,
      averageAccuracy,
      sessionTime,
      wordsPerMinute: sessionTime > 0 ? wordsCompleted / sessionTime : 0 // Use the prop here
    };
  };

  const analytics = getAnalyticsData();
  const wordStatsArray = Array.from(wordStats.values());
  const questionTypes = [
    { id: 'translation', name: 'Spanish → English' },
    { id: 'reverse', name: 'English → Spanish' },
    { id: 'multiple', name: 'Multiple Choice' },
    { id: 'fillblank', name: 'Fill in the Blank' },
    { id: 'pronunciation', name: 'Pronunciation' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Learning Analytics</h3>
          <button
            onClick={() => setShowAnalytics(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics.totalWords}</div>
            <div className="text-sm text-blue-800">Total Words</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics.masteredWords}</div>
            <div className="text-sm text-green-800">Mastered Words</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analytics.averageAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-purple-800">Accuracy</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{analytics.wordsPerMinute.toFixed(1)}</div>
            <div className="text-sm text-orange-800">Words/Min</div>
          </div>
        </div>

        {/* Mastery Progress */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Mastery Progress</h4>
          <div className="space-y-2">
            {wordStatsArray.slice(0, 10).map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium truncate">{stat.word.spanish}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stat.masteryLevel * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 w-12">
                  {(stat.masteryLevel * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Type Performance */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Question Type Performance</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {questionTypes.map(type => {
              const typeStats = wordStatsArray.reduce((acc, stat) => {
                const typeData = stat.questionTypeStats[type.id];
                acc.correct += typeData.correct;
                acc.total += typeData.total;
                return acc;
              }, { correct: 0, total: 0 });
              
              const accuracy = typeStats.total > 0 ? (typeStats.correct / typeStats.total) * 100 : 0;
              
              return (
                <div key={type.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-lg font-bold">{accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">{type.name}</div>
                  <div className="text-xs text-gray-500">{typeStats.correct}/{typeStats.total}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficult Words */}
        {sessionStats.difficultWords.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Words to Review</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sessionStats.difficultWords.slice(-6).map((wordKey, index) => {
                const stat = wordStats.get(wordKey);
                if (!stat) return null;
                return (
                  <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="font-semibold text-red-800">{stat.word.spanish}</div>
                    <div className="text-sm text-red-600">{stat.word.english}</div>
                    <div className="text-xs text-red-500">
                      {stat.timesShown > 0 ? `${((stat.timesCorrect/stat.timesShown)*100).toFixed(0)}% accuracy` : 'New word'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Session Timeline */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Session Summary</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">{sessionStats.questionsAnswered}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-xl font-bold">{sessionStats.streakRecord}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold">{analytics.sessionTime.toFixed(1)}m</div>
                <div className="text-sm text-gray-600">Study Time</div>
              </div>
              <div>
                <div className="text-xl font-bold">{sessionStats.score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
