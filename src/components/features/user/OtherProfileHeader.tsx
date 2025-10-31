'use client'

import React, { useEffect, useState } from 'react'
import { GeneralProfileCard } from './GeneralProfileCard'
import { useParams } from 'next/navigation'
import { userService } from '@/modules/services/user-service'
import { UserProfile, FollowRelationship } from '@/types/services/user'
import UserProfileSkeleton from '@/components/features/user/UserProfileSkeleton'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { createConversation } from '@/modules/services/message-service'
import { useChatStore } from '@/store/useChatStore'
import { useSocket } from '@/context/SocketContext'

export function OtherProfileHeader() {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const { joinChatRoom } = useSocket()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      userService
        .getUserProfile(userId as string)
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setLoading(false))
    }
  }, [userId])

  if (loading) return <UserProfileSkeleton />
  if (!profile)
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <h2 className='text-xl font-semibold mb-2'>Profile not found</h2>
        <p className='text-muted-foreground mb-4'>Unable to load this profile.</p>
      </div>
    )

  const relationship = profile.relationshipStatus
  const isOwnProfile = currentUser?.id === profile.id

  const handleMessage = async () => {
    try {
      setActionLoading(true)
      const conversation = await createConversation('direct', [profile.id]) // Create conversation
      useChatStore.getState().setActiveConversation(conversation) // Set active conversation in store
      useChatStore.getState().toggleChat() // Open chat component
    } catch (error) {
      console.error('Failed to create conversation:', error)
    } finally {
      setActionLoading(false)
    }
  }

  // Action handlers
  const handleFollow = async () => {
    setActionLoading(true)
    try {
      await userService.followUser(profile.id)
      const updated = await userService.getUserProfile(profile.id)
      setProfile(updated)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnfollow = async (followId: string) => {
    setActionLoading(true)
    try {
      await userService.unfollowUser(followId)
      const updated = await userService.getUserProfile(profile.id)
      setProfile(updated)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelRequest = async (followId: string) => {
    setActionLoading(true)
    try {
      await userService.cancelFollowRequest(followId)
      const updated = await userService.getUserProfile(profile.id)
      setProfile(updated)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAccept = async (followId: string) => {
    setActionLoading(true)
    try {
      await userService.acceptFollowRequest(followId)
      const updated = await userService.getUserProfile(profile.id)
      setProfile(updated)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (followId: string) => {
    setActionLoading(true)
    try {
      await userService.rejectFollowRequest(followId)
      const updated = await userService.getUserProfile(profile.id)
      setProfile(updated)
    } finally {
      setActionLoading(false)
    }
  }

  // Conditional rendering logic
  return (
    <div className='flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-card border rounded-lg'>
      <GeneralProfileCard profile={profile} />
      <div className='mt-4 flex flex-col gap-2 items-end flex-1'>
        {!isOwnProfile && (
          <>
            {/* Follow/Unfollow actions */}
            {relationship?.requesterToTarget?.status === 'ACCEPTED' && (
              <Button
                variant='default'
                disabled={actionLoading}
                onClick={() => handleUnfollow(relationship.requesterToTarget!.id)}
              >
                {actionLoading ? 'Unfollowing...' : 'Unfollow'}
              </Button>
            )}
            {relationship?.requesterToTarget?.status === 'PENDING' && (
              <Button
                variant='default'
                disabled={actionLoading}
                onClick={() => handleCancelRequest(relationship.requesterToTarget!.id)}
              >
                {actionLoading ? 'Cancelling...' : 'Cancel request'}
              </Button>
            )}
            {relationship?.targetToRequester?.status === 'PENDING' && (
              <div className='flex gap-2'>
                <Button
                  variant='default'
                  disabled={actionLoading}
                  onClick={() => handleAccept(relationship.targetToRequester!.id)}
                >
                  {actionLoading ? 'Accepting...' : 'Accept'}
                </Button>
                <Button
                  variant='destructive'
                  disabled={actionLoading}
                  onClick={() => handleReject(relationship.targetToRequester!.id)}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            )}
            {!relationship?.requesterToTarget &&
              relationship?.targetToRequester?.status === 'ACCEPTED' && (
                <Button variant='default' disabled={actionLoading} onClick={handleFollow}>
                  {actionLoading ? 'Following...' : 'Follow back'}
                </Button>
              )}
            {!relationship?.requesterToTarget && !relationship?.targetToRequester && (
              <Button variant='default' disabled={actionLoading} onClick={handleFollow}>
                {actionLoading ? 'Following...' : 'Follow'}
              </Button>
            )}

            {/* Message action */}
            <Button variant='secondary' disabled={actionLoading} onClick={handleMessage}>
              {actionLoading ? 'Messaging...' : 'Message'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
