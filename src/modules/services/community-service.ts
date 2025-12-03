import { communityApiClient } from '@/libs/apiClient'
import type { MyCommunity, SystemStats } from '@/types/services/community'
import {
  Community,
  CommunityFlair,
  CommunityMembership,
  CommunityRule,
  CreateCommunityPayload,
  UpdateCommunityPayload,
  CommunityMember,
  CreateCommunityFlairPayload,
  CreateCommunityRulePayload,
  UpdateCommunityRulePayload,
  SearchCommunityResult,
  CommunityStats,
} from '@/types/services/community'

export const communityService = {
  // Search communities with cursor-based paging
  searchCommunities: (
    q?: string,
    cursor?: string,
    limit = 20,
    sort: 'newest' | 'oldest' | 'members' | 'posts' | 'name' = 'newest'
  ): Promise<{
    communities: SearchCommunityResult[]
    pagination: { hasMore: boolean; nextCursor: string | null }
  }> => {
    return communityApiClient
      .get(`/`, { params: { q, cursor, limit, sort } })
      .then((res) => res.data)
  },

  // Search communities with cursor-based paging FOR ADMIN
  searchCommunitiesAdmin: (
    q?: string,
    cursor?: string,
    limit = 20,
    sort: 'newest' | 'oldest' | 'members' | 'posts' | 'name' = 'newest',
    statuses?: ('ACTIVE' | 'SUSPENDED' | 'DELETED' | 'ALL')[]
  ): Promise<{
    communities: SearchCommunityResult[]
    pagination: { hasMore: boolean; nextCursor: string | null }
  }> => {
    const allowed = new Set(['ACTIVE', 'SUSPENDED', 'DELETED', 'ALL'])
    let statusesCsv: string | undefined

    if (Array.isArray(statuses) && statuses.length > 0) {
      const filtered = statuses.filter((s) => allowed.has(s))
      // if 'ALL' is present, prefer 'ALL' as the single value
      if (filtered.includes('ALL')) {
        statusesCsv = 'ALL'
      } else if (filtered.length > 0) {
        statusesCsv = filtered.join(',')
      }
    }

    const params: Record<string, any> = { q, cursor, limit, sort }
    if (statusesCsv) params.statuses = statusesCsv

    return communityApiClient.get(`/admin`, { params }).then((res) => res.data)
  },

  // Fetch community details by name
  getCommunityByName: (name: string): Promise<Community> =>
    communityApiClient.get(`/${name}`).then((res) => res.data.community),

  getMembership: async (communityName: string): Promise<CommunityMembership | null> => {
    try {
      const res = await communityApiClient.get(`/${communityName}/members/me`)
      return res.data
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        return null // No membership found
      }
      throw err // Other errors should still throw
    }
  },

  // Create a new community
  createCommunity: (payload: CreateCommunityPayload): Promise<Community> =>
    communityApiClient.post(`/`, payload).then((res) => res.data.community),

  // Update community details (PUT /{communityId})
  updateCommunity: (communityId: string, payload: UpdateCommunityPayload): Promise<Community> =>
    communityApiClient.put(`/${communityId}`, payload).then((res) => res.data.community),

  // Update community avatar (multipart/form-data, field name "avatar")
  updateAvatar: (communityId: string, file: File): Promise<any> => {
    const form = new FormData()
    form.append('avatar', file)
    return communityApiClient
      .put(`/${communityId}/avatar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },

  // Update community banner (multipart/form-data, field name "banner")
  updateBanner: (communityId: string, file: File): Promise<any> => {
    const form = new FormData()
    form.append('banner', file)
    return communityApiClient
      .put(`/${communityId}/banner`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },

  /**
   * Suspend a community (admin)
   * POST /{communityId}/suspend
   */
  suspendCommunity: (communityId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/suspend`).then((res) => res.data),

  /**
   * Reactivate a suspended community (admin)
   * POST /{communityId}/reactivate
   */
  reactivateCommunity: (communityId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/reactivate`).then((res) => res.data),

  // Delete a community
  deleteCommunity: (id: string): Promise<void> =>
    communityApiClient.delete(`/${id}`).then((res) => res.data),

  // Join community
  joinCommunity: (communityId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/members`).then((res) => res.data),

  // Cancel join request
  cancelJoinRequest: (communityId: string): Promise<any> =>
    communityApiClient.delete(`/${communityId}/members/me/cancel`).then((res) => res.data),

  // Leave community
  leaveCommunity: (communityId: string): Promise<any> =>
    communityApiClient.delete(`/${communityId}/members/me/leave`).then((res) => res.data),

  // Fetch flairs for a community
  getFlairs: (communityId: string): Promise<CommunityFlair[]> =>
    communityApiClient.get(`/${communityId}/flairs`).then((res) => {
      const data = res.data
      return data.flairs
    }),

  // Create a new flair for a community
  // POST /{communityId}/flairs
  // returns the created CommunityFlair (supports APIs returning { flair: {...} } or the flair object)
  createFlair: (
    communityId: string,
    payload: CreateCommunityFlairPayload
  ): Promise<CommunityFlair> =>
    communityApiClient.post(`/${communityId}/flairs`, payload).then((res) => {
      const data = res.data
      return data.flair
    }),

  // Update an existing flair for a community
  // PUT /{communityId}/flairs/{flairId}
  // payload: { name, description?, color? } (same validation as create)
  // returns the updated CommunityFlair (supports { flair: {...} } or the flair object)
  updateFlair: (
    communityId: string,
    flairId: string,
    payload: CreateCommunityFlairPayload
  ): Promise<CommunityFlair> =>
    communityApiClient.put(`/${communityId}/flairs/${flairId}`, payload).then((res) => {
      const data = res.data
      return data?.flair ?? data
    }),

  // Delete a flair
  // DELETE /{communityId}/flairs/{flairId}
  deleteFlair: (communityId: string, flairId: string): Promise<void> =>
    communityApiClient.delete(`/${communityId}/flairs/${flairId}`).then(() => undefined),

  // Fetch rules for a community
  getRules: (communityId: string): Promise<CommunityRule[]> =>
    communityApiClient.get(`/${communityId}/rules`).then((res) => {
      const data = res.data
      return data.rules
    }),

  // Create a new rule for a community
  // POST /{communityId}/rules
  // payload: { title, description? }
  // returns the created CommunityRule (supports APIs returning { rule: {...} } or the rule object)
  createRule: (communityId: string, payload: CreateCommunityRulePayload): Promise<CommunityRule> =>
    communityApiClient.post(`/${communityId}/rules`, payload).then((res) => {
      const data = res.data
      return data?.rule ?? data
    }),

  // Update an existing rule for a community
  // PUT /{communityId}/rules/{ruleId}
  // payload: { title?, description? } (must provide at least one)
  // returns the updated CommunityRule (supports { rule: {...} } or the rule object)
  updateRule: (
    communityId: string,
    ruleId: string,
    payload: UpdateCommunityRulePayload
  ): Promise<CommunityRule> =>
    communityApiClient.put(`/${communityId}/rules/${ruleId}`, payload).then((res) => {
      const data = res.data
      return data?.rule ?? data
    }),

  // Delete a rule
  // DELETE /{communityId}/rules/{ruleId}
  deleteRule: (communityId: string, ruleId: string): Promise<void> =>
    communityApiClient.delete(`/${communityId}/rules/${ruleId}`).then(() => undefined),

  // Find members in a community with optional query params
  // params: { q?: string; role?: string; cursor?: string | null; limit?: number }
  // Expects server response shape like: { members: [...], pagination: { hasMore, nextCursor } }
  getMembers: (
    communityId: string,
    params?: { q?: string; role?: string; cursor?: string | null; limit?: number }
  ): Promise<{
    members: CommunityMember[]
    pagination?: { hasMore: boolean; nextCursor: string | null }
  }> => communityApiClient.get(`/${communityId}/members`, { params }).then((res) => res.data),

  /**
   * Get communities the current user is a member of or has left.
   * GET /me
   * Accepts: statuses?: ('ACTIVE' | 'LEFT')[]
   * Returns: MyCommunity[]
   */
  getMyCommunities: (params?: { statuses?: ('ACTIVE' | 'LEFT')[] }): Promise<MyCommunity[]> =>
    communityApiClient
      .get('/me', {
        params:
          params?.statuses && params.statuses.length > 0
            ? { statuses: params.statuses.join(',') }
            : undefined,
      })
      .then((res) => {
        // The response is expected to be an array of MyCommunity objects
        return Array.isArray(res.data.items) ? res.data.items : []
      }),

  // Fetch communities for a specific user (GET /user/:userId)
  // Accepts optional statuses?: ('PENDING' | 'ACTIVE' | 'BANNED')[]
  getUserCommunities: (
    userId: string,
    params?: { statuses?: ('PENDING' | 'ACTIVE' | 'BANNED')[] }
  ): Promise<MyCommunity[]> =>
    communityApiClient
      .get(`/user/${userId}`, {
        params:
          params?.statuses && params.statuses.length > 0
            ? { statuses: params.statuses.join(',') }
            : undefined,
      })
      .then((res) => {
        return Array.isArray(res.data.items) ? res.data.items : []
      }),

  // Get pending requests
  // GET {communityId}/members/pending
  getPendingRequests: (
    communityId: string,
    params?: {
      cursor?: string | null
      limit?: number
    }
  ): Promise<any> =>
    communityApiClient.get(`${communityId}/members/pending`, { params }).then((res) => res.data),

  // Approve join request
  // POST /{communityId}/members/{userId}/approve
  approveJoinRequest: (communityId: string, userId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/members/${userId}/approve`).then((res) => res.data),

  // Reject join request
  // POST /{communityId}/members/{userId}/reject
  rejectJoinRequest: (
    communityId: string,
    userId: string,
    params?: {
      reason?: string | null
    }
  ): Promise<any> =>
    communityApiClient
      .post(`/${communityId}/members/${userId}/reject`, {
        reason: params?.reason ?? null,
      })
      .then((res) => res.data),

  // Promote a member to moderator
  // POST /{communityId}/members/{userId}/promote
  promoteMember: (
    communityId: string,
    userId: string,
    params?: { reason?: string | null }
  ): Promise<any> =>
    communityApiClient
      .post(`/${communityId}/members/${userId}/promote`, {
        reason: params?.reason?.trim() ? params.reason.trim() : null,
      })
      .then((res) => res.data),

  // Demote a moderator to member
  // POST /{communityId}/members/${userId}/demote
  demoteMember: (
    communityId: string,
    userId: string,
    params?: { reason?: string | null }
  ): Promise<any> =>
    communityApiClient
      .post(`/${communityId}/members/${userId}/demote`, {
        reason: params?.reason?.trim() ? params.reason.trim() : null,
      })
      .then((res) => res.data),

  // Ban a member
  // POST /{communityId}/members/{userId}/ban
  banMember: (
    communityId: string,
    userId: string,
    params?: { reason?: string | null }
  ): Promise<any> =>
    communityApiClient
      .post(`/${communityId}/members/${userId}/ban`, {
        reason: params?.reason?.trim() ? params.reason.trim() : null,
      })
      .then((res) => res.data),

  // Unban a user
  // POST /{communityId}/members/{userId}/unban
  unbanMember: (
    communityId: string,
    userId: string,
    params?: { reason?: string | null }
  ): Promise<any> =>
    communityApiClient
      .post(`/${communityId}/members/${userId}/unban`, {
        reason: params?.reason?.trim() ? params.reason.trim() : null,
      })
      .then((res) => res.data),

  // Remove a member
  // POST /{communityId}/members/{userId}/remove
  removeMember: (
    communityId: string,
    userId: string,
    params?: { reason?: string | null }
  ): Promise<any> =>
    communityApiClient
      .post(`/${communityId}/members/${userId}/remove`, {
        reason: params?.reason?.trim() ? params.reason.trim() : null,
      })
      .then((res) => res.data),

  // Get banned members
  // GET {communityId}/members/banned
  getBannedMembers: (
    communityId: string,
    params?: { q?: string; cursor?: string | null; limit?: number }
  ): Promise<{
    members: CommunityMember[]
    pagination?: { hasMore: boolean; nextCursor: string | null }
  }> =>
    communityApiClient.get(`/${communityId}/members/banned`, { params }).then((res) => res.data),

  /**
   * Fetch user's recently visited communities.
   * GET /recent
   * @param signal Optional AbortSignal for request cancellation
   * @returns A list of recently visited communities
   */
  fetchRecentCommunities: async (signal?: AbortSignal): Promise<SearchCommunityResult[]> => {
    const res = await communityApiClient.get<{ communities: SearchCommunityResult[] }>('/recent', {
      signal,
    })
    return res.data.communities
  },

  /**
   * Fetch system-wide community stats.
   * GET /stats/system
   * @returns A Promise resolving to the system-wide stats data.
   */
  fetchSystemStats: (): Promise<SystemStats> => {
    return communityApiClient.get('/stats/system').then((res) => res.data)
  },

  /**
   * Fetch stats for a specific community.
   * GET /stats/{communityId}
   * @param communityId community identifier
   * @returns CommunityStats
   */
  getCommunityStats: (communityId: string): Promise<CommunityStats> =>
    communityApiClient.get(`/stats/${communityId}`).then((res) => res.data),
}
