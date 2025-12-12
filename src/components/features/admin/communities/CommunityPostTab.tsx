import React, { useEffect, useState, useCallback } from 'react'
import { listCommunityPosts } from '@/modules/services/post-service'
import { userService } from '@/modules/services/user-service'
import type { PostDetails, ListCommunityPostsResponse } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Image, Link as LinkIcon } from 'lucide-react'

type Props = {
  communityId: string
  communityName?: string
  limit?: number
}

const TypeIcon = ({ type, className = '' }: { type?: string; className?: string }) => {
  if (type === 'MEDIA') return <Image className={`inline-block mr-1 w-3 h-3 ${className}`} />
  if (type === 'LINK') return <LinkIcon className={`inline-block mr-1 w-3 h-3 ${className}`} />
  return <FileText className={`inline-block mr-1 w-3 h-3 ${className}`} />
}

// status -> tailwind classes
const statusClasses = (status?: string) => {
  switch ((status || '').toUpperCase()) {
    case 'DRAFT':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-800 border border-gray-200'
    case 'PENDING':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'PUBLISHED':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-800 border border-green-200'
    case 'REJECTED':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 border border-rose-200'
    case 'LOCKED':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-orange-100 text-orange-800 border border-orange-200'
    case 'REMOVED_AUTHOR':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200'
    case 'REMOVED_MOD':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800 border border-red-200'
    default:
      return 'px-2 py-0.5 rounded-full text-[10px] bg-muted/10 text-muted-foreground border border-muted/20'
  }
}

// type -> tailwind classes
const typeClasses = (type?: string) => {
  switch ((type || '').toUpperCase()) {
    case 'MEDIA':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center'
    case 'LINK':
      return 'px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center'
    case 'TEXT':
    default:
      return 'px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-800 border border-slate-200 flex items-center'
  }
}

