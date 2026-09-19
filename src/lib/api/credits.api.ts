import { apiClient } from './client';
import { data } from './http';
import type { ApiEnvelope, CreditWallet } from '@/lib/types';

/** Credit wallet (backend prefix `/credits/wallet`, JWT). */
export const creditsApi = {
  /** Current wallet balance. */
  balance(): Promise<CreditWallet> {
    return apiClient
      .get<ApiEnvelope<CreditWallet>>('/credits/wallet/balance')
      .then(data);
  },

  /** Ensure a wallet exists / reconcile it (idempotent). */
  sync(): Promise<CreditWallet> {
    return apiClient
      .post<ApiEnvelope<CreditWallet>>('/credits/wallet/sync')
      .then(data);
  },
};
