import { commentApiClient } from '@/libs/apiClient'
import type {
  Comment,
  CreateCommentPayload,
  EditCommentPayload,
  FetchCommentsResponse,
} from '@/types/services/comment'

export async function fetchPostComments(
  postId: string,
  cursor?: string,
  limit?: number
): Promise<FetchCommentsResponse> {
  const params = new URLSearchParams({ postId })
  if (cursor) params.append('cursor', cursor)
  if (limit) params.append('limit', limit.toString())

  const res = await commentApiClient.get(`/?${params.toString()}`)
  return res.data
}

export async function fetchCommentReplies(
  parentCommentId: string,
  cursor?: string,
  limit?: number
): Promise<FetchCommentsResponse> {
  const params = new URLSearchParams()
  if (cursor) params.append('cursor', cursor)
  if (limit) params.append('limit', limit.toString())

  const res = await commentApiClient.get(
    `/${parentCommentId}/replies${params.toString() ? `?${params.toString()}` : ''}`
  )
  return res.data
}

export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
  const res = await commentApiClient.post('/', payload)
  return res.data
}

export async function editComment(
  commentId: string,
  payload: EditCommentPayload
): Promise<Comment> {
  const res = await commentApiClient.patch(`/${commentId}`, payload)
  return res.data
}

export async function deleteComment(commentId: string, reason?: string): Promise<void> {
  const config = reason ? { data: { reason } } : undefined
  await commentApiClient.delete(`/${commentId}`, config)
}

// VOTING
export type VoteType = 'UPVOTE' | 'DOWNVOTE'

export async function voteComment(commentId: string, type: VoteType): Promise<Comment> {
  const res = await commentApiClient.post(`/${commentId}/vote`, { type })
  return res.data
}

export async function unvoteComment(commentId: string): Promise<Comment> {
  const res = await commentApiClient.delete(`/${commentId}/vote`)
  return res.data
}

// Fetch the context chain for a comment (top-level ancestor -> ... -> target)
export async function fetchCommentContext(commentId: string): Promise<Comment[]> {
  const res = await commentApiClient.get(`/${commentId}/context`)
  return res.data
}
