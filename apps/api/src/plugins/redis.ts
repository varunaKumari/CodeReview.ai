import Redis from 'ioredis';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { env } from '@api/config/env';

/**
 * Fastify plugin that initializes a Redis connection via ioredis
 * and decorates the Fastify instance with `app.redis`.
 *
 * Provides typed helper methods for common operations.
 * Compatible with Upstash Redis (TLS) and standard Redis.
 */
async function redisPlugin(app: FastifyInstance): Promise<void> {
  const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number): number | null {
      if (times > 3) {
        app.log.error('Redis: max retries reached, giving up');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  // Connect
  await redis.connect();
  app.log.info('🔴 Redis connected');

  // Decorate Fastify instance
  app.decorate('redis', redis);

  // Graceful disconnect on shutdown
  app.addHook('onClose', async () => {
    app.log.info('🔴 Redis disconnecting...');
    redis.disconnect();
  });
}

export default fp(redisPlugin, {
  name: 'redis',
  fastify: '5.x',
});

// ── Type augmentation ───────────────────────────────────────
declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

// ═══════════════════════════════════════════════════════════
// Typed Redis Helper Service
// ═══════════════════════════════════════════════════════════

/**
 * Typed Redis cache helpers.
 *
 * Usage: `const cache = new RedisCacheService(app.redis);`
 */
export class RedisCacheService {
  constructor(private readonly client: Redis) {}

  /** Get a parsed JSON value by key, or null if not found. */
  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  }

  /** Set a JSON-serializable value with optional TTL in seconds. */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds !== undefined) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  /** Delete one or more keys. Returns the number of keys deleted. */
  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return this.client.del(...keys);
  }

  /** Check if a key exists. */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /** Set or update the TTL on an existing key. */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.expire(key, ttlSeconds);
    return result === 1;
  }

  /** Increment a numeric value. Returns the new value. */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /** Get remaining TTL in seconds. Returns -1 if no TTL, -2 if key doesn't exist. */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /** Ping Redis — returns true if connected. */
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
