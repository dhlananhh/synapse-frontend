'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

import { UserProfile } from '@/types/services/user'

import { UpdateProfileForm } from './UpdateProfileForm'
import { PrivacyConfirmDialog } from './PrivacyConfirmDialog'
import { userService } from '@/modules/services/user-service'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AvatarUpload } from './AvatarUpload'

interface UpdateProfileDialogProps {
  profile: UserProfile
  onProfileUpdate: (updatedProfile: UserProfile) => void
}

export function UpdateProfileDialog({ profile, onProfileUpdate }: UpdateProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isPrivate, setIsPrivate] = useState(profile.isPrivate)
  const userId = profile.id

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const updatedProfile = await userService.updateUserProfile(data)
      toast.success('Profile updated successfully!')
      onProfileUpdate(updatedProfile)
      setIsOpen(false)
    } catch (error: any) {
      toast.error('Failed to update profile.', {
        description: error.response?.data?.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowConfirm(true)
    } else {
      setIsOpen(open)
    }
  };

  const handleSwitchClick = () => {
    setIsPrivacyConfirmOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[480px]'>
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <AvatarUpload
            currentAvatarUrl={profile.avatarUrl}
            onUploaded={(newAvatarUrl) => {
              onProfileUpdate({ ...profile, avatarUrl: newAvatarUrl })
            }}
          />

          <div className='py-4'>
            <UpdateProfileForm
              initialData={profile}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="font-semibold">
              Privacy Settings
            </Label>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm">
                Private Account
              </p>
              <Switch
                checked={ isPrivate }
                onCheckedChange={ handleSwitchClick }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {showConfirm && (
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard changes?</DialogTitle>
            </DialogHeader>
            <div>You have unsaved changes. Are you sure you want to discard them?</div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() => {
                  setShowConfirm(false)
                  setIsOpen(false)
                }}
              >
                Discard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
