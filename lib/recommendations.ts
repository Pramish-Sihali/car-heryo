import { EVCar, UserPreferences } from './types';
import { mockEVCars } from './mock-data';

export interface ScoredCar {
  car: EVCar;
  score?: number;
  matchPercentage: number;
  reason: string;
  strengths?: string[];
  considerations?: string;
}

export const getRecommendations = (prefs: UserPreferences): ScoredCar[] => {
  let scored = mockEVCars.map((car) => {
    const score = calculateScore(car, prefs);
    const matchPercentage = Math.min(Math.round((score / 100) * 100), 100);
    const reason = generateReason(car, prefs, score);

    return {
      car,
      score,
      matchPercentage,
      reason,
    };
  });

  // Sort by score, return top 4
  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
};

const calculateScore = (car: EVCar, prefs: UserPreferences): number => {
  let score = 0;

  // Budget match (+30 points)
  if (matchesBudget(car.price, prefs.budget)) {
    score += 30;
  }

  // Category match (+20 points)
  if (prefs.carType !== 'Any' && car.category === prefs.carType) {
    score += 20;
  } else if (prefs.carType === 'Any') {
    score += 10;
  }

  // Range match (+20 points)
  if (matchesRange(car.specs.range, prefs.range)) {
    score += 20;
  }

  // Feature matches (+5 per feature, max 20 points)
  let featureScore = 0;
  prefs.features.forEach((f) => {
    if (car.features.some((cf) => cf.toLowerCase().includes(f.toLowerCase()))) {
      featureScore += 5;
    }
  });
  score += Math.min(featureScore, 20);

  // Brand preference (+15 points)
  if (prefs.brand !== 'Any' && prefs.brand === car.brand) {
    score += 15;
  } else if (prefs.brand === 'Any') {
    score += 5;
  }

  // Seating match (+10 points)
  if (matchesSeating(car.specs.seats, prefs.seating)) {
    score += 10;
  }

  // Performance match (+5 points)
  if (matchesPerformance(car.specs.acceleration, prefs.performance)) {
    score += 5;
  }

  return score;
};

const matchesBudget = (price: number, budget: string): boolean => {
  switch (budget) {
    case 'Under $30,000':
      return price < 30000;
    case '$30,000 - $50,000':
      return price >= 30000 && price <= 50000;
    case 'Over $50,000':
      return price > 50000;
    case 'No budget limit':
      return true;
    default:
      return true;
  }
};

const matchesRange = (range: number, rangePreference: string): boolean => {
  switch (rangePreference) {
    case 'Under 300km':
      return range < 300;
    case '300-400km':
      return range >= 300 && range <= 400;
    case '400-500km':
      return range >= 400 && range <= 500;
    case 'Over 500km':
      return range > 500;
    default:
      return true;
  }
};

const matchesSeating = (seats: number, seatingPreference: string): boolean => {
  switch (seatingPreference) {
    case '5 seats':
      return seats === 5;
    case '7+ seats':
      return seats >= 7;
    default:
      return true;
  }
};

const matchesPerformance = (
  acceleration: string,
  performancePreference: string
): boolean => {
  const acc = parseFloat(acceleration);

  switch (performancePreference) {
    case 'Economy/Efficiency':
      return acc > 6;
    case 'Balanced':
      return acc >= 4 && acc <= 7;
    case 'High performance':
      return acc < 5;
    default:
      return true;
  }
};

const generateReason = (
  car: EVCar,
  prefs: UserPreferences,
  score: number
): string => {
  const reasons: string[] = [];

  if (matchesBudget(car.price, prefs.budget)) {
    reasons.push('fits your budget');
  }

  if (prefs.carType !== 'Any' && car.category === prefs.carType) {
    reasons.push(`matches your preferred ${car.category.toLowerCase()} type`);
  }

  if (matchesRange(car.specs.range, prefs.range)) {
    reasons.push(`offers ${car.specs.range}km range`);
  }

  if (prefs.brand !== 'Any' && prefs.brand === car.brand) {
    reasons.push(`from your preferred brand ${car.brand}`);
  }

  const matchedFeatures = prefs.features.filter((f) =>
    car.features.some((cf) => cf.toLowerCase().includes(f.toLowerCase()))
  );

  if (matchedFeatures.length > 0) {
    reasons.push(`includes ${matchedFeatures.slice(0, 2).join(', ')}`);
  }

  if (reasons.length === 0) {
    reasons.push('great overall value and features');
  }

  return `This car ${reasons.slice(0, 3).join(', ')}.`;
};
