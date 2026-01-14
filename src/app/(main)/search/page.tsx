'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { userService } from '@/modules/services/user-service'
import { communityService } from '@/modules/services/community-service'
import { searchPublicPosts, searchPrivatePosts } from '@/modules/services/post-service'
import { useAuth } from '@/context/AuthContext'
import { SearchUserResult } from '@/types/services/user'
import { SearchCommunityResult } from '@/types/services/community'
import type { SearchPost } from '@/types/services/post'
import { ResourceTypeSelector } from '@/components/features/search/ResourceTypeSelector'
import { SearchResultsList } from '@/components/features/search/SearchResultsList'
import { LoadMoreButton } from '@/components/features/search/LoadMoreButton'
import { NoMoreResults } from '@/components/features/search/NoMoreResults'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'user'

  const { user, isLoading: authLoading } = useAuth()

  const [userResults, setUserResults] = useState<SearchUserResult[]>([])
  const [communityResults, setCommunityResults] = useState<SearchCommunityResult[]>([])
  const [postResults, setPostResults] = useState<SearchPost[]>([])

  const [loading, setLoading] = useState(false) // used for user/community
  const [postLoading, setPostLoading] = useState(false)

  // user/community pagination (cursor-style)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(false)

  // posts pagination (page-style)
  const [postPage, setPostPage] = useState<number>(1)
  const [postTotalPages, setPostTotalPages] = useState<number>(1)
  const [postHasMore, setPostHasMore] = useState<boolean>(false)

  const resourceTypes = [
    { label: 'Users', value: 'user' },
    { label: 'Posts', value: 'post' },
    { label: 'Communities', value: 'community' },
  ]

  useEffect(() => {
    if (!query) {
      setUserResults([])
      setCommunityResults([])
      setPostResults([])
      setNextCursor(null)
      setHasMore(false)
      setPostPage(1)
      setPostTotalPages(1)
      setPostHasMore(false)
      return
    }

    // USERS
    setLoading(true)
    if (type === 'user') {
      userService
        .searchUsers(query, undefined, 20)
        .then((res) => {
          setUserResults(res.users)
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
    }

    // COMMUNITIES
    if (type === 'community') {
      setLoading(true)
      communityService
        .searchCommunities(query, undefined, 20)
        .then((res) => {
          setCommunityResults(res.communities)
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
    }

    // POSTS
    if (type === 'post') {
      // wait for auth to resolve before deciding public/private
      if (authLoading) return

      setPostLoading(true)
      const service = user ? searchPrivatePosts : searchPublicPosts
      service(query, 1, 20)
        .then((res) => {
          // log posts as requested
          console.log('search posts results:', res.posts)
          setPostResults(res.posts)
          setPostPage(res.pagination.currentPage)
          setPostTotalPages(res.pagination.totalPages)
          setPostHasMore(res.pagination.hasNextPage)
        })
        .catch((err) => {
          console.error('post search failed', err)
          setPostResults([])
          setPostPage(1)
          setPostTotalPages(1)
          setPostHasMore(false)
        })
        .finally(() => setPostLoading(false))
    }

    // reset other lists when switching types
    if (type !== 'user') {
      setUserResults([])
      setNextCursor(null)
      setHasMore(false)
    }
    if (type !== 'community') {
      setCommunityResults([])
    }
    if (type !== 'post') {
      setPostResults([])
      setPostPage(1)
      setPostTotalPages(1)
      setPostHasMore(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, user, authLoading])

  const loadMore = () => {
    if (!query) return

    // users (cursor)
    if (type === 'user') {
      if (!nextCursor) return
      setLoading(true)
      userService
        .searchUsers(query, nextCursor, 20)
        .then((res) => {
          setUserResults((prev) => [...prev, ...res.users])
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
      return
    }

    // communities (cursor)
    if (type === 'community') {
      if (!nextCursor) return
      setLoading(true)
      communityService
        .searchCommunities(query, nextCursor, 20)
        .then((res) => {
          setCommunityResults((prev) => [...prev, ...res.communities])
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
      return
    }

    // posts (page)
    if (type === 'post') {
      if (postLoading) return
      if (postPage >= postTotalPages) return
      const nextPage = postPage + 1
      setPostLoading(true)
      const service = user ? searchPrivatePosts : searchPublicPosts
      service(query, nextPage, 20)
        .then((res) => {
          console.log('more posts:', res.posts)
          setPostResults((prev) => [...prev, ...res.posts])
          setPostPage(res.pagination.currentPage)
          setPostTotalPages(res.pagination.totalPages)
          setPostHasMore(res.pagination.hasNextPage)
        })
        .catch((err) => {
          console.error('post load more failed', err)
        })
        .finally(() => setPostLoading(false))
    }
  }

  const handleTypeChange = (newType: string) => {
    router.push(`/search?q=${query}&type=${newType}`)
  }

  // decide whether to show load more button and no-more-results for current type
  const currentHasMore = type === 'post' ? postHasMore : hasMore
  const currentLoading = type === 'post' ? postLoading : loading
  const currentCount =
    type === 'post'
      ? postResults.length
      : type === 'user'
      ? userResults.length
      : communityResults.length

  return (
    <div className='pt-16 pl-16 flex flex-col'>
      <div className='sticky top-[64px] bg-background z-10 pt-8'>
        <ResourceTypeSelector
          resourceTypes={resourceTypes}
          selectedType={type}
          onTypeChange={handleTypeChange}
        />
        <h2 className='text-lg font-semibold mb-4 text-foreground'>
          Search results for <span className='text-primary'>"{query}"</span>
        </h2>
        <hr className='border-muted' />
      </div>

      <SearchResultsList
        type={type}
        userResults={userResults}
        communityResults={communityResults}
        postResults={postResults}
      />

      {currentHasMore && (type === 'user' || type === 'community' || type === 'post') && (
        <LoadMoreButton loading={currentLoading} onClick={loadMore} />
      )}

      {!currentHasMore && type === 'user' && userResults.length > 0 && <NoMoreResults />}
      {!currentHasMore && type === 'community' && communityResults.length > 0 && <NoMoreResults />}
      {!currentHasMore && type === 'post' && postResults.length > 0 && <NoMoreResults />}
    </div>
  )
}
