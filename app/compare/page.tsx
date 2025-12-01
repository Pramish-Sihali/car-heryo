'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CarSelector } from '@/components/car/CarSelector';
import { ComparisonTable } from '@/components/car/ComparisonTable';
import { WinnerBadge } from '@/components/car/WinnerBadge';
import { mockEVCars } from '@/lib/mock-data';

function CompareContent() {
  const searchParams = useSearchParams();
  const [car1Id, setCar1Id] = useState(searchParams.get('car1') || mockEVCars[0].id);
  const [car2Id, setCar2Id] = useState(searchParams.get('car2') || mockEVCars[1].id);

  const car1 = mockEVCars.find((c) => c.id === car1Id) || mockEVCars[0];
  const car2 = mockEVCars.find((c) => c.id === car2Id) || mockEVCars[1];

  const handleSwap = () => {
    const temp = car1Id;
    setCar1Id(car2Id);
    setCar2Id(temp);
  };

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
            Compare specifications side-by-side to find the perfect match
          </p>
        </div>

        <CarSelector
          car1Id={car1Id}
          car2Id={car2Id}
          onCar1Change={setCar1Id}
          onCar2Change={setCar2Id}
          onSwap={handleSwap}
        />

        <WinnerBadge car1={car1} car2={car2} />

        <ComparisonTable car1={car1} car2={car2} />
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
