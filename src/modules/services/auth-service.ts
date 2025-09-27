import { authApiClient } from "@/libs/apiClient";
import {
  RegisterPayload, RegisterResponse,
  LoginPayload, LoginResponse,
  VerifyEmailPayload, ResendVerificationPayload,
  RequestPasswordResetPayload, VerifyResetCodePayload,
  VerifyResetCodeResponse, SetNewPasswordPayload,
  ChangePasswordPayload, RefreshTokenResponse,
  GenericMessageResponse
} from "@/types/services/auth";
import Cookies from "js-cookie";
import { AuthUser } from "@/types/services/auth";



const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:4000/api/auth";
const RESET_TOKEN_KEY = "reset_token";


export const authService = {
  register: (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { ...apiPayload } = payload;
    return authApiClient.post(`${AUTH_SERVICE_URL}/register`, apiPayload).then(res => res.data);
  },

  login: (payload: LoginPayload): Promise<LoginResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/login`, payload).then(res => res.data);
  },

  getMe: (): Promise<AuthUser> => {
    return authApiClient.get(`${AUTH_SERVICE_URL}/me`).then(res => res.data);
  },

  logout: (): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/logout`).then(res => res.data);
  },

  refreshToken: (token: string): Promise<LoginResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/refresh`, {
      refresh_token: token
    }).then(res => res.data);
  },

  changePassword: (payload: ChangePasswordPayload): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/change-password`, payload).then(res => res.data);
  },

  verifyEmail: (payload: VerifyEmailPayload): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/verify-email`, payload).then(res => res.data);
  },

  resendVerification: (payload: ResendVerificationPayload): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/resend-verification`, payload).then(res => res.data);
  },

  requestPasswordReset: (payload: RequestPasswordResetPayload): Promise<GenericMessageResponse> => {
    return authApiClient.post(`${AUTH_SERVICE_URL}/request-password-reset`, payload).then(res => res.data);
  },

  verifyPasswordResetCode: async (payload: VerifyResetCodePayload): Promise<VerifyResetCodeResponse> => {
    const response = await authApiClient.post(`${AUTH_SERVICE_URL}/verify-reset-code`, payload);
    if (response.data.reset_token) {
      Cookies.set(RESET_TOKEN_KEY, response.data.reset_token, { expires: 1 / 288 }); // Expires in 5 minutes
    }
    return response.data;
  },

  setNewPassword: (payload: SetNewPasswordPayload): Promise<GenericMessageResponse> => {
    return authApiClient.post(
      `${AUTH_SERVICE_URL}/set-new-password`,
      payload,
      { withCredentials: true }
    ).then(res => res.data);
  },
};
