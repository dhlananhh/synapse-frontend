import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSchema, ReportFormData } from '@/libs/validators/report-validator'
import { submitReport } from '@/modules/services/report-service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
  communityId: string
  targetType: 'POST' | 'COMMENT'
  targetId: string
}

export default function ReportDialog({
  isOpen,
  onClose,
  communityId,
  targetType,
  targetId,
}: ReportDialogProps) {
  const {
    register,
    handleSubmit,
    setValue, // Add setValue to manually update form state
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: 'OTHER', // Default value for the reason field
      reasonDetail: '',
    },
  })

  // Mapping of reasons to their textual representations
  const reasonDescriptions: Record<string, string> = {
    SPAM: 'spam',
    HARASSMENT: 'harassing someone',
    HATE_SPEECH: 'hate speech.',
    NSFW_CONTENT: 'not safe for work',
    VIOLENCE: 'promotes violence',
    MISINFORMATION: 'contains misinformation',
    ILLEGAL_ACTIVITY: 'promotes illegal activity',
    SELF_HARM: 'promotes self-harm',
    IMPERSONATION: 'impersonates someone',
    COPYRIGHT: 'violates copyright',
    OFF_TOPIC: 'is off-topic',
    OTHER: 'Other reasons',
  }

  const onSubmit = async (data: ReportFormData) => {
    try {
      await submitReport({
        communityId,
        targetType,
        targetId,
        reason: data.reason, // Correctly typed reason
        reasonDetail: data.reasonDetail,
      })
      toast.success('Report submitted successfully!') // Show success toast
      onClose()
    } catch (error) {
      console.error('Failed to submit report:', error)
      toast.error('Failed to submit report.') // Show error toast
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogTitle>Submit a report</DialogTitle>
        <DialogHeader>
          <h2 className='text-md font-light text-gray-500'>
            Thanks for expressing your concern over Synapse's content. Why are you reporting this
            content?
          </h2>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Reason Selection */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Reason</label>
            <RadioGroup
              onValueChange={(value: ReportFormData['reason']) => setValue('reason', value)} // Explicitly type value
            >
              {reportSchema.shape.reason.options.map((option) => (
                <div key={option} className='flex items-center gap-2'>
                  <RadioGroupItem value={option} id={option} />
                  <label htmlFor={option} className='text-sm text-gray-400'>
                    {reasonDescriptions[option]} {/* Display textual representation */}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {errors.reason && <p className='text-red-500 text-sm'>{errors.reason.message}</p>}
          </div>

          {/* Reason Detail */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Additional Details (Optional)</label>
            <Textarea
              {...register('reasonDetail')}
              placeholder='Provide more details (max 500 characters)'
              onClick={(e) => e.stopPropagation()} // Stop event propagation
            />
            {errors.reasonDetail && (
              <p className='text-red-500 text-sm'>{errors.reasonDetail.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type='button' variant='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' variant='default'>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
