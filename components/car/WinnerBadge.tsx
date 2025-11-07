'use client';

import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { EVCar } from '@/lib/types';

interface WinnerBadgeProps {
  car1: EVCar;
  car2: EVCar;
}

export function WinnerBadge({ car1, car2 }: WinnerBadgeProps) {
  // Calculate winner based on various metrics
  let car1Score = 0;
  let car2Score = 0;

  // Price (lower is better)
  if (car1.price < car2.price) car1Score++;
  else if (car2.price < car1.price) car2Score++;

  // Range (higher is better)
  if (car1.specs.range > car2.specs.range) car1Score++;
  else if (car2.specs.range > car1.specs.range) car2Score++;

  // Battery (higher is better)
  if (car1.specs.battery > car2.specs.battery) car1Score++;
  else if (car2.specs.battery > car1.specs.battery) car2Score++;

  // Top Speed (higher is better)
  if (car1.specs.topSpeed > car2.specs.topSpeed) car1Score++;
  else if (car2.specs.topSpeed > car1.specs.topSpeed) car2Score++;

  // Acceleration (lower is better)
  const acc1 = parseFloat(car1.specs.acceleration);
  const acc2 = parseFloat(car2.specs.acceleration);
  if (acc1 < acc2) car1Score++;
  else if (acc2 < acc1) car2Score++;

  // Power (higher is better)
  if (car1.specs.power > car2.specs.power) car1Score++;
  else if (car2.specs.power > car1.specs.power) car2Score++;

  const winner = car1Score > car2Score ? car1 : car2Score > car1Score ? car2 : null;
  const winnerScore = Math.max(car1Score, car2Score);

  if (!winner) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 rounded-lg border bg-card"
      >
        <p className="text-lg font-semibold">It&apos;s a tie!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Both cars are equally matched
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-6 rounded-lg border bg-gradient-to-br from-yellow-500/10 to-amber-500/10"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="inline-block mb-2"
      >
        <Crown className="h-12 w-12 text-yellow-500" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-1">{winner.name}</h3>
      <p className="text-sm text-muted-foreground">
        Winner with {winnerScore} out of 6 categories
      </p>
    </motion.div>
  );
}
