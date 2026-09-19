import { apiClient } from './client';
import { data } from './http';
import type {
  ApiEnvelope,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
  VerifyOtpPayload,
} from '@/lib/types';

/** Auth & onboarding endpoints (backend prefix `/auth`). */
export const authApi = {
  register(payload: RegisterPayload): Promise<AuthTokens> {
    return apiClient
      .post<ApiEnvelope<AuthTokens>>('/auth/register', payload)
      .then(data);
  },

  login(payload: LoginPayload): Promise<AuthTokens> {
    return apiClient
      .post<ApiEnvelope<AuthTokens>>('/auth/login', payload)
      .then(data);
  },

  /** Fetch the current user (JWT, allowed while unverified). */
  me(): Promise<User> {
    return apiClient.get<ApiEnvelope<User>>('/auth/me').then(data);
  },

  logout(): Promise<{ success: boolean; message: string }> {
    return apiClient
      .post<ApiEnvelope<{ success: boolean; message: string }>>('/auth/logout')
      .then(data);
  },

  /** Send an email verification OTP to the logged-in user. */
  sendOtp(): Promise<unknown> {
    return apiClient
      .post<ApiEnvelope<unknown>>('/auth/otp/generate')
      .then(data);
  },

  verifyOtp(payload: VerifyOtpPayload): Promise<unknown> {
    return apiClient
      .post<ApiEnvelope<unknown>>('/auth/otp/verify', payload)
      .then(data);
  },
};
