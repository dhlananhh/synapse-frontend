'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
  TriangleAlert,
  MoreHorizontal,
  ShieldOff,
  ShieldCheck,
  Trash,
  Globe,
  Lock,
  Check,
  X,
} from 'lucide-react'
import { SearchCommunityResult } from '@/types/services/community'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { communityService } from '@/modules/services/community-service'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const getColumns = (onActionComplete: () => void): ColumnDef<SearchCommunityResult>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const isNSFW = (row.original as SearchCommunityResult).isNSFW
      const avatarUrl = (row.original as SearchCommunityResult).avatarUrl
      const initial = name?.charAt(0)?.toUpperCase() ?? '?'
      return (
        <div className='font-medium flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={`c/${name} avatar`} /> : null}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <span>c/{name}</span>
          {isNSFW && (
            <span className='inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs font-bold text-white'>
              <TriangleAlert className='h-3 w-3 text-white' />
              NSFW
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'privacy',
    accessorFn: (row) => (row.isPrivate ? 'Private' : 'Public'),
    header: 'Privacy',
    cell: ({ row }) => {
      const isPrivate = (row.original as SearchCommunityResult).isPrivate
      return isPrivate ? (
        <Badge className='inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-2 py-1'>
          <Lock className='h-4 w-4' />
          Private
        </Badge>
      ) : (
        <Badge className='inline-flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1'>
          <Globe className='h-4 w-4' />
          Public
        </Badge>
      )
    },
  },
  {
    id: 'nsfw',
    accessorFn: (row) => (row.isNSFW ? 'Yes' : 'No'),
    header: () => <div className='text-center'>NSFW</div>,
    cell: ({ row }) => {
      const isNSFW = (row.original as SearchCommunityResult).isNSFW
      return (
        <div className='flex items-center justify-center'>
          {isNSFW ? (
            <span className='inline-flex items-center justify-center text-purple-600'>
              <Check className='h-4 w-4' />
            </span>
          ) : (
            <span className='inline-flex items-center justify-center text-red-600'>
              <X className='h-4 w-4' />
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as unknown as 'ACTIVE' | 'SUSPENDED' | 'DELETED'
      // map to color styles
      if (status === 'ACTIVE') {
        return (
          <Badge className='inline-flex items-center justify-center bg-green-100 text-green-800 px-2 py-1'>
            Active
          </Badge>
        )
      }
      if (status === 'SUSPENDED') {
        return (
          <Badge className='inline-flex items-center justify-center bg-yellow-100 text-yellow-800 px-2 py-1'>
            Suspended
          </Badge>
        )
      }
      // DELETED
      return (
        <Badge className='inline-flex items-center justify-center bg-red-100 text-red-800 px-2 py-1'>
          Deleted
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const dateValue = row.getValue('createdAt') as string | undefined
      if (!dateValue) return 'N/A'
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return 'Invalid Date'

      const day = date.getDate()
      const dayStr = day < 10 ? `0${day}` : String(day)
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      return <div>{`${dayStr} ${monthNames[date.getMonth()]} ${date.getFullYear()}`}</div>
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Actions</div>,
    cell: ({ row }) => {
      const community = row.original as SearchCommunityResult & { status?: string; id: string }
      const status = community.status ?? 'ACTIVE' // fallback
      // ensure action cell content is centered
      const [isDialogOpen, setDialogOpen] = React.useState(false)
      const [confirmName, setConfirmName] = React.useState('')
      const [isDeleting, setIsDeleting] = React.useState(false)

      const handleSuspend = async () => {
        try {
          await communityService.suspendCommunity(community.id)
          toast.success('Community suspended')
          onActionComplete()
        } catch (err) {
          toast.error('Failed to suspend community')
        }
      }

      const handleReactivate = async () => {
        try {
          await communityService.reactivateCommunity(community.id)
          toast.success('Community reactivated')
          onActionComplete()
        } catch (err) {
          toast.error('Failed to reactivate community')
        }
      }

      const confirmMatches = confirmName.trim() === community.name

      const confirmDelete = async () => {
        if (!confirmMatches) {
          toast.error('Confirmation name did not match. Aborted.')
          return
        }
        setIsDeleting(true)
        try {
          await communityService.deleteCommunity(community.id)
          toast.success('Community deleted')
          setDialogOpen(false)
          setConfirmName('')
          onActionComplete()
        } catch (err) {
          toast.error('Failed to delete community')
        } finally {
          setIsDeleting(false)
        }
      }

      return (
        <div className='flex items-center justify-center'>
          {status === 'DELETED' ? (
            <div className='text-sm text-muted-foreground'>No actions</div>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='h-8 w-8 rounded p-0 hover:bg-muted/50 flex items-center justify-center'>
                    <MoreHorizontal className='h-4 w-4' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(community.id)
                      toast.success('Community ID copied')
                    }}
                  >
                    Copy Community ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {status === 'ACTIVE' && (
                    <DropdownMenuItem onClick={handleSuspend} className='text-orange-600'>
                      <ShieldOff className='mr-2 h-4 w-4' />
                      Suspend Community
                    </DropdownMenuItem>
                  )}
                  {status === 'SUSPENDED' && (
                    <DropdownMenuItem onClick={handleReactivate} className='text-green-600'>
                      <ShieldCheck className='mr-2 h-4 w-4' />
                      Reactivate Community
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setDialogOpen(true)
                    }}
                    className='text-destructive'
                  >
                    <Trash className='mr-2 h-4 w-4' />
                    Delete Community
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Custom delete confirmation dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete community</DialogTitle>
                    <DialogDescription>
                      This action will permanently delete the community{' '}
                      <strong>c/{community.name}</strong>. This is destructive and cannot be undone.
                    </DialogDescription>
                  </DialogHeader>

                  <div className='mt-4 space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      To confirm deletion, type the community name (without the leading "c/") below.
                    </p>
                    <Input
                      placeholder={community.name}
                      value={confirmName}
                      onChange={(e) => setConfirmName(e.target.value)}
                      autoFocus
                    />
                    <p className='text-xs text-muted-foreground'>
                      Exact match required to enable the delete button.
                    </p>
                  </div>

                  <DialogFooter className='mt-4'>
                    <DialogClose asChild>
                      <Button
                        variant='ghost'
                        onClick={() => {
                          setConfirmName('')
                          setDialogOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button
                      variant='destructive'
                      onClick={confirmDelete}
                      disabled={!confirmMatches || isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Community'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      )
    },
  },
]
