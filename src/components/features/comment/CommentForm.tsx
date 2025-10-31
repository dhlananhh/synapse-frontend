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
  const [isExpanded, setIsExpanded] = useState(false)

  async function onSubmit(data: CommentFormValues) {
    setError(null)
    try {
      const comment = await commentService.createComment({
        postId,
        parentCommentId,
        content: data.content,
      })
      reset()
      setIsExpanded(false)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError('Failed to submit comment.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`mb-6 p-4 border border-gray-800 rounded-lg bg-gray-900 shadow-sm ${
        isExpanded ? 'space-y-2' : ''
      }`}
    >
      <Textarea
        {...register('content')}
        placeholder='Write your comment...'
        rows={1} // Start with one row
        className='resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none p-2' // Adjusted padding and rounded corners
        disabled={isSubmitting}
        onFocus={() => setIsExpanded(true)}
      />
      {isExpanded && (
        <>
          {errors.content && (
            <div className='text-sm text-destructive'>{errors.content.message}</div>
          )}
          {error && <div className='text-sm text-destructive'>{error}</div>}
          <div className='flex justify-end gap-2'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-gray-700 text-white hover:bg-gray-800 transition-colors'
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                reset()
                setIsExpanded(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
