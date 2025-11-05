export interface ReportedPost {
  id: string
  title: string
  authorId: string
  communityId: string
  createdAt: string
  updatedAt: string
  totalReports: number
  reasonProportions: {
    reason:
      | 'SPAM'
      | 'HARASSMENT'
      | 'HATE_SPEECH'
      | 'NSFW_CONTENT'
      | 'VIOLENCE'
      | 'MISINFORMATION'
      | 'ILLEGAL_ACTIVITY'
      | 'SELF_HARM'
      | 'IMPERSONATION'
      | 'COPYRIGHT'
      | 'OFF_TOPIC'
      | 'OTHER'
    count: number
    proportion: number
  }[]
  lastReportAt: string
  reasonDetails: string[]
}

export interface ReportedComment {
  id: string
  content: string // Different from `ReportedPost` (uses `content` instead of `title`)
  authorId: string
  communityId: string
  createdAt: string
  updatedAt: string
  totalReports: number
  reasonProportions: {
    reason:
      | 'SPAM'
      | 'HARASSMENT'
      | 'HATE_SPEECH'
      | 'NSFW_CONTENT'
      | 'VIOLENCE'
      | 'MISINFORMATION'
      | 'ILLEGAL_ACTIVITY'
      | 'SELF_HARM'
      | 'IMPERSONATION'
      | 'COPYRIGHT'
      | 'OFF_TOPIC'
      | 'OTHER'
    count: number
    proportion: number
  }[]
  lastReportAt: string
  reasonDetails: string[]
}

export interface Pagination {
  totalItems: number
  totalPages: number
  currentPage: number
  hasMore: boolean
}

export interface FetchReportedPostsResponse {
  posts: ReportedPost[]
  pagination: Pagination
}

export interface FetchReportedCommentsResponse {
  comments: ReportedComment[]
  pagination: Pagination
}

export interface ResolvedItemTarget {
  id: string
  type: 'POST' | 'COMMENT' | 'MEMBERSHIP'
  authorId: string
  status: string
  createdAt: string
  postId: string | null
  title: string | null
  content: string | null
}

export interface ResolvedItem {
  id: string
  action: string
  actorId: string
  reason: string | null
  resolvedAt: string
  target: ResolvedItemTarget
}

export interface ResolvedItemsResponse {
  items: ResolvedItem[]
  pagination: {
    nextCursor: string | null
    hasMore: boolean
  }
}
