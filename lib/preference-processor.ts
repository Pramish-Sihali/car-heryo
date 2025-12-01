import { UserPreferences } from './types';
import { EVCar } from './types';
import { mockEVCars } from './mock-data';

/**
 * Preprocessed and optimized preferences for API
 */
export interface ProcessedPreferences {
  budgetRange: string;
  type: string;
  minRange: number;
  priorities: string;
  mustHaves: string;
  relevantCarIds: string[];
}

/**
 * Extract budget range as min-max numbers
 */
function extractBudgetRange(budget: string): { min: number; max: number } {
  switch (budget) {
    case 'Under $30,000':
      return { min: 0, max: 30000 };
    case '$30,000 - $50,000':
      return { min: 30000, max: 50000 };
    case 'Over $50,000':
      return { min: 50000, max: 999999 };
    case 'No budget limit':
      return { min: 0, max: 999999 };
    default:
      return { min: 0, max: 999999 };
  }
}

/**
 * Extract minimum range requirement in km
 */
function extractMinRange(rangePreference: string): number {
  switch (rangePreference) {
    case 'Under 300km':
      return 0;
    case '300-400km':
      return 300;
    case '400-500km':
      return 400;
    case 'Over 500km':
      return 500;
    default:
      return 0;
  }
}

/**
 * Quick score a car against preferences (simple algorithm)
 */
function quickScore(car: EVCar, prefs: UserPreferences, budgetRange: { min: number; max: number }, minRange: number): number {
  let score = 0;

  // Budget match (most important)
  if (car.price >= budgetRange.min && car.price <= budgetRange.max) {
    score += 40;
  } else if (car.price <= budgetRange.max * 1.2) {
    score += 20;
  }

  // Range requirement
  if (car.specs.range >= minRange) {
    score += 30;
  }

  // Category match
  if (prefs.carType === 'Any' || car.category === prefs.carType) {
    score += 15;
  }

  // Brand match
  if (prefs.brand === 'Any' || car.brand === prefs.brand) {
    score += 10;
  }

  // Features match (quick check)
  prefs.features.forEach(feature => {
    if (car.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))) {
      score += 5;
    }
  });

  return score;
}

/**
 * Preprocess and optimize user preferences
 * Filters cars and creates compact summary for API
 */
export function preprocessPreferences(preferences: UserPreferences): ProcessedPreferences {
  const budgetRange = extractBudgetRange(preferences.budget);
  const minRange = extractMinRange(preferences.range);

  // Quick score all cars
  const scoredCars = mockEVCars
    .map(car => ({
      car,
      score: quickScore(car, preferences, budgetRange, minRange),
    }))
    .sort((a, b) => b.score - a.score);

  // Only send top 6 most relevant cars to API (instead of all 10)
  const relevantCarIds = scoredCars.slice(0, 6).map(sc => sc.car.id);

  // Create compact summary
  const budgetSummary = `$${budgetRange.min / 1000}k-${budgetRange.max === 999999 ? 'unlimited' : budgetRange.max / 1000 + 'k'}`;
  const prioritiesSummary = preferences.priority.join('+');
  const mustHavesSummary = preferences.features.length > 0 ? preferences.features.join(',') : 'none';

  return {
    budgetRange: budgetSummary,
    type: preferences.carType,
    minRange,
    priorities: prioritiesSummary,
    mustHaves: mustHavesSummary,
    relevantCarIds,
  };
}

/**
 * Get only relevant cars based on preprocessed data
 */
export function getRelevantCars(processed: ProcessedPreferences): EVCar[] {
  return mockEVCars.filter(car => processed.relevantCarIds.includes(car.id));
}

/**
 * Create ultra-compact prompt summary
 */
export function createCompactSummary(preferences: UserPreferences): string {
  const processed = preprocessPreferences(preferences);

  return `Budget:${processed.budgetRange}|Type:${processed.type}|Range:${processed.minRange}km+|Priorities:${processed.priorities}|Features:${processed.mustHaves}`;
}
