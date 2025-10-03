// =================================
// Payloads for API Requests
// =================================

export interface CreateCommunityPayload {
  name: string;
  description: string;
  isPrivate: boolean;
  isNSFW: boolean;
}

export interface UpdateCommunityPayload {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  isNSFW?: boolean;
  moderationMode?: boolean;
}


// =================================
// Responses from API
// =================================

export interface Community {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  ownerId: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  isNSFW: boolean;
  moderationMode: boolean;
  avatarKey: string | null;
  bannerKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenericMessageResponse {
  success: boolean;
  message: string;
  data: Community;
}

export interface GetCommunitiesResponse {
  communities: Community[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
}
