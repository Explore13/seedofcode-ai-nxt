import { AxiosError } from 'axios';
import type { ApiEnvelope } from '@/lib/types';

/**
 * A normalized error surfaced to the UI. Carries the backend's human-readable
 * `message` (from the response envelope) plus the HTTP status, so callers can
 * branch on `status` (e.g. 402 → top-up) and show `message` directly.
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly payload: ApiEnvelope<null> | null;
  readonly isNetworkError: boolean;

  constructor(
    message: string,
    options: {
      status?: number | null;
      payload?: ApiEnvelope<null> | null;
      isNetworkError?: boolean;
    } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? null;
    this.payload = options.payload ?? null;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}

/** Convert any thrown value (usually an AxiosError) into an ApiError. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const response = error.response;
    if (!response) {
      // No response = network/timeout/CORS failure.
      return new ApiError(
        'Cannot reach the server. Check your connection and try again.',
        { isNetworkError: true },
      );
    }
    const payload = response.data as ApiEnvelope<null> | undefined;
    const message =
      (payload && typeof payload.message === 'string' && payload.message) ||
      error.message ||
      'Something went wrong.';
    return new ApiError(message, {
      status: response.status,
      payload: payload ?? null,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unexpected error occurred.');
}
