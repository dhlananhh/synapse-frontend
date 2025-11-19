import { reportApiClient } from '@/libs/apiClient'
import {
  FetchReportedPostsResponse,
  FetchReportedCommentsResponse,
  ResolvedItemsResponse,
} from '@/types/services/report'

/**
 * Submit a report to the backend.
 * @param payload - The report payload adhering to the validation schema.
 * @returns The response from the backend (type `any` for now).
 */
export const submitReport = async (payload: {
  communityId: string
  targetType: 'POST' | 'COMMENT' | 'MEMBERSHIP'
  targetId: string
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
  reasonDetail?: string
}): Promise<any> => {
  try {
    const response = await reportApiClient.post('/', payload)
    return response.data
  } catch (error) {
    console.error('Error submitting report:', error)
    throw error
  }
}

/**
 * Fetch reported posts from the backend.
 * @param query - The query parameters adhering to the validation schema.
 * @returns The response containing reported posts and pagination details.
 */
export const fetchReportedPosts = async (query: {
  communityId: string
  page?: number
  limit?: number
}): Promise<FetchReportedPostsResponse> => {
  try {
    const response = await reportApiClient.get('/posts', { params: query })
    return response.data
  } catch (error) {
    console.error('Error fetching reported posts:', error)
    throw error
  }
}

/**
 * Fetch reported comments from the backend.
 * @param query - The query parameters adhering to the validation schema.
 * @returns The response containing reported comments and pagination details.
 */
export const fetchReportedComments = async (query: {
  communityId: string
  page?: number
  limit?: number
}): Promise<FetchReportedCommentsResponse> => {
  try {
    const response = await reportApiClient.get('/comments', { params: query })
    return response.data
  } catch (error) {
    console.error('Error fetching reported comments:', error)
    throw error
  }
}

/**
 * Resolve a reported item in the backend.
 * @param payload - The payload adhering to the `resolveReportSchema`.
 * @returns The response from the backend (type `any` for now).
 */
export const resolveReportedItem = async (payload: {
  communityId: string
  targetType: 'POST' | 'COMMENT'
  targetId: string
  action: 'NONE' | 'FLAGGED' | 'WARNED' | 'LOCKED' | 'REMOVED_MOD'
  reason?: string
}): Promise<any> => {
  try {
    const response = await reportApiClient.post('/resolve', payload)
    return response.data
  } catch (error) {
    console.error('Error resolving reported item:', error)
    throw error
  }
}

/**
 * Dismiss a reported item in the backend.
 * @param payload - The payload adhering to the `dismissReportSchema`.
 * @returns The response from the backend (type `any` for now).
 */
export const dismissReportedItem = async (payload: {
  communityId: string
  targetType: 'POST' | 'COMMENT'
  targetId: string
  reason?: string
}): Promise<any> => {
  try {
    const response = await reportApiClient.post('/dismiss', payload)
    return response.data
  } catch (error) {
    console.error('Error dismissing reported item:', error)
    throw error
  }
}

/**
 * Fetch resolved items from the backend.
 * @param query - The query parameters adhering to the `fetchResolvedItemsSchema`.
 * @returns The response containing resolved items and pagination details.
 */
export const fetchResolvedItems = async (query: {
  communityId: string
  cursor?: string | null
  limit?: number
  actions?: string // CSV string of actions (e.g., "REMOVED_MOD,LOCKED,NONE")
  targetTypes?: string // CSV string of target types (e.g., "POST,COMMENT,MEMBERSHIP")
}): Promise<ResolvedItemsResponse> => {
  const { communityId, cursor = null, limit = 20, actions, targetTypes } = query

  try {
    const params: Record<string, any> = { communityId, cursor, limit }
    if (actions) params.actions = actions
    if (targetTypes) params.targetTypes = targetTypes

    const response = await reportApiClient.get('/resolved', { params })
    const data = response.data

    // Normalize backend shapes:
    // - prefer `items` if present
    // - fallback to `resolved`
    // - fallback to top-level array (unlikely) -> wrap
    const items: any[] = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.resolved)
      ? data.resolved
      : Array.isArray(data)
      ? data
      : []

    const pagination = data?.pagination ?? { // keep shape compatible with ResolvedItemsResponse
      nextCursor: null,
      hasMore: false,
    }

    return {
      items,
      pagination,
    }
  } catch (error) {
    console.error('Error fetching resolved items:', error)
    throw error
  }
}

/**
 * Restore a previously resolved target in the backend.
 * @param payload - The payload adhering to the `restoreResolvedTargetSchema`.
 * @returns The response from the backend (type `any` for now).
 */
export const restoreResolvedTarget = async (payload: {
  communityId: string
  targetType: 'POST' | 'COMMENT'
  targetId: string
  reason?: string | null
}): Promise<any> => {
  try {
    const response = await reportApiClient.post('/restore', payload)
    return response.data
  } catch (error) {
    console.error('Error restoring resolved target:', error)
    throw error
  }
}
