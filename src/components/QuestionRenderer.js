import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakSpanish, handleStopPronunciation } from '../utils/speechUtils';

const QuestionRenderer = ({
  currentWord,
  questionType,
  userAnswer,
  selectedChoice,
  feedback,
  hintsEnabled,
  settings,
  setUserAnswer,
  setSelectedChoice,
  checkAnswer,
  multipleChoiceOptions, // Add this prop
  fillBlankSentence, // Add this prop
  fillBlankAnswer // Add this prop
}) => {
  const questionTypes = [
    { id: 'translation', name: 'Spanish → English', icon: '🇪🇸➡️🇺🇸' },
    { id: 'reverse', name: 'English → Spanish', icon: '🇺🇸➡️🇪🇸' },
    { id: 'multiple', name: 'Multiple Choice', icon: '📝' },
    { id: 'fillblank', name: 'Fill in the Blank', icon: '✏️' },
    { id: 'pronunciation', name: 'Pronunciation', icon: '🔊' }
  ];

  const handlePlayPronunciation = () => {
    if (!currentWord?.spanish) return;
    try {
      speakSpanish(currentWord.spanish, { rate: 0.95, pitch: 1.0 });
    } catch (e) {
      console.warn(e.message);
      alert("Text-to-speech not supported in this browser.");
    }
  };


  const renderQuestion = () => {
    if (!currentWord) return null;

    const questionConfig = questionTypes.find(qt => qt.id === questionType);

    switch (questionType) {
      case 'translation':
        return (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl mb-6">
              <div className="text-sm opacity-80 mb-2">{questionConfig.icon} {questionConfig.name}</div>
              <h3 className="text-3xl font-bold mb-2">{currentWord.spanish}</h3>
              {settings.pronunciationHints && (
                <p className="text-purple-100 text-sm mb-2">/{currentWord.pronunciation}/</p>
              )}
              {hintsEnabled && <p className="text-purple-100 text-sm">Hint: {currentWord.hint}</p>}
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Type the English translation..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
              disabled={feedback !== null}
            />
          </div>
        );

      case 'pronunciation':
        return (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl mb-6">
              <div className="text-sm opacity-80 mb-2">{questionConfig.icon} {questionConfig.name}</div>
              <h3 className="text-3xl font-bold mb-2">{currentWord.spanish}</h3>
              <p className="text-indigo-100 text-lg mb-2">/{currentWord.pronunciation}/</p>
              <p className="text-indigo-100 text-sm">English: {currentWord.english}</p>
            </div>
            <div className="mb-4 flex gap-2 justify-center">
              <button
                type="button"
                onClick={handlePlayPronunciation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm shadow"
                aria-label="Play pronunciation"
                title="Play pronunciation (Spanish)"
              >
                <Volume2 className="w-4 h-4" />
                Play
              </button>
              <button
                type="button"
                onClick={handleStopPronunciation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm"
                aria-label="Stop audio"
                title="Stop audio"
              >
                Stop
              </button>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Type what you heard..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
              disabled={feedback !== null}
            />
          </div>
        );

      case 'reverse':
        return (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl mb-6">
              <div className="text-sm opacity-80 mb-2">{questionConfig.icon} {questionConfig.name}</div>
              <h3 className="text-3xl font-bold mb-2">{currentWord.english}</h3>
              {hintsEnabled && <p className="text-green-100 text-sm">Hint: {currentWord.hint}</p>}
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Type the Spanish translation..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
              disabled={feedback !== null}
            />
          </div>
        );

      case 'multiple':
        return (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl mb-6">
              <div className="text-sm opacity-80 mb-2">{questionConfig.icon} {questionConfig.name}</div>
              <h3 className="text-3xl font-bold mb-2">{currentWord.spanish}</h3>
              {settings.pronunciationHints && (
                <p className="text-blue-100 text-sm mb-2">/{currentWord.pronunciation}/</p>
              )}
              {hintsEnabled && <p className="text-blue-100 text-sm">Hint: {currentWord.hint}</p>}
            </div>
            <div className="grid gap-3 mb-4">
              {multipleChoiceOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedChoice(option)}
                  disabled={feedback !== null}
                  className={`p-4 text-lg border-2 rounded-xl transition-all ${
                    selectedChoice === option
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                  } ${feedback !== null ? 'opacity-60' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'fillblank':
        return (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl mb-6">
              <div className="text-sm opacity-80 mb-2">{questionConfig.icon} {questionConfig.name}</div>
              <h3 className="text-2xl font-bold mb-2">{fillBlankSentence}</h3>
              {hintsEnabled && <p className="text-orange-100 text-sm">English: {currentWord.english}</p>}
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Fill in the blank with the Spanish word..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
              disabled={feedback !== null}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderQuestion()}
      
      {(questionType !== 'multiple') && (
        <button
          onClick={checkAnswer}
          disabled={
            (questionType === 'multiple' && !selectedChoice) ||
            (questionType !== 'multiple' && !userAnswer.trim()) ||
            feedback !== null
          }
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 text-lg mb-4"
        >
          Check Answer
        </button>
      )}

      {(questionType === 'multiple' && selectedChoice) && (
        <button
          onClick={checkAnswer}
          disabled={feedback !== null}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 text-lg mb-4"
        >
          Check Answer
        </button>
      )}
    </>
  );
};

export default QuestionRenderer;
