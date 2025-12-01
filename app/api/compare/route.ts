import { NextRequest, NextResponse } from 'next/server';
import { generateContent, generateCacheKey } from '@/lib/gemini';
import { generateFallbackComparison } from '@/lib/fallback-compare';
import { ComparisonResponse } from '@/lib/types/gemini';
import { EVCar } from '@/lib/types';

// Cache TTL for comparisons (10 minutes - less dynamic)
const CACHE_TTL = 10 * 60 * 1000;

/**
 * Compress car data for comparison to reduce tokens
 */
function compressCarForComparison(car: EVCar) {
  return {
    name: car.name,
    brand: car.brand,
    price: car.price,
    category: car.category,
    range: car.specs.range,
    acceleration: car.specs.acceleration,
    power: car.specs.power,
    topFeatures: car.features.slice(0, 5),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { car1, car2 } = await request.json();

    if (!car1 || !car2) {
      return NextResponse.json(
        { error: 'Both cars are required for comparison' },
        { status: 400 }
      );
    }

    // Generate cache key from car IDs
    const cacheKey = generateCacheKey({ car1: car1.id, car2: car2.id });

    // Compress car data
    const c1 = compressCarForComparison(car1);
    const c2 = compressCarForComparison(car2);

    // Create shortened prompt
    const prompt = `EV expert: compare cars, pick winner.

Car1: ${JSON.stringify(c1)}
Car2: ${JSON.stringify(c2)}

JSON only (2 sentences max): {"winner":"","summary":"","reasons":["","",""],"bestFor":"","valueProposition":""}`;

    try {
      // Try to get AI comparison
      const result = await generateContent<Omit<ComparisonResponse, 'source'>>(
        prompt,
        cacheKey,
        CACHE_TTL
      );

      // Add source to response
      const response: ComparisonResponse = {
        ...result.data,
        source: result.source,
      };

      return NextResponse.json(response, {
        headers: {
          'X-Response-Source': result.source,
        },
      });
    } catch (error: any) {
      // Log error for debugging
      console.error('Gemini API error, using fallback:', error.message);

      // Return fallback comparison on ANY error
      const fallbackResponse = generateFallbackComparison(car1, car2);

      return NextResponse.json(fallbackResponse, {
        headers: {
          'X-Response-Source': 'fallback',
        },
      });
    }
  } catch (error: any) {
    console.error('Error in compare route:', error);

    return NextResponse.json(
      { error: 'Failed to compare cars. Please try again.' },
      { status: 500 }
    );
  }
}
