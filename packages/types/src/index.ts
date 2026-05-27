// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @codereview-ai/types — Platform Type Definitions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export * from './database';

// ────────────────────────────────────────────────
// User & Authentication
// ────────────────────────────────────────────────

/** Subscription tier for the user's account. */
export type UserPlan = "free" | "pro" | "enterprise";

/** User account on the platform. */
export interface User {
  /** Unique identifier (UUID). */
  id: string;
  /** Primary email address. */
  email: string;
  /** Display name. */
  name: string;
  /** URL to the user's avatar image, or `null` if not set. */
  avatarUrl: string | null;
  /** Linked GitHub username, or `null` if not connected. */
  githubUsername: string | null;
  /** Current subscription plan. */
  plan: UserPlan;
  /** ISO-8601 timestamp of account creation. */
  createdAt: string;
  /** ISO-8601 timestamp of last profile update. */
  updatedAt: string;
}

// ────────────────────────────────────────────────
// Repository
// ────────────────────────────────────────────────

/** Connected repository from a Git hosting provider. */
export interface Repository {
  /** Unique identifier (UUID). */
  id: string;
  /** Short repository name (e.g. `"my-app"`). */
  name: string;
  /** Full qualified name including owner (e.g. `"acme/my-app"`). */
  fullName: string;
  /** Repository owner (user or organization). */
  owner: string;
  /** Repository description, or `null` if none provided. */
  description: string | null;
  /** Primary programming language detected, or `null`. */
  language: string | null;
  /** Whether the repository is private. */
  isPrivate: boolean;
  /** Default branch name (e.g. `"main"`). */
  defaultBranch: string;
  /** URL to the repository on the hosting provider. */
  url: string;
  /** ISO-8601 timestamp of when the repo was connected to the platform. */
  connectedAt: string;
}

// ────────────────────────────────────────────────
// Review
// ────────────────────────────────────────────────

/** Lifecycle status of a code review. */
export type ReviewStatus = "pending" | "in_progress" | "completed" | "failed";

/** Severity level for a review or individual finding. */
export type ReviewSeverity = "info" | "warning" | "error" | "critical";

/** Category of an individual review finding. */
export type FindingCategory =
  | "security"
  | "performance"
  | "maintainability"
  | "bug_risk"
  | "style"
  | "best_practice";

/** Individual finding within a code review. */
export interface ReviewFinding {
  /** Unique identifier (UUID). */
  id: string;
  /** Relative file path within the repository. */
  filePath: string;
  /** Starting line number of the affected code (1-indexed). */
  lineStart: number;
  /** Ending line number of the affected code (1-indexed, inclusive). */
  lineEnd: number;
  /** Human-readable description of the issue. */
  message: string;
  /** Severity of this specific finding. */
  severity: ReviewSeverity;
  /** Classification category. */
  category: FindingCategory;
  /** AI-generated fix suggestion, or `null` if unavailable. */
  suggestion: string | null;
}

/** Code review request and its results. */
export interface Review {
  /** Unique identifier (UUID). */
  id: string;
  /** ID of the repository this review belongs to. */
  repositoryId: string;
  /** Pull request number in the hosting provider. */
  pullRequestNumber: number;
  /** Pull request title. */
  title: string;
  /** Current lifecycle status. */
  status: ReviewStatus;
  /** Overall severity level of the review. */
  severity: ReviewSeverity;
  /** List of individual findings surfaced by the AI. */
  findings: ReviewFinding[];
  /** AI-generated summary of the review, or `null` if not yet available. */
  summary: string | null;
  /** ISO-8601 timestamp of review creation. */
  createdAt: string;
  /** ISO-8601 timestamp of review completion, or `null` if still in progress. */
  completedAt: string | null;
}

// ────────────────────────────────────────────────
// API Response Wrappers
// ────────────────────────────────────────────────

/**
 * Generic API response wrapper.
 *
 * @typeParam T - The shape of the response payload.
 */
export interface ApiResponse<T> {
  /** Whether the request was successful. */
  success: boolean;
  /** Response payload. */
  data: T;
  /** Optional human-readable message. */
  message?: string;
  /** ISO-8601 timestamp of the response. */
  timestamp: string;
}

/** Pagination metadata included in paginated responses. */
export interface PaginationMeta {
  /** Current page number (1-indexed). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of items matching the query. */
  totalItems: number;
  /** Total number of pages. */
  totalPages: number;
  /** Whether a next page exists. */
  hasNext: boolean;
  /** Whether a previous page exists. */
  hasPrevious: boolean;
}

/**
 * Paginated API response.
 *
 * @typeParam T - The shape of each item in the `data` array.
 */
export interface PaginatedResponse<T> {
  /** Whether the request was successful. */
  success: boolean;
  /** Array of items for the current page. */
  data: T[];
  /** Pagination metadata. */
  pagination: PaginationMeta;
  /** ISO-8601 timestamp of the response. */
  timestamp: string;
}

/** Structured error detail returned on failure. */
export interface ApiErrorDetail {
  /** Machine-readable error code (e.g. `"VALIDATION_ERROR"`). */
  code: string;
  /** Human-readable error description. */
  message: string;
  /** Optional additional context about the error. */
  details?: Record<string, unknown>;
}

/** API error response returned when a request fails. */
export interface ApiErrorResponse {
  /** Always `false` for error responses. */
  success: false;
  /** Structured error information. */
  error: ApiErrorDetail;
  /** ISO-8601 timestamp of the response. */
  timestamp: string;
}
