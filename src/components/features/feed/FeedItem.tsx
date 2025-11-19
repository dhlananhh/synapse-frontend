import React, { useEffect, useState } from 'react'
import { FeedItem as FeedItemType } from '@/types/services/feed'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import FeedActions from './FeedActions'
import { MoreHorizontal, Flag } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import MediaViewer from './MediaViewer'
import LinkViewer from './LinkViewer'
import { useRouter } from 'next/navigation'
import ReportDialog from '@/components/features/report/ReportDialog'
import { useAuth } from '@/context/AuthContext' // Import AuthContext
import type { CommunityFlair } from '@/types/services/community'

interface FeedItemProps {
  item: FeedItemType
  initialVote: 'UPVOTE' | 'DOWNVOTE' | null // User's current vote
  flair?: CommunityFlair | null // optional flair info when in community context
}

export default function FeedItem({ item, initialVote, flair }: FeedItemProps) {
  const router = useRouter()
  const { user } = useAuth() // Get the current user from AuthContext
  const [currentVote, setCurrentVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(initialVote)
  const [isReportDialogOpen, setReportDialogOpen] = useState(false) // State for the report dialog

  // Sync the currentVote state with initialVote whenever it changes
  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const goToPost = () => router.push(`/c/${item.community.name}/posts/${item.postId}`)
  const goToCommunity = () => router.push(`/c/${item.community.name}`)

  const isAuthor = user?.id === item.authorId // Check if the current user is the author

  return (
    <div className='block bg-muted border border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative'>
      {/* Options Menu */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger className='absolute top-2 right-4'>
            <div className='text-gray-500 hover:text-primary rounded-full p-2 hover:bg-gray-600 transition-colors cursor-pointer'>
              <MoreHorizontal className='h-6 w-6' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-gray-700 border-gray-700 shadow-md relative -top-2 right-10'>
            {/* Display the report option only if the current user is not the author */}
            {!isAuthor && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  setReportDialogOpen(true) // Open the report dialog
                }}
              >
                <Flag className='w-5 h-5' />
                Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header Section */}
      <div className='flex items-center gap-3 mb-4'>
        {/* Community Avatar */}
        <Avatar className='w-8 h-8 border border-gray-400'>
          <AvatarImage
            src={item.community.avatarUrl || '/images/default-avatar.png'}
            alt={item.community.name}
          />
          <AvatarFallback>{item.community.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Community Name and Timestamp */}
        <div>
          <button
            type='button'
            className='text-sm font-medium hover:underline text-primary bg-transparent p-0'
            onClick={(e) => {
              e.stopPropagation()
              goToCommunity()
            }}
          >
            c/{item.community.name}
          </button>
          <p className='text-xs text-gray-500'>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Title */}
      <h3
        className='font-bold text-2xl mb-2 cursor-pointer hover:underline'
        onClick={(e) => {
          e.stopPropagation()
          goToPost()
        }}
      >
        {item.title}
      </h3>

      {/* Flair badge (only shown when flair prop provided) */}
      {flair && (
        <div className='mb-3'>
          <span
            className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-full'
            style={{
              backgroundColor: flair.color ?? '#CBD5E1',
              color: '#fff',
            }}
          >
            {flair.name}
          </span>
        </div>
      )}

      <p className='text-md text-gray-400 mb-4'>{item.contentPreview}</p>

      {/* Media Viewer */}
      {item.media.length > 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <MediaViewer media={item.media} />
        </div>
      )}

      {/* Link Viewer */}
      {item.links.length > 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <LinkViewer links={item.links} />
        </div>
      )}

      {/* Interactive Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <FeedActions
          communityName={item.community.name}
          postId={item.postId}
          score={item.scores.score}
          commentCount={item.metrics.commentCount}
          shareCount={item.metrics.shareCount}
          initialVote={currentVote} // Pass the synced vote state
        />
      </div>

      {/* Report Dialog */}
      <div onClick={(e) => e.stopPropagation()}>
        <ReportDialog
          isOpen={isReportDialogOpen}
          onClose={() => setReportDialogOpen(false)} // Close the dialog
          communityId={item.community.communityId}
          targetType='POST'
          targetId={item.postId}
        />
      </div>
    </div>
  )
}
