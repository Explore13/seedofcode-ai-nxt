/**
 * TypeScript mirror of the seedofcode-llm backend contract.
 *
 * These types are derived directly from the NestJS entities and DTOs. Dates are
 * typed as `string` because they arrive as ISO-8601 over JSON. Keep this file in
 * lockstep with the backend — it is the single source of shape truth for the
 * portal.
 */

/* ── Response envelope ─────────────────────────────────────────────────────
 * Every backend response is wrapped by a global ResponseInterceptor. Errors are
 * shaped by HttpExceptionFilter with `success: false`. */
export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: PageMeta;
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
}

/** A page of results: the unwrapped `data` array plus pagination `meta`. */
export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

/* ── Auth / User ──────────────────────────────────────────────────────────── */
export type Plan = 'free' | 'pro' | 'enterprise';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name?: string | null;
  email: string;
  plan: Plan;
  role: UserRole;
  /** NOTE: the backend field is `verified` (not `isVerified`). */
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  otp: string;
}

/* ── API Keys ─────────────────────────────────────────────────────────────── */
/** Key entity with the secret hash stripped (as returned by the backend). */
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyPrefix: string; // e.g. "soc_live_ab12cdef3456"
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ApiKeyMode = 'live' | 'test';

export interface CreateApiKeyPayload {
  name: string;
  mode?: ApiKeyMode;
}

export interface UpdateApiKeyPayload {
  name?: string;
  isActive?: boolean;
}

/** `POST /apikeys` returns the one-time plaintext key plus the safe entity. */
export interface CreateApiKeyResult {
  rawKey: string;
  apiKey: ApiKey;
}

/** `POST /apikeys/:id/regenerate` returns only the new plaintext key. */
export interface RegenerateApiKeyResult {
  rawKey: string;
}

/* ── Credits ──────────────────────────────────────────────────────────────── */
export interface CreditWallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export type CreditTransactionReason =
  | 'chat_completion'
  | 'reservation'
  | 'shortfall'
  | 'refund'
  | 'topup'
  | 'signup_bonus'
  | 'admin_adjustment';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: CreditTransactionReason;
  usageLogId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ── Usage ────────────────────────────────────────────────────────────────── */
export type UsageStatus = 'success' | 'error' | 'timeout';

export interface UsageLog {
  id: string;
  userId: string;
  apiKeyId: string | null;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: UsageStatus;
  creditsCost: number;
  createdAt: string;
  updatedAt: string;
  creditTransactions?: CreditTransaction[];
}

/**
 * `GET /usage` query params.
 * IMPORTANT (P8a): the backend supports ONLY pagination — there is no
 * server-side date-range or model filter. `limit` is capped at 100. Date/model
 * filtering for the analytics page is therefore done client-side over fetched
 * rows.
 */
export interface UsageQuery {
  page?: number;
  limit?: number;
}

/** `GET /usage/today` summary. All values are integers. */
export interface TodayUsageSummary {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalCost: number;
  totalRequests: number;
}

/* ── Models ───────────────────────────────────────────────────────────────── */
export type ModelProvider = 'ollama';

export interface ModelInfo {
  id: string;
  name: string; // "llama3.1:8b" — the Ollama tag / lookup key
  provider: ModelProvider;
  enabled: boolean;
  maxContext: number | null;
  capabilities: string[];
  family: string | null;
  parameterSize: string | null; // "8.0B"
  parameterCount: string | null; // bigint as string
  quantizationLevel: string | null;
  sizeBytes: string | null;
  digest: string | null;
  creditsPerInputToken: number;
  creditsPerOutputToken: number;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
