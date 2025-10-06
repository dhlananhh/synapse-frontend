'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Community } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import { TUpdateCommunityDetailsSchema } from '@/libs/validators/community-validator'
import UpdateCommunityForm from '@/components/features/community/forms/UpdateCommunityForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Settings } from 'lucide-react'

interface UpdateCommunityDialogProps {
  community: Community
  onUpdate: (updatedCommunity: Community) => void
}

export function UpdateCommunityDialog({ community, onUpdate }: UpdateCommunityDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (formData: TUpdateCommunityDetailsSchema) => {
    setIsSubmitting(true)

    try {
      const response = await communityService.updateCommunity(community.id, formData)
      toast.success('Community details updated successfully!')
      onUpdate(response)
      setIsOpen(false)
    } catch (error: any) {
      toast.error('Failed to update community details. Try again later!', {
        description: error.response?.data?.errors?.[0]?.message || 'An unexpected error occurred.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          <div className='flex items-center justify-center gap-2 w-full'>
            <Settings className='h-4 w-4' />
            <span>Edit community details</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Community Settings</DialogTitle>
          <DialogDescription>
            Update your community&apos;s details. Changes will be visible to everyone.
          </DialogDescription>
        </DialogHeader>
        <div className='pt-4'>
          <UpdateCommunityForm
            initialData={community}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
