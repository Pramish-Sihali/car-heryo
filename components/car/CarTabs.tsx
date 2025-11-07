'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Gauge, Zap, Users, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { EVCar } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface CarTabsProps {
  car: EVCar;
}

export function CarTabs({ car }: CarTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <TabsContent value="overview" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              {car.description}
            </p>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center rounded-lg border bg-card p-6"
              >
                <Battery className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{car.specs.range} km</span>
                <span className="text-sm text-muted-foreground">Range</span>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center rounded-lg border bg-card p-6"
              >
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{car.specs.battery} kWh</span>
                <span className="text-sm text-muted-foreground">Battery</span>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center rounded-lg border bg-card p-6"
              >
                <Gauge className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{car.specs.acceleration}</span>
                <span className="text-sm text-muted-foreground">0-100 km/h</span>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center rounded-lg border bg-card p-6"
              >
                <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{car.specs.power} hp</span>
                <span className="text-sm text-muted-foreground">Power</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2"
          >
            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Battery className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Range</span>
              </div>
              <p className="text-2xl font-bold">{car.specs.range} km</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(car.specs.range / 650) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Battery Capacity</span>
              </div>
              <p className="text-2xl font-bold">{car.specs.battery} kWh</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(car.specs.battery / 120) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Charging Time</span>
              </div>
              <p className="text-xl font-bold">{car.specs.charging}</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Top Speed</span>
              </div>
              <p className="text-2xl font-bold">{car.specs.topSpeed} km/h</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Acceleration</span>
              </div>
              <p className="text-2xl font-bold">{car.specs.acceleration}</p>
              <p className="text-sm text-muted-foreground">0-100 km/h</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Seating</span>
              </div>
              <p className="text-2xl font-bold">{car.specs.seats} seats</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Power Output</span>
              </div>
              <p className="text-2xl font-bold">{car.specs.power} hp</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Year</span>
              </div>
              <p className="text-2xl font-bold">{car.year}</p>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            variants={staggerContainer}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {car.features.map((feature, index) => (
              <motion.div
                key={feature}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}
                className="flex items-center gap-3 rounded-lg border bg-card p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
}
