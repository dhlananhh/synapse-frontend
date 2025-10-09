'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { userService } from '@/modules/services/user-service'
import { communityService } from '@/modules/services/community-service'
import { SearchUserResult } from '@/types/services/user'
import { SearchCommunityResult } from '@/types/services/community'
import { ResourceTypeSelector } from '@/components/features/search/ResourceTypeSelector'
import { SearchResultsList } from '@/components/features/search/SearchResultsList'
import { LoadMoreButton } from '@/components/features/search/LoadMoreButton'
import { NoMoreResults } from '@/components/features/search/NoMoreResults'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'user'

  const [userResults, setUserResults] = useState<SearchUserResult[]>([])
  const [communityResults, setCommunityResults] = useState<SearchCommunityResult[]>([])
  const [loading, setLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const resourceTypes = [
    { label: 'Users', value: 'user' },
    { label: 'Posts', value: 'post' },
    { label: 'Communities', value: 'community' },
  ]

  useEffect(() => {
    if (!query) {
      setUserResults([])
      setCommunityResults([])
      setNextCursor(null)
      setHasMore(false)
      return
    }
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
    } else if (type === 'community') {
      communityService
        .searchCommunities(query, undefined, 20)
        .then((res) => {
          setCommunityResults(res.communities)
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
    } else {
      setUserResults([])
      setCommunityResults([])
      setNextCursor(null)
      setHasMore(false)
      setLoading(false)
    }
  }, [query, type])

  const loadMore = () => {
    if (!nextCursor) return
    setLoading(true)
    if (type === 'user') {
      userService
        .searchUsers(query, nextCursor, 20)
        .then((res) => {
          setUserResults((prev) => [...prev, ...res.users])
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
    } else if (type === 'community') {
      communityService
        .searchCommunities(query, nextCursor, 20)
        .then((res) => {
          setCommunityResults((prev) => [...prev, ...res.communities])
          setNextCursor(res.pagination.nextCursor)
          setHasMore(res.pagination.hasMore)
        })
        .finally(() => setLoading(false))
    }
  }

  const handleTypeChange = (newType: string) => {
    router.push(`/search?q=${query}&type=${newType}`)
  }

  return (
    <div className='pt-2'>
      <ResourceTypeSelector
        resourceTypes={resourceTypes}
        selectedType={type}
        onTypeChange={handleTypeChange}
      />
      <hr className='border-muted mb-6' />
      <h2 className='text-lg font-semibold mb-4 text-foreground'>
        Search results for <span className='text-primary'>"{query}"</span>
      </h2>
      <SearchResultsList
        type={type}
        userResults={userResults}
        communityResults={communityResults}
      />
      {hasMore && (type === 'user' || type === 'community') && (
        <LoadMoreButton loading={loading} onClick={loadMore} />
      )}
      {!hasMore && type === 'user' && userResults.length > 0 && <NoMoreResults />}
      {!hasMore && type === 'community' && communityResults.length > 0 && <NoMoreResults />}
    </div>
  )
}
