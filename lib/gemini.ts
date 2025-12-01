import { GoogleGenerativeAI } from '@google/generative-ai';
import { CacheEntry, RateLimitState, QueuedRequest, GeminiCacheConfig, RetryConfig } from './types/gemini';

// Initialize Gemini with gemini-1.5-flash (stable free tier model)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Rate limiter configuration (15 RPM = 4 second minimum gap)
const RATE_LIMIT_GAP_MS = 4000; // 4 seconds between requests
const rateLimitState: RateLimitState = {
  lastRequestTime: 0,
  requestQueue: [],
  isProcessing: false,
};

// In-memory cache
const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_CACHE_CONFIG: GeminiCacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxEntries: 100,
};

// Retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 2000,
  maxDelay: 10000,
};

/**
 * Clean and parse JSON response from Gemini
 * Removes markdown code blocks and extra whitespace
 */
export function cleanAndParseJSON<T>(text: string): T {
  try {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Try to find JSON object if wrapped in extra text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', text);
    throw new Error('Invalid JSON response from Gemini');
  }
}

/**
 * Generate cache key from data
 */
export function generateCacheKey(data: any): string {
  return JSON.stringify(data);
}

/**
 * Get cached data if available and not expired
 */
export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);

  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

/**
 * Set data in cache with TTL
 */
export function setCachedData<T>(key: string, data: T, ttl?: number): void {
  // Check cache size limit
  if (cache.size >= DEFAULT_CACHE_CONFIG.maxEntries) {
    // Remove oldest entry
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttl || DEFAULT_CACHE_CONFIG.ttl,
  });
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Wait for specified milliseconds
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process request queue with rate limiting
 */
async function processQueue(): Promise<void> {
  if (rateLimitState.isProcessing || rateLimitState.requestQueue.length === 0) {
    return;
  }

  rateLimitState.isProcessing = true;

  while (rateLimitState.requestQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastRequest = now - rateLimitState.lastRequestTime;

    // Enforce minimum gap between requests
    if (timeSinceLastRequest < RATE_LIMIT_GAP_MS) {
      await wait(RATE_LIMIT_GAP_MS - timeSinceLastRequest);
    }

    const request = rateLimitState.requestQueue.shift();
    if (!request) break;

    try {
      const result = await request.execute();
      rateLimitState.lastRequestTime = Date.now();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    }
  }

  rateLimitState.isProcessing = false;
}

/**
 * Add request to queue and process
 */
function queueRequest<T>(execute: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    rateLimitState.requestQueue.push({
      execute,
      resolve,
      reject,
    });

    processQueue();
  });
}

/**
 * Make Gemini API request with retry logic and exponential backoff
 */
async function makeGeminiRequest(
  prompt: string,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      lastError = error;

      // Don't retry on rate limit errors - fail fast
      if (error.message && error.message.includes('429')) {
        throw error;
      }

      // If not last attempt, wait with exponential backoff
      if (attempt < retryConfig.maxRetries) {
        const delay = Math.min(
          retryConfig.initialDelay * Math.pow(2, attempt),
          retryConfig.maxDelay
        );
        console.log(`Gemini request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries})`);
        await wait(delay);
      }
    }
  }

  throw lastError || new Error('Gemini request failed after all retries');
}

/**
 * Generate content with Gemini API
 * Includes rate limiting, caching, and retry logic
 */
export async function generateContent<T>(
  prompt: string,
  cacheKey?: string,
  cacheTTL?: number
): Promise<{ data: T; source: 'ai' | 'cache' }> {
  // Check cache first if key provided
  if (cacheKey) {
    const cached = getCachedData<T>(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }
  }

  // Queue the request with rate limiting
  const text = await queueRequest(() => makeGeminiRequest(prompt));

  // Parse response
  const data = cleanAndParseJSON<T>(text);

  // Cache if key provided
  if (cacheKey) {
    setCachedData(cacheKey, data, cacheTTL);
  }

  return { data, source: 'ai' };
}

/**
 * Get current rate limit state (for debugging)
 */
export function getRateLimitState(): {
  queueLength: number;
  isProcessing: boolean;
  timeSinceLastRequest: number;
} {
  return {
    queueLength: rateLimitState.requestQueue.length,
    isProcessing: rateLimitState.isProcessing,
    timeSinceLastRequest: Date.now() - rateLimitState.lastRequestTime,
  };
}
