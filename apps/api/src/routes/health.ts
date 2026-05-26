import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { RedisCacheService } from '@api/plugins/redis';

/** Health check response shape */
interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
  uptime: number;
  timestamp: string;
}

/**
 * Health check route plugin.
 *
 * GET /health — returns connectivity status for database, redis,
 * and server uptime. Never throws — always returns a structured response.
 */
async function healthPlugin(app: FastifyInstance): Promise<void> {
  app.get(
    '/health',
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      let dbStatus: 'connected' | 'disconnected' = 'disconnected';
      let redisStatus: 'connected' | 'disconnected' = 'disconnected';

      // Check database connectivity
      try {
        await app.prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch (error: unknown) {
        app.log.error({ err: error }, 'Health check: database unreachable');
      }

      // Check Redis connectivity
      try {
        const cache = new RedisCacheService(app.redis);
        const isAlive = await cache.ping();
        redisStatus = isAlive ? 'connected' : 'disconnected';
      } catch (error: unknown) {
        app.log.error({ err: error }, 'Health check: Redis unreachable');
      }

      const overallStatus =
        dbStatus === 'connected' && redisStatus === 'connected' ? 'ok' : 'error';

      const response: HealthResponse = {
        status: overallStatus,
        database: dbStatus,
        redis: redisStatus,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      };

      const statusCode = overallStatus === 'ok' ? 200 : 503;
      void reply.status(statusCode).send(response);
    },
  );
}

export default fp(healthPlugin, {
  name: 'health',
  fastify: '5.x',
  dependencies: ['prisma', 'redis'],
});
