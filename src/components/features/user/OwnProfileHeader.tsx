'use client'

import React, { useEffect, useState } from 'react'
import { GeneralProfileCard } from './GeneralProfileCard'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/modules/services/user-service'
import { UserProfile } from '@/types/services/user'
import UserProfileSkeleton from '@/components/features/user/UserProfileSkeleton'
import { UpdateProfileDialog } from './UpdateProfileDialog'
import { PrivacyToggle } from './PrivacyToggle'
import { PendingRequestsDialog } from './PendingRequestsDialog'

export function OwnProfileHeader() {
  const { user: currentUser, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && currentUser?.id) {
      setLoading(true)
      userService
        .getUserProfile(currentUser.id)
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setLoading(false))
    }
  }, [isLoading, currentUser?.id])

  if (isLoading || loading) return <UserProfileSkeleton />
  if (!profile)
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <h2 className='text-xl font-semibold mb-2'>Profile not found</h2>
        <p className='text-muted-foreground mb-4'>Unable to load your profile.</p>
      </div>
    )

  return (
    <div className='flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-card border rounded-lg'>
      <GeneralProfileCard profile={profile} />
      {/* Own-specific controls below */}
      <div className='mt-4 flex flex-col justify-between min-h-[150px] h-full items-end flex-1'>
        <PrivacyToggle
          profile={profile}
          onPrivacyChange={(newPrivacy) => setProfile({ ...profile, isPrivate: newPrivacy })}
        />
        <PendingRequestsDialog />
        <UpdateProfileDialog profile={profile} onProfileUpdate={setProfile} />
      </div>
    </div>
  )
}
