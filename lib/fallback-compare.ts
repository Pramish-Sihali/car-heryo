import { EVCar } from './types';
import { ComparisonResponse } from './types/gemini';

interface ComparisonScores {
  car1Score: number;
  car2Score: number;
  priceWinner: string;
  rangeWinner: string;
  performanceWinner: string;
  featuresWinner: string;
}

/**
 * Compare two cars and generate fallback comparison response
 */
export function generateFallbackComparison(car1: EVCar, car2: EVCar): ComparisonResponse {
  const scores: ComparisonScores = {
    car1Score: 0,
    car2Score: 0,
    priceWinner: '',
    rangeWinner: '',
    performanceWinner: '',
    featuresWinner: '',
  };

  const reasons: string[] = [];
  let winner: EVCar;
  let loser: EVCar;

  // Price comparison (value score - lower is better)
  if (car1.price < car2.price) {
    scores.car1Score += 25;
    scores.priceWinner = car1.name;
    const savings = car2.price - car1.price;
    reasons.push(
      `${car1.name} offers better value at $${car1.price.toLocaleString()}, saving you $${savings.toLocaleString()} compared to ${car2.name}`
    );
  } else if (car2.price < car1.price) {
    scores.car2Score += 25;
    scores.priceWinner = car2.name;
    const savings = car1.price - car2.price;
    reasons.push(
      `${car2.name} is more affordable at $${car2.price.toLocaleString()}, saving $${savings.toLocaleString()}`
    );
  } else {
    scores.car1Score += 10;
    scores.car2Score += 10;
  }

  // Range comparison (efficiency score - higher is better)
  if (car1.specs.range > car2.specs.range) {
    scores.car1Score += 25;
    scores.rangeWinner = car1.name;
    const rangeDiff = car1.specs.range - car2.specs.range;
    reasons.push(
      `${car1.name} provides superior range at ${car1.specs.range}km (${rangeDiff}km more than ${car2.name})`
    );
  } else if (car2.specs.range > car1.specs.range) {
    scores.car2Score += 25;
    scores.rangeWinner = car2.name;
    const rangeDiff = car2.specs.range - car1.specs.range;
    reasons.push(
      `${car2.name} excels with ${car2.specs.range}km range, ${rangeDiff}km more than ${car1.name}`
    );
  } else {
    scores.car1Score += 10;
    scores.car2Score += 10;
  }

  // Performance comparison (acceleration + top speed)
  const car1Accel = parseFloat(car1.specs.acceleration);
  const car2Accel = parseFloat(car2.specs.acceleration);

  let performanceScore1 = 0;
  let performanceScore2 = 0;

  // Lower acceleration time is better
  if (car1Accel < car2Accel) {
    performanceScore1 += 15;
  } else if (car2Accel < car1Accel) {
    performanceScore2 += 15;
  }

  // Higher top speed is better
  if (car1.specs.topSpeed > car2.specs.topSpeed) {
    performanceScore1 += 10;
  } else if (car2.specs.topSpeed > car1.specs.topSpeed) {
    performanceScore2 += 10;
  }

  // Higher power is better
  if (car1.specs.power > car2.specs.power) {
    performanceScore1 += 10;
  } else if (car2.specs.power > car1.specs.power) {
    performanceScore2 += 10;
  }

  if (performanceScore1 > performanceScore2) {
    scores.car1Score += 20;
    scores.performanceWinner = car1.name;
    reasons.push(
      `${car1.name} delivers better performance with ${car1.specs.acceleration} 0-100km/h and ${car1.specs.power}hp`
    );
  } else if (performanceScore2 > performanceScore1) {
    scores.car2Score += 20;
    scores.performanceWinner = car2.name;
    reasons.push(
      `${car2.name} offers superior performance with ${car2.specs.acceleration} 0-100km/h and ${car2.specs.power}hp`
    );
  }

  // Features comparison
  if (car1.features.length > car2.features.length) {
    scores.car1Score += 15;
    scores.featuresWinner = car1.name;
    reasons.push(
      `${car1.name} includes more features (${car1.features.length} vs ${car2.features.length})`
    );
  } else if (car2.features.length > car1.features.length) {
    scores.car2Score += 15;
    scores.featuresWinner = car2.name;
    reasons.push(
      `${car2.name} comes with more features (${car2.features.length} vs ${car1.features.length})`
    );
  }

  // Battery capacity bonus
  if (car1.specs.battery > car2.specs.battery) {
    scores.car1Score += 5;
  } else if (car2.specs.battery > car1.specs.battery) {
    scores.car2Score += 5;
  }

  // Determine winner
  if (scores.car1Score > scores.car2Score) {
    winner = car1;
    loser = car2;
  } else if (scores.car2Score > scores.car1Score) {
    winner = car2;
    loser = car1;
  } else {
    // Tie - prefer lower price
    winner = car1.price <= car2.price ? car1 : car2;
    loser = winner === car1 ? car2 : car1;
  }

  // Generate summary
  const summary =
    scores.car1Score === scores.car2Score
      ? `Both vehicles are evenly matched. ${car1.name} and ${car2.name} each have distinct advantages - choose based on your priorities.`
      : `${winner.name} is the better choice overall, scoring higher in ${reasons.length} key categories including ${scores.priceWinner === winner.name ? 'value' : ''} ${scores.rangeWinner === winner.name ? 'range' : ''} ${scores.performanceWinner === winner.name ? 'performance' : ''}`.trim();

  // Generate bestFor
  const bestFor =
    winner.price < 35000
      ? 'Budget-conscious buyers seeking maximum value without compromising on essential features'
      : winner.specs.range > 500
      ? 'Long-distance travelers and those with limited charging access who need maximum range'
      : winner.specs.power > 400
      ? 'Performance enthusiasts who want thrilling acceleration and driving dynamics'
      : 'Buyers seeking a well-balanced EV with good overall capabilities';

  // Generate value proposition
  const valueProposition = `${winner.name} stands out with its combination of ${
    scores.priceWinner === winner.name ? 'competitive pricing, ' : ''
  }${scores.rangeWinner === winner.name ? `impressive ${winner.specs.range}km range, ` : ''}${
    scores.performanceWinner === winner.name ? 'strong performance, ' : ''
  }and comprehensive features. ${
    winner.price > loser.price
      ? `While it costs $${(winner.price - loser.price).toLocaleString()} more than ${loser.name}, the additional capabilities justify the premium.`
      : `At $${winner.price.toLocaleString()}, it delivers exceptional value compared to ${loser.name}.`
  }`;

  // Ensure we have exactly 3 reasons
  while (reasons.length < 3) {
    if (winner.category === 'SUV' || winner.category === 'Crossover') {
      reasons.push('Versatile body style suitable for families and various activities');
    } else if (winner.category === 'Sedan') {
      reasons.push('Efficient sedan design with excellent aerodynamics');
    } else {
      reasons.push('Well-rounded package meeting diverse driving needs');
    }
  }

  return {
    winner: winner.name,
    summary,
    reasons: reasons.slice(0, 3),
    bestFor,
    valueProposition,
    source: 'fallback',
    warning: 'AI analysis temporarily unavailable. Showing algorithm-based comparison.',
  };
}
