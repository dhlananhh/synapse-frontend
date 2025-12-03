import { feedApiClient } from '@/libs/apiClient'
import { FeedResponse } from '@/types/services/feed'

interface FetchFeedParams {
  type?: 'hot' | 'trending' | 'top' | 'global'
  communityId?: string
  flairId?: string
  nsfw?: boolean
  limit?: number
  cursor?: string
  timeRange?: '24h' | '7d' | '30d'
}

/**
 * Fetch a feed from the server.
 * @param params - Query parameters for the feed request.
 * @returns The feed response containing feed items and pagination info.
 */
export const fetchFeed = async (params: FetchFeedParams): Promise<FeedResponse> => {
  try {
    const response = await feedApiClient.get<FeedResponse>('/', {
      params: {
        type: params.type || 'global',
        communityId: params.communityId,
        flairId: params.flairId,
        nsfw: params.nsfw ?? true,
        limit: params.limit ?? 20,
        cursor: params.cursor,
        timeRange: params.timeRange,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching feed:', error)
    throw error
  }
}
