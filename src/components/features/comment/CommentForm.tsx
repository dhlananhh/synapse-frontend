'use client'


import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import * as commentService from '@/modules/services/comment-service'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'


// Schema validation
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

  const [ isExpanded, setIsExpanded ] = useState(false)

  async function onSubmit(data: CommentFormValues) {
    try {
      await commentService.createComment({
        postId,
        parentCommentId,
        content: data.content,
      })
      toast.success('Comment posted successfully!')
      reset()
      setIsExpanded(false)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit comment'
      toast.error(msg)
    }
  }

  return (
    <form
      onSubmit={ handleSubmit(onSubmit) }
      className={ `
        mb-6 p-4 rounded-lg border border-border bg-card shadow-sm transition-all duration-200
        ${isExpanded ? 'ring-2 ring-primary/20' : ''} 
      `}
    >
      <div className="relative">
        <Textarea
          { ...register('content') }
          placeholder="What are your thoughts?"
          rows={ isExpanded ? 3 : 1 }
          className="w-full resize-none border-none bg-transparent px-2 py-2 text-sm focus-visible:ring-0 min-h-[40px] placeholder:text-muted-foreground"
          disabled={ isSubmitting }
          onFocus={ () => setIsExpanded(true) }
        />
      </div>

      {
        isExpanded && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">

            <div className="text-sm text-destructive">
              { errors.content && errors.content.message }
            </div>

            <div className='flex items-center gap-2 ml-auto'>
              <Button
                type='button'
                variant='ghost'
                size="sm"
                onClick={
                  () => {
                    reset();
                    setIsExpanded(false);
                  }
                }
                disabled={ isSubmitting }
              >
                Cancel
              </Button>

              <Button
                type='submit'
                size="sm"
                disabled={ isSubmitting }
                className='rounded-full px-6 font-semibold'
              >
                {
                  isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                Comment
              </Button>
            </div>
          </div>
        )
      }
    </form>
  )
}
