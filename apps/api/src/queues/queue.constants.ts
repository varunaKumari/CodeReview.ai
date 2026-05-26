/**
 * Queue name constants for BullMQ job queues.
 *
 * Never hardcode queue names — always reference these constants
 * so renames propagate across producers and consumers.
 */

/** Queue for processing AI code reviews */
export const REVIEW_QUEUE = 'codereview:reviews' as const;

/** Queue for generating/updating code embeddings (pgvector) */
export const EMBEDDING_QUEUE = 'codereview:embeddings' as const;

/** Queue for sending user notifications (email, in-app, webhooks) */
export const NOTIFICATION_QUEUE = 'codereview:notifications' as const;

/** All queue names — useful for bulk operations (e.g., health checks) */
export const ALL_QUEUES = [
  REVIEW_QUEUE,
  EMBEDDING_QUEUE,
  NOTIFICATION_QUEUE,
] as const;

/** Union type of all queue names */
export type QueueName = (typeof ALL_QUEUES)[number];
