import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { editComment } from '@/modules/services/comment-service'

const editCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

type EditCommentFormValues = z.infer<typeof editCommentSchema>

interface EditCommentFormProps {
  commentId: string
  initialContent: string
  onSuccess?: (newContent: string) => void
  onCancel?: () => void
}

export default function EditCommentForm({
  commentId,
  initialContent,
  onSuccess,
  onCancel,
}: EditCommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditCommentFormValues>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: { content: initialContent },
  })

  const [error, setError] = useState<string | null>(null)

  async function onSubmit(data: EditCommentFormValues) {
    setError(null)
    try {
      const updatedComment = await editComment(commentId, { content: data.content })
      if (onSuccess) onSuccess(updatedComment.content)
    } catch (err) {
      setError('Failed to edit comment.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-2'>
      <Textarea {...register('content')} rows={3} disabled={isSubmitting} className='mb-2' />
      {errors.content && (
        <div className='text-sm text-destructive mb-2'>{errors.content.message}</div>
      )}
      {error && <div className='text-sm text-destructive mb-2'>{error}</div>}
      <div className='flex gap-2'>
        <Button type='submit' disabled={isSubmitting}>
          Save
        </Button>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
