import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateQuizScore,
  calculateStreak,
  calculateWellbeingScore,
  generateAdaptiveRecommendations,
  QuizQuestion,
} from './studyLogic';

test('calculateQuizScore accurately computes percentage and breakdown', () => {
  const sampleQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'],
      correctIndex: 1,
      explanation: 'Mitochondria generates ATP.',
    },
    {
      id: 'q2',
      question: 'Which gas is absorbed in photosynthesis?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
      correctIndex: 1,
      explanation: 'Plants absorb CO2.',
    },
    {
      id: 'q3',
      question: 'What is the chemical formula of water?',
      options: ['CO2', 'NaCl', 'H2O', 'O2'],
      correctIndex: 2,
      explanation: 'Water is H2O.',
    },
    {
      id: 'q4',
      question: 'What is the speed of light approx in vacuum?',
      options: ['300,000 km/s', '150,000 km/s', '1,000 km/s', '3,000 km/s'],
      correctIndex: 0,
      explanation: 'Approx 300,000 km/s.',
    },
  ];

  // 3 out of 4 correct (75%)
  const answers = {
    q1: 1, // correct
    q2: 1, // correct
    q3: 0, // wrong
    q4: 0, // correct
  };

  const result = calculateQuizScore(answers, sampleQuestions);
  assert.equal(result.total, 4);
  assert.equal(result.correct, 3);
  assert.equal(result.scorePercentage, 75);
  assert.equal(result.passed, true);
  assert.equal(result.questionBreakdown[2].isCorrect, false);
  assert.equal(result.questionBreakdown[0].isCorrect, true);
});

test('calculateStreak computes continuous consecutive study days', () => {
  const dates = ['2026-10-28', '2026-10-27', '2026-10-26'];
  const streak = calculateStreak(dates, '2026-10-28');
  assert.equal(streak, 3);

  // If broken 3 days ago
  const brokenDates = ['2026-10-24', '2026-10-23'];
  const brokenStreak = calculateStreak(brokenDates, '2026-10-28');
  assert.equal(brokenStreak, 0);

  // Empty list
  assert.equal(calculateStreak([], '2026-10-28'), 0);
});

test('calculateWellbeingScore computes average metrics and wellness index', () => {
  const checkins = [
    { date: '2026-10-27', moodRating: 4, energyLevel: 4, stressLevel: 2 },
    { date: '2026-10-28', moodRating: 5, energyLevel: 4, stressLevel: 1 },
  ];

  const res = calculateWellbeingScore(checkins);
  assert.equal(res.averageMood, 4.5);
  assert.equal(res.averageEnergy, 4.0);
  assert.equal(res.averageStress, 1.5);
  assert.ok(res.wellnessIndex >= 80);
});

test('generateAdaptiveRecommendations provides sensible advice for fatigue and low scores', () => {
  // Low wellness index
  const tiredRec = generateAdaptiveRecommendations(85, 40, 2);
  assert.equal(tiredRec.recommendedDurationMins, 25);
  assert.ok(tiredRec.focusArea.includes('Gentle Review'));

  // Low score but good wellness
  const strugglingRec = generateAdaptiveRecommendations(60, 75, 1);
  assert.equal(strugglingRec.recommendedDurationMins, 40);
  assert.ok(strugglingRec.focusArea.includes('Foundational'));

  // High score & high wellness
  const peakRec = generateAdaptiveRecommendations(90, 85, 0);
  assert.equal(peakRec.recommendedDurationMins, 50);
  assert.ok(peakRec.focusArea.includes('Advanced'));
});
