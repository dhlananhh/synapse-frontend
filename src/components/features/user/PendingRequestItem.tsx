'use client'

import { PendingFollowRequest } from '@/types/services/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function PendingRequestItem({
  requester,
  onAccept,
  onReject,
}: {
  requester: PendingFollowRequest['requester']
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <div className='flex items-center justify-between gap-3'>
      <Link
        href={`/u/${requester.id}`}
        className='flex items-center gap-3 flex-1 hover:bg-accent rounded transition px-2 py-1'
      >
        <Avatar className='w-8 h-8'>
          <AvatarImage src={requester.avatarUrl ?? undefined} alt={requester.username} />
          <AvatarFallback>{requester.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className='font-medium'>
            {requester.firstName} {requester.lastName}
          </div>
          <div className='text-xs text-muted-foreground'>@{requester.username}</div>
        </div>
      </Link>
      <div className='flex gap-2'>
        <Button size='sm' onClick={onAccept}>
          Accept
        </Button>
        <Button size='sm' variant='destructive' onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  )
}
