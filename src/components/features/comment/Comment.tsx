import React, { useEffect, useState } from 'react'
import {
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  MessageCircle,
  CornerDownRight,
  Pencil,
  Trash2,
  Flag,
} from 'lucide-react'
import { userService } from '@/modules/services/user-service'
import {
  fetchCommentReplies,
  deleteComment,
  voteComment,
  unvoteComment,
  VoteType,
} from '@/modules/services/comment-service'
import type { CommentNode } from '@/app/(main)/(communities)/c/[name]/posts/[postId]/page'
import type { SimpleProfile } from '@/types/services/user'
import { formatDistanceToNow } from 'date-fns'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import EditCommentForm from './EditCommentForm'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/AuthContext'
import ActionConfirmDialog from '@/components/shared/ActionConfirmDialog'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import ReportDialog from '@/components/features/report/ReportDialog'


interface CommentProps {
  communityId: string
  comment: CommentNode
  postId: string
  onCommentAdded?: () => void
  onRepliesChanged?: () => void
  highlighted?: boolean
  allowNewComments?: boolean
}


export default function Comment({
  communityId,
  comment,
  postId,
  onCommentAdded,
  onRepliesChanged,
  highlighted = false,
  allowNewComments = true,
}: CommentProps) {
  const { user: authUser } = useAuth()
  const [ profile, setProfile ] = useState<SimpleProfile | null>(null)
  const [ showReply, setShowReply ] = useState(false)
  const [ showReplies, setShowReplies ] = useState(false)
  const [ replies, setReplies ] = useState<CommentNode[] | null>(null)
  const [ loadingReplies, setLoadingReplies ] = useState(false)
  const [ editMode, setEditMode ] = useState(false)
  const [ content, setContent ] = useState(comment.content)
  const [ deleting, setDeleting ] = useState(false)
  const [ confirmOpen, setConfirmOpen ] = useState(false)
  const [ voting, setVoting ] = useState<VoteType | null>(null)
  const [ localScore, setLocalScore ] = useState(comment.score)
  const [ voted, setVoted ] = useState<'UPVOTE' | 'DOWNVOTE' | null>(comment.currentUserVote ?? null)
  const [ isReportDialogOpen, setReportDialogOpen ] = useState(false)

  // local transient highlight state (controls visual effect)
  const [ isLocalHighlight, setIsLocalHighlight ] = useState(false)

  useEffect(() => {
    // Make highlight persistent while `highlighted` is true.
    setIsLocalHighlight(Boolean(highlighted))
  }, [ highlighted ])

  const currentUserId = authUser?.id // Get the current user's ID
  const isAuthor = currentUserId === comment.authorId // Check if the current user is the author

  const handleShowReplies = async () => {
    if (!replies) {
      setLoadingReplies(true)
      try {
        const res = await fetchCommentReplies(comment.id)
        setReplies(res.comments)
      } finally {
        setLoadingReplies(false)
      }
    }
    setShowReplies((v) => !v)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteComment(comment.id)
      setConfirmOpen(false)
      toast.success('Comment deleted', {
        description: 'Your comment has been removed successfully.',
      })
      if (comment.parentCommentId && onRepliesChanged) {
        onRepliesChanged()
      } else if (onCommentAdded) {
        onCommentAdded()
      }
    } catch {
      toast.error('Failed to delete comment', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleReplyAdded = async () => {
    // Re-fetch replies for this comment
    setLoadingReplies(true)
    try {
      const res = await fetchCommentReplies(comment.id)
      setReplies(res.comments)
      setShowReply(false)
      setShowReplies(true)
    } finally {
      setLoadingReplies(false)
    }
  }

  const handleVote = async (type: VoteType) => {
    if (voting || voted === type) return
    setVoting(type)
    try {
      const updated = await voteComment(comment.id, type)
      setLocalScore(updated.score)
      setVoted(type)
    } catch {
      toast.error('Failed to vote', { description: 'Please try again.' })
    } finally {
      setVoting(null)
    }
  }

  const handleUnvote = async () => {
    if (voting === null && voted) {
      setVoting(voted)
      try {
        const updated = await unvoteComment(comment.id)
        setLocalScore(updated.score)
        setVoted(null)
      } catch {
        toast.error('Failed to remove vote', { description: 'Please try again.' })
      } finally {
        setVoting(null)
      }
    }
  }

  // Helper to get removed message
  function getRemovedMessage() {
    if (comment.status === 'REMOVED_AUTHOR') {
      return 'This comment was removed by the author.'
    }
    if (comment.status === 'REMOVED_MOD') {
      return 'This comment was removed by a moderator.'
    }
    return null
  }

  const isRemoved = comment.status === 'REMOVED_AUTHOR' || comment.status === 'REMOVED_MOD'

  return (
    <div
      id={ `comment-${comment.id}` }
      className={
        `relative flex gap-3 py-4 transition-all duration-500 rounded-md
        ${isLocalHighlight
          ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'
          : 'hover:bg-muted/30'
        }`
      }
    >
      {/* Badge Highlight */ }
      {
        isLocalHighlight && (
          <span className='absolute -top-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 shadow-sm border border-amber-200'>
            New Highlight
          </span>
        )
      }

      {/* Avatar Column */ }
      <div className="flex-shrink-0">
        <Avatar className='w-8 h-8 border border-border shadow-sm'>
          {
            profile?.avatarUrl ? (
              <AvatarImage src={ profile.avatarUrl } alt={ profile.username || comment.authorId } />
            ) : (
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                { (profile?.username ?? comment.authorId).slice(0, 2).toUpperCase() }
              </AvatarFallback>
            )
          }
        </Avatar>

        {/* Thread line visual cue (optional) */ }
        {
          showReplies && (
            <div className="w-[1px] bg-border mx-auto h-[calc(100%-2rem)] mt-2 group-hover:bg-primary/20" />
          )
        }
      </div>

      {/* Content Column */ }
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
          <span className='font-semibold text-foreground hover:underline cursor-pointer'>
            u/{ profile?.username ?? comment.authorId }
          </span>
          <span className='text-muted-foreground'>
            • { formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) }
          </span>
          {
            comment.isEdited && (
              <span className='ml-2 text-xs text-muted-foreground italic'>
                (edited)
              </span>
            )
          }

          {/* Action Menu (More options) */ }
          {
            !isRemoved && (
              <div className='ml-auto'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className='p-1 rounded-full hover:bg-muted'
                      aria-label='Comment options'
                    >
                      <MoreHorizontal className='w-5 h-5' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {
                      isAuthor && (
                        <>
                          <DropdownMenuItem
                            onClick={ () => setEditMode(true) }
                          >
                            <Pencil className='w-4 h-4 mr-2' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={ () => setConfirmOpen(true) }
                            disabled={ deleting }
                          >
                            <Trash2 className='w-4 h-4 mr-2' />
                            { deleting ? 'Deleting...' : 'Delete' }
                          </DropdownMenuItem>
                        </>
                      )
                    }
                    {
                      !isAuthor && (
                        <DropdownMenuItem
                          onClick={
                            (e) => {
                              e.preventDefault()
                              setReportDialogOpen(true) // Open the report dialog
                            }
                          }
                        >
                          <Flag className='w-4 h-4 mr-2' />
                          Report
                        </DropdownMenuItem>
                      )
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          }
        </div>
        <div className='mt-2'>
          {
            comment.status === 'PUBLISHED' ? (
              editMode ? (
                <EditCommentForm
                  commentId={ comment.id }
                  initialContent={ content }
                  onSuccess={
                    (newContent) => {
                      setContent(newContent)
                      setEditMode(false)
                    }
                  }
                  onCancel={ () => setEditMode(false) }
                />
              ) : (
                // Hiển thị nội dung comment
                <div className="whitespace-pre-wrap break-words">
                  { content }
                </div>
              )
            ) : (
              // <span className='italic text-muted-foreground'>{ getRemovedMessage() }</span>
              <div className="py-2 px-3 bg-muted/50 rounded text-xs italic text-muted-foreground border border-border">
                { getRemovedMessage() }
              </div>
            )
          }
        </div>

        {/* Footer Actions (Vote, Reply) */ }
        {
          !isRemoved && (
            <div className='flex items-center gap-3 my-2 text-sm text-muted-foreground'>
              <button
                className={
                  `rounded-full p-1 hover:bg-muted 
                  ${voted === 'UPVOTE' ? 'text-destructive' : ''}`
                }
                aria-label='Upvote'
                disabled={ voting !== null }
                onClick={ () => (voted === 'UPVOTE' ? handleUnvote() : handleVote('UPVOTE')) }
              >
                <ArrowUp className='w-4 h-4' />
              </button>

              <span className={
                `text-xs font-bold px-1 min-w-[1.5rem] text-center 
                ${voted === 'UPVOTE' ? 'text-orange-500' :
                  voted === 'DOWNVOTE' ? 'text-purple-500' : 'text-foreground'
                }`
              }
              >
                { localScore }
              </span>

              <button
                className={
                  `p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors 
                  ${voted === 'DOWNVOTE'
                    ? 'text-purple-500'
                    : 'text-muted-foreground hover:text-purple-500'
                  }`
                }
                onClick={
                  () => (voted === 'DOWNVOTE'
                    ? handleUnvote()
                    : handleVote('DOWNVOTE'))
                }
              >
                <ArrowDown className='w-4 h-4' />
              </button>

              {/* Separator */ }
              <div className="h-3 w-[1px] bg-border mx-1"></div>

              {/* Reply Button */ }
              {
                allowNewComments ? (
                  <button
                    className='flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all'
                    onClick={ () => setShowReply((v) => !v) }
                    type='button'
                  >
                    <MessageCircle className='w-4 h-4' />
                    Reply
                  </button>
                ) : (
                  <span className='ml-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wide flex items-center gap-1 opacity-70'>
                    Comments locked
                  </span>
                )
              }

              {/* Show Replies Button */ }
              {
                comment.hasReplies && (
                  <button
                    className='flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all'
                    onClick={ handleShowReplies }
                    type='button'
                  >
                    <CornerDownRight className={ `w-4 h-4 transition-transform 
                      ${showReplies ? 'rotate-90' : ''}` }
                    />
                    { showReplies ? 'Hide replies' : loadingReplies ? 'Loading...' : 'Show replies' }
                  </button>
                )
              }
            </div>
          )
        }

        {/* Reply Input Form */ }
        {
          showReply && !isRemoved && allowNewComments && (
            <div className='mt-3 pl-2 border-l-2 border-border animate-in fade-in slide-in-from-top-1'>
              <CommentForm
                postId={ postId }
                parentCommentId={ comment.id }
                onSuccess={ handleReplyAdded }
              />
            </div>
          )
        }

        {/* Nested Replies */ }
        {
          showReplies && replies && !isRemoved && (
            <div className='ml-6 border-l pl-4 mt-2'>
              <CommentList
                communityId={ communityId }
                comments={ replies }
                postId={ postId }
                onCommentAdded={ onCommentAdded }
                onRepliesChanged={
                  async () => {
                    setLoadingReplies(true)
                    try {
                      const res = await fetchCommentReplies(comment.id)
                      setReplies(res.comments)
                    } finally {
                      setLoadingReplies(false)
                    }
                  }
                }
              />
            </div>
          )
        }


        {/* Action Confirm Dialog */ }
        <ActionConfirmDialog
          open={ confirmOpen }
          onOpenChange={ setConfirmOpen }
          onConfirm={ handleDelete }
          title='Delete Comment'
          description='Are you sure you want to delete this comment? This action cannot be undone.'
          confirmText='Delete'
          isDestructive
          isConfirming={ deleting }
        />

        {/* Report Dialog */ }
        <ReportDialog
          isOpen={ isReportDialogOpen }
          onClose={ () => setReportDialogOpen(false) } // Close the dialog
          communityId={ communityId }
          targetType='COMMENT'
          targetId={ comment.id }
        />
      </div>
    </div>
  )
}
