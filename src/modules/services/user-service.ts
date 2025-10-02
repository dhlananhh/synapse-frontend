import { authApiClient, userApiClient } from "@/libs/apiClient";
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


export const userService = {

  // =================================
  // User Profile & Preferences
  // =================================

  getUserProfile: (userId: string): Promise<UserProfile> => (

    userApiClient.get(`/${userId}`).then(res => res.data)
  ),

  updateUserProfile: (userId: string, payload: UpdateUserProfilePayload): Promise<UserProfile> => (
    userApiClient.patch(`/${userId}`, payload).then(res => res.data)
  ),

  getUserPreferences: (userId: string): Promise<UserPreferences> => {
    return userApiClient.get(`/${userId}/preferences`).then(res => res.data);
  },

  updateUserPreferences: (userId: string, payload: UpdateUserPreferencesPayload): Promise<UserPreferences> => {
    return userApiClient.patch(`/${userId}/preferences`, payload).then(res => res.data);
  },

  searchUsers: (name: string, page = 1, limit = 10): Promise<SearchUserResult[]> => {
    return userApiClient.get(`/search`, { params: { name, page, limit } }).then(res => res.data);
  },

  togglePrivacy: (userId: string): Promise<TogglePrivacyResponse> => {
    return userApiClient.patch(`/${userId}/privacy`).then(res => res.data);
  },

  // =================================
  // Social Interactions (Following)
  // =================================

  followUser: (userId: string): Promise<FollowResponse> => (
    userApiClient.post(`/${userId}/follow`).then(res => res.data)
  ),

  unfollowUser: (userId: string): Promise<void> => (
    userApiClient.delete(`/${userId}/follow`).then(res => res.data)
  ),

  acceptFollowRequest: (followerId: string): Promise<void> => (
    userApiClient.patch(`/${followerId}/follow/accept`).then(res => res.data)
  ),

  rejectFollowRequest: (followerId: string): Promise<void> => (
    userApiClient.patch(`/${followerId}/follow/reject`).then(res => res.data)
  ),

  cancelFollowRequest: (followingId: string): Promise<void> => (
    userApiClient.delete(`/${followingId}/follow/cancel`).then(res => res.data)
  ),

  // =================================
  // Social Lists
  // =================================

  getFollowers: (userId: string, page = 1, limit = 20): Promise<FollowerResponse[]> => (
    userApiClient.get(`/${userId}/followers`, { params: { page, limit } }).then(res => res.data)
  ),

  getFollowing: (userId: string, page = 1, limit = 20): Promise<FollowingResponse[]> => (
    userApiClient.get(`/${userId}/following`, { params: { page, limit } }).then(res => res.data)
  ),

};
