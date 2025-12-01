'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Battery, Gauge, Zap } from 'lucide-react';
import { EVCar } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CarCardProps {
  car: EVCar;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image
              src={car.image}
              alt={car.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-2 right-2"
            >
              <Badge>{car.category}</Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold">{car.name}</h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-primary mt-1"
              >
                ${car.price.toLocaleString()}
              </motion.p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-md border p-2 text-center"
              >
                <Battery className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-xs font-medium">{car.specs.range} km</span>
                <span className="text-xs text-muted-foreground">Range</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-md border p-2 text-center"
              >
                <Zap className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-xs font-medium">{car.specs.battery} kWh</span>
                <span className="text-xs text-muted-foreground">Battery</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-md border p-2 text-center"
              >
                <Gauge className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-xs font-medium">{car.specs.acceleration}</span>
                <span className="text-xs text-muted-foreground">0-100</span>
              </motion.div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Link href={`/car/${car.id}`} className="w-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full gap-2 group">
                View Details
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
