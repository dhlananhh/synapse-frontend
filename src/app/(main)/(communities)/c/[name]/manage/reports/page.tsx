'use client'

import React, { useEffect, useState } from 'react'
import {
  fetchReportedPosts,
  fetchReportedComments,
  fetchResolvedItems,
} from '@/modules/services/report-service'
import ReportedItemCard from '@/components/features/report/ReportedItemCard'
import ResolvedItemCard from '@/components/features/report/ResolvedItemCard'
import { ReportedPost, ReportedComment, Pagination, ResolvedItem } from '@/types/services/report'
import { useCommunity } from '@/context/CommunityContext'

export default function ReportsPage() {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([])
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>([])
  const [resolvedItems, setResolvedItems] = useState<ResolvedItem[]>([])
  const [paginationPosts, setPaginationPosts] = useState<Pagination | null>(null)
  const [paginationComments, setPaginationComments] = useState<Pagination | null>(null)
  const [paginationResolved, setPaginationResolved] = useState<{
    nextCursor: string | null
    hasMore: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'POSTS' | 'COMMENTS' | 'RESOLVED'>('POSTS') // Active tab state

  const community = useCommunity()
  const communityId = community?.id

  const fetchPosts = async (page = 1, limit = 10) => {
    if (!communityId) {
      setError('Community ID is missing.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetchReportedPosts({ communityId, page, limit })
      setReportedPosts(response.posts)
      setPaginationPosts(response.pagination)
    } catch (err) {
      console.error('Failed to fetch reported posts:', err)
      setError('Failed to fetch reported posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (page = 1, limit = 10) => {
    if (!communityId) {
      setError('Community ID is missing.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetchReportedComments({ communityId, page, limit })
      setReportedComments(response.comments)
      setPaginationComments(response.pagination)
    } catch (err) {
      console.error('Failed to fetch reported comments:', err)
      setError('Failed to fetch reported comments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchResolved = async (cursor?: string | null, limit = 10, reset = false) => {
    if (!communityId) {
      setError('Community ID is missing.')
      return
    }

    if (reset) {
      setResolvedItems([]) // Clear resolved items when resetting
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetchResolvedItems({ communityId, cursor, limit })
      setResolvedItems((prev) => (reset ? response.items : [...prev, ...response.items]))
      setPaginationResolved(response.pagination)
    } catch (err) {
      console.error('Failed to fetch resolved items:', err)
      setError('Failed to fetch resolved items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateReportedState = (itemId: string, type: 'POST' | 'COMMENT') => {
    if (type === 'POST') {
      setReportedPosts((prev) => prev.filter((post) => post.id !== itemId))
    } else if (type === 'COMMENT') {
      setReportedComments((prev) => prev.filter((comment) => comment.id !== itemId))
    }
  }

  const updateResolvedState = (itemId: string) => {
    setResolvedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  useEffect(() => {
    fetchPosts()
    fetchComments()
    fetchResolved(null, 10, true) // Reset resolved items on initial load
  }, [communityId])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-8'>Reported Contents</h1>
      <div className='border-b mb-4'>
        <nav className='flex gap-12 text-xl'>
          <button
            className={`font-medium ${
              activeTab === 'POSTS' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('POSTS')}
          >
            Posts
          </button>
          <button
            className={`font-medium ${
              activeTab === 'COMMENTS' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('COMMENTS')}
          >
            Comments
          </button>
          <button
            className={`font-medium ${
              activeTab === 'RESOLVED' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveTab('RESOLVED')
              fetchResolved(null, 10, true) // Reset resolved items when switching tabs
            }}
          >
            Resolved
          </button>
        </nav>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {!loading && !error && activeTab === 'POSTS' && (
        <>
          {reportedPosts.length === 0 ? (
            <p className='text-gray-500'>No reported posts found.</p>
          ) : (
            reportedPosts.map((post) => (
              <ReportedItemCard
                key={post.id}
                item={post}
                type='POST'
                updateState={updateReportedState}
              />
            ))
          )}
          {paginationPosts && paginationPosts.hasMore && (
            <button
              className='mt-4 px-4 py-2 bg-primary text-white rounded'
              onClick={() => fetchPosts(paginationPosts.currentPage + 1)}
            >
              Load More
            </button>
          )}
        </>
      )}
      {!loading && !error && activeTab === 'COMMENTS' && (
        <>
          {reportedComments.length === 0 ? (
            <p className='text-gray-500'>No reported comments found.</p>
          ) : (
            reportedComments.map((comment) => (
              <ReportedItemCard
                key={comment.id}
                item={comment}
                type='COMMENT'
                updateState={updateReportedState}
              />
            ))
          )}
          {paginationComments && paginationComments.hasMore && (
            <button
              className='mt-4 px-4 py-2 bg-primary text-white rounded'
              onClick={() => fetchComments(paginationComments.currentPage + 1)}
            >
              Load More
            </button>
          )}
        </>
      )}
      {!loading && !error && activeTab === 'RESOLVED' && (
        <>
          {resolvedItems.length === 0 ? (
            <p className='text-gray-500'>No resolved items found.</p>
          ) : (
            resolvedItems.map((item) => (
              <ResolvedItemCard
                updateResolvedState={updateResolvedState}
                key={item.id}
                item={item}
              />
            ))
          )}
          {paginationResolved && paginationResolved.hasMore && (
            <button
              className='mt-4 px-4 py-2 bg-primary text-white rounded'
              onClick={() => fetchResolved(paginationResolved.nextCursor)}
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  )
}
