/**
 * Simple in-memory rate limiting utility
 * In production, consider using Redis or a more robust solution
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Check if a request should be rate limited
   * @param key Unique identifier for the rate limit (e.g., user ID + endpoint)
   * @param maxRequests Maximum requests allowed
   * @param windowMs Time window in milliseconds
   * @returns true if request should be allowed, false if rate limited
   */
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string, maxRequests: number): number {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      return maxRequests;
    }

    return Math.max(0, maxRequests - entry.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key);
    return entry ? entry.resetTime : null;
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.limits.clear();
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Quiz finalization - 5 requests per minute per user
  QUIZ_FINALIZE: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  },

  // Daily challenge claim - 3 requests per day per user (very restrictive)
  DAILY_CHALLENGE_CLAIM: {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Wallet spend - 10 requests per minute per user
  WALLET_SPEND: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },

  // Leaderboard - 20 requests per minute per user
  LEADERBOARD: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },

  // Wallet info - 30 requests per minute per user
  WALLET_INFO: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

/**
 * Create a rate limit key for a user and endpoint
 */
export function createRateLimitKey(userId: string, endpoint: string): string {
  return `${userId}:${endpoint}`;
}

/**
 * Check rate limit and return appropriate response
 */
export function checkRateLimit(
  userId: string,
  endpoint: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining?: number; resetTime?: number } {
  const key = createRateLimitKey(userId, endpoint);
  const config = RATE_LIMITS[endpoint];
  
  const allowed = rateLimiter.isAllowed(key, config.maxRequests, config.windowMs);
  
  if (!allowed) {
    const resetTime = rateLimiter.getResetTime(key);
    return {
      allowed: false,
      remaining: 0,
      resetTime: resetTime || undefined,
    };
  }
  
  const remaining = rateLimiter.getRemaining(key, config.maxRequests);
  return {
    allowed: true,
    remaining,
  };
}
