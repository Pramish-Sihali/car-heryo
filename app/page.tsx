'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { FilterBar } from '@/components/car/FilterBar';
import { CarCard } from '@/components/car/CarCard';
import { mockEVCars } from '@/lib/mock-data';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export default function Home() {
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const filteredCars = useMemo(() => {
    return mockEVCars.filter((car) => {
      // Category filter
      if (category !== 'all' && car.category !== category) {
        return false;
      }

      // Price range filter
      if (priceRange !== 'all') {
        if (priceRange === '0-30000' && car.price >= 30000) return false;
        if (priceRange === '30000-50000' && (car.price < 30000 || car.price >= 50000)) return false;
        if (priceRange === '50000-70000' && (car.price < 50000 || car.price >= 70000)) return false;
        if (priceRange === '70000+' && car.price < 70000) return false;
      }

      return true;
    });
  }, [category, priceRange]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <main className="container px-4 py-12" id="cars">
        <FilterBar
          category={category}
          priceRange={priceRange}
          onCategoryChange={setCategory}
          onPriceRangeChange={setPriceRange}
        />

        {filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="text-2xl font-semibold mb-2">No cars found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCars.map((car) => (
              <motion.div key={car.id} variants={fadeInUp}>
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
