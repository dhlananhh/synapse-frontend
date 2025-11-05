'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PostCard from '@/components/features/post/PostCard'
import { getPostById } from '@/modules/services/post-service'
import type { PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import { fetchPostComments } from '@/modules/services/comment-service'
import type { Comment as CommentType } from '@/types/services/comment'
import CommentList from '@/components/features/comment/CommentList'
import CommentForm from '@/components/features/comment/CommentForm'
import { useCommunityFlairs } from '@/context/CommunityContext'
import { userService } from '@/modules/services/user-service'

export interface CommentNode extends CommentType {
  replies?: CommentNode[]
}

export default function PostDetailsPage() {
  const { postId } = useParams()
  const [post, setPost] = useState<PostDetails | null>(null)
  const [authorProfile, setAuthorProfile] = useState<SimpleProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentNode[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const flairs = useCommunityFlairs()

  useEffect(() => {
    async function fetchPostAndProfile() {
      try {
        const data = await getPostById(postId as string)
        console.log('wtf gang ', data)
        setPost(data)
        // Fetch author simple profile
        const profiles = await userService.getSimpleProfiles([data.authorId])
        setAuthorProfile(profiles[0])
      } catch (err) {
        setError('Failed to load post.')
      } finally {
        setLoading(false)
      }
    }
    if (postId) fetchPostAndProfile()
  }, [postId])

  useEffect(() => {
    async function loadComments() {
      setCommentsLoading(true)
      try {
        const res = await fetchPostComments(postId as string)
        setComments(res.comments)
      } catch {
        // handle error if needed
      } finally {
        setCommentsLoading(false)
      }
    }
    if (postId) loadComments()
  }, [postId])

  function handleCommentAdded() {
    if (postId) {
      fetchPostComments(postId as string).then((res) => setComments(res.comments))
    }
  }

  if (loading) return <div>Loading post...</div>
  if (error) return <div>{error}</div>
  if (!post) return <div>Post not found.</div>

  // Find the correct flair by id
  const flair = post.flairId ? flairs.find((f) => f.id === post.flairId) : null

  return (
    <div className='flex justify-center py-4'>
      <div className='max-w-3xl'>
        <PostCard post={post} authorProfile={authorProfile} flair={flair} />
        <div className='mt-4'>
          <h2 className='text-lg font-semibold mb-4'>Comments</h2>
          <CommentForm postId={post.id} onSuccess={handleCommentAdded} />
          {commentsLoading ? (
            <div>Loading comments...</div>
          ) : (
            <CommentList
              communityId={post.community.id}
              comments={comments}
              postId={post.id}
              onCommentAdded={handleCommentAdded}
            />
          )}
        </div>
      </div>
    </div>
  )
}
