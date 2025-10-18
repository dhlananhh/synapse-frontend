'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { postService } from '@/modules/services/post-service'
import type { PostDetails } from '@/types/services/post'
import { Loader2, PencilLine, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import TextPost from '@/components/features/post/TextPost'
import MediaPost from '@/components/features/post/MediaPost'
import LinkPost from '@/components/features/post/LinkPost'
import ModerationActionCard from '@/components/features/post/ModerationActionCard'
import { communityService } from '@/modules/services/community-service'
import { CommunityFlair } from '@/types/services/community'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

export default function MyPostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const [post, setPost] = useState<PostDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flairs, setFlairs] = useState<CommunityFlair[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    postService
      .getPostById(postId)
      .then(setPost)
      .catch(() => setError('Failed to load post'))
      .finally(() => setIsLoading(false))
  }, [postId])

  useEffect(() => {
    if (!post?.community?.id) return
    communityService
      .getFlairs(post.community.id)
      .then(setFlairs)
      .catch(() => setFlairs([]))
  }, [post?.community?.id])

  const flair = post?.flairId ? flairs.find((f) => f.id === post.flairId) : null

  const handleDelete = async () => {
    if (!post) return
    setIsDeleting(true)
    try {
      await postService.deletePost(post.id)
      // Redirect to homepage or user's posts after deletion
      window.location.href = '/u/me/posts'
    } catch (err) {
      // Optionally handle error (show toast, etc.)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error || !post) {
    return <div className='p-8 text-center text-destructive'>{error || 'Post not found.'}</div>
  }

  return (
    <div className='max-w-2xl mx-auto p-4 sm:p-8 bg-background rounded-2xl shadow'>
      {/* Header: Community, status, edit, history */}
      <div className='flex items-center gap-3 mb-2'>
        <Avatar className='h-7 w-7'>
          <AvatarImage src={post.community.avatarUrl || ''} alt={post.community.name} />
          <AvatarFallback>{post.community.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <Link
          href={`/c/${post.community.name}`}
          className='font-semibold text-foreground hover:underline'
        >
          c/{post.community.name}
        </Link>
        <span className='mx-2 text-muted-foreground'>•</span>
        <span className='text-xs text-muted-foreground'>
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
        <span
          className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border
            ${
              post.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-700 border-green-200'
                : post.status === 'REJECTED'
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }
          `}
        >
          {post.status}
        </span>
      </div>

      <hr />

      {/* Title and flair */}
      <div className='flex items-center gap-2 mt-4'>
        <div className='text-2xl sm:text-3xl font-bold text-foreground break-words'>
          {post.title}
        </div>
        {flair && (
          <span
            className='ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border'
            style={{
              backgroundColor: flair.color || '#888',
              color: '#fff',
              borderColor: 'transparent',
            }}
          >
            {flair.name}
          </span>
        )}
      </div>

      {/* Post content */}
      <div className='my-4 rounded-xl border bg-card p-4 shadow-sm'>
        {post.type === 'TEXT' && <TextPost post={post} />}
        {post.type === 'MEDIA' && <MediaPost post={post} />}
        {post.type === 'LINK' && <LinkPost post={post} />}
      </div>

      {/* Divider */}
      <div className='border-t border-muted-foreground/10 my-4' />

      {/* Edit, history, and delete actions */}
      <div className='flex gap-3 mb-4'>
        <Link
          href={`/u/me/posts/${post.id}/edit`}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold shadow hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-accent/50'
        >
          <PencilLine className='w-4 h-4' />
          {post.moderationAction?.action === 'REJECTED' ? 'Resubmit' : 'Edit Post'}
        </Link>
        <Link
          href={`/u/me/posts/${post.id}/history`}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold shadow hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-accent/50'
        >
          <History className='w-4 h-4' />
          View Edit History
        </Link>
        <button
          type='button'
          onClick={() => setShowDeleteDialog(true)}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-semibold shadow hover:bg-destructive/90 transition focus:outline-none focus:ring-2 focus:ring-destructive/50'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z'
            />
          </svg>
          Delete
        </button>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title='Delete Post'
        description='Are you sure you want to delete this post? This action cannot be undone.'
        confirmText='Delete'
        isDestructive
        isConfirming={isDeleting}
      />

      {/* Number of versions */}
      {post.numOfVersions > 1 && (
        <div className='text-xs text-muted-foreground mb-2'>
          This post has {post.numOfVersions} versions.
        </div>
      )}

      {/* Moderation action */}
      {post.moderationAction && <ModerationActionCard action={post.moderationAction} />}
    </div>
  )
}
