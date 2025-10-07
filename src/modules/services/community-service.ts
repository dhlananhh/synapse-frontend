import { communityApiClient } from '@/libs/apiClient'
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
} from '@/types/services/community'
import { SearchCommunityResult } from '@/types/services/community'

export const communityService = {

  // ==============================
  // Community
  // ==============================

  // Search communities with cursor-based paging
  searchCommunities: (
    q: string,
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

  // Get communities list
  getCommunities: (): Promise<any> => {
    return communityApiClient.get(`/`).then(res => res.data);
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

  //   // Delete a community
  //   deleteCommunity: (id: string): Promise<void> =>
  //     communityApiClient.delete(`/${id}`).then((res) => res.data),


  // =================================
  // Membership Management
  // =================================

  // Join community
  joinCommunity: (communityId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/members`).then((res) => res.data),

  // Cancel join request
  cancelJoinRequest: (communityId: string): Promise<any> =>
    communityApiClient.delete(`/${communityId}/members/me/cancel`).then((res) => res.data),

  // Leave community
  leaveCommunity: (communityId: string): Promise<any> =>
    communityApiClient.delete(`/${communityId}/members/me/leave`).then((res) => res.data),

  // Get pending requests
  // GET {communityId}/members/pending
  getPendingRequests: (
    communityId: string,
    params?: {
      cursor?: string | null;
      limit?: number;
    }
  ): Promise<any> =>
    communityApiClient.get(`${communityId}/members/pending`, { params }).then((res) => res.data),

  // Get banned members
  // GET {communityId}/members/banned
  getBannedMembers: (
    communityId: string,
    params?: {
      cursor?: string | null;
      limit?: number;
    }
  ): Promise<any> => communityApiClient.get(`${communityId}/members/banned`, { params }).then((res) => res.data),

  // Approve join request
  // POST /{communityId}/members/{userId}/approve
  approveJoinRequest: (communityId: string, userId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/members/${userId}/approve`).then(res => res.data),

  // Reject join request
  // POST /{communityId}/members/{userId}/reject
  rejectJoinRequest: (communityId: string, userId: string): Promise<any> =>
    communityApiClient.post(`/${communityId}/members/${userId}/reject`).then(res => res.data),

  // ==============================
  // Community Flairs
  // ==============================

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

  // ==============================
  // Community Rules
  // ==============================

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

}
