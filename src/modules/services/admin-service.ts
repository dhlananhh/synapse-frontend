import { communityApiClient, userApiClient } from "@/libs/apiClient";
import { AdminUser } from "@/types/services/admin";
import { Community } from "@/types/services/community";


export const adminService = {
  // =================================
  // ADMIN
  // =================================

  adminGetAllUsers: (params: {
    q?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{
    users: AdminUser[];
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
    };
  }> => {
    const searchQuery = params.q || "user";

    return userApiClient
      .get(`/`, {
        params: {
          q: searchQuery,
          cursor: params.cursor,
          limit: params.limit || 20
        }
      })
      .then((res) => res.data);
  },

  adminUpdateUserStatus: (
    userId: string,
    status: "ACTIVE" | "SUSPENDED"
  ): Promise<any> => {
    return userApiClient
      .patch(`/admin/users/${userId}/status`, { status })
      .then(res => res.data);
  },


  adminGetAllCommunities: (): Promise<any> => {
    return communityApiClient.get(`/`).then(res => res.data);
  },


  adminUpdateCommunityStatus: (
    communityId: string,
    status: "ACTIVE" | "SUSPENDED"
  ): Promise<Community> => {
    return communityApiClient
      .patch(`/communities/${communityId}/status`, { status })
      .then(res => res.data);
  }
}
