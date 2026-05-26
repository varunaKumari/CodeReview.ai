import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import type { ApiErrorResponse } from '@api/types';

/**
 * Registers the rate-limit plugin.
 *
 * - Maximum 100 requests per 60-second window per IP.
 * - The `/health` endpoint is excluded so uptime monitors are never throttled.
 * - Returns a structured {@link ApiErrorResponse} when the limit is exceeded.
 */
async function rateLimitPlugin(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',

    /**
     * Skip rate limiting for the health-check endpoint.
     */
    allowList: (req: FastifyRequest): boolean => {
      return req.url === '/health';
    },

    /**
     * Custom error response matching the API error contract.
     */
    errorResponseBuilder: (_req, context) => {
      const response: ApiErrorResponse = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. You may send up to ${context.max} requests per ${context.after}. Please retry later.`,
        statusCode: 429,
      };
      return response;
    },

    /**
     * Attach standard rate-limit headers so clients can self-throttle.
     */
    addHeadersOnExceeding: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  });
}

export default fp(rateLimitPlugin, {
  name: 'rate-limit',
  fastify: '5.x',
});
