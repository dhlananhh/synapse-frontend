import React, {
  useState,
  useEffect
} from 'react'
import {
  CornerLeftUp,
  CornerRightDown,
  MessageSquare,
  Share2
} from 'lucide-react'
import { votePost, unvotePost } from '@/modules/services/post-service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


interface FeedActionsProps {
  communityName: string
  postId: string
  score: number
  commentCount: number
  shareCount: number
  initialVote: 'UPVOTE' | 'DOWNVOTE' | null
}


export default function FeedActions({
  postId,
  score,
  commentCount,
  shareCount,
  initialVote,
  communityName,
}: FeedActionsProps) {
  const router = useRouter()
  const [ localScore, setLocalScore ] = useState(score)
  const [ voted, setVoted ] = useState<'UPVOTE' | 'DOWNVOTE' | null>(initialVote)
  const [ loading, setLoading ] = useState(false)

  // Sync the voted state with initialVote whenever it changes
  useEffect(() => {
    setVoted(initialVote)
  }, [ initialVote ])

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
    const postUrl = `${window.location.origin}/c/${communityName}/posts/${postId}`
    try {
      await navigator.clipboard.writeText(postUrl)
      toast.success('Post URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
      toast.error('Failed to copy URL to clipboard.')
    }
  }

  const handleCommentClick = () => {
    router.push(`/c/${communityName}/posts/${postId}`)
  }

  return (
    <div className='flex items-center gap-3 mt-3'>
      {/* Voting Group */ }
      <div className='flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-secondary/30 hover:border-primary/30 transition-colors'>
        <button
          className={ `p-1 rounded-sm transition-colors 
            ${voted === 'UPVOTE'
              ? 'text-green-600 dark:text-green-500' // Active color
              : 'text-muted-foreground hover:text-green-600 dark:hover:text-green-500 hover:bg-black/5 dark:hover:bg-white/10' // Inactive hover
            }` }
          onClick={
            () => (
              voted === 'UPVOTE'
                ? handleUnvote()
                : handleVote('UPVOTE')
            )
          }
          disabled={ loading }
          aria-label="Upvote"
        >
          <CornerLeftUp className={ `h-5 w-5 ${voted === 'UPVOTE' ? 'fill-current' : ''}` } />
        </button>

        <span
          className={
            `text-sm font-bold min-w-[2ch] text-center 
            ${voted === 'UPVOTE'
              ? 'text-green-600 dark:text-green-500'
              :
              voted === 'DOWNVOTE'
                ? 'text-purple-600 dark:text-purple-500'
                :
                'text-foreground'
            }`
          }
        >
          { localScore }
        </span>

        <button
          className={ `p-1 rounded-sm transition-colors ${voted === 'DOWNVOTE'
            ? 'text-purple-600 dark:text-purple-500' // Active color
            : 'text-muted-foreground hover:text-purple-600 dark:hover:text-purple-500 hover:bg-black/5 dark:hover:bg-white/10' // Inactive hover
            }` }
          onClick={ () => (voted === 'DOWNVOTE' ? handleUnvote() : handleVote('DOWNVOTE')) }
          disabled={ loading }
          aria-label="Downvote"
        >
          <CornerRightDown className={ `h-5 w-5 ${voted === 'DOWNVOTE' ? 'fill-current' : ''}` } />
        </button>
      </div>

      {/* Comments Button */ }
      <button
        className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all'
        onClick={ handleCommentClick }
      >
        <MessageSquare className='h-4 w-4' />
        <span className='text-xs font-semibold'>
          { commentCount }
          <span className="hidden sm:inline"></span>
        </span>
      </button>

      {/* Share Button */ }
      <button
        className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all'
        onClick={ handleShare }
      >
        <Share2 className='h-4 w-4' />
        <span className='text-xs font-semibold'></span>
      </button>
    </div>
  )
}
