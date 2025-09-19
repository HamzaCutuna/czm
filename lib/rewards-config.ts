/**
 * Server-side configuration for the diamonds rewards system
 * This module centralizes all reward rules and makes them configurable
 */

export interface AccuracyTier {
  minPercent: number;
  multiplier: number;
  label: string;
}

export interface HelpCost {
  fiftyFifty: number;
  skip: number;
  removeOne: number;
}

export interface RewardsConfig {
  // Minimum requirements
  MIN_QUESTIONS_FOR_REWARD: number;
  ONE_REWARDED_GAME_PER_DAY: boolean;
  
  // Base diamonds formula
  BASE_DIAMONDS_FORMULA: (numQuestions: number) => number;
  
  // Accuracy tiers
  ACCURACY_TIERS: AccuracyTier[];
  
  // Help costs for /kviz
  HELP_COSTS: HelpCost;
  
  // Leaderboard settings
  LEADERBOARD_PAGE_SIZE: number;
  
  // Privacy settings
  PRIVACY_DEFAULT: 'realname' | 'anon';
}

export const DEFAULT_REWARDS_CONFIG: RewardsConfig = {
  MIN_QUESTIONS_FOR_REWARD: 5,
  ONE_REWARDED_GAME_PER_DAY: false, // Temporarily disabled for testing
  
  BASE_DIAMONDS_FORMULA: (numQuestions: number) => {
    // Base diamonds = ceil(num_questions / 10)
    return Math.ceil(numQuestions / 10);
  },
  
  ACCURACY_TIERS: [
    { minPercent: 100, multiplier: 3, label: '100% → 3× baza' },
    { minPercent: 80, multiplier: 2, label: '≥80% → 2× baza' },
    { minPercent: 60, multiplier: 1, label: '≥60% → 1× baza' },
    { minPercent: 0, multiplier: 0, label: '<60% → 0' },
  ],
  
  HELP_COSTS: {
    fiftyFifty: 2,
    skip: 1,
    removeOne: 1,
  },
  
  LEADERBOARD_PAGE_SIZE: 20,
  
  PRIVACY_DEFAULT: 'realname',
};

/**
 * Calculate diamonds reward based on accuracy and number of questions
 */
export function calculateDiamondsReward(
  numQuestions: number,
  numCorrect: number,
  config: RewardsConfig = DEFAULT_REWARDS_CONFIG
): number {
  // Check minimum questions requirement
  if (numQuestions < config.MIN_QUESTIONS_FOR_REWARD) {
    return 0;
  }
  
  const accuracy = (numCorrect / numQuestions) * 100;
  
  // Find the appropriate tier
  const tier = config.ACCURACY_TIERS.find(t => accuracy >= t.minPercent) || 
               config.ACCURACY_TIERS[config.ACCURACY_TIERS.length - 1];
  
  // Calculate base diamonds
  const baseDiamonds = config.BASE_DIAMONDS_FORMULA(numQuestions);
  
  // Apply tier multiplier
  return Math.round(baseDiamonds * tier.multiplier);
}

/**
 * Get expected reward for a given number of questions and expected accuracy
 */
export function getExpectedReward(
  numQuestions: number,
  expectedAccuracy: number = 80,
  config: RewardsConfig = DEFAULT_REWARDS_CONFIG
): number {
  const expectedCorrect = Math.floor(numQuestions * (expectedAccuracy / 100));
  return calculateDiamondsReward(numQuestions, expectedCorrect, config);
}

/**
 * Get accuracy tier for a given accuracy percentage
 */
export function getAccuracyTier(
  accuracy: number,
  config: RewardsConfig = DEFAULT_REWARDS_CONFIG
): AccuracyTier {
  return config.ACCURACY_TIERS.find(t => accuracy >= t.minPercent) || 
         config.ACCURACY_TIERS[config.ACCURACY_TIERS.length - 1];
}
