'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { UserPreferences } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
}

export function PreferenceForm({ onSubmit }: PreferenceFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: '',
    carType: '',
    range: '',
    usage: '',
    features: [],
    seating: '',
    charging: '',
    brand: '',
    performance: '',
    priority: [],
  });

  const handleFeatureToggle = (feature: string) => {
    setPreferences((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handlePriorityToggle = (priority: string) => {
    setPreferences((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter((p) => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const isFormValid = () => {
    return (
      preferences.budget &&
      preferences.carType &&
      preferences.range &&
      preferences.usage &&
      preferences.seating &&
      preferences.charging &&
      preferences.brand &&
      preferences.performance &&
      preferences.priority.length > 0
    );
  };

  const totalQuestions = 10;
  const answeredQuestions = Object.entries(preferences).filter(([key, value]) => {
    if (key === 'features') return true; // Features are optional
    if (key === 'priority') return (value as string[]).length > 0;
    return value !== '';
  }).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{answeredQuestions}/{totalQuestions} questions</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Question 1: Budget */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">1. What&apos;s your budget?</h3>
          <RadioGroup value={preferences.budget} onValueChange={(value) => setPreferences({ ...preferences, budget: value })}>
            <div className="space-y-3">
              {['Under $30,000', '$30,000 - $50,000', 'Over $50,000', 'No budget limit'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`budget-${option}`} />
                  <Label htmlFor={`budget-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 2: Car Type */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">2. Preferred car type?</h3>
          <RadioGroup value={preferences.carType} onValueChange={(value) => setPreferences({ ...preferences, carType: value })}>
            <div className="space-y-3">
              {['Sedan', 'SUV', 'Hatchback', 'Crossover', 'Any'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`carType-${option}`} />
                  <Label htmlFor={`carType-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 3: Range */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">3. Minimum range needed?</h3>
          <RadioGroup value={preferences.range} onValueChange={(value) => setPreferences({ ...preferences, range: value })}>
            <div className="space-y-3">
              {['Under 300km', '300-400km', '400-500km', 'Over 500km'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`range-${option}`} />
                  <Label htmlFor={`range-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 4: Usage */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">4. Primary usage?</h3>
          <RadioGroup value={preferences.usage} onValueChange={(value) => setPreferences({ ...preferences, usage: value })}>
            <div className="space-y-3">
              {['City driving', 'Highway commute', 'Mixed usage', 'Long road trips'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`usage-${option}`} />
                  <Label htmlFor={`usage-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 5: Features */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">5. Must-have features? (select multiple)</h3>
          <div className="space-y-3">
            {['Autopilot', 'Fast charging', 'Panoramic roof', 'Premium audio', '360° camera'].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`feature-${feature}`}
                  checked={preferences.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`feature-${feature}`} className="cursor-pointer">{feature}</Label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Question 6: Seating */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">6. How many seats?</h3>
          <RadioGroup value={preferences.seating} onValueChange={(value) => setPreferences({ ...preferences, seating: value })}>
            <div className="space-y-3">
              {['5 seats', '7+ seats'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`seating-${option}`} />
                  <Label htmlFor={`seating-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 7: Charging */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">7. Charging preference?</h3>
          <RadioGroup value={preferences.charging} onValueChange={(value) => setPreferences({ ...preferences, charging: value })}>
            <div className="space-y-3">
              {['Home charging (overnight)', 'Fast charging (30 mins)', "Don't mind either"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`charging-${option}`} />
                  <Label htmlFor={`charging-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 8: Brand */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">8. Preferred brand?</h3>
          <Select value={preferences.brand} onValueChange={(value) => setPreferences({ ...preferences, brand: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {['Tesla', 'BYD', 'Nissan', 'Hyundai', 'Volkswagen', 'Kia', 'Polestar', 'MG', 'BMW', 'Chevrolet', 'Any'].map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Question 9: Performance */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">9. Performance priority?</h3>
          <RadioGroup value={preferences.performance} onValueChange={(value) => setPreferences({ ...preferences, performance: value })}>
            <div className="space-y-3">
              {['Economy/Efficiency', 'Balanced', 'High performance'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`performance-${option}`} />
                  <Label htmlFor={`performance-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Question 10: Priority */}
        <motion.div variants={fadeInUp} className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">10. What matters most? (select multiple)</h3>
          <div className="space-y-3">
            {['Range', 'Price', 'Features', 'Brand', 'Performance'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`priority-${option}`}
                  checked={preferences.priority.includes(option)}
                  onChange={() => handlePriorityToggle(option)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`priority-${option}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
          disabled={!isFormValid()}
        >
          Find My Perfect EV
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </form>
  );
}
