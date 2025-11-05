import React, { useEffect, useState } from 'react'
import { ResolvedItem } from '@/types/services/report'
import { userService } from '@/modules/services/user-service'
import { SimpleProfile } from '@/types/services/user'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { restoreResolvedTarget } from '@/modules/services/report-service'
import { useCommunity } from '@/context/CommunityContext'

interface ResolvedItemCardProps {
  item: ResolvedItem
  updateResolvedState: (itemId: string) => void
}

export default function ResolvedItemCard({ item, updateResolvedState }: ResolvedItemCardProps) {
  const community = useCommunity() // Use community context to get communityId
  const [actorProfile, setActorProfile] = useState<SimpleProfile | null>(null)
  const [authorProfile, setAuthorProfile] = useState<SimpleProfile | null>(null)

  const handleRestore = async () => {
    if (!community?.id) {
      toast.error('Community ID is missing.')
      return
    }

    try {
      await restoreResolvedTarget({
        communityId: community.id, // Use communityId from context
        targetType: item.target.type as 'POST' | 'COMMENT',
        targetId: item.target.id,
        reason: null, // Optional reason can be added here
      })
      toast.success('Item restored successfully.')
      updateResolvedState(item.id) // Update the state after restoring
    } catch (error) {
      console.error('Failed to restore resolved item:', error)
      toast.error('Failed to restore item. Please try again.')
    }
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await userService.getSimpleProfiles([item.actorId, item.target.authorId])
        setActorProfile(profiles.find((profile) => profile.id === item.actorId) || null)
        setAuthorProfile(profiles.find((profile) => profile.id === item.target.authorId) || null)
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
      }
    }

    fetchProfiles()
  }, [item.actorId, item.target.authorId])

  return (
    <div className='border rounded-lg p-4 shadow-sm bg-muted mb-4 relative'>
      {/* Actions Dropdown */}
      <div className='absolute top-2 right-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='p-2 rounded-full hover:bg-gray-200' aria-label='Actions'>
              <MoreHorizontal className='w-5 h-5 text-gray-500' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={handleRestore}>
              <RefreshCw className='w-4 h-4 mr-2 text-green-500' /> Restore
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Type and Action */}
      <div className='flex items-center gap-2'>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            item.target.type === 'POST'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-green-200 text-green-800'
          }`}
        >
          {item.target.type}
        </span>
        <span className='text-xs font-medium bg-gray-200 px-2 py-1 rounded'>{item.action}</span>
      </div>

      {/* Resolver */}
      <div className='flex items-center gap-2 mt-2'>
        <Avatar className='w-8 h-8'>
          <AvatarImage
            src={actorProfile?.avatarUrl || ''}
            alt={actorProfile?.username || 'Unknown'}
          />
          <AvatarFallback>{actorProfile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <p className='text-sm text-gray-500'>
          Resolved by{' '}
          <span className='font-medium text-primary'>u/{actorProfile?.username || 'Unknown'}</span>{' '}
          {formatDistanceToNow(new Date(item.resolvedAt), { addSuffix: true })}
        </p>
      </div>
      {/* Horizontal Separator */}
      <hr className='my-4 border-gray-300' />

      {/* Content */}
      <div className='mt-2'>
        {item.target.type === 'POST' && (
          <p className='text-lg font-bold'>{item.target.title || 'No title available'}</p>
        )}
        {item.target.type === 'COMMENT' && (
          <>
            <div className='flex items-center gap-2 mt-2'>
              <Avatar className='w-6 h-6'>
                <AvatarImage
                  src={authorProfile?.avatarUrl || ''}
                  alt={authorProfile?.username || 'Unknown'}
                />
                <AvatarFallback>
                  {authorProfile?.username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <p className='text-sm text-gray-500'>
                <span className='font-medium text-primary'>
                  u/{authorProfile?.username || 'Unknown'}
                </span>
              </p>
            </div>
            <p className='text-sm text-gray-500'>{item.target.content || 'No content available'}</p>
          </>
        )}
      </div>

      {/* Enhanced Reason */}
      {item.reason && (
        <div className='mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3'>
          <p className='text-sm font-bold text-yellow-800'>Reason: {item.reason}</p>
        </div>
      )}
    </div>
  )
}
