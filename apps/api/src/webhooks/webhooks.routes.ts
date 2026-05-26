import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { Webhook } from 'svix';
import { z } from 'zod';

import { env } from '@api/config/env';

/** Shape of the incoming Clerk webhook body we forward from the frontend */
const clerkWebhookSchema = z.object({
  type: z.enum(['user.created', 'user.updated', 'user.deleted']),
  data: z.object({
    clerkId: z.string(),
    email: z.string().optional(),
    name: z.string().optional(),
    avatarUrl: z.string().nullable().optional(),
  }),
});

/**
 * Webhook routes plugin — prefix /api/webhooks
 *
 * POST /clerk — handles forwarded Clerk webhook events:
 * - user.created → upsert user in database
 * - user.updated → update user fields
 * - user.deleted → soft-delete user (anonymize email, reset name)
 *
 * Route config has `skipAuth: true` to bypass the auth plugin.
 * Verifies Svix signature when receiving direct webhooks from Clerk.
 */
async function webhookRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/clerk',
    {
      config: { skipAuth: true } as Record<string, unknown>,
    },
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      // ── Optional Svix signature verification ──────────────
      // If the request comes directly from Clerk (not forwarded from our frontend),
      // verify the Svix signature
      const svixId = request.headers['svix-id'] as string | undefined;
      const svixTimestamp = request.headers['svix-timestamp'] as string | undefined;
      const svixSignature = request.headers['svix-signature'] as string | undefined;

      if (svixId && svixTimestamp && svixSignature) {
        try {
          const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
          const rawBody = JSON.stringify(request.body);
          wh.verify(rawBody, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          });
        } catch (err: unknown) {
          request.log.warn({ err }, 'Svix webhook signature verification failed');
          void reply.status(400).send({
            code: 'WEBHOOK_SIGNATURE_INVALID',
            message: 'Invalid webhook signature',
            statusCode: 400,
          });
          return;
        }
      }

      // ── Parse and validate body ───────────────────────────
      const parsed = clerkWebhookSchema.safeParse(request.body);
      if (!parsed.success) {
        request.log.warn({ errors: parsed.error.flatten() }, 'Invalid webhook payload');
        void reply.status(400).send({
          code: 'VALIDATION_ERROR',
          message: 'Invalid webhook payload',
          statusCode: 400,
        });
        return;
      }

      const { type, data } = parsed.data;

      try {
        switch (type) {
          case 'user.created':
          case 'user.updated': {
            await app.prisma.user.upsert({
              where: { clerkId: data.clerkId },
              update: {
                ...(data.email ? { email: data.email } : {}),
                ...(data.name ? { name: data.name } : {}),
                ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
              },
              create: {
                clerkId: data.clerkId,
                email: data.email ?? `${data.clerkId}@clerk.pending`,
                name: data.name ?? 'User',
                avatarUrl: data.avatarUrl ?? null,
                role: 'USER',
              },
            });

            // Invalidate Redis cache
            await app.redis.del(`user:clerk:${data.clerkId}`);

            request.log.info(
              { clerkId: data.clerkId, event: type },
              'User synced from Clerk webhook',
            );
            break;
          }

          case 'user.deleted': {
            const existing = await app.prisma.user.findUnique({
              where: { clerkId: data.clerkId },
            });

            if (existing) {
              await app.prisma.user.update({
                where: { clerkId: data.clerkId },
                data: {
                  email: `deleted-${existing.id}@deleted.codereview.ai`,
                  name: 'Deleted User',
                  avatarUrl: null,
                },
              });

              // Invalidate Redis cache
              await app.redis.del(`user:clerk:${data.clerkId}`);

              request.log.info(
                { clerkId: data.clerkId },
                'User soft-deleted via Clerk webhook',
              );
            }
            break;
          }
        }
      } catch (err: unknown) {
        request.log.error({ err, event: type }, 'Failed to process Clerk webhook');
        // Still return 200 — Clerk requires successful responses
      }

      void reply.status(200).send({ received: true });
    },
  );
}

export default fp(webhookRoutes, {
  name: 'webhook-routes',
  fastify: '5.x',
  dependencies: ['prisma', 'redis'],
});
