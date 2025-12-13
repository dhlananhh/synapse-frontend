'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { communityService } from '@/modules/services/community-service'
import type { MyCommunity } from '@/types/services/community'
import { Skeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 10

export default function ManageCommunitiesPage() {
  const [q, setQ] = useState('')
  const [all, setAll] = useState<MyCommunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    communityService
      .getMyCommunities({ statuses: ['ACTIVE'] })
      .then((items) => {
        if (!mounted) return
        setAll(items ?? [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(err?.message ?? 'Failed to load communities')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // filter by name (case-insensitive)
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return all
    return all.filter((c) => c.name?.toLowerCase().includes(term))
  }, [all, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(Math.max(1, page), totalPages)

  const visible = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  useEffect(() => {
    // reset to first page when search changes
    setPage(1)
  }, [q])

  return (
    <div className='container mx-auto px-4 py-14'>
      <h1 className='text-2xl font-bold mb-4'>Manage communities</h1>

      <div className='mb-6'>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Filter your communities'
          className='w-full max-w-lg rounded-md border px-3 py-2 bg-input text-sm'
          aria-label='Filter your communities'
        />
      </div>

      <div className='space-y-4'>
        {loading ? (
          // show a few skeleton rows while loading
          <>
            <Skeleton className='h-12 w-full rounded' />
            <Skeleton className='h-12 w-full rounded' />
            <Skeleton className='h-12 w-full rounded' />
          </>
        ) : error ? (
          <div className='text-sm text-destructive'>{error}</div>
        ) : visible.length === 0 ? (
          <div className='text-sm text-muted-foreground'>No communities found</div>
        ) : (
          visible.map((c) => (
            <div
              key={c.communityId}
              className='flex items-start gap-4 p-3 rounded-md border bg-card'
            >
              <div className='flex-shrink-0'>
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className='h-10 w-10 rounded-full object-cover'
                  />
                ) : (
                  <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold'>
                    {c.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='min-w-0'>
                    <Link
                      href={`/c/${c.name}`}
                      className='font-medium text-sm hover:underline block truncate'
                    >
                      {c.name}
                    </Link>
                    <div className='text-xs text-muted-foreground mt-1 truncate'>
                      {c.description ?? ''}
                    </div>
                  </div>

                  <div className='ml-4'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full border text-sm'>
                      {c.role === 'OWNER'
                        ? 'Owner'
                        : c.role === 'MODERATOR'
                        ? 'Moderator'
                        : 'Joined'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      <div className='mt-6 flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
          {Math.min(filtered.length, currentPage * PAGE_SIZE)} of {filtered.length}
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='px-3 py-1 rounded border disabled:opacity-50'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Prev
          </button>

          <span className='text-sm'>
            {currentPage} / {totalPages}
          </span>

          <button
            className='px-3 py-1 rounded border disabled:opacity-50'
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
