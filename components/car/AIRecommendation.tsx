'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AIRecommendationProps {
  analysis: {
    winner: string;
    summary: string;
    reasons: string[];
    bestFor: string;
    valueProposition: string;
  } | null;
}

export function AIRecommendation({ analysis }: AIRecommendationProps) {
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lightbulb className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold">AI Expert Analysis</h2>
        </div>
        <p className="text-muted-foreground">
          Powered by Gemini AI - Comprehensive comparison insights
        </p>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Key Reasons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg border bg-card space-y-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-xl font-semibold">Key Advantages</h3>
          </div>
          <ul className="space-y-3">
            {analysis.reasons.map((reason, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed">{reason}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Best For & Value Proposition */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="text-xl font-semibold">Perfect For</h3>
            </div>
            <p className="text-sm leading-relaxed">{analysis.bestFor}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-lg border bg-gradient-to-br from-purple-500/10 to-blue-500/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <h3 className="text-xl font-semibold">Why Choose This?</h3>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              {analysis.valueProposition}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-muted-foreground mt-4"
      >
        This analysis is based on the specifications and features provided.
        We recommend test-driving both vehicles before making a final decision.
      </motion.div>
    </motion.div>
  );
}
