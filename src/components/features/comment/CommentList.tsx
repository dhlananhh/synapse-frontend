import type { CommentNode } from '@/app/(main)/(communities)/c/[name]/posts/[postId]/page'
import Comment from './Comment'

interface CommentListProps {
  comments: CommentNode[]
  postId: string
  onCommentAdded?: () => void
  onRepliesChanged?: () => void // NEW
}

export default function CommentList({
  comments,
  postId,
  onCommentAdded,
  onRepliesChanged,
}: CommentListProps) {
  if (!comments.length) return <div className='text-muted-foreground'>No comments yet.</div>

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment
            comment={comment}
            postId={postId}
            onCommentAdded={onCommentAdded}
            onRepliesChanged={onRepliesChanged}
          />
        </div>
      ))}
    </div>
  )
}
