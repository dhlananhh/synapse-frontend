// =================================
// Payloads for API Requests
// =================================

export interface CreateUserProfilePayload {
  accountId: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: Gender;
}

export interface UpdateUserProfilePayload {
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE";
  bio?: string;
  location?: string;
  avatarUrl?: string | null;
}

export interface UpdateUserPreferencesPayload {
  theme?: "light" | "dark";
  language?: string;
  extras?: {
    notifications: boolean;
  };
}


// =================================
// Responses from API
// =================================

export interface UserProfile {
  id: string;
  accountId: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  gender: "MALE" | "FEMALE";
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    followers: number;
    following: number;
  };
}

export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  extras: {
    notifications: boolean;
  };
}

export interface SearchUserResult {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  _count: {
    followers: number;
  };
}

export interface FollowInfo {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface FollowerResponse {
  follower: FollowInfo;
  createdAt: string;
}

export interface FollowingResponse {
  following: FollowInfo;
  createdAt: string;
}

export interface TogglePrivacyResponse {
  id: string;
  isPrivate: boolean;
}

export interface FollowResponse {
  message: string;
  status: "PENDING" | "ACCEPTED";
}
