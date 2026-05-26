import { PrismaClient } from '@prisma/client';

/**
 * Database seed script — idempotent via upsert.
 *
 * Creates:
 * - 1 admin user + 1 regular user
 * - 1 organization with admin as OWNER and regular user as MEMBER
 * - 1 repository linked to the org
 * - FREE subscription for both users
 * - 2 sample notifications
 */

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // ── Users ─────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { clerkId: 'clerk_admin_seed_001' },
    update: {},
    create: {
      clerkId: 'clerk_admin_seed_001',
      email: 'admin@codereview.ai',
      name: 'Admin User',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { clerkId: 'clerk_user_seed_001' },
    update: {},
    create: {
      clerkId: 'clerk_user_seed_001',
      email: 'user@codereview.ai',
      name: 'Jane Developer',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      role: 'USER',
    },
  });

  console.log(`  ✓ Users: ${adminUser.name}, ${regularUser.name}`);

  // ── Organization ──────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=acme',
    },
  });

  console.log(`  ✓ Organization: ${org.name}`);

  // ── Memberships ───────────────────────────────────────────
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: adminUser.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      organizationId: org.id,
      role: 'OWNER',
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: regularUser.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      organizationId: org.id,
      role: 'MEMBER',
    },
  });

  console.log('  ✓ Memberships: admin=OWNER, jane=MEMBER');

  // ── Repository ────────────────────────────────────────────
  await prisma.repository.upsert({
    where: { githubId: 123456789 },
    update: {},
    create: {
      githubId: 123456789,
      name: 'frontend-app',
      fullName: 'acme-corp/frontend-app',
      description: 'Main frontend application for Acme Corp',
      private: false,
      defaultBranch: 'main',
      language: 'TypeScript',
      stars: 142,
      forks: 23,
      isActive: true,
      organizationId: org.id,
    },
  });

  console.log('  ✓ Repository: acme-corp/frontend-app');

  // ── Subscriptions ─────────────────────────────────────────
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      plan: 'FREE',
      status: 'ACTIVE',
      reviewsUsed: 3,
      reviewsLimit: 10,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
    },
  });

  await prisma.subscription.upsert({
    where: { userId: regularUser.id },
    update: {},
    create: {
      userId: regularUser.id,
      plan: 'FREE',
      status: 'ACTIVE',
      reviewsUsed: 0,
      reviewsLimit: 10,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('  ✓ Subscriptions: FREE plan for both users');

  // ── Notifications ─────────────────────────────────────────
  // Use deleteMany + createMany for idempotent notification seeding
  await prisma.notification.deleteMany({
    where: {
      userId: adminUser.id,
      title: { startsWith: '[SEED]' },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: adminUser.id,
        title: '[SEED] Welcome to CodeReview.ai!',
        body: 'Your account is set up and ready. Connect your first GitHub repository to get started with AI-powered code reviews.',
        type: 'SYSTEM',
        isRead: false,
      },
      {
        userId: adminUser.id,
        title: '[SEED] New repository connected',
        body: 'acme-corp/frontend-app has been connected. You can now request code reviews for pull requests.',
        type: 'PR_ANALYZED',
        isRead: false,
        metadata: { repositoryName: 'acme-corp/frontend-app' },
      },
    ],
  });

  console.log('  ✓ Notifications: 2 sample notifications for admin');

  console.log('\n✅ Database seeded successfully!\n');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
