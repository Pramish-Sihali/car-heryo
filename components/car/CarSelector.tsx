'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockEVCars } from '@/lib/mock-data';

interface CarSelectorProps {
  car1Id: string;
  car2Id: string;
  onCar1Change: (id: string) => void;
  onCar2Change: (id: string) => void;
  onSwap: () => void;
}

export function CarSelector({
  car1Id,
  car2Id,
  onCar1Change,
  onCar2Change,
  onSwap,
}: CarSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center gap-4 justify-center"
    >
      <Select value={car1Id} onValueChange={onCar1Change}>
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select first car" />
        </SelectTrigger>
        <SelectContent>
          {mockEVCars.map((car) => (
            <SelectItem key={car.id} value={car.id}>
              {car.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-muted-foreground">VS</span>
        <motion.div whileHover={{ rotate: 180 }} whileTap={{ scale: 0.9 }}>
          <Button variant="outline" size="icon" onClick={onSwap}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <Select value={car2Id} onValueChange={onCar2Change}>
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select second car" />
        </SelectTrigger>
        <SelectContent>
          {mockEVCars.map((car) => (
            <SelectItem key={car.id} value={car.id}>
              {car.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
