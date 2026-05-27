// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @codereview-ai/utils — Database Helper Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Pagination result for Prisma skip/take queries */
export interface PaginationParams {
  /** Number of records to skip */
  skip: number;
  /** Number of records to take */
  take: number;
}

/**
 * Converts human-friendly page/pageSize into Prisma-compatible skip/take.
 *
 * @param page - 1-indexed page number (clamped to >= 1)
 * @param pageSize - Number of items per page (clamped to 1-100)
 * @returns Object with `skip` and `take` values for Prisma
 *
 * @example
 * ```ts
 * const { skip, take } = paginate(3, 20);
 * // → { skip: 40, take: 20 }
 *
 * const items = await prisma.user.findMany({ skip, take });
 * ```
 */
export function paginate(page: number, pageSize: number): PaginationParams {
  const safePage = Math.max(1, Math.floor(page));
  const safeSize = Math.max(1, Math.min(100, Math.floor(pageSize)));

  return {
    skip: (safePage - 1) * safeSize,
    take: safeSize,
  };
}

/** Valid sort directions */
export type SortDirection = 'asc' | 'desc';

/**
 * Builds a Prisma-compatible `orderBy` object from field name and direction.
 *
 * @param field - The model field name to sort by
 * @param direction - Sort direction: 'asc' or 'desc'
 * @returns An object suitable for Prisma's `orderBy` clause
 *
 * @example
 * ```ts
 * const orderBy = buildOrderBy('createdAt', 'desc');
 * // → { createdAt: 'desc' }
 *
 * const users = await prisma.user.findMany({ orderBy });
 * ```
 */
export function buildOrderBy(
  field: string,
  direction: SortDirection = 'desc',
): Record<string, SortDirection> {
  return { [field]: direction };
}

/**
 * Sanitizes a string for safe database storage by removing
 * null bytes, control characters, and trimming whitespace.
 *
 * Does NOT replace parameterized queries — this is an extra
 * safety layer for user-provided content stored as text.
 *
 * @param str - The raw input string
 * @returns Sanitized string safe for DB storage
 *
 * @example
 * ```ts
 * sanitizeForDb("Hello\x00World\x1F!");
 * // → "HelloWorld!"
 * ```
 */
export function sanitizeForDb(str: string): string {
  return str
    .replace(/\0/g, '')              // remove null bytes
    .replace(/[\x01-\x1F\x7F]/g, '') // remove control characters
    .trim();
}
