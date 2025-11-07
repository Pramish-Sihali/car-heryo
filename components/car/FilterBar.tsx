'use client';

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fadeInUp } from '@/lib/animations';

interface FilterBarProps {
  category: string;
  priceRange: string;
  onCategoryChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
}

export function FilterBar({
  category,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
}: FilterBarProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border bg-card p-4"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
            <SelectItem value="Crossover">Crossover</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-30000">Under $30,000</SelectItem>
            <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
            <SelectItem value="50000-70000">$50,000 - $70,000</SelectItem>
            <SelectItem value="70000+">Over $70,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
