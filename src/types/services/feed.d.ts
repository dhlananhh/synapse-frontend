export interface FeedItem {
  postId: string
  community: {
    communityId: string
    name: string
    avatarUrl: string | null
  }
  authorId: string
  flairId: string | null
  title: string
  contentPreview: string
  status: 'PUBLISHED' | 'DRAFT' | 'DELETED'
  type: 'TEXT' | 'MEDIA' | 'LINK'
  media: {
    key: string
    url: string
  }[] // Media objects with key and URL
  links: {
    url: string
    title: string
    description: string
    thumbnail: string | null
  }[] // Links with metadata
  userTags: string[]
  isOC: boolean
  isNSFW: boolean
  isSpoiler: boolean
  createdAt: string
  updatedAt: string
  scores: {
    score: number
    hotScore: number
    trendScore: number
    rankingWeight: number
  }
  metrics: {
    upvotes: number
    downvotes: number
    commentCount: number
    viewCount: number
    shareCount: number
    saveCount: number
    lastActivity: string | null
    firstSeenAt: string | null
  }
}

export interface FeedResponse {
  feeds: FeedItem[]
  pagination: {
    hasMore: boolean
    nextCursor: string | null
  }
}
