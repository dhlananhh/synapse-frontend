import { communityApiClient, userApiClient } from "@/libs/apiClient";
import { Community, UpdateCommunityPayload } from "@/types/services/community";


export const adminService = {
  // =================================
  // ADMIN
  // =================================
  adminGetAllUsers: (params: {
    q?: string;
    cursor?: string | null;
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  }): Promise<{
    users: any[],
    pagination: {
      hasMore: boolean;
      nextCursor: string | null
    }
  }> => {
    return userApiClient.get("/admin/users", { params }).then(res => res.data);
  },


  adminUpdateUserStatus: (
    userId: string,
    status: "ACTIVE" | "SUSPENDED"
  ): Promise<any> => {
    return userApiClient.patch(`/admin/users/${userId}/status`, { status }).then(res => res.data);
  },


  adminGetAllCommunities: (params: {
    q?: string;
    cursor?: string | null;
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  }): Promise<{
    communities: Community[],
    pagination: {
      hasMore: boolean;
      nextCursor: string | null
    }
  }> => {
    return communityApiClient.get(`/communities`, { params }).then(res => res.data);
  },


  adminUpdateCommunityStatus: (
    communityId: string,
    status: "ACTIVE" | "SUSPENDED"
  ): Promise<Community> => {
    return communityApiClient.patch(`/communities/${communityId}/status`, { status }).then(res => res.data);
  }
}
