'use client'

import React, { useEffect, useState } from 'react'
import { fetchFeed } from '@/modules/services/feed-service'
import { fetchUserVotes } from '@/modules/services/post-service'
import FeedItem from './FeedItem'
import { FeedItem as FeedItemType, FeedResponse } from '@/types/services/feed'
import { useAuth } from '@/context/AuthContext'
import { useCommunity, useCommunityFlairs } from '@/context/CommunityContext'
import type { CommunityFlair } from '@/types/services/community'

interface FeedListProps {
  type?: 'hot' | 'trending' | 'top' | 'global'
  communityId?: string
  flairId?: string
  showFlair?: boolean
}

export default function FeedList({
  type = 'global',
  communityId,
  flairId,
  showFlair,
}: FeedListProps) {
  const { user, isLoading } = useAuth() // Check authentication status
  const [feed, setFeed] = useState<FeedItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<string, 'UPVOTE' | 'DOWNVOTE' | null>>({}) // Store votes by postId

  // determine if we're inside a community context
  const community = useCommunity()
  const inCommunity = Boolean(community) || Boolean(communityId)
  const shouldShowFlair = showFlair ?? inCommunity

  // grab flairs from context (empty array if not in community)
  const flairs = useCommunityFlairs()
  const flairMap = (flairs as CommunityFlair[]).reduce((acc, f) => {
    acc[f.id] = f
    return acc
  }, {} as Record<string, CommunityFlair>)

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: FeedResponse = await fetchFeed({ type, communityId, flairId })
        setFeed(response.feeds)

        // Fetch user votes if authenticated
        if (user && !isLoading) {
          const postIds = response.feeds.map((item) => item.postId)
          const userVotes = await fetchUserVotes(postIds)
          const votesMap = userVotes.reduce((acc, vote) => {
            acc[vote.postId] = vote.vote
            return acc
          }, {} as Record<string, 'UPVOTE' | 'DOWNVOTE' | null>)
          setVotes(votesMap)
        }
      } catch (err) {
        setError('Failed to load feed.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadFeed()
  }, [type, communityId, flairId, user, isLoading])

  if (loading) {
    return <p>Loading feed...</p>
  }

  if (error) {
    return <p className='text-red-500'>{error}</p>
  }

  if (feed.length === 0) {
    return <p>No feed items available.</p>
  }

  return (
    <div className='space-y-4 overflow-y-auto'>
      {feed.map((item) => (
        <FeedItem
          key={item.postId}
          item={item}
          initialVote={votes[item.postId] || null}
          flair={
            shouldShowFlair ? (item.flairId ? flairMap[item.flairId] ?? null : null) : undefined
          }
        />
      ))}
    </div>
  )
}
