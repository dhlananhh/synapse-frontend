import { userApiClient } from "@/libs/apiClient";
import {
  UserProfile,
  UpdateUserProfilePayload,
  UserPreferences,
  UpdateUserPreferencesPayload,
  SearchUserResult,
  FollowerResponse,
  FollowingResponse,
  TogglePrivacyResponse,
  FollowResponse
} from "@/types/services/user";


const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:4002/api/users";


export const userService = {

  // =================================
  // User Profile & Preferences
  // =================================

  getMe: (): Promise<UserProfile> => {
    return userApiClient.get(`${USER_SERVICE_URL}/me`).then(res => res.data);
  },

  getUserProfile: (userId: string): Promise<UserProfile> => {
    return userApiClient.get(`${USER_SERVICE_URL}/${userId}`).then(res => res.data);
  },

  updateUserProfile: (userId: string, payload: UpdateUserProfilePayload): Promise<UserProfile> => {
    return userApiClient.patch(`${USER_SERVICE_URL}/${userId}`, payload).then(res => res.data);
  },

  getUserPreferences: (userId: string): Promise<UserPreferences> => {
    return userApiClient.get(`${USER_SERVICE_URL}/${userId}/preferences`).then(res => res.data);
  },

  updateUserPreferences: (userId: string, payload: UpdateUserPreferencesPayload): Promise<UserPreferences> => {
    return userApiClient.patch(`${USER_SERVICE_URL}/${userId}/preferences`, payload).then(res => res.data);
  },

  searchUsers: (name: string, page = 1, limit = 10): Promise<SearchUserResult[]> => {
    return userApiClient.get(`${USER_SERVICE_URL}/search`, { params: { name, page, limit } }).then(res => res.data);
  },

  togglePrivacy: (userId: string): Promise<TogglePrivacyResponse> => {
    return userApiClient.patch(`${USER_SERVICE_URL}/${userId}/privacy`).then(res => res.data);
  },

  // =================================
  // Social Interactions (Following)
  // =================================

  followUser: (userId: string): Promise<FollowResponse> => {
    return userApiClient.post(`${USER_SERVICE_URL}/${userId}/follow`).then(res => res.data);
  },

  unfollowUser: (userId: string): Promise<void> => {
    return userApiClient.delete(`${USER_SERVICE_URL}/${userId}/follow`).then(res => res.data);
  },

  acceptFollowRequest: (followerId: string): Promise<void> => {
    return userApiClient.patch(`${USER_SERVICE_URL}/${followerId}/follow/accept`).then(res => res.data);
  },

  rejectFollowRequest: (followerId: string): Promise<void> => {
    return userApiClient.patch(`${USER_SERVICE_URL}/${followerId}/follow/reject`).then(res => res.data);
  },

  cancelFollowRequest: (followingId: string): Promise<void> => {
    return userApiClient.delete(`${USER_SERVICE_URL}/${followingId}/follow/cancel`).then(res => res.data);
  },

  // =================================
  // Social Lists
  // =================================

  getFollowers: (userId: string, page = 1, limit = 20): Promise<FollowerResponse[]> => {
    return userApiClient.get(`${USER_SERVICE_URL}/${userId}/followers`, {
      params: { page, limit }
    }).then(res => res.data);
  },

  getFollowing: (userId: string, page = 1, limit = 20): Promise<FollowingResponse[]> => {
    return userApiClient.get(`${USER_SERVICE_URL}/${userId}/following`, {
      params: { page, limit }
    }).then(res => res.data);
  },

};
