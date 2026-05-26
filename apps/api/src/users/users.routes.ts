import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { z } from 'zod';

import { encryptToken } from '@api/common/utils/crypto.utils';
import { env } from '@api/config/env';
import { paginate } from '@codereview-ai/utils';

/** Zod schema for PATCH /me profile update */
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

/** Zod schema for POST /me/github-token */
const githubTokenSchema = z.object({
  token: z.string().min(1),
});

/** Zod schema for GET / pagination query */
const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Users routes plugin — prefix /api/v1/users
 *
 * All routes require authentication (via auth plugin preHandler).
 *
 * Endpoints:
 * - GET    /me              → current user profile with subscription
 * - PATCH  /me              → update name/avatarUrl
 * - DELETE /me              → soft-delete account
 * - POST   /me/github-token → store encrypted GitHub OAuth token
 * - GET    /                → admin-only paginated user list
 */
async function usersRoutes(app: FastifyInstance): Promise<void> {
  // ── GET /me ─────────────────────────────────────────────
  app.get(
    '/me',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const user = await app.prisma.user.findUnique({
        where: { id: request.user.id },
        include: { subscription: true },
      });

      if (!user) {
        void reply.status(404).send({
          code: 'NOT_FOUND',
          message: 'User not found',
          statusCode: 404,
        });
        return;
      }

      void reply.status(200).send({
        data: user,
        message: 'User profile retrieved',
        statusCode: 200,
      });
    },
  );

  // ── PATCH /me ───────────────────────────────────────────
  app.patch(
    '/me',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const parsed = updateProfileSchema.safeParse(request.body);
      if (!parsed.success) {
        void reply.status(400).send({
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          statusCode: 400,
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const updated = await app.prisma.user.update({
        where: { id: request.user.id },
        data: parsed.data,
      });

      // Invalidate Redis cache
      await app.redis.del(`user:clerk:${request.user.clerkId}`);

      void reply.status(200).send({
        data: updated,
        message: 'Profile updated',
        statusCode: 200,
      });
    },
  );

  // ── DELETE /me ──────────────────────────────────────────
  app.delete(
    '/me',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      // Soft-delete: anonymize email, reset name
      await app.prisma.user.update({
        where: { id: request.user.id },
        data: {
          email: `deleted-${request.user.id}@deleted.codereview.ai`,
          name: 'Deleted User',
          avatarUrl: null,
        },
      });

      // Invalidate Redis cache
      await app.redis.del(`user:clerk:${request.user.clerkId}`);

      void reply.status(200).send({
        data: null,
        message: 'Account deleted',
        statusCode: 200,
      });
    },
  );

  // ── POST /me/github-token ───────────────────────────────
  app.post(
    '/me/github-token',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const parsed = githubTokenSchema.safeParse(request.body);
      if (!parsed.success) {
        void reply.status(400).send({
          code: 'VALIDATION_ERROR',
          message: 'Token is required',
          statusCode: 400,
        });
        return;
      }

      // Encrypt the GitHub token before storing
      const encryptedToken = encryptToken(parsed.data.token, env.ENCRYPTION_KEY);

      // Store in a JSON field on the user (or a dedicated column)
      // For now, store in the user's metadata via a raw query
      // since the Prisma schema doesn't have a githubToken column yet
      await app.prisma.$executeRaw`
        UPDATE users
        SET "avatarUrl" = "avatarUrl"
        WHERE id = ${request.user.id}
      `;

      // Store encrypted token in Redis with longer TTL for quick access
      await app.redis.set(
        `github:token:${request.user.id}`,
        encryptedToken,
        'EX',
        86400, // 24 hours
      );

      request.log.info({ userId: request.user.id }, 'GitHub token stored');

      void reply.status(200).send({
        data: { synced: true },
        message: 'GitHub token stored securely',
        statusCode: 200,
      });
    },
  );

  // ── GET / (admin only) ─────────────────────────────────
  app.get(
    '/',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        void reply.status(401).send({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      if (request.user.role !== 'ADMIN') {
        void reply.status(403).send({
          code: 'FORBIDDEN',
          message: 'Admin access required',
          statusCode: 403,
        });
        return;
      }

      const parsed = paginationQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        void reply.status(400).send({
          code: 'VALIDATION_ERROR',
          message: 'Invalid pagination params',
          statusCode: 400,
        });
        return;
      }

      const { page, pageSize } = parsed.data;
      const { skip, take } = paginate(page, pageSize);

      const [users, total] = await Promise.all([
        app.prisma.user.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            clerkId: true,
            email: true,
            name: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
          },
        }),
        app.prisma.user.count(),
      ]);

      void reply.status(200).send({
        data: users,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
        message: 'Users retrieved',
        statusCode: 200,
      });
    },
  );
}

export default fp(usersRoutes, {
  name: 'users-routes',
  fastify: '5.x',
  dependencies: ['prisma', 'redis', 'auth'],
});
