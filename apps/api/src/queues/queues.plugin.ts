import { Queue } from 'bullmq';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { env } from '@api/config/env';
import {
  REVIEW_QUEUE,
  EMBEDDING_QUEUE,
  NOTIFICATION_QUEUE,
  ALL_QUEUES,
  type QueueName,
} from '@api/queues/queue.constants';

/**
 * Fastify plugin that initializes BullMQ queues and decorates
 * the Fastify instance with `app.queues` — a typed map of queue instances.
 *
 * Queues connect to Redis using the same REDIS_URL as the cache layer.
 * All queue names come from constants — never hardcoded.
 */
async function queuesPlugin(app: FastifyInstance): Promise<void> {
  const connection = {
    host: new URL(env.REDIS_URL).hostname,
    port: Number(new URL(env.REDIS_URL).port) || 6379,
    password: new URL(env.REDIS_URL).password || undefined,
    tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
  };

  const queues: Record<QueueName, Queue> = {
    [REVIEW_QUEUE]: new Queue(REVIEW_QUEUE, { connection }),
    [EMBEDDING_QUEUE]: new Queue(EMBEDDING_QUEUE, { connection }),
    [NOTIFICATION_QUEUE]: new Queue(NOTIFICATION_QUEUE, { connection }),
  };

  app.log.info(`📋 BullMQ queues registered: ${ALL_QUEUES.join(', ')}`);

  // Decorate Fastify instance
  app.decorate('queues', queues);

  // Close all queues on shutdown
  app.addHook('onClose', async () => {
    app.log.info('📋 Closing BullMQ queues...');
    await Promise.all(
      Object.values(queues).map((queue) => queue.close()),
    );
  });
}

export default fp(queuesPlugin, {
  name: 'queues',
  fastify: '5.x',
  dependencies: ['redis'], // ensure Redis is connected first
});

// ── Type augmentation ───────────────────────────────────────
declare module 'fastify' {
  interface FastifyInstance {
    queues: Record<QueueName, Queue>;
  }
}
