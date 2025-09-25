// =================================
// Payloads for API Requests
// =================================


export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  gender: "MALE" | "FEMALE";
  birthday?: Date;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface SetNewPasswordPayload {
  new_password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}


// =================================
// Responses from API
// =================================

export interface AuthUser {
  id: string;
  email: string;
  role: "USER" | "SYSTEM_ADMIN";
}

export interface Account {
  id: string;
  email: string;
  isEmailVerified: boolean;
  role: "USER" | "SYSTEM_ADMIN";
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  account: Account;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  refreshToken?: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: AuthUser;
}

export interface VerifyResetCodeResponse {
  reset_token: string;
  expires_in: number;
}

export interface GenericMessageResponse {
  message: string;
}
