import { EVCar, UserPreferences } from './types';
import { mockEVCars } from './mock-data';
import { RecommendationResponse, RecommendationItem } from './types/gemini';

interface ScoredCar {
  car: EVCar;
  score: number;
  matchPercentage: number;
  reason: string;
  strengths: string[];
}

/**
 * Check if car matches budget preference
 */
function matchesBudget(price: number, budget: string): { matches: boolean; score: number } {
  switch (budget) {
    case 'Under $30,000':
      if (price < 30000) return { matches: true, score: 30 };
      if (price < 36000) return { matches: true, score: 15 }; // Within 20% over
      return { matches: false, score: 0 };
    case '$30,000 - $50,000':
      if (price >= 30000 && price <= 50000) return { matches: true, score: 30 };
      if (price < 30000 || (price > 50000 && price <= 60000)) return { matches: true, score: 15 };
      return { matches: false, score: 0 };
    case 'Over $50,000':
      if (price > 50000) return { matches: true, score: 30 };
      if (price >= 42000) return { matches: true, score: 15 };
      return { matches: false, score: 0 };
    case 'No budget limit':
      return { matches: true, score: 20 };
    default:
      return { matches: true, score: 10 };
  }
}

/**
 * Check if car meets minimum range requirement
 */
function matchesRange(range: number, rangePreference: string): { matches: boolean; score: number } {
  switch (rangePreference) {
    case 'Under 300km':
      return { matches: range < 400, score: range < 300 ? 25 : 15 };
    case '300-400km':
      if (range >= 300 && range <= 400) return { matches: true, score: 25 };
      if (range > 400 && range <= 450) return { matches: true, score: 15 };
      return { matches: false, score: 0 };
    case '400-500km':
      if (range >= 400 && range <= 500) return { matches: true, score: 25 };
      if (range > 500) return { matches: true, score: 20 };
      return { matches: false, score: 0 };
    case 'Over 500km':
      if (range > 500) return { matches: true, score: 25 };
      if (range >= 450) return { matches: true, score: 15 };
      return { matches: false, score: 0 };
    default:
      return { matches: true, score: 10 };
  }
}

/**
 * Calculate score for a car based on user preferences
 */
function calculateCarScore(car: EVCar, prefs: UserPreferences): ScoredCar {
  let score = 0;
  const strengths: string[] = [];
  const reasonParts: string[] = [];

  // Budget match (30 points if under budget, 15 if within 20% over)
  const budgetMatch = matchesBudget(car.price, prefs.budget);
  score += budgetMatch.score;
  if (budgetMatch.matches) {
    if (budgetMatch.score === 30) {
      strengths.push(`Excellent value at $${car.price.toLocaleString()}`);
      reasonParts.push('fits your budget perfectly');
    } else {
      reasonParts.push('reasonably priced');
    }
  }

  // Range match (25 points)
  const rangeMatch = matchesRange(car.specs.range, prefs.range);
  score += rangeMatch.score;
  if (rangeMatch.matches) {
    if (rangeMatch.score === 25) {
      strengths.push(`${car.specs.range}km range meets your requirements`);
      reasonParts.push(`offers ${car.specs.range}km range`);
    }
  }

  // Category/car type match (20 points)
  if (prefs.carType !== 'Any' && car.category === prefs.carType) {
    score += 20;
    strengths.push(`Perfect ${car.category.toLowerCase()} body style`);
    reasonParts.push(`matches your ${car.category.toLowerCase()} preference`);
  } else if (prefs.carType === 'Any') {
    score += 10;
  }

  // Brand preference match (15 points)
  if (prefs.brand !== 'Any' && prefs.brand === car.brand) {
    score += 15;
    strengths.push(`From your preferred brand ${car.brand}`);
    reasonParts.push(`from ${car.brand}`);
  } else if (prefs.brand === 'Any') {
    score += 5;
  }

  // Feature matches (5 points each, max 3)
  let featureScore = 0;
  const matchedFeatures: string[] = [];
  prefs.features.forEach((prefFeature) => {
    const hasFeature = car.features.some((carFeature) =>
      carFeature.toLowerCase().includes(prefFeature.toLowerCase())
    );
    if (hasFeature && featureScore < 15) {
      featureScore += 5;
      matchedFeatures.push(prefFeature);
    }
  });
  score += featureScore;
  if (matchedFeatures.length > 0) {
    strengths.push(`Includes ${matchedFeatures.slice(0, 2).join(', ')}`);
    reasonParts.push(`has ${matchedFeatures.length} of your must-have features`);
  }

  // Seating requirement match (10 points)
  if (prefs.seating === '5 seats' && car.specs.seats === 5) {
    score += 10;
  } else if (prefs.seating === '7+ seats' && car.specs.seats >= 7) {
    score += 10;
    strengths.push(`Spacious ${car.specs.seats}-seater`);
  }

  // Priority bonuses
  prefs.priority.forEach((priority) => {
    switch (priority) {
      case 'Range':
        if (car.specs.range > 450) score += 5;
        break;
      case 'Price':
        if (car.price < 40000) score += 5;
        break;
      case 'Features':
        if (car.features.length > 6) score += 5;
        break;
      case 'Performance':
        if (parseFloat(car.specs.acceleration) < 6) {
          score += 5;
          if (strengths.length < 3) {
            strengths.push(`Quick ${car.specs.acceleration} 0-100km/h`);
          }
        }
        break;
    }
  });

  // Generate reason
  let reason = reasonParts.length > 0
    ? `This car ${reasonParts.slice(0, 3).join(', ')}`
    : 'Great overall value and features for your needs';

  // Ensure we have some strengths
  if (strengths.length === 0) {
    strengths.push(`${car.specs.range}km range`);
    strengths.push(`${car.specs.power}hp power output`);
  }

  // Calculate match percentage
  const matchPercentage = Math.min(Math.round((score / 100) * 100), 99);

  return {
    car,
    score,
    matchPercentage,
    reason,
    strengths,
  };
}

/**
 * Generate fallback recommendations using algorithm-based scoring
 */
export function generateFallbackRecommendations(
  preferences: UserPreferences
): RecommendationResponse {
  // Score all cars
  const scoredCars = mockEVCars
    .map((car) => calculateCarScore(car, preferences))
    .sort((a, b) => b.score - a.score);

  // Get top 3-4 recommendations
  const topCars = scoredCars.slice(0, 4);

  // Convert to recommendation format
  const recommendations: RecommendationItem[] = topCars.map((scored) => ({
    carId: scored.car.id,
    matchPercentage: scored.matchPercentage,
    reason: scored.reason,
    strengths: scored.strengths.slice(0, 3),
    considerations: scored.car.price > 50000
      ? 'Premium pricing - ensure it fits your long-term budget'
      : scored.car.specs.range < 350
      ? 'Lower range - best for city driving and shorter commutes'
      : 'Consider test driving to confirm it meets your specific needs',
  }));

  // Generate summary
  const topCar = topCars[0];
  const summary =
    recommendations.length > 0
      ? `Based on your preferences for a ${preferences.carType === 'Any' ? 'vehicle' : preferences.carType.toLowerCase()} with ${preferences.range} range and ${preferences.budget} budget, we recommend ${topCar.car.name} as your best match with ${topCar.matchPercentage}% compatibility.`
      : 'We found several great options matching your preferences. Review the recommendations below.';

  return {
    recommendations,
    summary,
    source: 'fallback',
    warning: 'AI recommendations temporarily unavailable. Showing algorithm-based matches.',
  };
}
