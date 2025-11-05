import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { userService } from '@/modules/services/user-service'
import { SimpleProfile } from '@/types/services/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import ReportProgressBar from '@/components/features/report/ReportProgressBar'
import ReasonDetailsAccordion from '@/components/features/report/ReasonDetailsAccordion'
import Link from 'next/link'
import { useCommunity } from '@/context/CommunityContext'
import ReportedItemActions from '@/components/features/report/ReportedItemActions'

interface ReportedItemCardProps {
  item: {
    id: string
    title?: string // For posts
    content?: string // For comments
    authorId: string
    communityId: string
    createdAt: string
    updatedAt: string
    totalReports: number
    reasonProportions: {
      reason:
        | 'SPAM'
        | 'HARASSMENT'
        | 'HATE_SPEECH'
        | 'NSFW_CONTENT'
        | 'VIOLENCE'
        | 'MISINFORMATION'
        | 'ILLEGAL_ACTIVITY'
        | 'SELF_HARM'
        | 'IMPERSONATION'
        | 'COPYRIGHT'
        | 'OFF_TOPIC'
        | 'OTHER'
      count: number
      proportion: number
    }[]
    lastReportAt: string
    reasonDetails: string[]
  }
  type: 'POST' | 'COMMENT' // Specify whether it's a post or a comment
  updateState: (itemId: string, type: 'POST' | 'COMMENT') => void // Callback to update state
}

export default function ReportedItemCard({ item, type, updateState }: ReportedItemCardProps) {
  const [authorProfile, setAuthorProfile] = useState<SimpleProfile | null>(null)
  const community = useCommunity()

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const profiles = await userService.getSimpleProfiles([item.authorId])
        setAuthorProfile(profiles[0])
      } catch (error) {
        console.error('Failed to fetch author profile:', error)
      }
    }

    fetchAuthorProfile()
  }, [item.authorId])

  return (
    <div className='border rounded-lg p-4 shadow-sm bg-muted mb-4 relative'>
      {/* Actions */}
      <div className='absolute top-2 right-2'>
        <ReportedItemActions itemId={item.id} targetType={type} updateState={updateState} />
      </div>

      {/* Item Metadata */}
      <div className='mb-2 flex items-center gap-3'>
        {/* Author Avatar */}
        <Avatar className='w-10 h-10 border border-gray-400'>
          <AvatarImage
            src={authorProfile?.avatarUrl || ''}
            alt={authorProfile?.username || item.authorId}
          />
          <AvatarFallback>
            {authorProfile?.username?.charAt(0).toUpperCase() ||
              item.authorId.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Author Name and Timestamp */}
        <div>
          <Link
            href={`/u/${item.authorId}`}
            className='text-sm font-medium text-primary hover:underline'
          >
            {authorProfile?.username ? `u/${authorProfile.username}` : `u/${item.authorId}`}
          </Link>
          <p className='text-xs text-gray-500'>
            Created {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Horizontal Separator */}
      <hr className='my-4 border-gray-300' />

      {/* Item Title or Content */}
      {type === 'POST' ? (
        <Link
          href={`/c/${community?.name}/posts/${item.id}`}
          className='text-lg font-bold text-primary hover:underline'
        >
          {item.title}
        </Link>
      ) : (
        <p className='text-lg font-bold text-primary'>{item.content}</p>
      )}

      {/* Aggregated Report Data */}
      <div className='mt-2'>
        <ReportProgressBar
          reasonProportions={item.reasonProportions.map((reason) => ({
            reason: reason.reason,
            proportion: reason.proportion,
            count: reason.count,
          }))}
          totalReports={item.totalReports}
        />
      </div>

      {/* Last Reported At */}
      <div className='mt-4'>
        <p className='text-sm font-medium'>
          Last Reported: {formatDistanceToNow(new Date(item.lastReportAt), { addSuffix: true })}
        </p>
      </div>

      {/* Reason Details Accordion */}
      <div className='mt-4 border-t-2'>
        <ReasonDetailsAccordion reasonDetails={item.reasonDetails} />
      </div>
    </div>
  )
}
