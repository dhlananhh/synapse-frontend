import { useCallback, useEffect, useState } from 'react'
import { postService } from '@/modules/services/post-service'
import { userService } from '@/modules/services/user-service'
import type { Post, ListCommunityPostsParams, PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'

export function useCommunityPosts(
  communityId?: string,
  baseParams?: Omit<ListCommunityPostsParams, 'cursor'>
) {
  const [posts, setPosts] = useState<PostDetails[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authorProfiles, setAuthorProfiles] = useState<Record<string, SimpleProfile>>({})

  const load = useCallback(
    async (cursor?: string | null) => {
      if (!communityId) return
      const loadingSetter = cursor ? setIsLoadingMore : setIsLoading
      loadingSetter(true)
      setError(null)
      try {
        const res = await postService.listCommunityPosts(communityId, {
          ...(baseParams || {}),
          cursor: cursor ?? undefined,
        })
        setPosts((prev) => (cursor ? [...prev, ...res.posts] : res.posts))
        setHasMore(res.pagination?.hasMore ?? false)
        setNextCursor(res.pagination?.nextCursor ?? null)

        // --- Batch fetch author profiles ---
        const authorIds = Array.from(new Set(res.posts.map((p) => p.authorId)))
        if (authorIds.length) {
          const profiles = await userService.getSimpleProfiles(authorIds)
          // Map by userId for quick lookup
          const profileMap: Record<string, SimpleProfile> = {}
          for (const profile of profiles) {
            profileMap[profile.id] = profile
          }
          setAuthorProfiles((prev) => ({ ...prev, ...profileMap }))
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load posts')
      } finally {
        loadingSetter(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [communityId, JSON.stringify(baseParams)]
  )

  const refresh = useCallback(() => load(undefined), [load])
  const loadMore = useCallback(
    () => (hasMore ? load(nextCursor) : Promise.resolve()),
    [load, hasMore, nextCursor]
  )

  useEffect(() => {
    setPosts([])
    setNextCursor(null)
    setHasMore(false)
    if (communityId) load(undefined)
  }, [communityId, load])

  return {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    nextCursor,
    error,
    refresh,
    loadMore,
    setPosts,
    authorProfiles,
  }
}
