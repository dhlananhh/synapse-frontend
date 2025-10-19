'use client'

import { useEffect, useState, useCallback } from 'react'
import { postService } from '@/modules/services/post-service'
import type { Post, PostDetails } from '@/types/services/post'
import { Loader2 } from 'lucide-react'
import PostCard from '@/components/features/post/PostCard'
import { useAuth } from '@/context/AuthContext'
import { EmptyState } from '@/components/empty-states/EmptyState'
import { CommunitySelector } from '@/components/features/post/CommunitySelector'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import MyPostCard from '@/components/features/post/MyPostCard'

const POST_STATUSES = [
  'DRAFT',
  'PENDING',
  'PUBLISHED',
  'LOCKED',
  'REMOVED_AUTHOR',
  'REMOVED_MOD',
  'REJECTED',
] as const
const POST_TYPES = [ 'TEXT', 'MEDIA', 'LINK' ] as const
type PostStatus = (typeof POST_STATUSES)[ number ]
type PostTypeFilter = (typeof POST_TYPES)[ number ] | 'ALL'

export default function MyPostsPage() {
  const { user } = useAuth()
  const [ posts, setPosts ] = useState<PostDetails[]>([])
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isLoadingMore, setIsLoadingMore ] = useState(false)
  const [ error, setError ] = useState<string | null>(null)
  const [ selectedCommunityId, setSelectedCommunityId ] = useState('')
  const [ cursor, setCursor ] = useState<string | null>(null)
  const [ hasMore, setHasMore ] = useState(false)
  const [ selectedStatuses, setSelectedStatuses ] = useState<PostStatus[]>([])
  const [ typeFilter, setTypeFilter ] = useState<PostTypeFilter>('ALL')

  // Fetch posts (initial or when filter changes)
  const fetchPosts = useCallback(
    async (opts?: { reset?: boolean; cursor?: string }) => {
      if (!user) return
      const isFirstLoad = !cursor || opts?.reset
      if (isFirstLoad) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)
      try {
        const params: any = {}
        if (selectedCommunityId) params.communityId = selectedCommunityId
        if (selectedStatuses.length > 0) params.statuses = selectedStatuses
        if (typeFilter !== 'ALL') params.types = [ typeFilter ]
        if (opts?.cursor) params.cursor = opts.cursor

        const res = await postService.listUserPosts(params)
        if (isFirstLoad) {
          setPosts(res.posts)
        } else {
          setPosts((prev) => [ ...prev, ...res.posts ])
        }
        setCursor(res.pagination?.nextCursor ?? null)
        setHasMore(!!res.pagination?.hasMore)
      } catch (e: any) {
        setError(e?.message || 'Failed to load your posts')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [ user, selectedCommunityId, selectedStatuses, typeFilter, cursor ]
  )

  // Initial load & when selectedCommunityId changes
  useEffect(() => {
    setCursor(null)
    fetchPosts({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedCommunityId, selectedStatuses, typeFilter, user ])

  const handleLoadMore = () => {
    if (cursor) {
      fetchPosts({ cursor })
    }
  }

  if (!user) {
    return (
      <div className='p-8 text-center text-muted-foreground'>Please log in to view your posts.</div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return <div className='p-8 text-center text-destructive'>{ error }</div>
  }

  return (
    <div className='max-w-4xl mx-auto p-4 sm:p-8 bg-background rounded-2xl shadow'>
      <h2 className='text-2xl font-bold mb-4'>My Posts</h2>
      <div
        className='
          bg-gradient-to-br from-background/80 to-background/60
          rounded-2xl p-6 mb-8 shadow-lg border border-muted
          flex flex-col gap-8
          sm:flex-row sm:gap-0 sm:items-center
          relative
          overflow-hidden
        '
        style={ {
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        } }
      >
        {/* Community Filter */ }
        <div className='flex-1 min-w-[180px] flex flex-col items-center sm:items-start'>
          <span className='block text-base font-semibold mb-3 text-primary'>
            Filter by Community
          </span>
          <div className='w-full'>
            <CommunitySelector
              value={ selectedCommunityId }
              onChange={ (id) => {
                setSelectedCommunityId(id)
                setCursor(null)
              } }
              statuses={ [ 'ACTIVE', 'LEFT' ] }
              label=''
              className='w-full'
            />
          </div>
        </div>

        {/* Vertical divider for desktop */ }
        <div className='hidden sm:block w-px bg-muted-foreground/10 mx-6 rounded-full' />

        {/* Status Filter */ }
        <div className='flex-1 min-w-[180px] flex flex-col items-center sm:items-start'>
          <span className='block text-base font-semibold mb-3 text-primary'>Filter by Status</span>
          <div className='flex flex-wrap gap-2 items-center justify-center sm:justify-start'>
            <button
              type='button'
              className={ `flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium transition
                ${selectedStatuses.length === 0
                  ? 'bg-primary text-primary-foreground border-primary shadow font-bold'
                  : 'bg-muted text-muted-foreground border-muted-foreground/20 hover:bg-accent'
                }` }
              onClick={ () => setSelectedStatuses([]) }
            >
              <span
                className={ `inline-block w-2 h-2 rounded-full ${selectedStatuses.length === 0 ? 'bg-primary-foreground' : 'bg-muted-foreground/30'
                  }` }
              />
              <span className={ selectedStatuses.length === 0 ? 'font-bold' : '' }>Deselect All</span>
            </button>
            { POST_STATUSES.map((status) => {
              const selected = selectedStatuses.includes(status)
              return (
                <button
                  key={ status }
                  type='button'
                  className={ `flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium transition
                    ${selected
                      ? 'bg-primary text-primary-foreground border-primary shadow font-bold'
                      : 'bg-muted text-muted-foreground border-muted-foreground/20 hover:bg-accent'
                    }` }
                  onClick={ () =>
                    setSelectedStatuses((prev) =>
                      prev.includes(status) ? prev.filter((s) => s !== status) : [ ...prev, status ]
                    )
                  }
                >
                  <span
                    className={ `inline-block w-2 h-2 rounded-full ${selected ? 'bg-primary-foreground' : 'bg-muted-foreground/30'
                      }` }
                  />
                  <span className={ selected ? 'font-bold' : '' }>
                    { status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ') }
                  </span>
                </button>
              )
            }) }
          </div>
        </div>

        {/* Vertical divider for desktop */ }
        <div className='hidden sm:block w-px bg-muted-foreground/10 mx-6 rounded-full' />

        {/* Type Filter */ }
        <div className='flex-1 min-w-[180px] flex flex-col items-center sm:items-start'>
          <span className='block text-base font-semibold mb-3 text-primary'>Filter by Type</span>
          <div className='flex flex-wrap gap-2 items-center justify-center sm:justify-start'>
            <Button
              type='button'
              size='sm'
              variant={ typeFilter === 'ALL' ? 'default' : 'outline' }
              className={ typeFilter === 'ALL' ? 'font-bold' : '' }
              onClick={ () => setTypeFilter('ALL') }
            >
              All
            </Button>
            { POST_TYPES.map((type) => (
              <Button
                key={ type }
                type='button'
                size='sm'
                variant={ typeFilter === type ? 'default' : 'outline' }
                className={ typeFilter === type ? 'font-bold' : '' }
                onClick={ () => setTypeFilter(type) }
              >
                { type.charAt(0) + type.slice(1).toLowerCase() }
              </Button>
            )) }
          </div>
        </div>
      </div>
      <Separator className='mb-6' />
      <div className='flex flex-col gap-6'>
        { posts.length === 0 ? (
          <EmptyState>No posts found for this community.</EmptyState>
        ) : (
          posts.map((post) => <MyPostCard key={ post.id } post={ post } />)
        ) }
        { hasMore && (
          <Button
            onClick={ handleLoadMore }
            disabled={ isLoadingMore }
            className='mx-auto mt-4'
            variant='outline'
          >
            { isLoadingMore ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Loading...
              </>
            ) : (
              'Load More'
            ) }
          </Button>
        ) }
      </div>
    </div>
  )
}
