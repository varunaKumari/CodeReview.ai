import Fastify, { type FastifyInstance, type FastifyError } from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@api/config/env';
import corsPlugin from '@api/plugins/cors';
import loggerPlugin from '@api/plugins/logger';
import rateLimitPlugin from '@api/plugins/rate-limit';
import prismaPlugin from '@api/plugins/prisma';
import redisPlugin from '@api/plugins/redis';
import queuesPlugin from '@api/queues/queues.plugin';
import authPlugin from '@api/auth/auth.plugin';
import healthRoute from '@api/routes/health';
import webhookRoutes from '@api/webhooks/webhooks.routes';
import usersRoutes from '@api/users/users.routes';
import routes from '@api/routes/index';
import type { ApiErrorResponse } from '@api/types';

/**
 * Builds and returns a fully configured Fastify instance.
 *
 * Registration order:
 * 1. Core plugins (CORS, rate-limit, logger)
 * 2. Infrastructure plugins (Prisma, Redis, BullMQ queues)
 * 3. Webhook routes (BEFORE auth — webhooks bypass auth)
 * 4. Health check route (depends on Prisma + Redis)
 * 5. Auth plugin (JWT verification on all subsequent routes)
 * 6. Authenticated routes (users, application routes)
 * 7. Global error & 404 handlers
 *
 * @returns A ready-to-listen Fastify instance
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
                colorize: true,
              },
            }
          : undefined,
    },
    requestIdHeader: 'x-request-id',
    genReqId: () => crypto.randomUUID(),
    disableRequestLogging: true, // handled by our logger plugin
  });

  // ── Core Plugins ────────────────────────────────────────────────────────
  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);
  await app.register(loggerPlugin);

  // ── Infrastructure Plugins ──────────────────────────────────────────────
  await app.register(prismaPlugin);
  await app.register(redisPlugin);
  await app.register(queuesPlugin);

  // ── Unauthenticated Routes (must be BEFORE auth plugin) ─────────────────
  await app.register(webhookRoutes, { prefix: '/api/webhooks' });
  await app.register(healthRoute);

  // ── Auth Plugin (JWT verification on all subsequent routes) ──────────────
  await app.register(authPlugin);

  // ── Authenticated Routes ────────────────────────────────────────────────
  await app.register(usersRoutes, { prefix: '/api/v1/users' });
  await app.register(routes);

  // ── Global Error Handler ────────────────────────────────────────────────
  app.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply): void => {
      const statusCode = error.statusCode ?? 500;

      request.log.error(
        {
          err: error,
          requestId: request.id,
          method: request.method,
          url: request.url,
          statusCode,
        },
        error.message,
      );

      const response: ApiErrorResponse = {
        code: error.code ?? 'INTERNAL_SERVER_ERROR',
        message:
          statusCode >= 500
            ? 'An unexpected error occurred. Please try again later.'
            : error.message,
        statusCode,
      };

      void reply.status(statusCode).send(response);
    },
  );

  // ── 404 Handler ─────────────────────────────────────────────────────────
  app.setNotFoundHandler(
    (_request: FastifyRequest, reply: FastifyReply): void => {
      const response: ApiErrorResponse = {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
        statusCode: 404,
      };

      void reply.status(404).send(response);
    },
  );

  return app;
}
