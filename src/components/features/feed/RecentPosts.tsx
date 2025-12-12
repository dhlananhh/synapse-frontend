'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchRecentPosts } from '@/modules/services/post-service'
import { PostDetails } from '@/types/services/post'
import PostPreview from './PostPreview'

export default function RecentPosts() {
  const { user, isLoading } = useAuth() // Check authentication status
  const [ recentPosts, setRecentPosts ] = useState<PostDetails[]>([])
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState<string | null>(null)

  useEffect(() => {
    if (!user || isLoading) return // Skip fetching if user is not authenticated or loading

    const loadRecentPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const posts = await fetchRecentPosts()
        setRecentPosts(posts.slice(0, 10)) // Limit to top 10 posts
      } catch (err) {
        setError('Failed to load recent posts.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRecentPosts()
  }, [ user, isLoading ])

  if (!user || isLoading) return null // Do not render if user is not authenticated or loading

  if (loading) {
    return <p>Loading recent posts...</p>
  }

  if (error) {
    return <p className='text-red-500'>{ error }</p>
  }

  if (recentPosts.length === 0) {
    return <p>No recently viewed posts available.</p>
  }

  return (
    <div className='space-y-4 h-full overflow-y-auto'>
      <h3 className='text-lg font-bold mb-4'>Recently Viewed Posts</h3>
      { recentPosts.map((post) => (
        <PostPreview key={ post.id } post={ post } />
      )) }
    </div>
  )
}
