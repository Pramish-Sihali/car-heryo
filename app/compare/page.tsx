'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CarSelector } from '@/components/car/CarSelector';
import { ComparisonTable } from '@/components/car/ComparisonTable';
import { WinnerBadge } from '@/components/car/WinnerBadge';
import { AIRecommendation } from '@/components/car/AIRecommendation';
import { mockEVCars } from '@/lib/mock-data';

interface AIAnalysis {
  winner: string;
  summary: string;
  reasons: string[];
  bestFor: string;
  valueProposition: string;
}

// Cache for API responses
const analysisCache = new Map<string, { data: AIAnalysis; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function CompareContent() {
  const searchParams = useSearchParams();
  const [car1Id, setCar1Id] = useState(searchParams.get('car1') || mockEVCars[0].id);
  const [car2Id, setCar2Id] = useState(searchParams.get('car2') || mockEVCars[1].id);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const car1 = mockEVCars.find((c) => c.id === car1Id) || mockEVCars[0];
  const car2 = mockEVCars.find((c) => c.id === car2Id) || mockEVCars[1];

  const handleSwap = () => {
    const temp = car1Id;
    setCar1Id(car2Id);
    setCar2Id(temp);
  };

  // Fetch AI analysis with debouncing and caching
  useEffect(() => {
    // Clear previous timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Check cache first
    const cacheKey = `${car1Id}-${car2Id}`;
    const cached = analysisCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setAiAnalysis(cached.data);
      setIsAnalyzing(false);
      setError(null);
      return;
    }

    // Debounce the API call (wait 1 second before making request)
    fetchTimeoutRef.current = setTimeout(async () => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const response = await fetch('/api/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ car1, car2 }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit error
            const errorData = await response.json();
            const retryMatch = errorData.error?.match(/retry in ([\d.]+)s/i);
            if (retryMatch) {
              const retrySeconds = Math.ceil(parseFloat(retryMatch[1]));
              setRetryAfter(retrySeconds);
              setError(`Rate limit reached. Please wait ${retrySeconds} seconds before trying again.`);
            } else {
              setError('Rate limit reached. Please wait a moment before trying again.');
            }
            throw new Error('Rate limit exceeded');
          }
          throw new Error('Failed to get AI analysis');
        }

        const data = await response.json();
        setAiAnalysis(data);

        // Cache the response
        analysisCache.set(cacheKey, { data, timestamp: Date.now() });
      } catch (err) {
        console.error('Error fetching AI analysis:', err);
        if (!error) {
          setError('Failed to load AI analysis. Showing basic comparison.');
        }
        setAiAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000); // 1 second debounce

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [car1Id, car2Id]);

  return (
    <div className="container px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Compare EVs</h1>
          <p className="text-muted-foreground">
            AI-powered comparison to find the perfect electric vehicle for you
          </p>
        </div>

        <CarSelector
          car1Id={car1Id}
          car2Id={car2Id}
          onCar1Change={setCar1Id}
          onCar2Change={setCar2Id}
          onSwap={handleSwap}
        />

        {error && (
          <div className="text-center p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">{error}</p>
          </div>
        )}

        <WinnerBadge
          car1={car1}
          car2={car2}
          aiRecommendation={aiAnalysis ? { winner: aiAnalysis.winner, summary: aiAnalysis.summary } : null}
          isLoading={isAnalyzing}
        />

        <ComparisonTable car1={car1} car2={car2} />

        {aiAnalysis && !isAnalyzing && (
          <AIRecommendation analysis={aiAnalysis} />
        )}
      </motion.div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<div className="container px-4 py-12 text-center">Loading...</div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
