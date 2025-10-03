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

export interface CreateFlairPayload {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateFlairPayload {
  name?: string;
  color?: string;
  description?: string;
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

export interface CommunityFlair {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
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

export interface GetFlairsResponse {
  success: boolean;
  message: string;
  data: CommunityFlair[];
}

export interface FlairResponse {
  success: boolean;
  message: string;
  data: CommunityFlair;
}
