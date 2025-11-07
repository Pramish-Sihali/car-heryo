'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { EVCar } from '@/lib/types';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface ComparisonTableProps {
  car1: EVCar;
  car2: EVCar;
}

interface ComparisonRow {
  label: string;
  car1Value: string | number;
  car2Value: string | number;
  compareFunc: (v1: string | number, v2: string | number) => 'car1' | 'car2' | 'tie';
}

export function ComparisonTable({ car1, car2 }: ComparisonTableProps) {
  const comparisonRows: ComparisonRow[] = [
    {
      label: 'Price',
      car1Value: car1.price,
      car2Value: car2.price,
      compareFunc: (v1, v2) => (Number(v1) < Number(v2) ? 'car1' : Number(v1) > Number(v2) ? 'car2' : 'tie'),
    },
    {
      label: 'Range',
      car1Value: `${car1.specs.range} km`,
      car2Value: `${car2.specs.range} km`,
      compareFunc: (v1, v2) => (car1.specs.range > car2.specs.range ? 'car1' : car1.specs.range < car2.specs.range ? 'car2' : 'tie'),
    },
    {
      label: 'Battery',
      car1Value: `${car1.specs.battery} kWh`,
      car2Value: `${car2.specs.battery} kWh`,
      compareFunc: (v1, v2) => (car1.specs.battery > car2.specs.battery ? 'car1' : car1.specs.battery < car2.specs.battery ? 'car2' : 'tie'),
    },
    {
      label: 'Charging',
      car1Value: car1.specs.charging,
      car2Value: car2.specs.charging,
      compareFunc: () => 'tie', // Charging times are text, hard to compare
    },
    {
      label: 'Top Speed',
      car1Value: `${car1.specs.topSpeed} km/h`,
      car2Value: `${car2.specs.topSpeed} km/h`,
      compareFunc: (v1, v2) => (car1.specs.topSpeed > car2.specs.topSpeed ? 'car1' : car1.specs.topSpeed < car2.specs.topSpeed ? 'car2' : 'tie'),
    },
    {
      label: 'Acceleration',
      car1Value: car1.specs.acceleration,
      car2Value: car2.specs.acceleration,
      compareFunc: (v1, v2) => {
        const acc1 = parseFloat(String(v1));
        const acc2 = parseFloat(String(v2));
        return acc1 < acc2 ? 'car1' : acc1 > acc2 ? 'car2' : 'tie'; // Lower is better
      },
    },
    {
      label: 'Seats',
      car1Value: car1.specs.seats,
      car2Value: car2.specs.seats,
      compareFunc: (v1, v2) => (Number(v1) > Number(v2) ? 'car1' : Number(v1) < Number(v2) ? 'car2' : 'tie'),
    },
    {
      label: 'Power',
      car1Value: `${car1.specs.power} hp`,
      car2Value: `${car2.specs.power} hp`,
      compareFunc: (v1, v2) => (car1.specs.power > car2.specs.power ? 'car1' : car1.specs.power < car2.specs.power ? 'car2' : 'tie'),
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${car1.id}-${car2.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Car Images */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-64 rounded-lg overflow-hidden"
          >
            {/* <Image src={car1.image} alt={car1.name} fill className="object-cover" /> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-64 rounded-lg overflow-hidden"
          >
            {/* <Image src={car2.image} alt={car2.name} fill className="object-cover" /> */}
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="rounded-lg border overflow-hidden"
        >
          {comparisonRows.map((row, index) => {
            const winner = row.compareFunc(row.car1Value, row.car2Value);

            return (
              <motion.div
                key={row.label}
                variants={fadeInUp}
                className="grid grid-cols-3 border-b last:border-b-0"
              >
                {/* Car 1 Value */}
                <motion.div
                  whileHover={{ scale: winner === 'car1' ? 1.02 : 1 }}
                  className={`p-4 flex items-center justify-between ${
                    winner === 'car1' ? 'bg-green-500/10' : 'bg-card'
                  }`}
                >
                  <span className="font-medium">
                    {row.label === 'Price' ? `$${Number(row.car1Value).toLocaleString()}` : row.car1Value}
                  </span>
                  {winner === 'car1' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Trophy className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Label */}
                <div className="p-4 bg-muted flex items-center justify-center">
                  <span className="text-sm font-semibold text-center">{row.label}</span>
                </div>

                {/* Car 2 Value */}
                <motion.div
                  whileHover={{ scale: winner === 'car2' ? 1.02 : 1 }}
                  className={`p-4 flex items-center justify-between ${
                    winner === 'car2' ? 'bg-green-500/10' : 'bg-card'
                  }`}
                >
                  {winner === 'car2' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Trophy className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                  <span className="font-medium ml-auto">
                    {row.label === 'Price' ? `$${Number(row.car2Value).toLocaleString()}` : row.car2Value}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
