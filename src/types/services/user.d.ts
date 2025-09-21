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

export type UserGender = "MALE" | "FEMALE";

export interface UserProfile {
  id: string;
  accountId: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: UserGender;
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
  } | null;
}

export interface FollowerInfo {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface GetFollowersResponse {
  follower: FollowerInfo,
  createdAt: string;
}


export interface GetFollowingResponse {
  following: FollowerInfo,
  createdAt: string;
}

export interface FollowResponse {
  message: string;
  status: "PENDING" | "ACCEPTED";
}
