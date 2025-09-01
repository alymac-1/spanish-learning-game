// src/components/SpanishLearningGame.js - Updated with Save/Load Integration
import React, { useState, useEffect } from 'react';
import LevelSelection from './LevelSelection';
//import GameInterface from './GameInterface';
import Analytics from './Analytics';
import Settings from './Settings';
import RandomConfig from './RandomConfig';
import { useWordStats } from '../utils/wordUtils';
import { autoSaveProgress } from '../utils/saveUtils';
import { Trophy, Star, BarChart3, Lightbulb, LightbulbOff, RotateCcw, Brain, CheckCircle, XCircle, Download, Upload, FileText } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';

const SpanishLearningGame = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRandomConfig, setShowRandomConfig] = useState(false);
  const [selectedLevelsForRandom, setSelectedLevelsForRandom] = useState({
    A1: true,
    A2: true,
    B1: true,
    B2: true
  });

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [fillBlankSentence, setFillBlankSentence] = useState('');
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  
  // Use the custom hook for word management
  const {
    wordStats,
    availableWords,
    currentWord,
    questionType,
    userAnswer,
    selectedChoice,
    feedback,
    score,
    streak,
    wordsCompleted,
    sessionStats,
    settings,
    setSettings,
    initializeWordPool,
    generateNextQuestion,
    checkAnswer,
    setUserAnswer,
    setSelectedChoice,
    setFeedback,
    setScore,
    setStreak,
    setWordsCompleted
  } = useWordStats();

  // Auto-save progress periodically
  useEffect(() => {
    if (gameStarted && wordsCompleted > 0) {
      const gameState = {
        wordStats,
        sessionStats,
        settings,
        score,
        streak,
        wordsCompleted,
        selectedLevel,
        selectedTopic,
        isRandomMode,
        selectedLevelsForRandom
      };
      
      // Auto-save every 5 questions
      if (wordsCompleted % 5 === 0) {
        autoSaveProgress(gameState);
      }
    }
  }, [wordsCompleted, gameStarted]);

  const handleLoadGameData = (loadedData) => {
    try {
      // Apply loaded settings
      if (loadedData.settings) {
        setSettings(loadedData.settings);
      }

      // Apply game progress
      if (loadedData.gameProgress) {
        setScore(loadedData.gameProgress.totalScore || 0);
        setStreak(loadedData.gameProgress.currentStreak || 0);
        setWordsCompleted(loadedData.gameProgress.wordsCompleted || 0);
        
        // Resume game state if applicable
        if (loadedData.gameProgress.selectedLevel) {
          setSelectedLevel(loadedData.gameProgress.selectedLevel);
          setSelectedTopic(loadedData.gameProgress.selectedTopic);
          setIsRandomMode(loadedData.gameProgress.isRandomMode || false);
          setSelectedLevelsForRandom(loadedData.gameProgress.selectedLevelsForRandom || {
            A1: true, A2: true, B1: true, B2: true
          });
        }
      }

      // The wordStats will be handled by the useWordStats hook if we pass it the loaded data
      console.log('Game data loaded successfully:', loadedData);
      
      return true;
    } catch (error) {
      console.error('Failed to apply loaded data:', error);
      return false;
    }
  };

  const startRandomMode = () => {
    const selectedLevelCount = Object.values(selectedLevelsForRandom).filter(Boolean).length;
    if (selectedLevelCount === 0) {
      alert('Please select at least one level for random mode.');
      return;
    }
    setShowRandomConfig(false);
    startGame('ALL', 'ALL', true);
  };

  const startGame = (level, topic, randomMode = false) => {
    setSelectedLevel(level);
    setSelectedTopic(topic);
    setIsRandomMode(randomMode);
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setWordsCompleted(0);
    setFeedback(null);
    
    initializeWordPool(level, topic, randomMode, selectedLevelsForRandom);
  };

  const resetGame = () => {
    setSelectedLevel(null);
    setSelectedTopic(null);
    setIsRandomMode(false);
    setGameStarted(false);
    setFeedback(null);
    setShowAnalytics(false);
    setShowSettings(false);
    setShowRandomConfig(false);
  };

  if (!gameStarted) {
    return (
      <LevelSelection
        hintsEnabled={hintsEnabled}
        setHintsEnabled={setHintsEnabled}
        showRandomConfig={showRandomConfig}
        setShowRandomConfig={setShowRandomConfig}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        startGame={startGame}
        selectedLevelsForRandom={selectedLevelsForRandom}
        setSelectedLevelsForRandom={setSelectedLevelsForRandom}
        startRandomMode={startRandomMode}
        settings={settings}
        setSettings={setSettings}
      />
    );
  }

  return (
    <>
      <GameInterface
        selectedLevel={selectedLevel}
        selectedTopic={selectedTopic}
        isRandomMode={isRandomMode}
        hintsEnabled={hintsEnabled}
        setHintsEnabled={setHintsEnabled}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        resetGame={resetGame}
        currentWord={currentWord}
        questionType={questionType}
        userAnswer={userAnswer}
        selectedChoice={selectedChoice}
        feedback={feedback}
        score={score}
        streak={streak}
        wordsCompleted={wordsCompleted}
        sessionStats={sessionStats}
        wordStats={wordStats}
        settings={settings}
        selectedLevelsForRandom={selectedLevelsForRandom}
        checkAnswer={checkAnswer}
        setUserAnswer={setUserAnswer}
        setSelectedChoice={setSelectedChoice}
        generateNextQuestion={generateNextQuestion}
        levels={{}} // Pass levels object here
        multipleChoiceOptions={multipleChoiceOptions}
        fillBlankSentence={fillBlankSentence}
        fillBlankAnswer={fillBlankAnswer}
        onLoadGameData={handleLoadGameData}
      />
      
      {showAnalytics && (
        <Analytics
          sessionStats={sessionStats}
          wordStats={wordStats}
          settings={settings}
          setShowAnalytics={setShowAnalytics}
          wordsCompleted={wordsCompleted}
        />
      )}
      
      {showSettings && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          setShowSettings={setShowSettings}
        />
      )}
      
      {showRandomConfig && (
        <RandomConfig
          selectedLevelsForRandom={selectedLevelsForRandom}
          setSelectedLevelsForRandom={setSelectedLevelsForRandom}
          setShowRandomConfig={setShowRandomConfig}
          startRandomMode={startRandomMode}
        />
      )}
    </>
  );
};


