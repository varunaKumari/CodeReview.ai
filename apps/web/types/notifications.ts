/**
 * Notification type enum — mirrors the Prisma NotificationType enum
 * from packages/types/src/database.ts
 */
export const NotificationType = {
  REVIEW_COMPLETE: 'REVIEW_COMPLETE',
  PR_ANALYZED: 'PR_ANALYZED',
  MENTION: 'MENTION',
  BILLING: 'BILLING',
  SYSTEM: 'SYSTEM',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/** Notification entity matching the database schema */
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
