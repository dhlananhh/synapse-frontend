'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { authService } from '@/modules/services/auth-service'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, ArrowUpDown, UserX, CheckCircle2 } from 'lucide-react'
import { AccountDetails } from '@/types/services/auth'

const handleUserAction = async (
  account: AccountDetails,
  action: 'suspend' | 'activate',
  onActionComplete: () => void
) => {
  const actionToastId = toast.loading(
    `${action === 'suspend' ? 'Suspending' : 'Activating'} account @${account.username}...`
  )
  try {
    const newStatus = action === 'suspend' ? 'SUSPENDED' : 'ACTIVE'
    // use authService.updateAccountStatus (server API wrapper)
    await authService.updateAccountStatus(account.id, { status: newStatus })
    toast.success(
      `Account @${account.username} has been ${action === 'suspend' ? 'suspended' : 'activated'}.`,
      { id: actionToastId }
    )
    onActionComplete()
  } catch (error) {
    toast.error(`Failed to ${action} account.`, { id: actionToastId })
  }
}

export const getColumns = (onActionComplete: () => void): ColumnDef<AccountDetails>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('username')}</div>,
  },

  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')

      if (typeof status !== 'string' || !status) {
        return <Badge variant='secondary'>Unknown</Badge>
      }

      let variant: 'default' | 'secondary' | 'destructive' = 'secondary'
      if (status === 'ACTIVE') variant = 'default'
      if (status === 'SUSPENDED') variant = 'destructive'

      return (
        <Badge variant={variant} className='capitalize'>
          {status.toLowerCase()}
        </Badge>
      )
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registered
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateValue = row.getValue('createdAt') as string
      if (!dateValue) return 'N/A'
      const parsableDate = dateValue.replace(' ', 'T')
      const date = new Date(parsableDate)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return <div>{date.toLocaleDateString()}</div>
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const account = row.original as AccountDetails

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(account.id)}>
              Copy Account ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {account.status === 'ACTIVE' && (
              <DropdownMenuItem
                onClick={() => handleUserAction(account, 'suspend', onActionComplete)}
                className='text-orange-600 focus:text-orange-600'
              >
                <UserX className='mr-2 h-4 w-4' />
                Suspend Account
              </DropdownMenuItem>
            )}
            {account.status === 'SUSPENDED' && (
              <DropdownMenuItem
                onClick={() => handleUserAction(account, 'activate', onActionComplete)}
                className='text-green-600 focus:text-green-600'
              >
                <CheckCircle2 className='mr-2 h-4 w-4' />
                Activate Account
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
