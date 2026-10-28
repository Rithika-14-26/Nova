export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  total: number;
  correct: number;
  scorePercentage: number;
  passed: boolean;
  questionBreakdown: {
    questionId: string;
    userAnswer: number | undefined;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
}

/**
 * Evaluates quiz responses against answer keys.
 */
export function calculateQuizScore(
  userAnswers: Record<string, number>,
  questions: QuizQuestion[]
): QuizResult {
  if (!questions || questions.length === 0) {
    return {
      total: 0,
      correct: 0,
      scorePercentage: 0,
      passed: false,
      questionBreakdown: [],
    };
  }

  let correct = 0;
  const questionBreakdown = questions.map((q) => {
    const userAnswer = userAnswers[q.id];
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) correct += 1;
    return {
      questionId: q.id,
      userAnswer,
      correctAnswer: q.correctIndex,
      isCorrect,
    };
  });

  const scorePercentage = Math.round((correct / questions.length) * 100);
  const passed = scorePercentage >= 70;

  return {
    total: questions.length,
    correct,
    scorePercentage,
    passed,
    questionBreakdown,
  };
}

/**
 * Calculates current study streak given a list of active ISO dates (YYYY-MM-DD).
 */
export function calculateStreak(activityDates: string[], referenceDateStr?: string): number {
  if (!activityDates || activityDates.length === 0) return 0;

  // Deduplicate and sort descending
  const uniqueDates = Array.from(new Set(activityDates.map((d) => d.slice(0, 10)))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const todayStr = referenceDateStr ? referenceDateStr.slice(0, 10) : new Date().toISOString().slice(0, 10);
  
  // Calculate difference in calendar days
  const today = new Date(todayStr);
  const mostRecent = new Date(uniqueDates[0]);
  const diffDays = Math.round((today.getTime() - mostRecent.getTime()) / (1000 * 3600 * 24));

  // If most recent is more than 1 day ago (neither today nor yesterday), streak is broken
  if (diffDays > 1) return 0;

  let streak = 1;
  let prevDate = mostRecent;

  for (let i = 1; i < uniqueDates.length; i++) {
    const curDate = new Date(uniqueDates[i]);
    const dayGap = Math.round((prevDate.getTime() - curDate.getTime()) / (1000 * 3600 * 24));
    if (dayGap === 1) {
      streak += 1;
      prevDate = curDate;
    } else {
      break;
    }
  }

  return streak;
}

export interface WellbeingCheckin {
  date: string;
  moodRating: number; // 1 to 5
  energyLevel: number; // 1 to 5
  stressLevel: number; // 1 to 5
}

/**
 * Computes average wellness index (0 to 100).
 */
export function calculateWellbeingScore(checkins: WellbeingCheckin[]): {
  averageMood: number;
  averageEnergy: number;
  averageStress: number;
  wellnessIndex: number;
} {
  if (!checkins || checkins.length === 0) {
    return { averageMood: 3, averageEnergy: 3, averageStress: 3, wellnessIndex: 60 };
  }

  const sumMood = checkins.reduce((acc, c) => acc + c.moodRating, 0);
  const sumEnergy = checkins.reduce((acc, c) => acc + c.energyLevel, 0);
  const sumStress = checkins.reduce((acc, c) => acc + c.stressLevel, 0);

  const avgMood = Number((sumMood / checkins.length).toFixed(1));
  const avgEnergy = Number((sumEnergy / checkins.length).toFixed(1));
  const avgStress = Number((sumStress / checkins.length).toFixed(1));

  // Wellness Index: higher mood & energy, lower stress
  // normalize to 100: (mood/5 * 0.4 + energy/5 * 0.35 + (6 - stress)/5 * 0.25) * 100
  const normalized = (avgMood / 5) * 40 + (avgEnergy / 5) * 35 + ((6 - avgStress) / 5) * 25;
  const wellnessIndex = Math.min(100, Math.max(0, Math.round(normalized)));

  return {
    averageMood: avgMood,
    averageEnergy: avgEnergy,
    averageStress: avgStress,
    wellnessIndex,
  };
}

/**
 * Determines adaptive study suggestions based on learning & wellbeing metrics.
 */
export function generateAdaptiveRecommendations(
  averageQuizScore: number,
  wellnessIndex: number,
  incompleteTasksCount: number
): {
  focusArea: string;
  recommendedDurationMins: number;
  breakIntervalMins: number;
  encouragement: string;
  prioritySubjectAdvice: string;
} {
  // If wellness is low (< 50) or stress is high, recommend shorter sessions with frequent breaks
  if (wellnessIndex < 50) {
    return {
      focusArea: "Gentle Review & High-Yield Summary",
      recommendedDurationMins: 25,
      breakIntervalMins: 15,
      encouragement: "Take it easy today. Prioritize rest and light spaced-repetition over intense memorization.",
      prioritySubjectAdvice: "Review flashcard summaries rather than taking heavy new exams.",
    };
  }

  // If quiz score is lower (< 70%), suggest targeted concept practice
  if (averageQuizScore < 70) {
    return {
      focusArea: "Foundational Practice & Quiz Retakes",
      recommendedDurationMins: 40,
      breakIntervalMins: 10,
      encouragement: "Solid progress! Focus on review of missed questions to build topic mastery.",
      prioritySubjectAdvice: "Re-read notes for missed quiz topics before testing again.",
    };
  }

  // If high performance and good wellness
  return {
    focusArea: "Advanced Problems & Career Sprint",
    recommendedDurationMins: 50,
    breakIntervalMins: 10,
    encouragement: "You're in peak momentum! Great condition for deep-focus study and mock interview practice.",
    prioritySubjectAdvice: incompleteTasksCount > 2 
      ? "Knock out your top 2 pending assignments first while energy is high." 
      : "Explore career skills or ahead-of-syllabus readings.",
  };
}
