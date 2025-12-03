import { postApiClient, communityApiClient } from '@/libs/apiClient'
import {
  CreatePostPayload,
  CreatePostResponse,
  ListCommunityPostsParams,
  ListCommunityPostsResponse,
} from '@/types/services/post'
import type { PostDetails, PostVersion } from '@/types/services/post'
import type { TEditPostSchema } from '@/libs/validators/post-validator'

export async function createPost(
  communityId: string,
  payload: CreatePostPayload,
  signal?: AbortSignal
): Promise<any> {
  const res = await communityApiClient.post<CreatePostResponse>(`/${communityId}/posts`, payload, {
    signal,
  })
  return res.data
}

// Fetch posts in a community (cursor-paged, filterable)
export async function listCommunityPosts(
  communityId: string,
  params?: ListCommunityPostsParams,
  signal?: AbortSignal
): Promise<ListCommunityPostsResponse> {
  // Normalize query to match backend Joi (array or CSV string for types)
  const qp: Record<string, any> = { ...(params || {}) }

  if (qp.cursor == null) delete qp.cursor
  if (qp.q && typeof qp.q === 'string') qp.q = qp.q.trim() || undefined
  if (Array.isArray(qp.types)) qp.types = qp.types.join(',')

  const res = await communityApiClient.get<ListCommunityPostsResponse>(`/${communityId}/posts`, {
    params: qp,
    signal,
  })
  return res.data
}

// Fetch pending posts in a community (cursor-paged, filterable)
export async function listPendingCommunityPosts(
  communityId: string,
  params?: ListCommunityPostsParams,
  signal?: AbortSignal
): Promise<ListCommunityPostsResponse> {
  const qp: Record<string, any> = { ...(params || {}) }

  if (qp.cursor == null) delete qp.cursor
  if (qp.q && typeof qp.q === 'string') qp.q = qp.q.trim() || undefined
  if (Array.isArray(qp.types)) qp.types = qp.types.join(',')

  const res = await communityApiClient.get<ListCommunityPostsResponse>(
    `/${communityId}/posts/pending`,
    {
      params: qp,
      signal,
    }
  )
  return res.data
}

export interface ListUserPostsParams {
  cursor?: string
  limit?: number
  q?: string
  types?: string | string[]
  statuses?: string | string[] // 'DRAFT', 'PENDING', etc.
  communityId?: string
}

export async function listUserPosts(
  params?: ListUserPostsParams,
  signal?: AbortSignal
): Promise<ListCommunityPostsResponse> {
  const qp: Record<string, any> = { ...(params || {}) }

  if (qp.cursor == null) delete qp.cursor
  if (qp.q && typeof qp.q === 'string') qp.q = qp.q.trim() || undefined
  if (Array.isArray(qp.types)) qp.types = qp.types.join(',')
  if (Array.isArray(qp.statuses)) qp.statuses = qp.statuses.join(',')

  const res = await postApiClient.get<ListCommunityPostsResponse>('/me', {
    params: qp,
    signal,
  })
  return res.data
}

export async function getPostById(postId: string, signal?: AbortSignal): Promise<PostDetails> {
  const res = await postApiClient.get<PostDetails>(`/${postId}`, { signal })
  return res.data
}

/**
 * Update (edit) a post by ID.
 * PATCH /api/posts/:postId
 */
export async function updatePost(
  postId: string,
  payload: TEditPostSchema,
  signal?: AbortSignal
): Promise<any> {
  const res = await postApiClient.patch<any>(`/${postId}`, payload, { signal })
  return res.data
}

/**
 * Approve a pending post.
 * POST /api/posts/:postId/approve
 */
export async function approvePost(postId: string, signal?: AbortSignal): Promise<any> {
  const res = await postApiClient.post<any>(`/${postId}/approve`, undefined, { signal })
  return res.data
}

/**
 * Reject a pending post.
 * POST /api/posts/:postId/reject
 * @param reason The reason for rejection
 */
export async function rejectPost(
  postId: string,
  reason: string,
  signal?: AbortSignal
): Promise<any> {
  const res = await postApiClient.post<any>(`/${postId}/reject`, { reason }, { signal })
  return res.data
}

export async function getPostVersions(
  postId: string,
  signal?: AbortSignal
): Promise<PostVersion[]> {
  const res = await postApiClient.get<{ versions: PostVersion[] }>(`/${postId}/versions`, {
    signal,
  })
  return res.data.versions
}
/**
 * Delete a post by ID.
 * DELETE /api/posts/:postId
 * @param postId The ID of the post to delete
 * @param reason Optional reason for deletion
 */
export async function deletePost(
  postId: string,
  reason?: string,
  signal?: AbortSignal
): Promise<any> {
  const res = await postApiClient.delete<any>(`/${postId}`, {
    data: reason ? { reason } : undefined,
    signal,
  })
  return res.data
}

export type PostVoteType = 'UPVOTE' | 'DOWNVOTE'

export async function votePost(
  postId: string,
  type: PostVoteType,
  signal?: AbortSignal
): Promise<PostDetails> {
  const res = await postApiClient.post<PostDetails>(`/${postId}/vote`, { type }, { signal })
  return res.data
}

export async function unvotePost(postId: string, signal?: AbortSignal): Promise<PostDetails> {
  const res = await postApiClient.delete<PostDetails>(`/${postId}/vote`, { signal })
  return res.data
}

export interface UserVote {
  postId: string
  vote: 'UPVOTE' | 'DOWNVOTE' | null
}

/**
 * Fetch user's current vote for a post or multiple posts.
 * GET /api/posts/votes
 * @param postIds A list of post IDs (array of strings)
 * @param signal Optional AbortSignal for request cancellation
 * @returns A list of votes for the specified posts
 */
export async function fetchUserVotes(postIds: string[], signal?: AbortSignal): Promise<UserVote[]> {
  const csvPostIds = postIds.join(',') // Convert the list of post IDs into a CSV string
  const res = await postApiClient.get<{ votes: UserVote[] }>('/votes', {
    params: { postIds: csvPostIds },
    signal,
  })
  return res.data.votes
}

/**
 * Fetch user's recently viewed posts.
 * GET /api/posts/recent
 * @param signal Optional AbortSignal for request cancellation
 * @returns A list of recently viewed posts
 */
export async function fetchRecentPosts(signal?: AbortSignal): Promise<PostDetails[]> {
  const res = await postApiClient.get<{ posts: PostDetails[] }>('/recent', { signal })
  return res.data.posts
}

// Add to your export:
export const postService = {
  createPost,
  listCommunityPosts,
  listPendingCommunityPosts,
  listUserPosts,
  getPostById,
  updatePost,
  approvePost,
  rejectPost,
  getPostVersions,
  deletePost,
  votePost,
  unvotePost,
  fetchUserVotes,
  fetchRecentPosts,
}
