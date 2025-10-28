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

export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  email?: string;
  createdAt?: string;
  followerCount?: number;
  followingCount?: number;
  role?: "USER" | "SYSTEM_ADMIN";
  status?: "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";
  relationshipStatus?: {
    requesterToTarget: FollowRelationship | null;
    targetToRequester: FollowRelationship | null;
  };
  createdAt: string;
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
  isPrivate: boolean;
  followerCount: number;
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

export interface FollowerRecord {
  id: string;
  follower: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface FollowingRecord {
  id: string;
  following: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
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

export interface PendingFollowRequest {
  id: string;
  createdAt: string;
  requester: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface PendingFollowRequestsResponse {
  requests: PendingFollowRequest[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface SimpleProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}
