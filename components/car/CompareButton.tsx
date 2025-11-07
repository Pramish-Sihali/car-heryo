'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompareButtonProps {
  carId: string;
}

export function CompareButton({ carId }: CompareButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link href={`/compare?car1=${carId}`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Button size="lg" className="gap-2 shadow-lg">
            <GitCompare className="h-5 w-5" />
            Compare This Car
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
