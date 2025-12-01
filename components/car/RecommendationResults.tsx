'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GitCompare } from 'lucide-react';
import { ScoredCar } from '@/lib/recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { useState } from 'react';

interface RecommendationResultsProps {
  recommendations: ScoredCar[];
  aiSummary?: string;
}

export function RecommendationResults({ recommendations, aiSummary }: RecommendationResultsProps) {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  const handleToggleSelect = (carId: string) => {
    setSelectedCars((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      } else if (prev.length < 2) {
        return [...prev, carId];
      }
      return prev;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 rounded-full"></div>
            <Sparkles className="relative h-16 w-16 text-primary" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          We found {recommendations.length} perfect matches!
        </motion.h2>
        {aiSummary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-3xl mx-auto"
          >
            <div className="rounded-xl border border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 shadow-lg">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">AI-Powered Analysis</span>
              </div>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{aiSummary}</p>
            </div>
          </motion.div>
        ) : (
          <p className="text-muted-foreground text-lg">
            Here are the best EVs based on your preferences
          </p>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.car.id}
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-2xl ${
              index === 0 ? 'ring-2 ring-yellow-500 shadow-xl' : ''
            }`}>
              <CardHeader className="p-0">
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <Image
                    src={recommendation.car.image}
                    alt={recommendation.car.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg text-sm px-3 py-1">
                      {recommendation.matchPercentage}% Match
                    </Badge>
                  </div>

                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedCars.includes(recommendation.car.id)}
                      onChange={() => handleToggleSelect(recommendation.car.id)}
                      className="h-5 w-5 cursor-pointer rounded border-2 border-white shadow-lg"
                      disabled={
                        !selectedCars.includes(recommendation.car.id) &&
                        selectedCars.length >= 2
                      }
                    />
                  </div>

                  {index === 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="absolute top-3 left-1/2 -translate-x-1/2"
                    >
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg px-4 py-1.5 text-sm">
                        ⭐ Top Pick
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5 flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{recommendation.car.name}</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${recommendation.car.price.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-sm font-bold mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                      Why we recommend this
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{recommendation.reason}</p>
                  </div>

                  {recommendation.strengths && recommendation.strengths.length > 0 && (
                    <div>
                      <div className="text-sm font-bold mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        Key Strengths
                      </div>
                      <ul className="space-y-2">
                        {recommendation.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground leading-relaxed">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendation.considerations && (
                    <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 p-3">
                      <div className="text-sm font-bold mb-1 flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                        <span>💡</span>
                        Consider
                      </div>
                      <p className="text-xs leading-relaxed text-yellow-700 dark:text-yellow-300">{recommendation.considerations}</p>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0 flex flex-col gap-2">
                <Link href={`/car/${recommendation.car.id}`} className="w-full">
                  <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedCars.length === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Link href={`/compare?car1=${selectedCars[0]}&car2=${selectedCars[1]}`}>
            <Button size="lg" className="gap-2 shadow-xl">
              <GitCompare className="h-5 w-5" />
              Compare Selected Cars
            </Button>
          </Link>
        </motion.div>
      )}

      {selectedCars.length > 0 && selectedCars.length < 2 && (
        <div className="text-center text-sm text-muted-foreground">
          Select one more car to compare
        </div>
      )}
    </motion.div>
  );
}
