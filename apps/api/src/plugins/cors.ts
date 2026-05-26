import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { env } from '@api/config/env';

/**
 * Registers the CORS plugin with environment-driven configuration.
 *
 * - Allows the origin specified by `CORS_ORIGIN` (defaults to `http://localhost:3000`).
 * - Enables credentials so cookies / auth headers are forwarded.
 * - Exposes common headers the client may need to read.
 */
async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'Accept',
      'Origin',
    ],
    exposedHeaders: [
      'X-Request-Id',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    maxAge: 86_400, // 24 hours
  });
}

export default fp(corsPlugin, {
  name: 'cors',
  fastify: '5.x',
});
