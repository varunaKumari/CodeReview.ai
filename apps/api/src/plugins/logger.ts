import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers lifecycle hooks that emit structured Pino log entries
 * for every incoming request and outgoing response.
 *
 * - `onRequest`  → logs method + URL at `info` level.
 * - `onResponse` → logs method + URL + status + duration at `info` level.
 *
 * Static assets and health-check noise can be filtered at the Pino
 * transport layer if needed.
 */
async function loggerPlugin(app: FastifyInstance): Promise<void> {
  /**
   * Log every incoming request.
   */
  app.addHook(
    'onRequest',
    async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
      request.log.info(
        {
          requestId: request.id,
          method: request.method,
          url: request.url,
          userAgent: request.headers['user-agent'],
          ip: request.ip,
        },
        'Incoming request',
      );
    },
  );

  /**
   * Log every outgoing response with timing.
   */
  app.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const durationMs = reply.elapsedTime;

      request.log.info(
        {
          requestId: request.id,
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          durationMs: Math.round(durationMs * 100) / 100,
        },
        'Request completed',
      );
    },
  );
}

export default fp(loggerPlugin, {
  name: 'logger',
  fastify: '5.x',
});
