export interface CommunityRule {
  id: string;
  title: string;
  description?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// Payload used when creating a new rule
export interface CreateCommunityRulePayload {
  title: string;
  description?: string;
}

// Payload for updating a rule (at least one field optional)
export interface UpdateCommunityRulePayload {
  title?: string;
  description?: string;
}

export interface CommunityFlair {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  status: "PUBLIC" | "RESTRICTED" | "PRIVATE";
  ownerId: string;
  memberCount: number;
  postCount: number;
  isNSFW: boolean;
  isPrivate: boolean;
  moderationMode: boolean;
  avatarUrl: string | null;
  bannerUrl: string | null;
  moderatorIds: string[];
  rules: CommunityRule[];
  flairs: CommunityFlair[];
  userMembership: any;
  createdAt: string;
  updatedAt: string;
}

// Define the type for a community membership
export interface CommunityMembership {
  id: string;
  communityId: string;
  userId: string;
  username: string;
  role: "OWNER" | "MODERATOR" | "MEMBER";
  status: "ACTIVE" | "PENDING" | "BANNED";
  joinedAt: string | null;
}

export interface SearchCommunityResult {
  id: string
  name: string
  description: string
  ownerId: string
  memberCount: number
  postCount: number
  isNSFW: boolean
  isPrivate: boolean
  avatarUrl: string | null
}

export interface MyCommunity {
  communityId: string
  name: string
  description: string
  status: 'ACTIVE' | 'LEFT'
  avatarUrl: string | null
}

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  isNSFW?: boolean;
  isPrivate?: boolean;
}

export interface CommunityFlair {
  id: string;
  name: string;
  color: string;
  description: string;
}

// payload for creating a new flair (id assigned by server)
export interface CreateCommunityFlairPayload {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCommunityPayload {
  name?: string;
  description?: string;
  isNSFW?: boolean;
  isPrivate?: boolean;
  moderationMode?: boolean;
}

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  username: string;
  role: "OWNER" | "MODERATOR" | "MEMBER" | string;
  status: "ACTIVE" | "PENDING" | "BANNED" | string;
  joinedAt: string;
  avatarUrl?: string | null;
}
