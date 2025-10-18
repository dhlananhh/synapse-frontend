'use client'

import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import type { CommunityFlair } from '@/types/services/community'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Share2, ArrowUp, ArrowDown } from 'lucide-react'
import { PostBadges } from './PostBadges'
import TextPost from './TextPost'
import MediaPost from './MediaPost'
import LinkPost from './LinkPost'
import { votePost, unvotePost, PostVoteType } from '@/modules/services/post-service'

interface PostCardProps {
  post: PostDetails
  authorProfile?: SimpleProfile | null
  flair?: CommunityFlair | null
}

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  ({ post, authorProfile, flair }, ref) => {
    const [voting, setVoting] = React.useState<PostVoteType | null>(null)
    const [localScore, setLocalScore] = React.useState(post.score)
    const [voted, setVoted] = React.useState<'UPVOTE' | 'DOWNVOTE' | null>(
      post.currentUserVote ?? null
    )

    const handleVote = async (type: PostVoteType) => {
      if (voting || voted === type) return
      setVoting(type)
      try {
        const updated = await votePost(post.id, type)
        setLocalScore(updated.score)
        setVoted(type)
      } catch {
        // Optionally show a toast here
      } finally {
        setVoting(null)
      }
    }

    const handleUnvote = async () => {
      if (voting === null && voted) {
        setVoting(voted)
        try {
          const updated = await unvotePost(post.id)
          setLocalScore(updated.score)
          setVoted(updated.currentUserVote)
        } catch {
          // Optionally show a toast here
        } finally {
          setVoting(null)
        }
      }
    }

    return (
      <Card ref={ref} className='w-full rounded-2xl border bg-card'>
        <CardHeader className='px-4 sm:px-4'>
          <div className='text-xs text-muted-foreground flex items-center gap-2'>
            {/* Avatar */}
            <div className='w-7 h-7 rounded-full overflow-hidden bg-muted flex items-center justify-center'>
              {authorProfile?.avatarUrl ? (
                <img
                  src={authorProfile.avatarUrl}
                  alt={authorProfile.username}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-muted-foreground text-base'>
                  {authorProfile?.username?.[0]?.toUpperCase() || post.authorId[0]?.toUpperCase()}
                </span>
              )}
            </div>
            {authorProfile?.username ? (
              <Link
                href={`/u/${authorProfile.id}`}
                className='font-medium text-foreground hover:underline'
              >
                u/{authorProfile.username}
              </Link>
            ) : (
              <span className='font-medium text-foreground'>{post.authorId}</span>
            )}
            • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            {flair && (
              <span
                className='ml-2 rounded px-2 py-0.5   text-xs font-medium'
                style={{
                  backgroundColor: flair.color || '#eee',
                  color: '#fff',
                }}
              >
                {flair.name}
              </span>
            )}
          </div>
          <CardTitle className='mt-0 text-2xl sm:text-3xl font-semibold leading-tight break-words'>
            <Link href={`/c/${post.community.name}/posts/${post.id}`} className='hover:underline'>
              {post.title}
            </Link>
          </CardTitle>
          <PostBadges isNSFW={post.isNSFW} isSpoiler={post.isSpoiler} />
        </CardHeader>

        <CardContent className='p-3 sm:p-4 flex-grow mt-0'>
          {post.type === 'TEXT' && <TextPost post={post} />}
          {post.type === 'MEDIA' && <MediaPost post={post} />}
          {post.type === 'LINK' && <LinkPost post={post} />}
        </CardContent>

        <div className='flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-sm font-medium text-muted-foreground p-2 sm:px-4 border-t'>
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className={`rounded-full flex items-center justify-center px-2 ${
                voted === 'UPVOTE' ? 'text-destructive' : ''
              }`}
              aria-label='Upvote'
              type='button'
              disabled={voting !== null}
              onClick={() => (voted === 'UPVOTE' ? handleUnvote() : handleVote('UPVOTE'))}
            >
              <ArrowUp className='h-5 w-5' />
            </Button>
            <span className='mx-1 font-semibold text-foreground'>{localScore}</span>
            <Button
              variant='ghost'
              size='icon'
              className={`rounded-full flex items-center justify-center px-2 ${
                voted === 'DOWNVOTE' ? 'text-destructive' : ''
              }`}
              aria-label='Downvote'
              type='button'
              disabled={voting !== null}
              onClick={() => (voted === 'DOWNVOTE' ? handleUnvote() : handleVote('DOWNVOTE'))}
            >
              <ArrowDown className='h-5 w-5' />
            </Button>
          </div>
          <Button
            asChild
            variant='ghost'
            size='lg'
            className='rounded-full flex items-center gap-1.5 px-2'
          >
            <Link href={`/p/${post.id}`}>
              <MessageCircle className='h-5 w-5' />
              <span className='hidden sm:inline'>Comments</span>
            </Link>
          </Button>
          <Button variant='ghost' size='lg' className='rounded-full flex items-center gap-1.5 px-2'>
            <Share2 className='h-5 w-5' />
            <span className='hidden sm:inline'>Share</span>
          </Button>
        </div>
      </Card>
    )
  }
)

PostCard.displayName = 'PostCard'

export default PostCard
