/**
 * @module index
 * Server entrypoint for the CodeReview.ai API.
 *
 * Execution order:
 * 1. Environment validation (fail-fast via Zod)
 * 2. Application construction
 * 3. Listen on configured PORT
 * 4. Register graceful shutdown handlers
 */

// ── 1. Validate environment (side-effect import – throws on failure) ──────
import { env } from '@api/config/env';

import { buildApp } from '@api/app';

/** Flag to prevent duplicate shutdown sequences. */
let isShuttingDown = false;

/**
 * Boots the Fastify server and wires up process signal handlers.
 */
async function main(): Promise<void> {
  const app = await buildApp();

  // ── Graceful shutdown ──────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    app.log.info({ signal }, 'Received shutdown signal — closing server…');

    try {
      await app.close();
      app.log.info('Server closed gracefully.');
      process.exit(0);
    } catch (err: unknown) {
      app.log.error({ err }, 'Error during graceful shutdown.');
      process.exit(1);
    }
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  // Handle unhandled rejections at the process level
  process.on('unhandledRejection', (reason: unknown) => {
    app.log.fatal({ err: reason }, 'Unhandled promise rejection — shutting down.');
    void shutdown('unhandledRejection');
  });

  // ── Start listening ────────────────────────────────────────────────────
  try {
    const address = await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    app.log.info(
      {
        address,
        environment: env.NODE_ENV,
        pid: process.pid,
      },
      `🚀 CodeReview.ai API listening on ${address}`,
    );
  } catch (err: unknown) {
    app.log.fatal({ err }, 'Failed to start server.');
    process.exit(1);
  }
}

void main();
