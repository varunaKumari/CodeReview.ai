import type { FastifyRequest } from 'fastify';

// ─── Error Types ────────────────────────────────────────────────────────────

/**
 * Standardised JSON error response returned by the API on any
 * non-2xx status code.
 */
export interface ApiErrorResponse {
  /** Machine-readable error code (e.g., "VALIDATION_ERROR") */
  readonly code: string;
  /** Human-readable error message */
  readonly message: string;
  /** HTTP status code mirrored in the body for convenience */
  readonly statusCode: number;
  /** Optional field-level validation errors */
  readonly errors?: ReadonlyArray<FieldError>;
}

/**
 * Describes a single field-level validation error.
 */
export interface FieldError {
  /** Dot-path to the invalid field (e.g., "body.email") */
  readonly field: string;
  /** Description of the validation failure */
  readonly message: string;
}

// ─── Request Context ────────────────────────────────────────────────────────

/**
 * Per-request context that can be attached to the Fastify request
 * for cross-cutting concerns (auth, tracing, etc.).
 */
export interface RequestContext {
  /** Unique request identifier (UUID v4) */
  readonly requestId: string;
  /** ISO-8601 timestamp of when the request was received */
  readonly startTime: string;
  /** Authenticated user ID, if available */
  readonly userId?: string;
}

// ─── Pagination ─────────────────────────────────────────────────────────────

/**
 * Generic wrapper for paginated list endpoints.
 *
 * @typeParam T - The type of items contained in `data`
 */
export interface PaginatedResponse<T> {
  /** Array of result items for the current page */
  readonly data: ReadonlyArray<T>;
  /** Pagination metadata */
  readonly pagination: PaginationMeta;
}

/**
 * Metadata block describing the current pagination state.
 */
export interface PaginationMeta {
  /** Current page number (1-indexed) */
  readonly page: number;
  /** Maximum items per page */
  readonly pageSize: number;
  /** Total number of items across all pages */
  readonly totalItems: number;
  /** Total number of pages */
  readonly totalPages: number;
  /** Whether a next page exists */
  readonly hasNextPage: boolean;
  /** Whether a previous page exists */
  readonly hasPreviousPage: boolean;
}

// ─── Health Check ───────────────────────────────────────────────────────────

/**
 * Shape of the GET /health response body.
 */
export interface HealthCheckResponse {
  readonly status: 'ok';
  readonly timestamp: string;
  readonly version: string;
  readonly uptime: number;
}

// ─── Fastify Augmentation ───────────────────────────────────────────────────

declare module 'fastify' {
  /** Extend the base Fastify instance with custom decorators. */
  interface FastifyInstance {
    /** Application configuration (validated env) */
    readonly config: {
      readonly port: number;
      readonly nodeEnv: string;
      readonly databaseUrl: string;
      readonly corsOrigin: string;
      readonly logLevel: string;
    };
  }

  /** Extend individual requests with the per-request context. */
  interface FastifyRequest {
    /** Per-request context populated by middleware */
    ctx: RequestContext;
  }
}
