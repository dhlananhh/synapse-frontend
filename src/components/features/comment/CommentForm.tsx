'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import * as commentService from '@/modules/services/comment-service'
import { toast } from 'sonner'

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
    } catch (err: unknown) {
      let msg = 'Failed to submit comment.'
      // If fetch returned a Response (non-2xx) try to read its JSON body.message
      if (typeof window !== 'undefined' && err instanceof Response) {
        try {
          const body = await err
            .clone()
            .json()
            .catch(() => null)
          if (body && typeof body.message === 'string') {
            msg = body.message
          } else {
            msg = err.statusText || `Request failed with status code ${err.status}`
          }
        } catch {
          msg = `Request failed with status code ${err.status}`
        }
      } else if (err instanceof Error) {
        const anyErr = err as any
        // axios-like error shape
        if (anyErr?.response?.data?.message) {
          msg = String(anyErr.response.data.message)
        } else if (anyErr?.message) {
          msg = anyErr.message
        }
      } else if (typeof err === 'object' && err !== null) {
        const anyErr = err as any
        if (anyErr?.message) msg = String(anyErr.message)
      } else {
        msg = String(err)
      }

      setError(msg)
      toast.error('Failed to submit comment', { description: msg })
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
        rows={1}
        className='resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none p-2'
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
