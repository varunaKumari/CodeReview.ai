import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Fastify plugin that initializes a singleton PrismaClient and
 * decorates the Fastify instance with `app.prisma`.
 *
 * Handles graceful shutdown by disconnecting on server close.
 */
async function prismaPlugin(app: FastifyInstance): Promise<void> {
  const connectionString = process.env['DATABASE_URL'];

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({
    connectionString,
  });

  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
    log:
      process.env['NODE_ENV'] === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
          ]
        : [{ level: 'error', emit: 'stdout' }],
  });

  await prisma.$connect();
  app.log.info('📦 Prisma connected to database');

  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    app.log.info('📦 Prisma disconnecting...');
    await prisma.$disconnect();
    await pool.end();
  });
}

export default fp(prismaPlugin, {
  name: 'prisma',
  fastify: '5.x',
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}