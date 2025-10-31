'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Flame, TrendingUp, Star, Globe } from 'lucide-react'
import CommunitySection from './CommunitySection'
import { communityService } from '@/modules/services/community-service'
import { SearchCommunityResult, MyCommunity } from '@/types/services/community'
import { useAuth } from '@/context/AuthContext' // Import AuthContext

export default function Sidebar() {
  const { user, isLoading } = useAuth() // Check authentication status
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedFeed = searchParams.get('feed') || 'hot' // Default to 'hot' if no feed type is provided

  const feedOptions = [
    { label: 'Hot', value: 'hot', icon: <Flame className='h-5 w-5' /> },
    { label: 'Trending', value: 'trending', icon: <TrendingUp className='h-5 w-5' /> },
    { label: 'Top', value: 'top', icon: <Star className='h-5 w-5' /> },
    { label: 'Global', value: 'global', icon: <Globe className='h-5 w-5' /> },
  ]

  const handleFeedSelection = (feed: 'hot' | 'trending' | 'top' | 'global') => {
    router.push(`/home?feed=${feed}`)
  }

  const [topCommunities, setTopCommunities] = useState<SearchCommunityResult[]>([])
  const [myCommunities, setMyCommunities] = useState<MyCommunity[]>([])
  const [recentCommunities, setRecentCommunities] = useState<SearchCommunityResult[]>([])

  useEffect(() => {
    const fetchTopCommunities = async () => {
      try {
        const response = await communityService.searchCommunities(
          undefined,
          undefined,
          5,
          'members'
        )
        setTopCommunities(response.communities)
      } catch (error) {
        console.error('Failed to fetch top communities:', error)
      }
    }

    const fetchMyCommunities = async () => {
      try {
        const response = await communityService.getMyCommunities({ statuses: ['ACTIVE'] })
        setMyCommunities(response)
      } catch (error) {
        console.error('Failed to fetch my communities:', error)
      }
    }

    const fetchRecentCommunities = async () => {
      try {
        const response = await communityService.fetchRecentCommunities()
        console.log('ayo ', response)
        setRecentCommunities(response)
      } catch (error) {
        console.error('Failed to fetch recent communities:', error)
      }
    }

    fetchTopCommunities()
    if (user && !isLoading) {
      fetchMyCommunities() // Fetch "My Communities" only if the user is authenticated
      fetchRecentCommunities() // Fetch "Recent Communities" only if the user is authenticated
    }
  }, [user, isLoading])

  return (
    <aside className='w-70 bg-muted text-muted-foreground h-screen sticky top-0 flex-shrink-0 pt-8 overflow-y-auto scrollbar-hide px-2'>
      <div className='p-4 space-y-2'>
        {/* Feed Selection */}
        <div>
          {/* <h3 className='text-sm font-bold mb-4'>FEEDS</h3> */}
          <ul className='space-y-2'>
            {feedOptions.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() =>
                    handleFeedSelection(option.value as 'hot' | 'trending' | 'top' | 'global')
                  }
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-all duration-200 ${
                    selectedFeed === option.value
                      ? 'bg-gray-500 text-white'
                      : 'hover:bg-gray-700 hover:text-primary'
                  }`}
                >
                  {option.icon}
                  <span className='text-sm font-medium'>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <hr />

        {/* Recent Communities */}
        {user && !isLoading && (
          <CommunitySection
            title='Recent Communities'
            communities={recentCommunities.map((community) => ({
              id: community.id,
              name: community.name,
              avatarUrl: community.avatarUrl || '/images/default-avatar.png', // Fallback avatar
            }))}
          />
        )}
        <hr />

        {/* Top Communities */}
        <CommunitySection
          title='Top Communities'
          showMoreOption={true}
          communities={topCommunities.map((community) => ({
            id: community.id,
            name: community.name,
            avatarUrl: community.avatarUrl || '/images/default-avatar.png', // Fallback avatar
          }))}
        />
        <hr />

        {/* My Communities */}
        {user && !isLoading && (
          <CommunitySection
            title='My Communities'
            showManageOptions={true}
            communities={myCommunities.map((community) => ({
              id: community.communityId,
              name: community.name,
              avatarUrl: community.avatarUrl || '/images/default-avatar.png', // Fallback avatar
            }))}
          />
        )}
      </div>
    </aside>
  )
}
