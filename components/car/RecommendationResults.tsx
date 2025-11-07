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
}

export function RecommendationResults({ recommendations }: RecommendationResultsProps) {
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
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-block mb-4"
        >
          <Sparkles className="h-12 w-12 text-primary" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">
          We found {recommendations.length} perfect matches!
        </h2>
        <p className="text-muted-foreground">
          Here are the best EVs based on your preferences
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {recommendations.map((recommendation, index) => (
          <motion.div key={recommendation.car.id} variants={fadeInUp}>
            <Card className="overflow-hidden h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  {/* <Image
                    src={recommendation.car.image}
                    alt={recommendation.car.name}
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary">
                      {recommendation.matchPercentage}% Match
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedCars.includes(recommendation.car.id)}
                      onChange={() => handleToggleSelect(recommendation.car.id)}
                      className="h-5 w-5 cursor-pointer"
                      disabled={
                        !selectedCars.includes(recommendation.car.id) &&
                        selectedCars.length >= 2
                      }
                    />
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="bg-yellow-500 text-black">
                        Top Pick
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 flex-1">
                <h3 className="text-lg font-bold mb-1">{recommendation.car.name}</h3>
                <p className="text-2xl font-bold text-primary mb-3">
                  ${recommendation.car.price.toLocaleString()}
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Why we recommend this:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Link href={`/car/${recommendation.car.id}`} className="w-full">
                  <Button className="w-full gap-2">
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
