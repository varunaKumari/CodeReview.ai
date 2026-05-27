// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @codereview-ai/utils — Shared Utility Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export * from './db';

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ────────────────────────────────────────────────
// Class Name Merging
// ────────────────────────────────────────────────

/**
 * Merges class names using `clsx` for conditional logic and
 * `tailwind-merge` to resolve Tailwind CSS conflicts.
 *
 * @param inputs - Class values (strings, arrays, objects, etc.)
 * @returns A single, conflict-free className string.
 *
 * @example
 * ```ts
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6");
 * // → "py-2 px-6 bg-blue-500" (px-4 is overridden by px-6)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ────────────────────────────────────────────────
// Date Formatting
// ────────────────────────────────────────────────

/** Options for {@link formatDate}. */
export interface FormatDateOptions {
  /** Locale string (e.g. `"en-US"`). Defaults to `"en-US"`. */
  locale?: string;
  /** `Intl.DateTimeFormat` options to customize the output. */
  options?: Intl.DateTimeFormatOptions;
}

/**
 * Formats an ISO-8601 date string into a human-readable representation.
 *
 * @param date - ISO-8601 date string or `Date` instance.
 * @param formatOptions - Optional locale and formatting overrides.
 * @returns Formatted date string.
 *
 * @example
 * ```ts
 * formatDate("2025-01-15T10:30:00Z");
 * // → "Jan 15, 2025"
 *
 * formatDate("2025-01-15T10:30:00Z", {
 *   options: { dateStyle: "full" },
 * });
 * // → "Wednesday, January 15, 2025"
 * ```
 */
export function formatDate(
  date: string | Date,
  formatOptions?: FormatDateOptions,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = formatOptions?.locale ?? "en-US";
  const options: Intl.DateTimeFormatOptions = formatOptions?.options ?? {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// ────────────────────────────────────────────────
// Async Helpers
// ────────────────────────────────────────────────

/**
 * Returns a promise that resolves after the specified duration.
 *
 * @param ms - Duration in milliseconds.
 * @returns A promise that resolves to `void` after `ms` milliseconds.
 *
 * @example
 * ```ts
 * await sleep(1000); // pause for 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ────────────────────────────────────────────────
// ID Generation
// ────────────────────────────────────────────────

/**
 * Generates a unique identifier using `crypto.randomUUID()` when
 * available, falling back to a timestamp + random hex string.
 *
 * @returns A unique string identifier.
 *
 * @example
 * ```ts
 * const id = generateId();
 * // → "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 * ```
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback: timestamp + random hex
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  const randomPart2 = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}-${randomPart2}`;
}

// ────────────────────────────────────────────────
// String Utilities
// ────────────────────────────────────────────────

/**
 * Truncates a string to the specified maximum length, appending an
 * ellipsis (`…`) if the string exceeds that length.
 *
 * @param str - The string to truncate.
 * @param maxLength - Maximum allowed length (including the ellipsis character).
 * @returns The original string if within bounds, or a truncated version.
 *
 * @example
 * ```ts
 * truncate("Hello, World!", 8);
 * // → "Hello, …"
 * ```
 */
export function truncate(str: string, maxLength: number): string {
  if (maxLength < 1) {
    return "";
  }
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength - 1)}…`;
}

// ────────────────────────────────────────────────
// Validation
// ────────────────────────────────────────────────

/**
 * Validates whether a string is a well-formed email address.
 *
 * Uses the HTML5 spec email regex — sufficient for client-side validation.
 * Server-side code should additionally verify via confirmation email.
 *
 * @param email - The string to validate.
 * @returns `true` if the string matches the email pattern.
 *
 * @example
 * ```ts
 * isValidEmail("user@example.com"); // → true
 * isValidEmail("not-an-email");     // → false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return EMAIL_REGEX.test(email);
}

// ────────────────────────────────────────────────
// Debounce
// ────────────────────────────────────────────────

/** A debounced function with an additional `cancel` method. */
export interface DebouncedFunction<TArgs extends unknown[]> {
  /** Invoke the debounced function. */
  (...args: TArgs): void;
  /** Cancel any pending invocation. */
  cancel: () => void;
}

/**
 * Creates a debounced version of the provided function that delays
 * invocation until `delay` milliseconds have elapsed since the last call.
 *
 * @typeParam TArgs - Tuple of argument types for the wrapped function.
 * @param fn - The function to debounce.
 * @param delay - Delay in milliseconds.
 * @returns A debounced wrapper with a `.cancel()` method.
 *
 * @example
 * ```ts
 * const handleSearch = debounce((query: string) => {
 *   fetch(`/api/search?q=${query}`);
 * }, 300);
 *
 * inputElement.addEventListener("input", (e) => {
 *   handleSearch((e.target as HTMLInputElement).value);
 * });
 *
 * // Cancel pending call if needed:
 * handleSearch.cancel();
 * ```
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number,
): DebouncedFunction<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: TArgs): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

// ────────────────────────────────────────────────
// Relative Time Formatting
// ────────────────────────────────────────────────

/** Time division used by {@link formatRelativeTime}. */
interface TimeDivision {
  /** Maximum number of milliseconds for this division. */
  amount: number;
  /** `Intl.RelativeTimeFormat` unit. */
  unit: Intl.RelativeTimeFormatUnit;
}

const TIME_DIVISIONS: readonly TimeDivision[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.345, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
] as const;

/**
 * Formats a date into a human-readable relative time string
 * (e.g. "2 hours ago", "in 3 days").
 *
 * Uses `Intl.RelativeTimeFormat` for locale-aware output.
 *
 * @param date - ISO-8601 date string or `Date` instance.
 * @param locale - BCP-47 locale string. Defaults to `"en-US"`.
 * @returns A relative time string.
 *
 * @example
 * ```ts
 * // Assuming "now" is 2025-05-25T10:00:00Z
 * formatRelativeTime("2025-05-25T08:00:00Z");
 * // → "2 hours ago"
 *
 * formatRelativeTime("2025-05-24T10:00:00Z");
 * // → "yesterday"
 * ```
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = "en-US",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "long",
  });

  let duration = (dateObj.getTime() - Date.now()) / 1000; // seconds

  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  // Fallback — should not reach here due to Infinity sentinel
  return formatter.format(Math.round(duration), "year");
}
