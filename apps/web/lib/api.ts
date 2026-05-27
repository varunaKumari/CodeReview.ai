/**
 * Type-safe API client for communicating with the CodeReview.ai backend.
 *
 * @remarks
 * - Uses native `fetch` with automatic JSON parsing
 * - Supports request/response interceptors for auth tokens, logging, etc.
 * - All methods are generic for full type safety
 * - Credentials are included for cookie-based auth
 *
 * @example
 * ```ts
 * import { api } from '@/lib/api';
 *
 * const reviews = await api.get<Review[]>('/reviews');
 * const created = await api.post<Review>('/reviews', { repoUrl: '...' });
 * ```
 */

/** Base URL for the API — falls back to localhost in development */
const API_BASE_URL =
  process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

/**
 * Custom error class for API request failures.
 * Preserves HTTP status code and parsed response body for error handling.
 */
export class ApiError extends Error {
  /** HTTP status code from the failed response */
  public readonly status: number;

  /** Parsed response body, if available */
  public readonly data: unknown;

  /** Original response object */
  public readonly response: Response;

  constructor(message: string, status: number, data: unknown, response: Response) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.response = response;
  }

  /**
   * Returns true if the error represents a client-side error (4xx).
   */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Returns true if the error represents a server-side error (5xx).
   */
  get isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Returns true if the error is a 401 Unauthorized.
   */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Returns true if the error is a 403 Forbidden.
   */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /**
   * Returns true if the error is a 404 Not Found.
   */
  get isNotFound(): boolean {
    return this.status === 404;
  }
}

/** Configuration options for API requests */
interface RequestConfig extends Omit<RequestInit, "method" | "body"> {
  /** Query parameters to append to the URL */
  params?: Record<string, string | number | boolean | undefined>;

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/** Interceptor function type for modifying requests before they are sent */
type RequestInterceptor = (
  url: string,
  init: RequestInit
) => RequestInit | Promise<RequestInit>;

/** Interceptor function type for processing responses before they are returned */
type ResponseInterceptor = (
  response: Response
) => Response | Promise<Response>;

/**
 * Registered request interceptors.
 * These run in order before every API call.
 */
const requestInterceptors: RequestInterceptor[] = [];

/**
 * Registered response interceptors.
 * These run in order after every API call.
 */
const responseInterceptors: ResponseInterceptor[] = [];

/**
 * Registers a request interceptor that will be called before every API request.
 *
 * @param interceptor - Function that receives and may modify the request config
 * @returns A cleanup function that removes the interceptor
 *
 * @example
 * ```ts
 * const cleanup = addRequestInterceptor((_url, init) => {
 *   init.headers = {
 *     ...init.headers,
 *     'Authorization': `Bearer ${getToken()}`,
 *   };
 *   return init;
 * });
 *
 * // Later: cleanup() to remove
 * ```
 */
export function addRequestInterceptor(
  interceptor: RequestInterceptor
): () => void {
  requestInterceptors.push(interceptor);
  return () => {
    const index = requestInterceptors.indexOf(interceptor);
    if (index > -1) {
      requestInterceptors.splice(index, 1);
    }
  };
}

/**
 * Registers a response interceptor that will be called after every API response.
 *
 * @param interceptor - Function that receives and may modify the response
 * @returns A cleanup function that removes the interceptor
 *
 * @example
 * ```ts
 * const cleanup = addResponseInterceptor((response) => {
 *   if (response.status === 401) {
 *     window.location.href = '/sign-in';
 *   }
 *   return response;
 * });
 * ```
 */
export function addResponseInterceptor(
  interceptor: ResponseInterceptor
): () => void {
  responseInterceptors.push(interceptor);
  return () => {
    const index = responseInterceptors.indexOf(interceptor);
    if (index > -1) {
      responseInterceptors.splice(index, 1);
    }
  };
}

/**
 * Builds the full URL with query parameters appended.
 *
 * @param endpoint - The API endpoint path (e.g., '/reviews')
 * @param params - Optional query parameters
 * @returns The full URL string
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(endpoint, API_BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Core request function that handles fetch, interceptors, and error handling.
 *
 * @typeParam T - The expected response body type
 * @param method - HTTP method
 * @param endpoint - API endpoint path
 * @param body - Optional request body (will be JSON-serialized)
 * @param config - Additional request configuration
 * @returns Parsed response body of type T
 * @throws {ApiError} When the response status is not ok
 */
async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  const { params, timeout = 30_000, ...fetchConfig } = config;

  const url = buildUrl(endpoint, params);

  let init: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...fetchConfig.headers,
    },
    ...fetchConfig,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    init = await interceptor(url, init);
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  init.signal = config.signal ?? controller.signal;

  try {
    let response = await fetch(url, init);

    // Apply response interceptors
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      let errorData: unknown = null;

      try {
        errorData = await response.json();
      } catch {
        // Response body is not JSON — leave errorData as null
      }

      const errorMessage =
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof (errorData as Record<string, unknown>)["message"] === "string"
          ? ((errorData as Record<string, unknown>)["message"] as string)
          : `API request failed: ${response.status} ${response.statusText}`;

      throw new ApiError(errorMessage, response.status, errorData, response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        `Request to ${endpoint} timed out after ${timeout}ms`,
        408,
        null,
        new Response(null, { status: 408 })
      );
    }

    throw new ApiError(
      error instanceof Error
        ? error.message
        : `Network error requesting ${endpoint}`,
      0,
      null,
      new Response(null, { status: 0 })
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Type-safe API client for the CodeReview.ai backend.
 *
 * All methods include automatic JSON serialization/deserialization,
 * error handling, timeout support, and interceptor execution.
 */
export const api = {
  /**
   * Sends a GET request to the specified endpoint.
   *
   * @typeParam T - Expected response body type
   * @param endpoint - API endpoint path
   * @param config - Optional request configuration
   * @returns Parsed response of type T
   */
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>("GET", endpoint, undefined, config);
  },

  /**
   * Sends a POST request to the specified endpoint.
   *
   * @typeParam T - Expected response body type
   * @param endpoint - API endpoint path
   * @param body - Request body to send
   * @param config - Optional request configuration
   * @returns Parsed response of type T
   */
  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>("POST", endpoint, body, config);
  },

  /**
   * Sends a PUT request to the specified endpoint.
   *
   * @typeParam T - Expected response body type
   * @param endpoint - API endpoint path
   * @param body - Request body to send
   * @param config - Optional request configuration
   * @returns Parsed response of type T
   */
  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>("PUT", endpoint, body, config);
  },

  /**
   * Sends a PATCH request to the specified endpoint.
   *
   * @typeParam T - Expected response body type
   * @param endpoint - API endpoint path
   * @param body - Request body to send
   * @param config - Optional request configuration
   * @returns Parsed response of type T
   */
  patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return request<T>("PATCH", endpoint, body, config);
  },

  /**
   * Sends a DELETE request to the specified endpoint.
   *
   * @typeParam T - Expected response body type
   * @param endpoint - API endpoint path
   * @param config - Optional request configuration
   * @returns Parsed response of type T
   */
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>("DELETE", endpoint, undefined, config);
  },
} as const;
