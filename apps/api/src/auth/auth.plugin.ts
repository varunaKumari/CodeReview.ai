import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyToken } from '@clerk/backend';

import { env } from '@api/config/env';
import { RedisCacheService } from '@api/plugins/redis';
import type { User } from '@prisma/client';

/**
 * Fastify auth plugin that verifies Clerk JWTs on every request.
 *
 * Behavior:
 * 1. Skips routes with `config.skipAuth: true` (webhooks, health)
 * 2. Extracts Bearer token from Authorization header
 * 3. Verifies JWT using Clerk's verifyToken()
 * 4. Looks up user by clerkId (Redis cache → Prisma fallback)
 * 5. Creates user via upsert if not found in DB
 * 6. Attaches user to `request.user`
 * 7. Returns 401 on missing/invalid token
 *
 * Redis cache key: `user:clerk:{clerkId}` with 60s TTL
 */
async function authPlugin(app: FastifyInstance): Promise<void> {
  const cache = new RedisCacheService(app.redis);

  app.decorateRequest('user', null);

  app.addHook(
    'preHandler',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      // Skip auth for routes marked with skipAuth
      const routeConfig = request.routeOptions.config as Record<string, unknown> | undefined;
      if (routeConfig?.['skipAuth'] === true) {
        return;
      }

      // Extract Bearer token
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header',
          statusCode: 401,
        });
        return;
      }

      const token = authHeader.slice(7);

      // Verify JWT with Clerk
      let clerkId: string;
      try {
        const payload = await verifyToken(token, {
          secretKey: env.CLERK_SECRET_KEY,
        });
        clerkId = payload.sub;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Token verification failed';
        request.log.warn({ err }, 'Clerk JWT verification failed');
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message,
          statusCode: 401,
        });
        return;
      }

      // Look up user — cache first, then DB
      const cacheKey = `user:clerk:${clerkId}`;
      let user = await cache.get<User>(cacheKey);

      if (!user) {
        // Fetch from DB, create if not exists
        user = await app.prisma.user.upsert({
          where: { clerkId },
          update: {},
          create: {
            clerkId,
            email: `${clerkId}@clerk.placeholder`,
            name: 'User',
            role: 'USER',
          },
        });

        // Cache for 60 seconds
        await cache.set(cacheKey, user, 60);
      }

      // Attach user to request
      request.user = user;
    },
  );
}

export default fp(authPlugin, {
  name: 'auth',
  fastify: '5.x',
  dependencies: ['prisma', 'redis'],
});

// ── Type augmentation ───────────────────────────────────────
declare module 'fastify' {
  interface FastifyRequest {
    user: User | null;
  }
}
