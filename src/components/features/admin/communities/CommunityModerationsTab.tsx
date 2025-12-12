'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { fetchResolvedItems } from '@/modules/services/report-service'
import type { ResolvedItem, ResolvedItemsResponse } from '@/types/services/report'
import ResolvedItemCard from '@/components/features/report/ResolvedItemCard'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type Props = {
  communityId: string
  limit?: number
}

export default function CommunityModerationsTab({ communityId, limit = 20 }: Props) {
  const [items, setItems] = useState<ResolvedItem[]>([])
  const [loading, setLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchItems = useCallback(
    async (opts?: { cursor?: string | null; append?: boolean }) => {
      if (!communityId) return
      const { cursor = null, append = false } = opts || {}
      if (!append) setLoading(true)

      try {
        const resp = (await fetchResolvedItems({
          communityId,
          limit,
          targetTypes: 'POST,COMMENT',
          cursor,
        })) as ResolvedItemsResponse

        const fetched = Array.isArray(resp?.items) ? resp.items : []
        if (append) setItems((prev) => [...prev, ...fetched])
        else setItems(fetched)

        setHasMore(Boolean(resp?.pagination?.hasMore))
        setNextCursor(resp?.pagination?.nextCursor ?? null)
      } catch (err) {
        if (!opts?.append) toast.error('Failed to load moderation items')
      } finally {
        if (!opts?.append) setLoading(false)
      }
    },
    [communityId, limit]
  )

  useEffect(() => {
    fetchItems({ cursor: null, append: false })
  }, [communityId, fetchItems])

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return
    setIsLoadingMore(true)
    try {
      await fetchItems({ cursor: nextCursor, append: true })
    } catch (err) {
      toast.error('Failed to load more moderation items')
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoadingMore, nextCursor, fetchItems])

  const handleResolvedUpdate = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  return (
    <div className='space-y-3'>
      {loading ? (
        <div className='text-sm text-muted-foreground'>Loading moderation entries...</div>
      ) : items.length === 0 ? (
        <div className='text-sm text-muted-foreground'>No moderation entries</div>
      ) : (
        <div className='space-y-3'>
          {items
            .slice()
            .sort((a, b) => new Date(b.resolvedAt).getTime() - new Date(a.resolvedAt).getTime())
            .map((it) => (
              <ResolvedItemCard
                key={it.id ?? it.resolvedAt}
                item={it}
                updateResolvedState={handleResolvedUpdate}
              />
            ))}
        </div>
      )}

      {hasMore && (
        <div className='flex justify-center mt-2'>
          <Button size='sm' variant='outline' onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
