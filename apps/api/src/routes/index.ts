import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import healthRoute from '@api/routes/health';

/**
 * Central route registry.
 *
 * - Health check is registered at the **root** level (`/health`)
 *   so load balancers can reach it without a version prefix.
 * - All feature routes are grouped under the `/api/v1` prefix
 *   for clean API versioning.
 */
async function routes(app: FastifyInstance): Promise<void> {
  // ── Root-level routes ───────────────────────────────────────────────────
  await app.register(healthRoute);

  // ── Versioned API routes (/api/v1) ──────────────────────────────────────
  await app.register(
    async (v1: FastifyInstance): Promise<void> => {
      // Future feature routes go here, e.g.:
      // await v1.register(reviewRoutes, { prefix: '/reviews' });
      // await v1.register(projectRoutes, { prefix: '/projects' });

      // Placeholder: confirm the v1 prefix is live
      v1.get('/', async () => {
        return { api: 'codereview-ai', version: 'v1' };
      });
    },
    { prefix: '/api/v1' },
  );
}

export default fp(routes, {
  name: 'routes',
  fastify: '5.x',
});
