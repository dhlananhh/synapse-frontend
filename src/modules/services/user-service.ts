import apiClient from "@/libs/apiClient";
import {
  UserProfile,
  UserPreferences,
  UpdateUserProfilePayload,
  UpdateUserPreferencesPayload,
  GetFollowersResponse,
  GetFollowingResponse,
  FollowResponse
} from "@/types/services/user";


const API_BASE_URL = process.env.NEXT_PUBLIC_USER_API_BASE_URL;


export const userService = {
  // === Profile ===
  getUserProfile: (userId: string): Promise<UserProfile> => {
    return apiClient.get(`${API_BASE_URL}/users/${userId}`).then(res => res.data);
  },

  updateUserProfile: (userId: string, payload: UpdateUserProfilePayload): Promise<UserProfile> => {
    return apiClient.patch(`${API_BASE_URL}/users/${userId}`, payload).then(res => res.data);
  },

  togglePrivacy: (userId: string): Promise<{ id: string; isPrivate: boolean }> => {
    return apiClient.patch(`${API_BASE_URL}/users/${userId}/privacy`).then(res => res.data);
  },

  // === Preferences ===
  getUserPreferences: (userId: string): Promise<UserPreferences> => {
    return apiClient.get(`${API_BASE_URL}/users/${userId}/preferences`).then(res => res.data);
  },

  updateUserPreferences: (userId: string, payload: UpdateUserPreferencesPayload): Promise<UserPreferences> => {
    return apiClient.patch(`${API_BASE_URL}/users/${userId}/preferences`, payload).then(res => res.data);
  },

  // === Social ===
  followUser: (userIdToFollow: string): Promise<FollowResponse> => {
    return apiClient.post(`${API_BASE_URL}/users/${userIdToFollow}/follow`).then(res => res.data);
  },

  unfollowUser: (userIdToUnfollow: string): Promise<void> => {
    return apiClient.delete(`${API_BASE_URL}/users/${userIdToUnfollow}/follow`).then(res => res.data);
  },

  acceptFollowRequest: (userIdToAccept: string): Promise<{ message: string }> => {
    return apiClient.patch(`${API_BASE_URL}/users/${userIdToAccept}/follow/accept`).then(res => res.data);
  },

  rejectFollowRequest: (userIdToReject: string): Promise<void> => {
    return apiClient.patch(`${API_BASE_URL}/users/${userIdToReject}/follow/reject`).then(res => res.data);
  },

  getFollowers: (userId: string, page = 1, limit = 20): Promise<GetFollowersResponse[]> => {
    return apiClient.get(`${API_BASE_URL}/users/${userId}/followers`, {
      params: { page, limit }
    }).then(res => res.data);
  },

  getFollowing: (userId: string, page = 1, limit = 20): Promise<GetFollowingResponse[]> => {
    return apiClient.get(`${API_BASE_URL}/users/${userId}/following`, {
      params: { page, limit }
    }).then(res => res.data);
  },

  // === Search ===
  searchUsers: (query: string, page = 1, limit = 10): Promise<UserProfile[]> => {
    return apiClient.get(`${API_BASE_URL}/users/search`, {
      params: { name: query, page, limit }
    }).then(res => res.data);
  }
};
