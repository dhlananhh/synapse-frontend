import { communityApiClient } from "@/libs/apiClient";
import {
  CreateCommunityPayload,
  GenericMessageResponse,
  GetCommunitiesResponse,
  UpdateCommunityPayload
} from "@/types/services/community";


export const communityService = {
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
  }
}
