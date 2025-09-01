let speechSynthesis = null;
let currentUtterance = null;

export const speakSpanish = (text, options = {}) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    throw new Error('Speech synthesis not supported in this environment');
  }

  // Cancel any ongoing speech
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }

  speechSynthesis = window.speechSynthesis;
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set Spanish language
  utterance.lang = 'es-ES';
  
  // Apply options
  utterance.rate = options.rate || 0.95;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  currentUtterance = utterance;
  
  speechSynthesis.speak(utterance);
  
  return utterance;
};

export const handleStopPronunciation = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeechSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};
