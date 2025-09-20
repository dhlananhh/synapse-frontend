import axios from "axios";
import apiClient from "@/libs/apiClient";
import {
  CreateUserProfilePayload,
  Follower,
  Following,
  UpdateUserPreferencesPayload,
  UpdateUserProfilePayload,
  UserPreferences,
  UserProfile
} from "@/types/services/user";


const userApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_URL,
  withCredentials: true,
});


const USER_SERVICE_PATH = "/users";


export const userService = {
  createUserProfile: (payload: CreateUserProfilePayload): Promise<UserProfile> => {
    return apiClient.post(USER_SERVICE_PATH, payload).then(res => res.data);
  },

  getUserProfile: (userId: string): Promise<UserProfile> => {
    return userApiClient.get(`${USER_SERVICE_PATH}/${userId}`).then(res => res.data);
  },

  updateUserProfile: (userId: string, payload: UpdateUserProfilePayload): Promise<UserProfile> => {
    return userApiClient.patch(`${USER_SERVICE_PATH}/${userId}`, payload).then(res => res.data);
  },

  togglePrivacy: (userId: string): Promise<{ id: string; isPrivate: boolean; }> => {
    return userApiClient.patch(`${USER_SERVICE_PATH}/${userId}/privacy`).then(res => res.data);
  },

  getUserPreferences: (userId: string): Promise<UserPreferences> => {
    return userApiClient.get(`${USER_SERVICE_PATH}/${userId}/preferences`).then(res => res.data);
  },

  updateUserPreferences: (userId: string, payload: UpdateUserPreferencesPayload): Promise<UserPreferences> => {
    return userApiClient.patch(`${USER_SERVICE_PATH}/${userId}/preferences`, payload).then(res => res.data);
  },

  followUser: (userIdToFollow: string): Promise<any> => {
    return userApiClient.post(`${USER_SERVICE_PATH}/${userIdToFollow}/follow`).then(res => res.data);
  },

  unfollowUser: (userIdToUnfollow: string): Promise<void> => {
    return userApiClient.delete(`${USER_SERVICE_PATH}/${userIdToUnfollow}/follow`).then(res => res.data);
  },

  getFollowers: (userId: string, page = 1, limit = 20): Promise<Follower[]> => {
    return userApiClient.get(`${USER_SERVICE_PATH}/${userId}/followers`, {
      params: { page, limit }
    }).then(res => res.data);
  },

  getFollowing: (userId: string, page = 1, limit = 20): Promise<Following[]> => {
    return userApiClient.get(`${USER_SERVICE_PATH}/${userId}/following`, {
      params: { page, limit }
    }).then(res => res.data);
  }
};
