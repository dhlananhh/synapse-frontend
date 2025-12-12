import React, { useEffect, useState } from 'react'
import { ReportedPost } from '@/types/services/report'
import { formatDistanceToNow } from 'date-fns'
import { userService } from '@/modules/services/user-service'
import { SimpleProfile } from '@/types/services/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import ReportProgressBar from '@/components/features/report/ReportProgressBar'
import ReasonDetailsAccordion from '@/components/features/report/ReasonDetailsAccordion'
import Link from 'next/link'
import { useCommunity } from '@/context/CommunityContext'

interface ReportedPostCardProps {
  post: ReportedPost
}

export default function ReportedPostCard({ post }: ReportedPostCardProps) {
  const [authorProfile, setAuthorProfile] = useState<SimpleProfile | null>(null)
  const community = useCommunity()

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const profiles = await userService.getSimpleProfiles([post.authorId])
        setAuthorProfile(profiles[0])
      } catch (error) {
        console.error('Failed to fetch author profile:', error)
      }
    }

    fetchAuthorProfile()
  }, [post.authorId])

  return (
    <div className='border rounded-lg p-4 shadow-sm bg-muted mb-4'>
      {/* Post Metadata */}
      <div className='mb-2 flex items-center gap-3'>
        {/* Author Avatar */}
        <Avatar className='w-10 h-10 border border-gray-400'>
          <AvatarImage
            src={authorProfile?.avatarUrl || ''}
            alt={authorProfile?.username || post.authorId}
          />
          <AvatarFallback>
            {authorProfile?.username?.charAt(0).toUpperCase() ||
              post.authorId.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Author Name and Timestamp */}
        <div>
          <Link
            href={`/u/${post.authorId}`}
            className='text-sm font-medium text-primary hover:underline'
          >
            {authorProfile?.username ? `u/${authorProfile.username}` : `u/${post.authorId}`}
          </Link>
          <p className='text-xs text-gray-500'>
            Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Title */}
      <Link
        href={`/c/${community?.name}/posts/${post.id}`}
        className='text-lg font-bold text-primary hover:underline'
      >
        {post.title}
      </Link>

      {/* Aggregated Report Data */}
      <div className='mt-2'>
        <ReportProgressBar
          reasonProportions={post.reasonProportions.map((reason) => ({
            reason: reason.reason,
            proportion: reason.proportion,
            count: reason.count,
          }))}
          totalReports={post.totalReports}
        />
      </div>

      {/* Last Reported At */}
      <div className='mt-4'>
        <p className='text-sm font-medium'>
          Last Reported: {formatDistanceToNow(new Date(post.lastReportAt), { addSuffix: true })}
        </p>
      </div>
      {/* Reason Details Accordion */}
      <div className='mt-4 border-t-2'>
        <ReasonDetailsAccordion reasonDetails={post.reasonDetails} />
      </div>
    </div>
  )
}
