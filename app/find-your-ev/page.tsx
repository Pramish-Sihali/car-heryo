'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PreferenceForm } from '@/components/car/PreferenceForm';
import { LoadingAnimation } from '@/components/car/LoadingAnimation';
import { RecommendationResults } from '@/components/car/RecommendationResults';
import { UserPreferences } from '@/lib/types';
import { getRecommendations, ScoredCar } from '@/lib/recommendations';

type ViewState = 'form' | 'loading' | 'results';

export default function FindYourEVPage() {
  const [viewState, setViewState] = useState<ViewState>('form');
  const [recommendations, setRecommendations] = useState<ScoredCar[]>([]);

  const handleFormSubmit = (preferences: UserPreferences) => {
    setViewState('loading');

    // Simulate loading time for better UX
    setTimeout(() => {
      const results = getRecommendations(preferences);
      setRecommendations(results);
      setViewState('results');
    }, 2000);
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
                <RecommendationResults recommendations={recommendations} />
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
