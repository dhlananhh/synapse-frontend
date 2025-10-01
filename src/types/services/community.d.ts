// =================================
// Payloads for API Requests
// =================================

export interface CreateCommunityPayload {
  name: string;
  description: string;
  status: "PUBLIC" | "PRIVATE";
  isNSFW: boolean;
}

// =================================
// Responses from API
// =================================

export interface Community {
  id: string;
  name: string;
  description: string | null;
  status: "PUBLIC" | "PRIVATE" | "RESTRICTED";
  ownerId: string;
  memberCount: number;
  postCount: number;
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
