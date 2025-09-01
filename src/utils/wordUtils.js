import { useState, useEffect } from 'react';
import { calculateSM2, calculateMasteryLevel, getPerformanceRating } from './sm2Algorithm';
import { levels } from '../data/words';

export const useWordStats = () => {
  const [wordStats, setWordStats] = useState(new Map());
  const [availableWords, setAvailableWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [questionType, setQuestionType] = useState('translation');
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    startTime: Date.now(),
    totalTime: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    streakRecord: 0,
    difficultWords: [],
    learningVelocity: 0
  });
  const [settings, setSettings] = useState({
    spacedRepetitionEnabled: true,
    adaptiveDifficulty: true,
    pronunciationHints: true,
    contextualLearning: true,
    masteryThreshold: 0.85,
    reviewInterval: 'optimal',
    questionTypeWeights: {
      translation: 1,
      reverse: 1,
      multiple: 1,
      fillblank: 1,
      pronunciation: 1
    }
  });

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [fillBlankSentence, setFillBlankSentence] = useState('');
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');

  const initializeWordPool = (level, topic, randomMode, selectedLevelsForRandom) => {
    let words = [];
    
    if (randomMode) {
      Object.entries(levels).forEach(([levelKey, levelData]) => {
        if (selectedLevelsForRandom[levelKey]) {
          Object.values(levelData.topics).forEach(topicWords => {
            words = words.concat(topicWords);
          });
        }
      });
    } else {
      words = levels[level].topics[topic];
    }
    
    setAvailableWords(words);
    // For now, just set the first word
    if (words.length > 0) {
      setCurrentWord(words[0]);
    }
  };

  const generateNextQuestion = () => {
    if (availableWords.length === 0) return;
    
    // Simple implementation for now - just get a random word
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    setCurrentWord(word);
    setQuestionType('translation'); // Default to translation for now
    setUserAnswer('');
    setSelectedChoice('');
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    let isCorrect = false;
    switch (questionType) {
      case 'translation':
        isCorrect = userAnswer.toLowerCase().trim() === currentWord.english.toLowerCase();
        break;
      case 'reverse':
        isCorrect = userAnswer.toLowerCase().trim() === currentWord.spanish.toLowerCase();
        break;
      case 'multiple':
        isCorrect = selectedChoice === currentWord.english;
        break;
      case 'fillblank':
        isCorrect = userAnswer.toLowerCase().trim() === fillBlankAnswer.toLowerCase();
        break;
      case 'pronunciation':
        isCorrect = userAnswer.trim().length > 0;
        break;
    }
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setFeedback({ type: 'correct', message: 'Correct!' });
    } else {
      setStreak(0);
      setFeedback({ type: 'incorrect', message: `The answer is "${currentWord.english}"` });
    }
    
    setWordsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      generateNextQuestion();
      setFeedback(null);
    }, 2000);
  };

  return {
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
    setWordsCompleted,
    multipleChoiceOptions,
    fillBlankSentence,
    fillBlankAnswer
  };
};

export const getRandomQuestionType = (enabledTypes) => {
  const availableTypes = enabledTypes.filter(type => 
    ['translation', 'reverse', 'multiple', 'fillblank', 'pronunciation'].includes(type)
  );
  
  if (availableTypes.length === 0) {
    return 'translation'; // Fallback
  }
  
  const weights = {
    translation: 25,
    reverse: 25,
    multiple: 20,
    fillblank: 15,
    pronunciation: 15
  };
  
  const weightedTypes = availableTypes.flatMap(type => 
    Array(weights[type]).fill(type)
  );
  
  return weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
};

export const generateMultipleChoiceOptions = (correctWord, allWords, count = 4) => {
  const options = new Set([correctWord.english]);
  
  while (options.size < Math.min(count, allWords.length + 1)) {
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    options.add(randomWord.english);
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateFillBlankSentence = (word) => {
  const sentences = {
    hola: ["___! ¿Cómo estás?", "Cuando veo a mi amigo, digo ___."],
    gracias: ["Muchas ___ por tu ayuda.", "___ por el regalo."],
    por_favor: ["¿Puedes pasarme el agua, ___?", "___, ¿dónde está el baño?"],
    // Add more sentences for other words
  };
  
  const defaultSentences = [
    `Necesito usar la palabra "${word.spanish}" que significa "${word.english}".`,
    `Complete: La palabra para "${word.english}" es _____.`
  ];
  
  const availableSentences = sentences[word.spanish] || defaultSentences;
  return availableSentences[Math.floor(Math.random() * availableSentences.length)];
};
