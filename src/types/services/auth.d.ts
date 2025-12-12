// =================================
// Payloads for API Requests
// =================================

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
  gender: 'MALE' | 'FEMALE'
  birthday?: Date
}

export interface LoginPayload {
  email: string
  password: string
}

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface RequestPasswordResetPayload {
  email: string
}

export interface VerifyResetCodePayload {
  email: string
  code: string
}

export interface SetNewPasswordPayload {
  new_password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

// =================================
// Responses from API
// =================================

export interface AuthUser {
  id: string
  username: string
  email: string
  role: 'USER' | 'SYSTEM_ADMIN'
}

export interface Account {
  id: string
  email: string
  isEmailVerified: boolean
  role: 'USER' | 'SYSTEM_ADMIN'
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'
  createdAt: string
  updatedAt: string
}

export interface RegisterResponse {
  account: Account
}

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: AuthUser
}

export interface RefreshTokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  user: AuthUser
}

export interface VerifyResetCodeResponse {
  reset_token: string
  expires_in: number
}

export interface GenericMessageResponse {
  message: string
}

// =================================
// Types for Fetching Accounts
// =================================

export interface AccountPaginationCursor {
  createdAt: string
  id: string
}

export interface AccountPagination {
  hasMore: boolean
  nextCursor: AccountPaginationCursor | null
}

export interface AccountDetails {
  id: string
  userId: string
  username: string
  email: string
  isEmailVerified: boolean
  role: 'USER' | 'SYSTEM_ADMIN'
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface FetchAccountsResponse {
  accounts: AccountDetails[] // List of accounts
  pagination: {
    currentPage: number // Current page number
    totalPages: number // Total number of pages
    totalRecords: number // Total number of records
    hasNextPage: boolean // Whether there is a next page
    hasPreviousPage: boolean // Whether there is a previous page
  }
}

export interface FetchAccountsParams {
  q?: string
  page?: number // Page number for pagination
  limit?: number // Number of records per page
}

// =================================
// Types for Fetching Account Logs
// =================================

export type AccountAction =
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_UPDATED'
  | 'ACCOUNT_BANNED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_ACTIVATED'
  | 'PASSWORD_CHANGED'
  | 'EMAIL_VERIFIED'

export interface AccountLog {
  id: string
  accountId: string
  action: AccountAction
  performedBy: string
  details: string
  createdAt: string
}

export interface AccountLogPaginationCursor {
  id: string
  createdAt: string
}

export interface AccountLogPagination {
  hasMore: boolean
  nextCursor: AccountLogPaginationCursor | null
}

export interface FetchAccountLogsResponse {
  logs: AccountLog[]
  pagination: AccountLogPagination
}

export interface FetchAccountLogsParams {
  cursorId?: string
  cursorCreatedAt?: string
  limit?: number
}

// =================================
// Type for Account Summary
// =================================

export interface AccountSummary {
  id: string
  summaryDate: string // ISO date string representing the snapshot date
  totalUsers: number // Accumulated total users up to the snapshot date
  activeUsers: number // Accumulated active users up to the snapshot date
  suspendedUsers: number // Accumulated suspended users up to the snapshot date
  pendingUsers: number // Accumulated pending users up to the snapshot date
  newUsers: number // New users created on the snapshot date
  newActiveUsers: number // New active users on the snapshot date
  newSuspendedUsers: number // New suspended users on the snapshot date
  newPendingUsers: number // New pending users on the snapshot date
  newBannedUsers: number // New banned users on the snapshot date
  createdAt: string // ISO date string representing when this snapshot was created
}
