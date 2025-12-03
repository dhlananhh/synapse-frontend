import { Community, CommunityMembership } from '@/types/services/community'
import { Lock, TriangleAlert, Plus, LogOut, X, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { communityService } from '@/modules/services/community-service'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface CommunityHeaderProps {
  community: Community
  membership: CommunityMembership | null
  onMembershipChange?: (membership: CommunityMembership | null) => void
}

export default function CommunityHeader({
  community,
  membership,
  onMembershipChange,
}: CommunityHeaderProps) {
  const [loading, setLoading] = useState<'join' | 'cancel' | 'leave' | null>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  // Handler for joining community
  const handleJoin = async () => {
    setLoading('join')
    try {
      await communityService.joinCommunity(community.id)
      if (onMembershipChange) {
        const updated = await communityService.getMembership(community.name)
        onMembershipChange(updated)
      }
    } finally {
      setLoading(null)
    }
  }

  // Handler for cancel join request
  const handleCancelJoin = async () => {
    setLoading('cancel')
    try {
      await communityService.cancelJoinRequest(community.id)
      if (onMembershipChange) {
        const updated = await communityService.getMembership(community.name)
        onMembershipChange(updated)
      }
    } finally {
      setLoading(null)
    }
  }

  // Handler for leaving community (with confirmation)
  const handleLeave = async () => {
    setShowLeaveConfirm(false)
    setLoading('leave')
    try {
      await communityService.leaveCommunity(community.id)
      if (onMembershipChange) {
        // After leaving, membership will be null
        onMembershipChange(null)
      }
    } finally {
      setLoading(null)
    }
  }

  // Membership control button
  let membershipControl: React.ReactNode = null
  if (!membership) {
    membershipControl = (
      <Button variant='default' size='sm' onClick={handleJoin} disabled={loading === 'join'}>
        <Plus className='w-4 h-4 mr-1' />
        Join
      </Button>
    )
  } else if (membership.status === 'PENDING') {
    membershipControl = (
      <Button
        variant='outline'
        size='sm'
        onClick={handleCancelJoin}
        disabled={loading === 'cancel'}
      >
        <X className='w-4 h-4 mr-1' />
        Cancel join request
      </Button>
    )
  } else if (membership.status === 'ACTIVE') {
    if (membership.role === 'MODERATOR' || membership.role === 'MEMBER') {
      membershipControl = (
        <>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowLeaveConfirm(true)}
            disabled={loading === 'leave'}
          >
            <LogOut className='w-4 h-4 mr-1' />
            Leave
          </Button>
          <ConfirmDialog
            open={showLeaveConfirm}
            title='Leave Community'
            description='Are you sure you want to leave this community?'
            confirmText='Leave'
            onConfirm={handleLeave}
            onOpenChange={setShowLeaveConfirm}
            isConfirming={loading === 'leave'}
          />
        </>
      )
    }
    // OWNER: no button
  }
  // BANNED: no button

  // Show "Create Post" for all ACTIVE members
  const showCreatePost = membership && membership.status === 'ACTIVE'

  return (
    <div className='rounded-lg bg-background shadow mb-6 overflow-hidden'>
      {/* Banner */}
      <div className='w-full h-40 bg-muted relative rounded-lg'>
        {community.bannerUrl && (
          <img
            src={community.bannerUrl}
            alt={`${community.name} banner`}
            className='w-full h-full object-cover rounded-lg'
          />
        )}
        {/* Avatar overlay with z-index */}
        <div className='absolute left-8 -bottom-15 z-10'>
          <div className='w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-background shadow-lg'>
            {community.avatarUrl ? (
              <img
                src={community.avatarUrl}
                alt={community.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <span className='text-muted-foreground text-3xl'>
                {community.name && community.name.length > 0
                  ? community.name[0].toUpperCase()
                  : '?'}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Name and badges row below the banner and avatar */}
      <div className='flex items-center gap-2 px-8 mt-4 ml-28 font-bold text-xl'>
        c/{community.name}
        {community.status === 'PRIVATE' && (
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-700 text-white text-xs font-bold'>
            <Lock className='w-4 h-4' />
            Private
          </span>
        )}
        {/* Action buttons */}
        <div className='ml-auto flex gap-2'>
          {membershipControl}
          {showCreatePost && (
            <Button variant='secondary' size='sm'>
              <Pencil className='w-4 h-4 mr-1' />
              Create Post
            </Button>
          )}
        </div>
      </div>
      {/* Add extra bottom padding to push content below the overlay */}
      <div className='pb-10' />
    </div>
  )
}
