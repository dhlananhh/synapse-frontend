'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { ModerationAction } from '@/types/services/post'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { userService } from '@/modules/services/user-service'
import { CheckCircle2, XCircle, Trash2, User2 } from 'lucide-react'

interface ModerationActionCardProps {
  action: ModerationAction
}

interface SimpleProfile {
  id: string
  username: string
  avatarUrl?: string | null
}

const ACTION_STYLES: Record<
  string,
  {
    label: string
    labelColor: string
    icon: React.ReactNode
    color: string
    bg: string
    border: string
  }
> = {
  APPROVED: {
    label: 'Approved',
    labelColor: 'text-green-700',
    icon: <CheckCircle2 className='w-4 h-4 text-green-600' />,
    color: 'text-green-300',
    bg: 'bg-green-700',
    border: 'border-green-200',
  },
  REJECTED: {
    label: 'Rejected',
    labelColor: 'text-red-700',
    icon: <XCircle className='w-4 h-4 text-red-600' />,
    color: 'text-red-200',
    bg: 'bg-red-700',
    border: 'border-red-400',
  },
  'DELETED BY MOD': {
    label: 'Deleted by Moderator',
    labelColor: '',
    icon: <Trash2 className='w-4 h-4 text-orange-600' />,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  'DELETED BY AUTHOR': {
    label: 'Deleted by Author',
    labelColor: '',
    icon: <User2 className='w-4 h-4 text-gray-600' />,
    color: 'text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  },
}

export default function ModerationActionCard({ action }: ModerationActionCardProps) {
  const [actor, setActor] = useState<SimpleProfile | null>(null)
  const style = ACTION_STYLES[action.action] || {
    label: action.action,
    icon: null,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    border: 'border-muted-foreground/20',
  }

  useEffect(() => {
    if (!action.actorId) return
    userService
      .getSimpleProfiles([action.actorId])
      .then((profile) => {
        setActor(profile[0])
      })
      .catch(() => setActor(null))
  }, [action.actorId])

  return (
    <div
      className={`rounded-lg border-3 ${style.border} ${style.bg} p-4 shadow-sm mb-4 transition-all`}
    >
      <div className='flex items-center gap-3 mb-2'>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-xs uppercase tracking-wide ${style.labelColor} bg-white/70 border ${style.border}`}
        >
          {style.icon}
          {style.label}
        </span>
        <span className={`text-xs text-muted-foreground ${style.color}`}>
          {format(new Date(action.createdAt), 'yyyy-MM-dd HH:mm')}
        </span>
      </div>
      <div className='text-sm mb-2'>
        <span className='font-medium text-foreground'>Reason:</span>{' '}
        {action.reason ? (
          <span className='italic text-foreground'>"{action.reason}"</span>
        ) : (
          <span className='italic text-muted-foreground'>No reason provided</span>
        )}
      </div>
      {/* Actor info wrapper */}
      <div className='mt-2'>
        <div className='inline-flex items-center gap-2'>
          <Avatar className='h-6 w-6'>
            <AvatarImage src={actor?.avatarUrl || ''} alt={actor?.username || ''} />
            <AvatarFallback>{actor?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <span className='text-sm font-semibold text-foreground'>
            u/{actor?.username || 'Unknown user'}
          </span>
        </div>
      </div>
    </div>
  )
}
