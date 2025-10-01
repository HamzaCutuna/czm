/**
 * Tests for leaderboard scoring and utility functions
 */

// Test the scoring formula: round((correct_count::float / question_count) * 100 * ln(1 + question_count) * 100)
export function calculateLeaderboardScore(correctCount: number, questionCount: number): number {
  if (questionCount <= 0 || correctCount < 0 || correctCount > questionCount) {
    throw new Error('Invalid input parameters');
  }

  const accuracy = (correctCount / questionCount) * 100;
  const questionBonus = Math.log(1 + questionCount) * 100;

  return Math.round(accuracy * questionBonus);
}

// Test cases for scoring algorithm
export const scoringTests = [
  // Test case 1: Perfect accuracy with different question counts
  { correct: 5, total: 5, expected: Math.round(100 * Math.log(1 + 5) * 100) },
  { correct: 10, total: 10, expected: Math.round(100 * Math.log(1 + 10) * 100) },
  { correct: 20, total: 20, expected: Math.round(100 * Math.log(1 + 20) * 100) },

  // Test case 2: 80% accuracy with different question counts
  { correct: 4, total: 5, expected: Math.round(80 * Math.log(1 + 5) * 100) },
  { correct: 8, total: 10, expected: Math.round(80 * Math.log(1 + 10) * 100) },
  { correct: 16, total: 20, expected: Math.round(80 * Math.log(1 + 20) * 100) },

  // Test case 3: Edge cases
  { correct: 0, total: 5, expected: 0 },
  { correct: 1, total: 1, expected: Math.round(100 * Math.log(1 + 1) * 100) },
];

// Test the eligibility logic for daily rewards
export function isEligibleForDailyReward(
  userId: string,
  gameMode: string,
  today: Date,
  existingSessions: Array<{ user_id: string; mode: string; played_on: string; reward_granted: boolean }>
): boolean {
  // Check if user already got a reward today for this mode
  const todayStr = today.toISOString().split('T')[0];
  const userSessionsToday = existingSessions.filter(
    s => s.user_id === userId && s.mode === gameMode && s.played_on === todayStr && s.reward_granted
  );

  return userSessionsToday.length === 0;
}

// Test cases for eligibility
export const eligibilityTests = [
  {
    userId: 'user1',
    gameMode: 'true_false',
    today: new Date('2024-01-01'),
    existingSessions: [
      { user_id: 'user1', mode: 'true_false', played_on: '2024-01-01', reward_granted: true }
    ],
    expected: false // Already rewarded today
  },
  {
    userId: 'user1',
    gameMode: 'true_false',
    today: new Date('2024-01-01'),
    existingSessions: [
      { user_id: 'user1', mode: 'true_false', played_on: '2023-12-31', reward_granted: true }
    ],
    expected: true // Rewarded yesterday, eligible today
  },
  {
    userId: 'user1',
    gameMode: 'true_false',
    today: new Date('2024-01-01'),
    existingSessions: [],
    expected: true // No sessions, eligible
  }
];

