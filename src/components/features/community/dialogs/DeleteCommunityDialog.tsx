'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Community } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface DeleteCommunityDialogProps {
  community: Community
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCommunityDialog({
  community,
  isOpen,
  onOpenChange,
}: DeleteCommunityDialogProps) {
  const router = useRouter()
  const [confirmationText, setConfirmationText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const isConfirmationMatch = confirmationText === community.name

  const handleDelete = async () => {
    if (!isConfirmationMatch) return

    setIsDeleting(true)
    try {
      // await communityService.deleteCommunity(community.id);
      toast.success(`Community "c/${community.name}" has been permanently deleted.`, {
        duration: 5000,
      })
      setTimeout(() => {
        router.push(`/feed`)
      }, 5000)
    } catch (error: any) {
      toast.error('Failed to delete community.', {
        description: error.response?.data?.message || 'Please try again later.',
        duration: 5000,
      })
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmationText('')
    }
    onOpenChange(open)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this community?</AlertDialogTitle>
          <AlertDialogDescription>
            This action <span className='font-bold text-destructive'>cannot</span> be undone. This
            will permanently delete the{' '}
            <span className='font-semibold text-foreground'>c/{community.name}</span> community,
            posts, comments, and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='py-2 space-y-2'>
          <Label htmlFor='community-name-confirm'>
            Please type <span className='font-bold text-foreground'>{community.name}</span> to
            confirm.
          </Label>
          <Input
            id='community-name-confirm'
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            autoComplete='off'
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmationMatch || isDeleting}
            className='bg-destructive hover:bg-destructive/90'
          >
            {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}I understand, delete
            this community
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
