import type { CommentNode } from '@/app/(main)/(communities)/c/[name]/posts/[postId]/page'
import Comment from './Comment'

interface CommentListProps {
  communityId: string
  comments: CommentNode[]
  postId: string
  onCommentAdded?: () => void
  onRepliesChanged?: () => void // NEW
  contextMode?: boolean // NEW - when true, comments are ancestor -> ... -> target
  highlightedCommentId?: string | null // NEW
  allowNewComments?: boolean
}

export default function CommentList({
  communityId,
  comments,
  postId,
  onCommentAdded,
  onRepliesChanged,
  contextMode = false,
  highlightedCommentId = null,
  allowNewComments = true,
}: CommentListProps) {
  if (!comments.length) return <div className='text-muted-foreground'>No comments yet.</div>

  if (contextMode) {
    // render ancestor -> ... -> target with increasing indentation
    return (
      <div>
        {comments.map((comment, idx) => (
          <div key={comment.id} style={{ marginLeft: idx === 0 ? 0 : 20 * idx }}>
            <Comment
              communityId={communityId}
              comment={comment}
              postId={postId}
              onCommentAdded={onCommentAdded}
              onRepliesChanged={onRepliesChanged}
              highlighted={highlightedCommentId === comment.id}
              allowNewComments={allowNewComments}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment
            communityId={communityId}
            comment={comment}
            postId={postId}
            onCommentAdded={onCommentAdded}
            onRepliesChanged={onRepliesChanged}
            allowNewComments={allowNewComments}
          />
        </div>
      ))}
    </div>
  )
}
