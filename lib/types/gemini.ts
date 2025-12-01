import { EVCar } from '../types';

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  summary: string;
  source: 'ai' | 'cache' | 'fallback';
  warning?: string;
}

export interface RecommendationItem {
  carId: string;
  matchPercentage: number;
  reason: string;
  strengths: string[];
  considerations: string;
}

export interface ComparisonResponse {
  winner: string;
  summary: string;
  reasons: string[];
  bestFor: string;
  valueProposition: string;
  source: 'ai' | 'cache' | 'fallback';
  warning?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface RateLimitState {
  lastRequestTime: number;
  requestQueue: QueuedRequest[];
  isProcessing: boolean;
}

export interface QueuedRequest {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export interface CompressedCarData {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  range: number;
  acceleration: string;
  features: string[];
}

export interface GeminiCacheConfig {
  ttl: number;
  maxEntries: number;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}
