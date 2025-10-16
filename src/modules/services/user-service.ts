import {
  authApiClient,
  userApiClient,
} from "@/libs/apiClient";
import {
  UserProfile,
  UpdateUserProfilePayload,
  UserPreferences,
  UpdateUserPreferencesPayload,
  SearchUserResult,
  FollowerResponse,
  FollowingResponse,
  TogglePrivacyResponse,
  FollowResponse,
  PendingFollowRequestsResponse,
  FollowerRecord,
  FollowingRecord,
  SimpleProfile,
} from "@/types/services/user";

export const userService = {
  // =================================
  // User Profile & Preferences
  // =================================

  getUserProfile: (userId: string): Promise<UserProfile> =>
    userApiClient.get(`/${userId}`).then((res) => {
      console.log("user profile fetched ", res);
      return res.data;
    }),

  updateUserProfile: (
    payload: UpdateUserProfilePayload
  ): Promise<UserProfile> =>
    userApiClient
      .patch(`/me`, payload)
      .then((res) => res.data),

  getUserPreferences: (
    userId: string
  ): Promise<UserPreferences> => {
    return userApiClient
      .get(`/me/preferences`)
      .then((res) => res.data);
  },

  updateUserPreferences: (
    userId: string,
    payload: UpdateUserPreferencesPayload
  ): Promise<UserPreferences> => {
    return userApiClient
      .patch(`/me/preferences`, payload)
      .then((res) => res.data);
  },

  updateUserAvatar: (
    formData: FormData
  ): Promise<{ avatarUrl: string }> => {
    return userApiClient
      .patch("/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  searchUsers: (
    q: string,
    cursor?: string,
    limit = 10
  ): Promise<{
    users: SearchUserResult[];
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
    };
  }> => {
    return userApiClient
      .get(`/`, { params: { q, cursor, limit } })
      .then((res) => res.data);
  },

  togglePrivacy: (): Promise<TogglePrivacyResponse> => {
    return userApiClient
      .patch(`/me/privacy`)
      .then((res) => res.data);
  },

  getSimpleProfiles: (
    userIds: string[]
  ): Promise<SimpleProfile[]> => {
    return userApiClient
      .get("/simple-profiles", {
        params: { userIds: userIds.join(",") },
      })
      .then((res) => res.data);
  },

  // =================================
  // Social Interactions (Following)
  // =================================

  followUser: (userId: string): Promise<FollowResponse> =>
    userApiClient
      .post(`/me/following`, { userId })
      .then((res) => res.data),

  unfollowUser: (followId: string): Promise<void> =>
    userApiClient
      .delete(`/me/following/${followId}`)
      .then((res) => res.data),

  acceptFollowRequest: (requestId: string): Promise<void> =>
    userApiClient
      .patch(`/me/follow-requests/${requestId}`, {
        action: "accept",
      })
      .then((res) => res.data),

  rejectFollowRequest: (requestId: string): Promise<void> =>
    userApiClient
      .patch(`/me/follow-requests/${requestId}`, {
        action: "reject",
      })
      .then((res) => res.data),

  cancelFollowRequest: (requestId: string): Promise<void> =>
    userApiClient
      .patch(`/me/follow-requests/${requestId}`, {
        action: "cancel",
      })
      .then((res) => res.data),

  // =================================
  // Social Lists
  // =================================

  getFollowers: (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<FollowerRecord[]> =>
    userApiClient
      .get(`/${userId}/followers`, {
        params: { page, limit },
      })
      .then((res) => res.data.follows),

  getFollowing: (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<FollowingRecord[]> =>
    userApiClient
      .get(`/${userId}/following`, {
        params: { page, limit },
      })
      .then((res) => res.data.following),

  getPendingFollowRequests:
    (): Promise<PendingFollowRequestsResponse> =>
      userApiClient
        .get("/me/follow-requests")
        .then((res) => res.data),
};