export const saveGameData = (gameState) => {
  try {
    const saveData = {
      timestamp: Date.now(),
      version: '1.0',
      wordStats: Array.from(gameState.wordStats.entries()).map(([key, stats]) => ({
        key,
        ...stats,
        learningHistory: stats.learningHistory || []
      })),
      sessionStats: {
        ...gameState.sessionStats,
        totalPlayTime: gameState.sessionStats.startTime 
          ? Date.now() - gameState.sessionStats.startTime 
          : 0
      },
      settings: gameState.settings,
      gameProgress: {
        totalScore: gameState.score,
        currentStreak: gameState.streak,
        wordsCompleted: gameState.wordsCompleted,
        selectedLevel: gameState.selectedLevel,
        selectedTopic: gameState.selectedTopic,
        isRandomMode: gameState.isRandomMode,
        selectedLevelsForRandom: gameState.selectedLevelsForRandom
      }
    };

    // Create downloadable file
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `spanish-learning-progress-${dateStr}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return { success: true, message: 'Progress saved successfully!' };
  } catch (error) {
    console.error('Save failed:', error);
    return { success: false, message: 'Failed to save progress. Please try again.' };
  }
};

export const loadGameData = (fileData) => {
  try {
    const data = JSON.parse(fileData);
    
    // Validate data structure
    if (!data.version || !data.wordStats || !data.sessionStats) {
      throw new Error('Invalid save file format');
    }
    
    // Convert wordStats back to Map
    const wordStatsMap = new Map();
    data.wordStats.forEach(({ key, ...stats }) => {
      wordStatsMap.set(key, {
        ...stats,
        learningHistory: stats.learningHistory || [],
        nextReview: new Date(stats.nextReview),
        lastSeen: stats.lastSeen ? new Date(stats.lastSeen) : null,
        lastCorrect: stats.lastCorrect ? new Date(stats.lastCorrect) : null
      });
    });
    
    return {
      success: true,
      data: {
        wordStats: wordStatsMap,
        sessionStats: data.sessionStats,
        settings: data.settings,
        gameProgress: data.gameProgress
      }
    };
  } catch (error) {
    console.error('Load failed:', error);
    return { success: false, message: 'Failed to load progress. Invalid file format.' };
  }
};

export const exportLearningReport = (gameState) => {
  try {
    const analytics = calculateAnalytics(gameState);
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalWords: analytics.totalWords,
        masteredWords: analytics.masteredWords,
        averageAccuracy: analytics.averageAccuracy,
        totalStudyTime: analytics.sessionTime,
        wordsPerMinute: analytics.wordsPerMinute,
        currentStreak: gameState.streak,
        bestStreak: gameState.sessionStats.streakRecord
      },
      wordProgress: Array.from(gameState.wordStats.entries()).map(([key, stats]) => ({
        word: key,
        spanish: stats.word?.spanish || 'Unknown',
        english: stats.word?.english || 'Unknown',
        masteryLevel: (stats.masteryLevel * 100).toFixed(1) + '%',
        timesCorrect: stats.timesCorrect,
        timesShown: stats.timesShown,
        accuracy: stats.timesShown > 0 ? ((stats.timesCorrect / stats.timesShown) * 100).toFixed(1) + '%' : '0%',
        nextReview: stats.nextReview.toLocaleDateString()
      })),
      difficultWords: gameState.sessionStats.difficultWords.map(wordKey => {
        const stats = gameState.wordStats.get(wordKey);
        return {
          word: wordKey,
          accuracy: stats && stats.timesShown > 0 
            ? ((stats.timesCorrect / stats.timesShown) * 100).toFixed(1) + '%' 
            : '0%'
        };
      })
    };

    // Create CSV format for easy viewing
    let csvContent = "Spanish Learning Progress Report\n";
    csvContent += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += "SUMMARY\n";
    csvContent += `Total Words,${reportData.summary.totalWords}\n`;
    csvContent += `Mastered Words,${reportData.summary.masteredWords}\n`;
    csvContent += `Average Accuracy,${reportData.summary.averageAccuracy.toFixed(1)}%\n`;
    csvContent += `Study Time,${reportData.summary.totalStudyTime.toFixed(1)} minutes\n`;
    csvContent += `Words Per Minute,${reportData.summary.wordsPerMinute.toFixed(1)}\n\n`;
    
    csvContent += "WORD PROGRESS\n";
    csvContent += "Spanish,English,Mastery Level,Correct,Total,Accuracy,Next Review\n";
    reportData.wordProgress.forEach(word => {
      csvContent += `${word.spanish},${word.english},${word.masteryLevel},${word.timesCorrect},${word.timesShown},${word.accuracy},${word.nextReview}\n`;
    });

    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spanish-learning-report-${new Date().toISOString().split('T')[0]}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return { success: true, message: 'Learning report exported successfully!' };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, message: 'Failed to export report. Please try again.' };
  }
};

const calculateAnalytics = (gameState) => {
  const totalWords = gameState.wordStats.size;
  const masteredWords = Array.from(gameState.wordStats.values())
    .filter(stat => stat.masteryLevel >= gameState.settings.masteryThreshold).length;
  const averageAccuracy = gameState.sessionStats.questionsAnswered > 0 
    ? (gameState.sessionStats.correctAnswers / gameState.sessionStats.questionsAnswered) * 100 
    : 0;
  const sessionTime = gameState.sessionStats.startTime 
    ? (Date.now() - gameState.sessionStats.startTime) / 1000 / 60 
    : 0;
  
  return {
    totalWords,
    masteredWords,
    averageAccuracy,
    sessionTime,
    wordsPerMinute: sessionTime > 0 ? gameState.wordsCompleted / sessionTime : 0
  };
};

// Auto-save functionality (saves to localStorage as backup)
// src/components/GameInterface.js - Updated with Save Button
//import { saveGameData, loadGameData, exportLearningReport } from '../utils/saveUtils';

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
  levels,
  multipleChoiceOptions,
  fillBlankSentence,
  fillBlankAnswer,
  // Save/Load functions that should be passed from parent
  onLoadGameData
}) => {
  const [saveMessage, setSaveMessage] = useState('');
  const [showSaveOptions, setShowSaveOptions] = useState(false);

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
      wordsPerMinute: sessionTime > 0 ? wordsCompleted / sessionTime : 0
    };
  };

  const getCurrentWordStats = () => {
    if (!currentWord) return null;
    const key = `${currentWord.spanish}-${currentWord.english}`;
    return wordStats.get(key);
  };

  const handleSave = () => {
    const gameState = {
      wordStats,
      sessionStats,
      settings,
      score,
      streak,
      wordsCompleted,
      selectedLevel,
      selectedTopic,
      isRandomMode,
      selectedLevelsForRandom
    };

    const result = saveGameData(gameState);
    setSaveMessage(result.message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = loadGameData(e.target.result);
      if (result.success && onLoadGameData) {
        onLoadGameData(result.data);
        setSaveMessage('Progress loaded successfully!');
      } else {
        setSaveMessage(result.message);
      }
      setTimeout(() => setSaveMessage(''), 3000);
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleExportReport = () => {
    const gameState = {
      wordStats,
      sessionStats,
      settings,
      score,
      streak,
      wordsCompleted
    };

    const result = exportLearningReport(gameState);
    setSaveMessage(result.message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const currentStats = getCurrentWordStats();
  const analytics = getAnalyticsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">{score}</span>
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {analytics.masteredWords}/{analytics.totalWords} mastered
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-700">{streak}</span>
            </div>
            
            {/* Save/Load Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSaveOptions(!showSaveOptions)}
                className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors"
                title="Save/Load Options"
              >
                <Download className="w-5 h-5 text-indigo-600" />
              </button>
              
              {showSaveOptions && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                  <button
                    onClick={handleSave}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                  >
                    <Download className="w-4 h-4 text-green-600" />
                    Save Progress
                  </button>
                  
                  <label className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 cursor-pointer border-b border-gray-100">
                    <Upload className="w-4 h-4 text-blue-600" />
                    Load Progress
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleLoad}
                      className="hidden"
                    />
                  </label>
                  
                  <button
                    onClick={handleExportReport}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    Export Report
                  </button>
                  
                  <button
                    onClick={() => setShowSaveOptions(false)}
                    className="w-full px-4 py-2 text-center text-gray-500 hover:bg-gray-50 text-sm"
                  >
                    Close
                  </button>
                </div>
              )}
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

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            saveMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="text-center mb-6">
          {isRandomMode ? (
            <div>
              <h2 className="text-lg text-purple-600 mb-1 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                Smart Random Mode
              </h2>
              <p className="text-sm text-gray-500">
                AI-optimized learning • {Object.entries(selectedLevelsForRandom)
                  .filter(([_, selected]) => selected)
                  .map(([level]) => level)
                  .join(', ')} levels
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg text-gray-600 mb-1">{levels[selectedLevel].name}</h2>
              <h3 className="text-md text-gray-500 mb-2 capitalize">{selectedTopic} Topic</h3>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>Words: {wordsCompleted}</span>
            <span>Accuracy: {analytics.averageAccuracy.toFixed(1)}%</span>
            <span>WPM: {analytics.wordsPerMinute.toFixed(1)}</span>
          </div>
          
          {currentStats && currentStats.timesShown > 0 && (
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>This word: {Math.round((currentStats.timesCorrect / currentStats.timesShown) * 100)}%</span>
              <span>Mastery: {Math.round(currentStats.masteryLevel * 100)}%</span>
              {settings.spacedRepetitionEnabled && (
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

        {streak > 0 && (
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
        
        {/* Auto-save indicator */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            💾 Progress is automatically tracked • Use save button to download backup
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
