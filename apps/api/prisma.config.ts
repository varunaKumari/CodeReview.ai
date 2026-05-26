import path from 'node:path';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 configuration file.
 *
 * Provides connection URLs for Prisma Client and Prisma Migrate:
 * - DATABASE_URL: pooled connection for runtime queries (Neon pooler)
 * - DIRECT_URL: non-pooled connection for schema migrations
 */
export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  migrate: {
    async url() {
      return process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'] ?? '';
    },
  },
});
