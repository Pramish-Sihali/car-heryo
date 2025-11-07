'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { mockEVCars } from '@/lib/mock-data';
import { Header } from '@/components/layout/Header';
import { CarDetailHero } from '@/components/car/CarDetailHero';
import { CarTabs } from '@/components/car/CarTabs';
import { CompareButton } from '@/components/car/CompareButton';
import { Button } from '@/components/ui/button';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const car = mockEVCars.find((c) => c.id === params.id);

  if (!car) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container flex flex-col items-center justify-center px-4 py-20">
          <h1 className="text-2xl font-bold mb-4">Car not found</h1>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-20 left-4 z-40"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      <CarDetailHero car={car} />

      <div className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CarTabs car={car} />
        </motion.div>
      </div>

      <CompareButton carId={car.id} />
    </div>
  );
}
