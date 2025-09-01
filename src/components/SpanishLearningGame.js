import React, { useState, useEffect } from 'react';
import LevelSelection from './LevelSelection';
import GameInterface from './GameInterface';
import Analytics from './Analytics';
import Settings from './Settings';
import RandomConfig from './RandomConfig';
import { useWordStats } from '../utils/wordUtils';

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

export default SpanishLearningGame;
