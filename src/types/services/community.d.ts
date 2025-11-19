export interface CommunityRule {
  id: string
  title: string
  description?: string
  order: number
  createdAt?: string
  updatedAt?: string
}

// Payload used when creating a new rule
export interface CreateCommunityRulePayload {
  title: string
  description?: string
}

// Payload for updating a rule (at least one field optional)
export interface UpdateCommunityRulePayload {
  title?: string
  description?: string
}

export interface CommunityFlair {
  id: string
  name: string
  color: string
  description: string
}

export interface Community {
  id: string
  name: string
  description: string
  status: 'PUBLIC' | 'RESTRICTED' | 'PRIVATE'
  ownerId: string
  memberCount: number
  postCount: number
  isNSFW: boolean
  isPrivate: boolean
  moderationMode: boolean
  avatarUrl: string | null
  bannerUrl: string | null
  moderatorIds: string[]
  rules: CommunityRule[]
  flairs: CommunityFlair[]
  userMembership: any // define more specifically if needed
  createdAt: string
}

// Define the type for a community membership
export interface CommunityMembership {
  id: string
  communityId: string
  userId: string
  username: string
  role: 'OWNER' | 'MODERATOR' | 'MEMBER'
  status: 'ACTIVE' | 'PENDING' | 'BANNED'
  joinedAt: string | null
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
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt: string
}

export interface MyCommunity {
  communityId: string
  name: string
  role: 'MEMBER' | 'OWNER' | 'MODERATOR'
  description: string
  status: 'PENDING' | 'ACTIVE' | 'LEFT' | 'BANNED'
  communityStatus: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  avatarUrl: string | null
}

export interface CreateCommunityPayload {
  name: string
  description?: string
  isNSFW?: boolean
  isPrivate?: boolean
}

export interface CommunityFlair {
  id: string
  name: string
  color: string
  description: string
}

// payload for creating a new flair (id assigned by server)
export interface CreateCommunityFlairPayload {
  name: string
  description?: string
  color?: string
}

export interface UpdateCommunityPayload {
  name?: string
  description?: string
  isNSFW?: boolean
  isPrivate?: boolean
  moderationMode?: boolean
}

export interface CommunityMember {
  id: string
  userId: string
  communityId: string
  username: string
  role: 'OWNER' | 'MODERATOR' | 'MEMBER' | string
  status: 'ACTIVE' | 'PENDING' | 'BANNED' | string
}

export interface SystemStats {
  id: string
  timestamp: string
  communities: {
    totalCommunities: number
    activeCommunities: number
    suspendedCommunities: number
    deletedCommunities: number
    nsfwCommunities: number
    privateCommunities: number
    newCommunitiesPreviousDay: number
  }
  memberships: {
    totalMemberships: number
    activeMemberships: number
    pendingMemberships: number
    bannedMemberships: number
    removedMemberships: number
    leftMemberships: number
    totalOwners: number
    totalModerators: number
    totalMembers: number
    newMembershipsPreviousDay: number
  }
  content: {
    posts: {
      totalPosts: number
      publishedPosts: number
      draftPosts: number
      nsfwPosts: number
      newPostsPreviousDay: number
    }
    comments: {
      totalComments: number
      newCommentsPreviousDay: number
    }
    votes: {
      totalVotes: number
    }
  }
  reports: {
    totalReports: number
    pendingReports: number
    resolvedReports: number
    dismissedReports: number
    newReportsPreviousDay: number
  }
  moderation: {
    moderationActions: number
    bansIssued: number
    unbansIssued: number
  }
  timestamps: {
    createdAt: string
    updatedAt: string
  }
}

// Community-level stats returned by GET /stats/:communityId
export interface CommunityStats {
  id: string
  communityId: string
  timestamp: string
  members: {
    total: number
    active: number
    pending: number
    banned: number
    moderators: number
    owners: number
    newToday: number
    leftToday: number
  }
  posts: {
    total: number
    published: number
    drafts: number
    nsfw: number
    newToday: number
  }
  comments: {
    total: number
    averagePerPost: number
    removed: number
    newToday: number
  }
  votes: {
    posts: number
    comments: number
  }
  reports: {
    total: number
    pending: number
    resolved: number
    dismissed: number
    newToday: number
  }
  moderation: {
    totalActions: number
    bansIssued: number
    unbansIssued: number
    postsRemoved: number
    commentsRemoved: number
  }
  metadata: {
    createdAt: string
    updatedAt: string
  }
}
