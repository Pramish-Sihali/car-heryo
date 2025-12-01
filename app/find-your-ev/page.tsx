'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PreferenceForm } from '@/components/car/PreferenceForm';
import { LoadingAnimation } from '@/components/car/LoadingAnimation';
import { RecommendationResults } from '@/components/car/RecommendationResults';
import { UserPreferences } from '@/lib/types';
import { getRecommendations, ScoredCar } from '@/lib/recommendations';
import { mockEVCars } from '@/lib/mock-data';

type ViewState = 'form' | 'loading' | 'results';

interface AIRecommendation {
  carId: string;
  matchPercentage: number;
  reason: string;
  strengths: string[];
  considerations: string;
}

interface AIResponse {
  recommendations: AIRecommendation[];
  summary: string;
}

// Cache for recommendations
const recommendationsCache = new Map<string, { data: AIResponse; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default function FindYourEVPage() {
  const [viewState, setViewState] = useState<ViewState>('form');
  const [recommendations, setRecommendations] = useState<ScoredCar[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const handleFormSubmit = async (preferences: UserPreferences) => {
    setViewState('loading');
    setError(null);
    setRetryAfter(null);

    // Generate cache key from preferences
    const cacheKey = JSON.stringify(preferences);
    const cached = recommendationsCache.get(cacheKey);

    // Check cache first
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const scoredCars: ScoredCar[] = cached.data.recommendations.map((rec) => {
        const car = mockEVCars.find((c) => c.id === rec.carId);
        if (!car) throw new Error(`Car with id ${rec.carId} not found`);

        return {
          car,
          matchPercentage: rec.matchPercentage,
          reason: rec.reason,
          strengths: rec.strengths,
          considerations: rec.considerations,
        };
      });

      setRecommendations(scoredCars);
      setAiSummary(cached.data.summary);
      setViewState('results');
      return;
    }

    try {
      // Call Gemini API for recommendations
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          const retrySeconds = errorData.retryAfter || 60;
          setRetryAfter(retrySeconds);
          setError(`Rate limit reached. Please wait ${retrySeconds} seconds and try again.`);

          // Fallback to basic recommendations after showing error
          setTimeout(() => {
            const results = getRecommendations(preferences);
            setRecommendations(results);
            setViewState('results');
          }, 2000);
          return;
        }
        throw new Error('Failed to get AI recommendations');
      }

      const data: AIResponse = await response.json();

      // Convert AI recommendations to ScoredCar format
      const scoredCars: ScoredCar[] = data.recommendations.map((rec) => {
        const car = mockEVCars.find((c) => c.id === rec.carId);
        if (!car) throw new Error(`Car with id ${rec.carId} not found`);

        return {
          car,
          matchPercentage: rec.matchPercentage,
          reason: rec.reason,
          strengths: rec.strengths,
          considerations: rec.considerations,
        };
      });

      // Cache the successful response
      recommendationsCache.set(cacheKey, { data, timestamp: Date.now() });

      setRecommendations(scoredCars);
      setAiSummary(data.summary);
      setViewState('results');
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
      setError('Failed to get AI recommendations. Using basic matching...');

      // Fallback to basic recommendations
      setTimeout(() => {
        const results = getRecommendations(preferences);
        setRecommendations(results);
        setViewState('results');
      }, 1000);
    }
  };

  const handleStartOver = () => {
    setViewState('form');
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Find Your Perfect EV</h1>
            <p className="text-muted-foreground">
              Answer a few questions and we&apos;ll recommend the best electric vehicles for you
            </p>
          </div>

          {error && (
            <div className="mb-6 text-center p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {viewState === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PreferenceForm onSubmit={handleFormSubmit} />
              </motion.div>
            )}

            {viewState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingAnimation />
              </motion.div>
            )}

            {viewState === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RecommendationResults recommendations={recommendations} aiSummary={aiSummary} />
                <div className="mt-8 text-center">
                  <button
                    onClick={handleStartOver}
                    className="text-primary hover:underline"
                  >
                    Start over with new preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
