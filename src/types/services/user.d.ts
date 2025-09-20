export type Gender = "MALE" | "FEMALE";
export type Theme = "light" | "dark";


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
  gender?: Gender;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export interface UpdateUserPreferencesPayload {
  theme?: Theme;
  language?: string;
  extras?: {
    notifications?: boolean;
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
  gender: Gender;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    followers: number;
  }
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  extras: {
    notifications: boolean;
  } | null;
}

export interface Follower {
  follower: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface Following {
  following: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}
