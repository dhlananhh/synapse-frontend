'use client'

import React from 'react'
import type { Notification } from '@/types/services/notification'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type Props = {
  notification: Notification
  onClick?: () => void
  className?: string
}

export default function NotificationItem({ notification, onClick, className = '' }: Props) {
  const timeLabel = (() => {
    if (!notification?.createdAt) return ''
    try {
      return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    } catch {
      return notification.createdAt
    }
  })()

  return (
    <button
      type='button'
      onClick={onClick}
      className={`w-full text-left p-3 hover:bg-muted/50 transition flex gap-3 items-start ${className}`}
    >
      <div className='mt-0.5 h-3 w-3 rounded-full bg-primary/80 flex-shrink-0' />

      <div className='flex-1 flex flex-col'>
        {/* Title (row 1) */}
        <div className='font-medium text-sm break-words'>{notification.title}</div>

        {/* Timestamp (row 2) */}
        <div
          className='text-xs text-muted-foreground mt-1 flex items-center gap-1'
          title={notification.createdAt}
        >
          <Clock className='w-3 h-3' />
          <span>{timeLabel}</span>
        </div>

        {/* Message (row 3) */}
        {notification.message && (
          <div className='text-sm text-muted-foreground mt-2 leading-snug break-words'>
            {notification.message}
          </div>
        )}
      </div>
    </button>
  )
}
