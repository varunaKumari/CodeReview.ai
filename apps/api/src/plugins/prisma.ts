import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Fastify plugin that initializes a singleton PrismaClient and
 * decorates the Fastify instance with `app.prisma`.
 *
 * Handles graceful shutdown by disconnecting on server close.
 * Prisma 7: connection URL is passed via datasourceUrl in the constructor.
 */
async function prismaPlugin(app: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient({
    datasourceUrl: process.env['DATABASE_URL'],
    log:
      process.env['NODE_ENV'] === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
          ]
        : [{ level: 'error', emit: 'stdout' }],
  });

  // Connect on startup
  await prisma.$connect();
  app.log.info('📦 Prisma connected to database');

  // Decorate Fastify instance so all routes can access `app.prisma`
  app.decorate('prisma', prisma);

  // Graceful disconnect on shutdown
  app.addHook('onClose', async () => {
    app.log.info('📦 Prisma disconnecting...');
    await prisma.$disconnect();
  });
}

export default fp(prismaPlugin, {
  name: 'prisma',
  fastify: '5.x',
});

// ── Type augmentation so `app.prisma` is typed ──────────────
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
