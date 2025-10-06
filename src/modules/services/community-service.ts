import { communityApiClient } from "@/libs/apiClient";
import {
  CreateCommunityPayload,
  CreateFlairPayload,
  CreatePostPayload,
  CreatePostResponse,
  CreateRulePayload,
  FlairResponse,
  GenericMessageResponse,
  GetCommunitiesResponse,
  GetFlairsResponse,
  GetMembersResponse,
  GetRulesResponse,
  RuleResponse,
  UpdateCommunityPayload,
  UpdateFlairPayload,
  UpdateRulePayload,
  UploadMediaResponse
} from "@/types/services/community";


export const communityService = {
  // =================================
  // Community
  // =================================
  createCommunity: (
    payload: CreateCommunityPayload
  ): Promise<GenericMessageResponse> => {
    return communityApiClient.post(`/`, payload).then(res => res.data);
  },

  updateAvatar: (
    communityId: string,
    avatarFile: File
  ): Promise<GenericMessageResponse> => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    return communityApiClient.put(`/${communityId}/avatar`, formData).then(res => res.data);
  },

  updateBanner: (
    communityId: string,
    bannerFile: File
  ): Promise<GenericMessageResponse> => {
    const formData = new FormData();
    formData.append("banner", bannerFile);
    return communityApiClient.put(`/${communityId}/banner`, formData).then(res => res.data);
  },

  updateCommunityDetails: (
    communityId: string,
    payload: UpdateCommunityPayload
  ): Promise<GenericMessageResponse> => {
    return communityApiClient.put(`/${communityId}`, payload).then(res => res.data);
  },

  getCommunities: (): Promise<GetCommunitiesResponse> => {
    return communityApiClient.get(`/`).then(res => res.data);
  },

  getCommunityByName: (communityName: string): Promise<GenericMessageResponse> => {
    return communityApiClient.get(`/${communityName}`).then(res => res.data);
  },

  getCommunityMembers: (communityId: string, params: {
    cursor?: string,
    limit?: number,
    q?: string
  }): Promise<GetMembersResponse> => {
    return communityApiClient.get(`/${communityId}/members`, { params }).then(res => res.data);
  },


  // =================================
  // Community Flairs
  // =================================

  getCommunityFlairs: (communityId: string): Promise<GetFlairsResponse> => {
    return communityApiClient.get(`/${communityId}/flairs`).then(res => res.data);
  },

  createCommunityFlair: (
    communityId: string,
    payload: CreateFlairPayload
  ): Promise<FlairResponse> => {
    return communityApiClient.post(`/${communityId}/flairs`, payload).then(res => res.data);
  },

  updateCommunityFlair: (
    communityId: string,
    flairId: string,
    payload: UpdateFlairPayload
  ): Promise<FlairResponse> => {
    return communityApiClient.put(`/${communityId}/flairs/${flairId}`, payload).then(res => res.data);
  },

  deleteCommunityFlair: (
    communityId: string,
    flairId: string
  ): Promise<void> => {
    return communityApiClient.delete(`/${communityId}/flairs/${flairId}`).then(res => res.data);
  },

  // =================================
  // Community Posts
  // =================================


  // =================================
  // Community Rules
  // =================================

  getCommunityRules: (communityId: string): Promise<GetRulesResponse> => {
    return communityApiClient.get(`/${communityId}/rules`).then(res => res.data);
  },

  createCommunityRule: (
    communityId: string, payload: CreateRulePayload)
    : Promise<RuleResponse> => {
    return communityApiClient.post(`/${communityId}/rules`, payload).then(res => res.data);
  },

  updateCommunityRule: (
    communityId: string,
    ruleId: string,
    payload: UpdateRulePayload
  ): Promise<RuleResponse> => {
    return communityApiClient.put(`/${communityId}/rules/${ruleId}`, payload).then(res => res.data);
  },

  deleteCommunityRule: (
    communityId: string,
    ruleId: string
  ): Promise<void> => {
    return communityApiClient.delete(`/${communityId}/rules/${ruleId}`).then(res => res.data);
  },
}
