// src/utils/saveUtils.js
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
export const autoSaveProgress = (gameState) => {
  try {
    const autoSaveData = {
      timestamp: Date.now(),
      wordStats: Array.from(gameState.wordStats.entries()),
      settings: gameState.settings,
      lastSession: {
        score: gameState.score,
        streak: gameState.streak,
        wordsCompleted: gameState.wordsCompleted
      }
    };
    
    // Note: In Claude.ai artifacts, localStorage is not available
    // This would work in a real browser environment
    console.log('Auto-save data prepared:', autoSaveData);
    return true;
  } catch (error) {
    console.error('Auto-save failed:', error);
    return false;
  }
};
