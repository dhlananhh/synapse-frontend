'use client'

import React, { useEffect, useState } from 'react'
import { fetchResolvedItems } from '@/modules/services/report-service'
import type { ResolvedItemsResponse, ResolvedItem } from '@/types/services/report'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import CommunityPostsTab from './CommunityPostTab'
import CommunityMembersTab from './CommunityMembersTab'
import CommunityModerationsTab from './CommunityModerationsTab'
import CommunityStatsTab from './CommunityStatsTab'

type Props = {
  communityId: string
  communityName?: string
  limit?: number
}

type TabKey = 'posts' | 'members' | 'moderations' | 'stats'

/**
 * Shows community activity in tabs:
 * - Posts: recent posts (chronological desc)
 * - Members: membership list + membership resolved items
 * - Moderations: resolved POST and COMMENT items
 */
export default function CommunityActivityLog({ communityId, communityName, limit = 20 }: Props) {
  const [tab, setTab] = useState<TabKey>('posts')

  // moderation tab is handled inside CommunityModerationsTab

  // Layout: fixed height, scrollable content area
  return (
    <div className='h-[60vh] min-h-[300px] max-h-[80vh] overflow-hidden flex flex-col rounded-md border p-3'>
      {/* Tabs header */}
      <div className='flex-shrink-0 flex items-center gap-2 mb-2'>
        <button
          className={`px-3 py-1 rounded ${
            tab === 'posts' ? 'bg-muted text-white' : 'bg-transparent'
          }`}
          onClick={() => setTab('posts')}
        >
          Posts
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === 'members' ? 'bg-muted text-white' : 'bg-transparent'
          }`}
          onClick={() => setTab('members')}
        >
          Members
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === 'moderations' ? 'bg-muted text-white' : 'bg-transparent'
          }`}
          onClick={() => setTab('moderations')}
        >
          Moderations
        </button>

        <button
          className={`px-3 py-1 rounded ${
            tab === 'stats' ? 'bg-muted text-white' : 'bg-transparent'
          }`}
          onClick={() => setTab('stats')}
        >
          Stats
        </button>
      </div>

      {/* Scrollable content area */}
      <div className='flex-1 overflow-auto pr-2 space-y-4 mt-4'>
        {tab === 'posts' && (
          <>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Recent posts</h3>
              <Badge />
            </div>

            <CommunityPostsTab
              communityId={communityId}
              communityName={communityName}
              limit={limit}
            />
          </>
        )}

        {tab === 'members' && (
          <>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Members</h3>
              <Badge />
            </div>

            <CommunityMembersTab communityId={communityId} limit={limit} />
          </>
        )}

        {tab === 'moderations' && (
          <>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Moderation / Resolved items</h3>
              <Badge />
            </div>
            <CommunityModerationsTab communityId={communityId} limit={limit} />
          </>
        )}

        {tab === 'stats' && (
          <>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Community daily statistics</h3>
              <Badge />
            </div>
            <CommunityStatsTab communityId={communityId} />
          </>
        )}
      </div>
    </div>
  )
}
