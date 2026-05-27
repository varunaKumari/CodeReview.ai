// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @codereview-ai/types — Database Types & Prisma Aliases
//
// Re-exports enums and defines composite type aliases for
// common query patterns (user with subscription, review with
// comments, etc.) so frontend and backend share the same types.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ═══════════════════════════════════════════════════════════
// ENUMS (mirrored from Prisma schema for cross-package use)
// ═══════════════════════════════════════════════════════════

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const MembershipRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
export type MembershipRole = (typeof MembershipRole)[keyof typeof MembershipRole];

export const PullRequestState = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  MERGED: 'MERGED',
} as const;
export type PullRequestState = (typeof PullRequestState)[keyof typeof PullRequestState];

export const ReviewStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const CommentSeverity = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  SUGGESTION: 'SUGGESTION',
} as const;
export type CommentSeverity = (typeof CommentSeverity)[keyof typeof CommentSeverity];

export const CommentCategory = {
  SECURITY: 'SECURITY',
  PERFORMANCE: 'PERFORMANCE',
  READABILITY: 'READABILITY',
  MAINTAINABILITY: 'MAINTAINABILITY',
  BUG: 'BUG',
  STYLE: 'STYLE',
} as const;
export type CommentCategory = (typeof CommentCategory)[keyof typeof CommentCategory];

export const ReviewPersona = {
  CRITIC: 'CRITIC',
  MENTOR: 'MENTOR',
  OPTIMIZER: 'OPTIMIZER',
} as const;
export type ReviewPersona = (typeof ReviewPersona)[keyof typeof ReviewPersona];

export const SubscriptionPlan = {
  FREE: 'FREE',
  PRO: 'PRO',
  TEAM: 'TEAM',
  ENTERPRISE: 'ENTERPRISE',
} as const;
export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  CANCELED: 'CANCELED',
  PAST_DUE: 'PAST_DUE',
  TRIALING: 'TRIALING',
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const NotificationType = {
  REVIEW_COMPLETE: 'REVIEW_COMPLETE',
  PR_ANALYZED: 'PR_ANALYZED',
  MENTION: 'MENTION',
  BILLING: 'BILLING',
  SYSTEM: 'SYSTEM',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const ChatRole = {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
} as const;
export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];

// ═══════════════════════════════════════════════════════════
// BASE ENTITY TYPES (framework-agnostic, used by frontend)
// ═══════════════════════════════════════════════════════════

/** Core user entity */
export interface DbUser {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** Subscription entity */
export interface DbSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  reviewsUsed: number;
  reviewsLimit: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
}

/** Repository entity */
export interface DbRepository {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  language: string | null;
  stars: number;
  forks: number;
  isActive: boolean;
  lastAnalyzedAt: string | null;
}

/** Code review entity */
export interface DbCodeReview {
  id: string;
  status: ReviewStatus;
  overallScore: number | null;
  readabilityScore: number | null;
  securityScore: number | null;
  performanceScore: number | null;
  summary: string | null;
  modelUsed: string | null;
  tokensUsed: number;
  processingTimeMs: number | null;
  createdAt: string;
}

/** Review comment entity */
export interface DbReviewComment {
  id: string;
  filePath: string;
  lineStart: number | null;
  lineEnd: number | null;
  severity: CommentSeverity;
  category: CommentCategory;
  title: string;
  body: string;
  suggestion: string | null;
  persona: ReviewPersona;
  isResolved: boolean;
}

// ═══════════════════════════════════════════════════════════
// COMPOSITE TYPE ALIASES (common query patterns)
// ═══════════════════════════════════════════════════════════

/** User with their subscription info — used on profile/dashboard pages */
export interface UserWithSubscription extends DbUser {
  subscription: DbSubscription | null;
}

/** Repository with computed stats for listing views */
export interface RepositoryWithStats extends DbRepository {
  _count: {
    pullRequests: number;
    codeReviews: number;
  };
}

/** Code review with all comments and suggestions — used on review detail page */
export interface ReviewWithComments extends DbCodeReview {
  comments: DbReviewComment[];
  suggestions: Array<{
    id: string;
    filePath: string;
    originalCode: string;
    suggestedCode: string;
    explanation: string;
    isApplied: boolean;
  }>;
}

/** Notification as received by the frontend */
export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
