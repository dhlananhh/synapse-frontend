import React, { useState } from 'react'
import { resolveReportedItem, dismissReportedItem } from '@/modules/services/report-service'
import { useCommunity } from '@/context/CommunityContext'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, Lock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ReportedItemActionsProps {
  itemId: string
  targetType: 'POST' | 'COMMENT'
  updateState: (itemId: string, type: 'POST' | 'COMMENT') => void
}

export default function ReportedItemActions({
  itemId,
  targetType,
  updateState,
}: ReportedItemActionsProps) {
  const community = useCommunity()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [actionType, setActionType] = useState<'REMOVE' | 'LOCK' | null>(null)

  const handleDismiss = async () => {
    if (!community?.id) {
      toast.error('Community ID is missing.')
      return
    }

    try {
      await dismissReportedItem({
        communityId: community.id,
        targetType,
        targetId: itemId,
      })
      toast.success('Item dismissed successfully.')
      updateState(itemId, targetType)
    } catch (error) {
      console.error('Failed to dismiss reported item:', error)
      toast.error('Failed to dismiss item. Please try again.')
    }
  }

  const handleConfirmAction = async () => {
    if (!community?.id || !actionType) {
      toast.error('Missing information.')
      return
    }

    // Map actionType to server-side values
    const action: 'REMOVED_MOD' | 'LOCKED' = actionType === 'REMOVE' ? 'REMOVED_MOD' : 'LOCKED'

    const payload = {
      communityId: community.id,
      targetType,
      targetId: itemId,
      action,
      reason: reason || undefined,
    }

    try {
      await resolveReportedItem(payload)
      toast.success(
        actionType === 'REMOVE' ? 'Item removed successfully.' : 'Item locked successfully.'
      )
      setIsDialogOpen(false)
      setReason('')
      setActionType(null)
      updateState(itemId, targetType)
    } catch (error) {
      console.error(
        `Failed to ${actionType === 'REMOVE' ? 'remove' : 'lock'} reported item:`,
        error
      )
      toast.error(
        `Failed to ${actionType === 'REMOVE' ? 'remove' : 'lock'} item. Please try again.`
      )
    }
  }

  const openRemoveDialog = () => {
    setActionType('REMOVE')
    setIsDialogOpen(true)
  }

  const openLockDialog = () => {
    setActionType('LOCK')
    setIsDialogOpen(true)
  }

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='p-2 rounded-full hover:bg-gray-200' aria-label='Actions'>
            <MoreHorizontal className='w-5 h-5 text-gray-500' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={openRemoveDialog}>
            <Trash2 className='w-4 h-4 mr-2 text-red-500' /> Remove
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDismiss}>
            <XCircle className='w-4 h-4 mr-2 text-gray-500' /> Dismiss
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openLockDialog}>
            <Lock className='w-4 h-4 mr-2 text-yellow-500' /> Lock
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog for Remove / Lock Action */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null)
            setReason('')
          }
          setIsDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'REMOVE'
                ? 'Provide a reason for removal'
                : 'Provide a reason for locking'}
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder={
              actionType === 'REMOVE'
                ? 'Enter reason for removal'
                : 'Enter reason for locking (optional)'
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsDialogOpen(false)
                setActionType(null)
                setReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'REMOVE' ? 'destructive' : 'default'} // Use valid variants
              onClick={handleConfirmAction}
            >
              {actionType === 'REMOVE' ? 'Confirm Remove' : 'Confirm Lock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
