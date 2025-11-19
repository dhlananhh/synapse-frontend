import { authApiClient } from '@/libs/apiClient'
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  VerifyEmailPayload,
  ResendVerificationPayload,
  RequestPasswordResetPayload,
  VerifyResetCodePayload,
  VerifyResetCodeResponse,
  SetNewPasswordPayload,
  ChangePasswordPayload,
  GenericMessageResponse,
  FetchAccountsParams,
  FetchAccountsResponse,
  FetchAccountLogsParams,
  FetchAccountLogsResponse,
  AccountDetails,
  AccountSummary,
} from '@/types/services/auth'
import Cookies from 'js-cookie'
import { AuthUser } from '@/types/services/auth'

const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:4000/api/auth'
const RESET_TOKEN_KEY = 'reset_token'

export const authService = {
  register: (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { ...apiPayload } = payload
    return authApiClient.post(`${AUTH_SERVICE_URL}/register`, apiPayload).then((res) => res.data)
  },

  login: (payload: LoginPayload): Promise<LoginResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/login`, payload).then((res) => res.data)
  },

  getMe: (): Promise<AuthUser> => {
    return authApiClient.get(`${AUTH_SERVICE_URL}/me`).then((res) => res.data)
  },

  logout: (): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/logout`).then((res) => res.data)
  },

  refreshToken: (): Promise<LoginResponse> => {
    return authApiClient.post(`/refresh`).then((res) => res.data)
  },

  changePassword: (payload: ChangePasswordPayload): Promise<GenericMessageResponse> => {
    return authApiClient
      .post(`${AUTH_SERVICE_URL}/change-password`, payload)
      .then((res) => res.data)
  },

  verifyEmail: (payload: VerifyEmailPayload): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/verify-email`, payload).then((res) => res.data)
  },

  resendVerification: (payload: ResendVerificationPayload): Promise<GenericMessageResponse> => {
    return authApiClient
      .post(`${AUTH_SERVICE_URL}/resend-verification`, payload)
      .then((res) => res.data)
  },

  requestPasswordReset: (payload: RequestPasswordResetPayload): Promise<GenericMessageResponse> => {
    return authApiClient
      .post(`${AUTH_SERVICE_URL}/request-password-reset`, payload)
      .then((res) => res.data)
  },

  verifyPasswordResetCode: async (
    payload: VerifyResetCodePayload
  ): Promise<VerifyResetCodeResponse> => {
    const response = await authApiClient.post(`${AUTH_SERVICE_URL}/verify-reset-code`, payload)
    if (response.data.reset_token) {
      Cookies.set(RESET_TOKEN_KEY, response.data.reset_token, { expires: 1 / 288 }) // Expires in 5 minutes
    }
    return response.data
  },

  setNewPassword: (payload: SetNewPasswordPayload): Promise<GenericMessageResponse> => {
    const resetToken = Cookies.get(RESET_TOKEN_KEY)
    if (!resetToken) {
      return Promise.reject(new Error('Reset token not found or expired.'))
    }
    Cookies.remove(RESET_TOKEN_KEY)
    return authApiClient
      .post(`${AUTH_SERVICE_URL}/set-new-password`, payload, {
        headers: { Authorization: `Bearer ${resetToken}` },
      })
      .then((res) => res.data)
  },

  fetchAccounts: (params: FetchAccountsParams = {}): Promise<FetchAccountsResponse> => {
    return authApiClient
      .get(`${AUTH_SERVICE_URL}/admin/accounts`, { params })
      .then((res) => res.data)
  },

  fetchAccountLogs: (
    accountId: string,
    params: FetchAccountLogsParams = {}
  ): Promise<FetchAccountLogsResponse> => {
    return authApiClient
      .get(`${AUTH_SERVICE_URL}/admin/accounts/${accountId}/logs`, { params })
      .then((res) => res.data)
  },

  updateAccountStatus: (
    accountId: string,
    payload: { status: 'ACTIVE' | 'SUSPENDED' }
  ): Promise<AccountDetails> => {
    return authApiClient
      .patch(`${AUTH_SERVICE_URL}/admin/accounts/${accountId}`, payload)
      .then((res) => res.data)
  },

  fetchAccountSummary: (): Promise<AccountSummary> => {
    return authApiClient.get(`${AUTH_SERVICE_URL}/admin/accounts/summary`).then((res) => res.data)
  },

  fetchAccountSummariesOverTime: (params: {
    startDate?: string
    endDate?: string
  }): Promise<AccountSummary[]> => {
    return authApiClient
      .get(`${AUTH_SERVICE_URL}/admin/accounts/summary-over-time`, { params })
      .then((res) => res.data)
  },
}
