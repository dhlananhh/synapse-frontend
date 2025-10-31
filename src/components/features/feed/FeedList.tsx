'use client'

import React, { useEffect, useState } from 'react'
import { fetchFeed } from '@/modules/services/feed-service'
import { fetchUserVotes } from '@/modules/services/post-service'
import FeedItem from './FeedItem'
import { FeedItem as FeedItemType, FeedResponse } from '@/types/services/feed'
import { useAuth } from '@/context/AuthContext'

interface FeedListProps {
  type?: 'hot' | 'trending' | 'top' | 'global'
  communityId?: string
  flairId?: string
}

export default function FeedList({ type = 'global', communityId, flairId }: FeedListProps) {
  const { user, isLoading } = useAuth() // Check authentication status
  const [feed, setFeed] = useState<FeedItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<string, 'UPVOTE' | 'DOWNVOTE' | null>>({}) // Store votes by postId

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
        <FeedItem key={item.postId} item={item} initialVote={votes[item.postId] || null} />
      ))}
    </div>
  )
}
