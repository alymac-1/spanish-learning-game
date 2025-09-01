import React from 'react';
import { Trophy, Star, BarChart3, Settings, Lightbulb, LightbulbOff, RotateCcw, Brain, CheckCircle, XCircle } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';
import { levels } from '../data/words'; // Import levels directly

const GameInterface = ({
  selectedLevel,
  selectedTopic,
  isRandomMode,
  hintsEnabled,
  setHintsEnabled,
  showAnalytics,
  setShowAnalytics,
  showSettings,
  setShowSettings,
  resetGame,
  currentWord,
  questionType,
  userAnswer,
  selectedChoice,
  feedback,
  score,
  streak,
  wordsCompleted,
  sessionStats,
  wordStats,
  settings,
  selectedLevelsForRandom,
  checkAnswer,
  setUserAnswer,
  setSelectedChoice,
  generateNextQuestion,
  // Add these missing props with defaults
  multipleChoiceOptions = [],
  fillBlankSentence = '',
  fillBlankAnswer = ''
}) => {
  const getAnalyticsData = () => {
    const totalWords = wordStats ? wordStats.size : 0;
    const masteredWords = wordStats ? 
      Array.from(wordStats.values()).filter(stat => 
        stat && stat.masteryLevel >= (settings?.masteryThreshold || 0.8)
      ).length : 0;
    const averageAccuracy = sessionStats?.questionsAnswered > 0 ? 
      (sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100 : 0;
    const sessionTime = sessionStats?.startTime ? 
      (Date.now() - sessionStats.startTime) / 1000 / 60 : 0;
    
    return {
      totalWords,
      masteredWords,
      averageAccuracy,
      sessionTime,
      wordsPerMinute: sessionTime > 0 ? wordsCompleted / sessionTime : 0
    };
  };

  const getCurrentWordStats = () => {
    if (!currentWord || !wordStats) return null;
    const key = `${currentWord.spanish}-${currentWord.english}`;
    return wordStats.get(key);
  };

  const currentStats = getCurrentWordStats();
  const analytics = getAnalyticsData();

  // Safe access to levels
  const currentLevelName = selectedLevel && levels && levels[selectedLevel] ? 
    levels[selectedLevel].name : 'Unknown Level';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">{score || 0}</span>
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {analytics.masteredWords}/{analytics.totalWords} mastered
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-700">{streak || 0}</span>
            </div>
            <button
              onClick={() => setShowAnalytics(true)}
              className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
              title="View Analytics"
            >
              <BarChart3 className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setHintsEnabled(!hintsEnabled)}
              className={`p-2 rounded-full transition-colors ${
                hintsEnabled 
                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={hintsEnabled ? 'Disable hints' : 'Enable hints'}
            >
              {hintsEnabled ? <Lightbulb className="w-5 h-5" /> : <LightbulbOff className="w-5 h-5" />}
            </button>
            <button
              onClick={resetGame}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Reset Game"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          {isRandomMode ? (
            <div>
              <h2 className="text-lg text-purple-600 mb-1 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                Smart Random Mode
              </h2>
              <p className="text-sm text-gray-500">
                AI-optimized learning • {selectedLevelsForRandom ? 
                  Object.entries(selectedLevelsForRandom)
                    .filter(([_, selected]) => selected)
                    .map(([level]) => level)
                    .join(', ') : 'All'} levels
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg text-gray-600 mb-1">{currentLevelName}</h2>
              <h3 className="text-md text-gray-500 mb-2 capitalize">{selectedTopic || 'Unknown'} Topic</h3>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>Words: {wordsCompleted || 0}</span>
            <span>Accuracy: {analytics.averageAccuracy.toFixed(1)}%</span>
            <span>WPM: {analytics.wordsPerMinute.toFixed(1)}</span>
          </div>
          
          {currentStats && currentStats.timesShown > 0 && (
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>This word: {Math.round((currentStats.timesCorrect / currentStats.timesShown) * 100)}%</span>
              <span>Mastery: {Math.round(currentStats.masteryLevel * 100)}%</span>
              {settings?.spacedRepetitionEnabled && currentStats.nextReview && (
                <span>Next review: {new Date(currentStats.nextReview).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>

        {currentWord && (
          <QuestionRenderer
            currentWord={currentWord}
            questionType={questionType}
            userAnswer={userAnswer}
            selectedChoice={selectedChoice}
            feedback={feedback}
            hintsEnabled={hintsEnabled}
            settings={settings}
            setUserAnswer={setUserAnswer}
            setSelectedChoice={setSelectedChoice}
            checkAnswer={checkAnswer}
            multipleChoiceOptions={multipleChoiceOptions}
            fillBlankSentence={fillBlankSentence}
            fillBlankAnswer={fillBlankAnswer}
          />
        )}

        {feedback && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${
            feedback.type === 'correct' 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}>
            {feedback.type === 'correct' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
            <div>
              <span className="font-semibold">{feedback.message}</span>
              {feedback.details && (
                <div className="text-sm opacity-80 mt-1">{feedback.details}</div>
              )}
            </div>
          </div>
        )}

        {streak > 0 && sessionStats && (
          <div className="text-center">
            <p className="text-orange-600 font-semibold">
              🔥 {streak} streak! +{streak * 2} bonus points per answer!
            </p>
            {streak === sessionStats.streakRecord && streak > 5 && (
              <p className="text-purple-600 text-sm">New personal record! 🎉</p>
            )}
          </div>
        )}
        
        {/* Progress indicator */}
        {analytics.masteredWords > 0 && (
          <div className="mt-4 text-center">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(analytics.masteredWords / analytics.totalWords) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Learning Progress: {((analytics.masteredWords / analytics.totalWords) * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;
