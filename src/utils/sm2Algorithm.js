export const calculateSM2 = (currentStats, performanceRating) => {
  // Implementation of SuperMemo-2 algorithm
  let { easinessFactor, interval, repetition } = currentStats;

  if (performanceRating >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.ceil(interval * easinessFactor);
    }
    
    repetition += 1;
  } else {
    // Incorrect response
    repetition = 0;
    interval = 1;
  }

  // Update easiness factor
  easinessFactor = easinessFactor + (0.1 - (5 - performanceRating) * (0.08 + (5 - performanceRating) * 0.02));
  
  // Ensure easiness factor doesn't fall below 1.3
  easinessFactor = Math.max(easinessFactor, 1.3);

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easinessFactor,
    interval,
    repetition,
    nextReview
  };
};

export const calculateMasteryLevel = (timesCorrect, timesShown, recentPerformance = 1) => {
  if (timesShown === 0) return 0;
  
  // Base mastery on accuracy
  let mastery = timesCorrect / timesShown;
  
  // Apply weighting based on recent performance
  const recentWeight = 0.7; // 70% weight to recent performance
  mastery = mastery * (1 - recentWeight) + recentPerformance * recentWeight;
  
  return Math.min(mastery, 1);
};

export const getPerformanceRating = (isCorrect, responseTime, expectedTime = 5000) => {
  let rating = isCorrect ? 4 : 1; // Base rating
  
  // Adjust based on response time (faster = better)
  if (isCorrect && responseTime < expectedTime) {
    rating += 1; // Bonus for quick responses
  } else if (isCorrect && responseTime > expectedTime * 2) {
    rating -= 1; // Penalty for slow responses
  }
  
  return Math.max(1, Math.min(5, rating));
};
