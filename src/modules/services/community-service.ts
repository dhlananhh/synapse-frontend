import { communityApiClient } from "@/libs/apiClient";
import { CreateCommunityPayload, GenericMessageResponse } from "@/types/services/community";

export const communityService = {
  createCommunity: (payload: CreateCommunityPayload): Promise<GenericMessageResponse> => {
    return communityApiClient.post(`/`, payload).then(res => res.data);
  },

  updateAvatar: (communityId: string, avatarFile: File): Promise<GenericMessageResponse> => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return communityApiClient.put(`/${communityId}/avatar`, formData).then(res => res.data);
  },

  updateBanner: (communityId: string, bannerFile: File): Promise<GenericMessageResponse> => {
    const formData = new FormData();
    formData.append('banner', bannerFile);
    return communityApiClient.put(`/${communityId}/banner`, formData).then(res => res.data);
  },
}
