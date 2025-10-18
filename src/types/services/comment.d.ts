export interface Comment {
  id: string
  authorId: string
  parentCommentId: string
  status: 'PUBLISHED' | 'REMOVED_MOD' | 'REMOVED_AUTHOR'
  createdAt: string
  isEdited: boolean
  hasReplies: boolean
  score: number
  content: string
  currentUserVote: 'UPVOTE' | 'DOWNVOTE' | null
}

export interface FetchCommentsResponse {
  comments: Comment[]
  pagination: {
    hasMore: boolean
    nextCursor: string
  }
}

export interface CreateCommentPayload {
  postId: string
  parentCommentId?: string | null
  content: string
}

export interface EditCommentPayload {
  content: string
}
