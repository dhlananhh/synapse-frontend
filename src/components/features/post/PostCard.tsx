'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import type { CommunityFlair } from '@/types/services/community'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostBadges } from './PostBadges'
import MediaViewer from '@/components/features/feed/MediaViewer'
import FeedActions from '@/components/features/feed/FeedActions'
import LinkViewer from '@/components/features/feed/LinkViewer'
import { fetchUserVotes } from '@/modules/services/post-service'
import { useAuth } from '@/context/AuthContext' // Import AuthContext

interface PostCardProps {
  post: PostDetails
  authorProfile?: SimpleProfile | null
  flair?: CommunityFlair | null
}

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  ({ post, authorProfile, flair }, ref) => {
    const { user, isLoading } = useAuth() // Check if the user is authenticated
    const [initialVote, setInitialVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(null)

    useEffect(() => {
      if (!user || isLoading) return // Skip fetching votes if the user is not authenticated or loading

      const fetchVote = async () => {
        try {
          const votes = await fetchUserVotes([post.id])
          const userVote = votes.find((vote) => vote.postId === post.id)?.vote || null
          setInitialVote(userVote)
        } catch (error) {
          console.error('Failed to fetch user vote:', error)
        }
      }

      fetchVote()
    }, [post.id, user, isLoading])

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
                className='ml-2 rounded px-2 py-0.5 text-xs font-medium'
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

        <CardContent className='p-3 sm:p-4 flex-grow'>
          {post.type === 'MEDIA' && (
            <MediaViewer
              media={post.media.map((media) => ({
                key: media.key,
                url: media.url,
              }))}
            />
          )}
          {post.type === 'LINK' && <LinkViewer links={post.links} />}
          {post.contentHtml && (
            <div
              className='prose prose-invert max-w-none text-md prose-p:my-2 line-clamp-6 mt-6'
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          )}
        </CardContent>

        {/* Feed Actions */}
        <div className='p-2 sm:px-4 border-t'>
          <FeedActions
            communityName={post.community.name}
            postId={post.id} // Pass postId
            score={post.score}
            commentCount={post.commentCount}
            shareCount={0}
            initialVote={initialVote} // Pass initialVote
          />
        </div>
      </Card>
    )
  }
)

PostCard.displayName = 'PostCard'

export default PostCard
