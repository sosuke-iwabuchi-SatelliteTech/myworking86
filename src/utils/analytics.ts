// Google Analytics types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Sets user properties in Google Analytics.
 * @param nickname The user's nickname.
 * @param grade The user's grade.
 */
export const setUserProperties = (nickname: string, grade: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      nickname: nickname,
      grade: grade,
    });
    console.log(`[Analytics] Set user properties: nickname=${nickname}, grade=${grade}`);
  }
};

/**
 * Tracks the start of a quiz.
 * Fires when the countdown finishes and the game begins.
 * @param levelId The ID of the quiz level.
 */
export const trackQuizStart = (levelId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quiz_start', {
      level_id: levelId,
    });
    console.log(`[Analytics] Track event: quiz_start, level_id=${levelId}`);
  }
};

/**
 * Tracks the completion of a quiz.
 * @param levelId The ID of the quiz level.
 * @param score The final score (0-100).
 * @param time The elapsed time in milliseconds.
 */
export const trackQuizComplete = (levelId: string, score: number, time: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quiz_complete', {
      level_id: levelId,
      score: score,
      time: time,
    });
    console.log(`[Analytics] Track event: quiz_complete, level_id=${levelId}, score=${score}, time=${time}`);
  }
};
