import { NextRequest, NextResponse } from 'next/server';
import { generateContent, generateCacheKey } from '@/lib/gemini';
import { generateFallbackRecommendations } from '@/lib/fallback-recommendations';
import { RecommendationResponse, CompressedCarData } from '@/lib/types/gemini';
import { preprocessPreferences, getRelevantCars, createCompactSummary } from '@/lib/preference-processor';

// Cache TTL for recommendations (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Compress car data for API to reduce token usage
 */
function compressCarData(cars: ReturnType<typeof getRelevantCars>): CompressedCarData[] {
  return cars.map(car => ({
    id: car.id,
    name: car.name,
    brand: car.brand,
    price: car.price,
    category: car.category,
    range: car.specs.range,
    acceleration: car.specs.acceleration,
    features: car.features.slice(0, 3), // Only top 3 features
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json();

    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences are required' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = generateCacheKey(preferences);

    // Preprocess preferences to filter and optimize data
    const processed = preprocessPreferences(preferences);

    // Get only the top 6 most relevant cars (instead of all 10)
    const relevantCars = getRelevantCars(processed);

    // Compress car data to reduce tokens
    const compressedCars = compressCarData(relevantCars);

    // Create ultra-compact preference summary
    const prefSummary = createCompactSummary(preferences);

    // Create ultra-shortened prompt (now sends only 6 cars with 3 features each)
    const prompt = `EV expert: recommend 3-4 best cars.

User needs: ${prefSummary}

Options: ${JSON.stringify(compressedCars)}

JSON (brief): {"recommendations":[{"carId":"","matchPercentage":0,"reason":"","strengths":["",""],"considerations":""}],"summary":""}`;

    try {
      // Try to get AI recommendations
      const result = await generateContent<Omit<RecommendationResponse, 'source'>>(
        prompt,
        cacheKey,
        CACHE_TTL
      );

      // Add source to response
      const response: RecommendationResponse = {
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

      // Return fallback recommendations on ANY error
      const fallbackResponse = generateFallbackRecommendations(preferences);

      return NextResponse.json(fallbackResponse, {
        headers: {
          'X-Response-Source': 'fallback',
        },
      });
    }
  } catch (error: any) {
    console.error('Error in recommendations route:', error);

    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    );
  }
}
