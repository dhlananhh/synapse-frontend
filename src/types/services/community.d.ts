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

export interface CreatePostPayload {
  communityId: string;
  title: string;
  content?: string;
  status?: PostStatus;
  flairId?: string;
  isPinned: boolean;
  isLocked: boolean;
  isNSFW: boolean;
  isOC: boolean;
  isSpoiler: boolean;
  links: string;
}

export interface CreateRulePayload {
  title: string;
  description?: string;
}

export interface UpdateRulePayload {
  title?: string;
  description?: string;
}

// =================================
// Shared Types
// =================================

export type CommunityStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type PostStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "REMOVED";
export type MembershipRole = "MEMBER" | "MODERATOR" | "OWNER";
export type MembershipStatus = "PENDING" | "ACTIVE" | "BANNED";


// =================================
// Responses from API
// =================================

export interface Community {
  id: string;
  name: string;
  description: string | null;
  status: CommunityStatus;
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
  userMembership?: CommunityMember;
}

export interface CommunityFlair {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string | null;
  order: number;
}

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isLocked: boolean;
  isNSFW: boolean;
  isOC: boolean;
  isSpoiler: boolean;
  links: string;
  userId: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt: string;
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

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface UploadMediaResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface GetMembersResponse {
  members: CommunityMember[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface GetRulesResponse {
  success: boolean;
  message: string;
  data: CommunityRule[];
}

export interface RuleResponse {
  success: boolean;
  message: string;
  data: CommunityRule;
}
