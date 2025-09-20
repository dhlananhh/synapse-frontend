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


const AUTH_SERVICE_PATH = "/auth";


export const authService = {
  register: (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/register`, payload).then(res => res.data);
  },

  login: (payload: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/login`, payload).then(res => res.data);
  },

  logout: (): Promise<GenericMessageResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/logout`).then(res => res.data);
  },

  refreshToken: (): Promise<RefreshTokenResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/refresh`).then(res => res.data);
  },

  changePassword: (payload: ChangePasswordPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/change-password`, payload).then(res => res.data);
  },

  verifyEmail: (payload: VerifyEmailPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/verify-email`, payload).then(res => res.data);
  },

  resendVerification: (payload: ResendVerificationPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/resend-verification`, payload).then(res => res.data);
  },

  requestPasswordReset: (payload: RequestPasswordResetPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/request-password-reset`, payload).then(res => res.data);
  },

  verifyPasswordResetCode: (payload: VerifyResetCodePayload): Promise<VerifyResetCodeResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/verify-reset-code`, payload).then(res => res.data);
  },

  setNewPassword: (payload: SetNewPasswordPayload): Promise<GenericMessageResponse> => {
    return apiClient.post(`${AUTH_SERVICE_PATH}/set-new-password`, payload).then(res => res.data);
  },
};
