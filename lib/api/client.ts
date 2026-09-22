export interface ApiPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type ApiErrorCode = "CONFIGURATION" | "NETWORK" | "HTTP" | "INVALID_RESPONSE" | "INVALID_ARGUMENT";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Shared native-fetch transport and runtime parsers for public API clients. */
export function createPublicApiClient(
  resource: string,
  ErrorType: typeof ApiError = ApiError,
) {
  function apiBaseUrl(): string {
    const value = process.env.NEXT_PUBLIC_API_URL?.trim();
    try {
      if (!value) throw new Error();
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
        throw new Error();
      }
      return url.href.replace(/\/+$/, "");
    } catch {
      throw new ErrorType(`The ${resource} service is not configured.`, "CONFIGURATION");
    }
  }

  function invalidResponse(): never {
    throw new ErrorType(`The ${resource} service returned an unexpected response. Please try again later.`, "INVALID_RESPONSE");
  }

  function record(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return invalidResponse();
    return value as Record<string, unknown>;
  }

  function string(value: unknown): string {
    if (typeof value !== "string") return invalidResponse();
    return value;
  }

  function nullableString(value: unknown): string | null {
    return value === null ? null : string(value);
  }

  /** Resolve uploads against the backend origin, never /api/uploads. */
  function imageUrl(value: unknown, baseUrl: string): string | null {
    const path = nullableString(value);
    if (!path) return null;
    try {
      const url = new URL(path, `${new URL(baseUrl).origin}/`);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return invalidResponse();
      return url.href;
    } catch {
      return invalidResponse();
    }
  }

  function integer(value: unknown, minimum: number): number {
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum) return invalidResponse();
    return value;
  }

  function pagination(value: unknown): ApiPagination {
    const data = record(value);
    if (typeof data.hasNextPage !== "boolean" || typeof data.hasPreviousPage !== "boolean") return invalidResponse();
    return {
      currentPage: integer(data.currentPage, 1),
      pageSize: integer(data.pageSize, 1),
      totalItems: integer(data.totalItems, 0),
      totalPages: integer(data.totalPages, 0),
      hasNextPage: data.hasNextPage,
      hasPreviousPage: data.hasPreviousPage,
    };
  }

  async function request(path: string, baseUrl: string): Promise<Record<string, unknown>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      // Public requests never send admin credentials. Protected endpoints remain
      // subject to backend authorization and surface as HTTP errors here.
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { Accept: "application/json" },
        credentials: "omit",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        const message = response.status === 404
          ? `The requested ${resource} could not be found.`
          : `The ${resource} is currently unavailable. Please try again later.`;
        throw new ErrorType(message, "HTTP", response.status);
      }
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        return invalidResponse();
      }
      const envelope = record(payload);
      if (envelope.success !== true) return invalidResponse();
      return record(envelope.data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ErrorType(`Unable to reach the ${resource} service. Please try again.`, "NETWORK");
    } finally {
      clearTimeout(timeout);
    }
  }

  return { apiBaseUrl, invalidResponse, record, string, nullableString, imageUrl, pagination, request };
}