export default function CommunityPostsTab({ communityId, communityName, limit = 20 }: Props) {
  const [posts, setPosts] = useState<PostDetails[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [authorsMap, setAuthorsMap] = useState<Record<string, SimpleProfile>>({})
  const [postsNextCursor, setPostsNextCursor] = useState<string | null>(null)
  const [postsHasMore, setPostsHasMore] = useState(false)
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false)
  const router = useRouter()

  // filters / search
  const [q, setQ] = useState<string>('')
  const [debouncedQ, setDebouncedQ] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('') // TEXT | MEDIA | LINK | ''
  const [selectedStatus, setSelectedStatus] = useState<string>('') // statuses or ''

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
      return ''
    }
  }

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400)
    return () => clearTimeout(t)
  }, [q])

  // central fetch function (can reset or append)
  const fetchPosts = useCallback(
    async (opts?: { cursor?: string | null; append?: boolean }) => {
      if (!communityId) return
      const { cursor = null, append = false } = opts || {}
      if (!append) setLoadingPosts(true)

      try {
        const params: Record<string, any> = { limit }
        if (cursor) params.cursor = cursor
        if (debouncedQ) params.q = debouncedQ
        if (selectedType) params.types = selectedType
        if (selectedStatus) params.statuses = selectedStatus // backend accepts statuses param (cast to any)
        const resp = (await listCommunityPosts(
          communityId,
          params as any
        )) as ListCommunityPostsResponse

        const items = Array.isArray(resp?.posts) ? resp.posts : []
        if (append) {
          setPosts((prev) => [...prev, ...items])
        } else {
          setPosts(items)
        }

        setPostsHasMore(Boolean(resp?.pagination?.hasMore))
        setPostsNextCursor(resp?.pagination?.nextCursor ?? null)

        // fetch author profiles for any new author ids
        const authorIds = Array.from(
          new Set(items.map((p) => p.authorId).filter(Boolean))
        ) as string[]
        const missing = authorIds.filter((id) => !authorsMap[id])
        if (missing.length > 0) {
          try {
            const profiles = await userService.getSimpleProfiles(missing)
            const map: Record<string, SimpleProfile> = {}
            for (const prof of profiles ?? []) {
              const key = (prof.id ?? (prof.userId as string) ?? prof.username) as string
              if (key) map[key] = prof
            }
            setAuthorsMap((prev) => ({ ...prev, ...map }))
          } catch (err) {
            console.warn('Failed to fetch author profiles', err)
          }
        }
      } catch (err) {
        if (!opts?.append) toast.error('Failed to load community posts')
      } finally {
        if (!opts?.append) setLoadingPosts(false)
      }
    },
    [communityId, debouncedQ, selectedType, selectedStatus, limit, authorsMap]
  )

  // initial / filters change -> reload first page
  useEffect(() => {
    fetchPosts({ cursor: null, append: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId, debouncedQ, selectedType, selectedStatus, limit])

  const loadMorePosts = useCallback(async () => {
    if (!communityId) return
    if (!postsHasMore || isLoadingMorePosts) return
    if (!postsNextCursor) return

    setIsLoadingMorePosts(true)
    try {
      await fetchPosts({ cursor: postsNextCursor, append: true })
    } catch (err) {
      toast.error('Failed to load more posts')
    } finally {
      setIsLoadingMorePosts(false)
    }
  }, [communityId, postsHasMore, postsNextCursor, isLoadingMorePosts, fetchPosts])

  const clearFilters = () => {
    setQ('')
    setSelectedType('')
    setSelectedStatus('')
  }

  return (
    <div>
      {/* Search + filters toolbar */}
      <div className='mb-3 flex gap-2 items-center'>
        <input
          type='search'
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Search posts by title...'
          className='flex-1 px-3 py-2 border rounded-md text-sm bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-slate-600'
          aria-label='Search posts'
        />

        {/* Type filter + color badge */}
        <div className='flex items-center gap-2'>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className='px-2 py-2 border rounded-md text-sm bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-indigo-600'
            aria-label='Filter by type'
          >
            <option className='bg-white dark:bg-slate-800' value=''>
              All types
            </option>
            <option className='bg-white dark:bg-slate-800' value='TEXT'>
              Text
            </option>
            <option className='bg-white dark:bg-slate-800' value='MEDIA'>
              Media
            </option>
            <option className='bg-white dark:bg-slate-800' value='LINK'>
              Link
            </option>
          </select>

          {/* visual badge for selected type (keeps dropdown compact and shows color) */}
          {selectedType ? (
            <span className={typeClasses(selectedType)} aria-hidden>
              <TypeIcon type={selectedType} className='text-current' />
              <span className='ml-1 uppercase'>{selectedType}</span>
            </span>
          ) : null}
        </div>

        {/* Status filter + color badge */}
        <div className='flex items-center gap-2'>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className='px-2 py-2 border rounded-md text-sm bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-1 focus:ring-yellow-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-yellow-600'
            aria-label='Filter by status'
          >
            <option className='bg-white dark:bg-slate-800' value=''>
              All statuses
            </option>
            <option className='bg-white dark:bg-slate-800' value='DRAFT'>
              Draft
            </option>
            <option className='bg-white dark:bg-slate-800' value='PENDING'>
              Pending
            </option>
            <option className='bg-white dark:bg-slate-800' value='PUBLISHED'>
              Published
            </option>
            <option className='bg-white dark:bg-slate-800' value='REJECTED'>
              Rejected
            </option>
            <option className='bg-white dark:bg-slate-800' value='LOCKED'>
              Locked
            </option>
            <option className='bg-white dark:bg-slate-800' value='REMOVED_AUTHOR'>
              Removed (author)
            </option>
            <option className='bg-white dark:bg-slate-800' value='REMOVED_MOD'>
              Removed (mod)
            </option>
          </select>

          {/* visual badge for selected status */}
          {selectedStatus ? (
            <span className={statusClasses(selectedStatus)}>{selectedStatus}</span>
          ) : null}
        </div>

        <Button size='sm' variant='ghost' onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {loadingPosts ? (
        <div className='text-sm text-muted-foreground'>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className='text-sm text-muted-foreground'>No posts found</div>
      ) : (
        <>
          {posts
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((p) => {
              const authorProfile = authorsMap[p.authorId ?? '']
              const displayName = authorProfile?.username
                ? `u/${authorProfile.username}`
                : p.authorId ?? '—'
              const avatarUrl =
                (authorProfile as any)?.avatarUrl ?? (authorProfile as any)?.avatar_url
              const status = p.status ?? ''
              const type = p.type ?? ''
              const score = (p as any).score ?? 0
              const commentCount = (p as any).commentCount ?? (p as any).comment_count ?? 0

              return (
                <div
                  key={p.id}
                  role='button'
                  onClick={() =>
                    router.push(
                      `/c/${encodeURIComponent(
                        communityName ?? p.community?.name ?? communityId
                      )}/posts/${encodeURIComponent(p.id)}`
                    )
                  }
                  className='p-3 border rounded-md bg-surface/20 cursor-pointer hover:shadow-sm transition my-3'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={displayName} />
                        ) : (
                          <AvatarFallback>
                            {(displayName?.charAt?.(0) ?? '?').toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className='flex flex-col'>
                        <div className='text-sm font-medium'>{displayName}</div>
                        <div className='text-xs text-muted-foreground'>{timeAgo(p.createdAt)}</div>
                      </div>
                    </div>

                    {/* badges at top-right */}
                    <div className='flex items-center gap-2'>
                      <span className={statusClasses(status)}>{status}</span>
                      <span className={typeClasses(type)}>
                        <TypeIcon type={type} className='text-current' />
                        <span className='uppercase text-[10px] leading-none'>{type}</span>
                      </span>
                    </div>
                  </div>

                  <div className='mt-2 text-sm font-semibold'>{p.title ?? p.type ?? 'Post'}</div>

                  <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center gap-1'>
                        <span className='text-xs'>▲</span>
                        <span>{score}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <span className='text-xs'>💬</span>
                        <span>{commentCount}</span>
                      </div>
                    </div>

                    <div className='text-[11px] text-muted-foreground'>
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )
            })}

          {postsHasMore && (
            <div className='flex justify-center mt-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={loadMorePosts}
                disabled={isLoadingMorePosts}
              >
                {isLoadingMorePosts ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
