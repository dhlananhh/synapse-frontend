import apiClient from "@/libs/apiClient";
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
  RefreshTokenResponse,
  GenericMessageResponse
} from "@/types/services/auth";


const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;


export const authService = {
  register: (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiClient.post(`${API_BASE_URL}/register`, payload).then(res => res.data);
  },

  login: (payload: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post(`${API_BASE_URL}/login`, payload).then(res => res.data);
  },

  logout: (): Promise<GenericMessageResponse> => {
    return apiClient.post(`${API_BASE_URL}/logout`).then(res => res.data);
  },

  refreshToken: (): Promise<RefreshTokenResponse> => {
    return apiClient.post(`${API_BASE_URL}/refresh`).then(res => res.data);
  },

  changePassword: (payload: ChangePasswordPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${API_BASE_URL}/change-password`, payload).then(res => res.data);
  },

  verifyEmail: (payload: VerifyEmailPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${API_BASE_URL}/verify-email`, payload).then(res => res.data);
  },

  resendVerification: (payload: ResendVerificationPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${API_BASE_URL}/resend-verification`, payload).then(res => res.data);
  },

  requestPasswordReset: (payload: RequestPasswordResetPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${API_BASE_URL}/request-password-reset`, payload).then(res => res.data);
  },

  verifyPasswordResetCode: (payload: VerifyResetCodePayload): Promise<VerifyResetCodeResponse> => {
    return apiClient.post(`${API_BASE_URL}/verify-reset-code`, payload).then(res => res.data);
  },

  setNewPassword: (payload: SetNewPasswordPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${API_BASE_URL}/set-new-password`, payload).then(res => res.data);
  },
};
