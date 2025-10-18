'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCommunity } from '@/context/CommunityContext'
import { useCommunityPosts } from '@/hooks/useCommunityPosts'
import type { PostType } from '@/types/services/post'
import PostCard from '../post/PostCard'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { EmptyState } from '@/components/empty-states/EmptyState'
import { PostCardSkeleton } from '@/components/skeletons/PostCardSkeleton'
import type { SimpleProfile } from '@/types/services/user'
import { communityService } from '@/modules/services/community-service'
import type { CommunityFlair } from '@/types/services/community'

interface CommunityPostFeedProps {
  selectedFlairId?: string | null
  typesFilter?: PostType[]
}

export default function CommunityPostFeed({
  selectedFlairId,
  typesFilter,
}: CommunityPostFeedProps) {
  const community = useCommunity()
  const { posts, isLoading, isLoadingMore, hasMore, loadMore, error, authorProfiles } =
    useCommunityPosts(community?.id, {
      flairId: selectedFlairId ?? undefined,
      types: typesFilter?.length ? typesFilter : undefined,
    })

  const [flairs, setFlairs] = useState<CommunityFlair[]>([])

  useEffect(() => {
    if (!community?.id) return
    communityService
      .getFlairs(community.id)
      .then(setFlairs)
      .catch(() => setFlairs([]))
  }, [community?.id])

  useEffect(() => {
    if (error) {
      toast.error('Failed to load posts', { description: error })
    }
  }, [error])

  if (!community?.id) return null

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    )
  }

  if (posts.length === 0) {
    return <EmptyState>No posts yet.</EmptyState>
  }

  return (
    <div className='flex flex-col gap-6'>
      {posts.map((p) => {
        const flair = flairs.find((f) => f.id === p.flairId) || null
        return (
          <PostCard key={p.id} post={p} authorProfile={authorProfiles[p.authorId]} flair={flair} />
        )
      })}
      {hasMore && <LoadMoreButton loading={isLoadingMore} onClick={() => void loadMore()} />}
    </div>
  )
}
