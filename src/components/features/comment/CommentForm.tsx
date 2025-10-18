'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import * as commentService from '@/modules/services/comment-service'

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

type CommentFormValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: string
  parentCommentId?: string | null
  onSuccess?: () => void
}

export default function CommentForm({
  postId,
  parentCommentId = null,
  onSuccess,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  })

  const [error, setError] = useState<string | null>(null)

  async function onSubmit(data: CommentFormValues) {
    setError(null)
    try {
      const comment = await commentService.createComment({
        postId,
        parentCommentId,
        content: data.content,
      })
      reset()
      if (onSuccess) onSuccess()
    } catch (err) {
      setError('Failed to submit comment.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-6'>
      <Textarea
        {...register('content')}
        placeholder='Write your comment...'
        rows={3}
        className='mb-2'
        disabled={isSubmitting}
      />
      {errors.content && (
        <div className='text-sm text-destructive mb-2'>{errors.content.message}</div>
      )}
      {error && <div className='text-sm text-destructive mb-2'>{error}</div>}
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  )
}
