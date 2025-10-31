import React, { useState, useEffect } from 'react'
import { CornerLeftUp, CornerRightDown, MessageSquare, Share2 } from 'lucide-react'
import { votePost, unvotePost } from '@/modules/services/post-service'
import { toast } from 'sonner' // Import toast for notifications
import { useRouter } from 'next/navigation' // Import useRouter for navigation

interface FeedActionsProps {
  communityName: string
  postId: string // Post ID for API requests
  score: number // Current score of the post
  commentCount: number // Number of comments
  shareCount: number // Number of shares
  initialVote: 'UPVOTE' | 'DOWNVOTE' | null // User's current vote
}

export default function FeedActions({
  postId,
  score,
  commentCount,
  shareCount,
  initialVote,
  communityName,
}: FeedActionsProps) {
  const router = useRouter() // Initialize router for navigation
  const [localScore, setLocalScore] = useState(score)
  const [voted, setVoted] = useState<'UPVOTE' | 'DOWNVOTE' | null>(initialVote) // Initialize with initialVote
  const [loading, setLoading] = useState(false)

  // Sync the voted state with initialVote whenever it changes
  useEffect(() => {
    setVoted(initialVote)
  }, [initialVote])

  const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (loading || voted === type) return
    setLoading(true)
    try {
      const updatedPost = await votePost(postId, type)
      setLocalScore(updatedPost.score)
      setVoted(type)
    } catch (error) {
      console.error('Failed to vote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnvote = async () => {
    if (loading || !voted) return
    setLoading(true)
    try {
      const updatedPost = await unvotePost(postId)
      setLocalScore(updatedPost.score)
      setVoted(null)
    } catch (error) {
      console.error('Failed to unvote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/c/${communityName}/posts/${postId}` // Construct the post URL
    try {
      await navigator.clipboard.writeText(postUrl) // Copy URL to clipboard
      toast.success('Post URL copied to clipboard!') // Notify the user using toast
    } catch (error) {
      console.error('Failed to copy URL:', error)
      toast.error('Failed to copy URL to clipboard.') // Notify the user of failure
    }
  }

  const handleCommentClick = () => {
    router.push(`/c/${communityName}/posts/${postId}`)
  }

  return (
    <div className='flex items-center gap-6 mt-8'>
      {/* Voting */}
      <div className='flex items-center gap-2 px-3 py-2 border rounded-3xl bg-gray-700'>
        <button
          className={`flex items-center gap-1 text-white ${
            voted === 'UPVOTE' ? 'text-green-500' : 'hover:text-green-500'
          } transition-colors`}
          onClick={() => (voted === 'UPVOTE' ? handleUnvote() : handleVote('UPVOTE'))}
          disabled={loading}
        >
          <CornerLeftUp className={`h-5 w-5 ${voted === 'UPVOTE' ? 'text-green-500' : ''}`} />
        </button>
        <span className='text-sm font-medium'>{localScore}</span>
        <button
          className={`flex items-center gap-1 text-white ${
            voted === 'DOWNVOTE' ? 'text-purple-500' : 'hover:text-purple-500'
          } transition-colors`}
          onClick={() => (voted === 'DOWNVOTE' ? handleUnvote() : handleVote('DOWNVOTE'))}
          disabled={loading}
        >
          <CornerRightDown className={`h-5 w-5 ${voted === 'DOWNVOTE' ? 'text-purple-500' : ''}`} />
        </button>
      </div>

      {/* Comments */}
      <div className='flex items-center gap-2 px-3 py-2 border rounded-3xl bg-gray-700'>
        <button
          className='flex items-center gap-2 text-white hover:text-primary'
          onClick={handleCommentClick} // Navigate to the post's URL
        >
          <MessageSquare className='h-5 w-5' />
          <span className='text-sm font-medium'>{commentCount}</span>
        </button>
      </div>

      {/* Share */}
      <div className='flex items-center gap-2 px-3 py-2 border rounded-3xl bg-gray-700'>
        <button
          className='flex items-center gap-2 text-white hover:text-primary'
          onClick={handleShare}
        >
          <Share2 className='h-5 w-5' />
          <span className='text-sm font-medium'>{shareCount}</span>
        </button>
      </div>
    </div>
  )
}
