'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Post } from '@/types'
import { fetchPosts } from '@/libs/mock-api'
import { useAuth } from '@/context/AuthContext'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import PostCard from '@/components/features/post/PostCard'
import PostFeedSkeleton from '@/components/features/post/PostFeedSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { Telescope, Loader2 } from 'lucide-react'
import { PATHS } from '@/libs/paths'

interface CommunityPostFeedProps {
  communityId: string
  flairId?: string | null
}

export default function CommunityPostFeed({ communityId, flairId }: CommunityPostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  // const { isBlocked } = useAuth()

  const loadPosts = useCallback(
    async (isNewFilter = false) => {
      setIsLoading(true)
      const pageToFetch = isNewFilter ? 1 : page

      try {
        const { data: newPosts, hasMore: newHasMore } = await fetchPosts(pageToFetch, 'hot', [], {
          filterByCommunityId: communityId,
          filterByFlairId: flairId || undefined,
        })
        setPosts((prev) => (isNewFilter ? newPosts : [...prev, ...newPosts]))
        setPage(pageToFetch + 1)
        setHasMore(newHasMore)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    },
    [communityId, flairId, page]
  )

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    loadPosts(true)
  }, [communityId, flairId, loadPosts])

  const { lastElementRef } = useIntersectionObserver({
    onIntersect: () => loadPosts(false),
    isLoading,
    hasMore,
  })

  if (isLoading && page === 1) {
    return <PostFeedSkeleton />
  }

  // const visiblePosts = posts.filter((post) => !isBlocked(post.author.id))

  // if (visiblePosts.length === 0) {
  //   return (
  //     <EmptyState
  //       Icon={Telescope}
  //       title={flairId ? 'No Posts with this Flair' : 'Be the First to Post'}
  //       description={
  //         flairId
  //           ? 'There are no posts with this flair yet. Try clearing the filter.'
  //           : 'This community is quiet... for now.'
  //       }
  //       action={{ label: 'Create Post', href: PATHS.submit }}
  //     />
  //   )
  // }

  return (
    <div className='flex flex-col gap-4'>
      {/* {visiblePosts.map((post, index) => {
        const ref = index === visiblePosts.length - 1 ? lastElementRef : null
        return <PostCard ref={ref as any} key={post.id} post={post} />
      })}
      {isLoading && page > 1 && (
        <div className='flex justify-center items-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      )} */}
    </div>
  )
}
