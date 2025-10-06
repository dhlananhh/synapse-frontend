'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Lock } from 'lucide-react'
import { FollowerRecord, FollowingRecord, UserProfile } from '@/types/services/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { userService } from '@/modules/services/user-service'
import { FollowerItem } from './FollowerItem'
import { FollowingItem } from './FollowingItem'
import { FollowerList } from './FollowerList'
import { FollowingList } from './FollowingList'
import { useAuth } from '@/context/AuthContext'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'

export function GeneralProfileCard({ profile }: { profile: UserProfile }) {
  const { user: currentUser } = useAuth()
  const isOwnProfile = currentUser?.id === profile.id

  const [openType, setOpenType] = useState<'followers' | 'following' | null>(null)
  const [list, setList] = useState<FollowerRecord[] | FollowingRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!openType) return
    setLoading(true)
    const fetchList = async () => {
      try {
        if (openType === 'followers') {
          const res: FollowerRecord[] = await userService.getFollowers(profile.id)
          setList(res)
        } else {
          const res: FollowingRecord[] = await userService.getFollowing(profile.id)
          setList(res)
        }
      } catch {
        setList([])
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [openType, profile.id])

  return (
    <>
      <Avatar className='w-24 h-24 md:w-32 md:h-32 border-4 border-primary'>
        <AvatarImage src={profile.avatarUrl || undefined} alt={profile.username} />
        <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex-1 text-center md:text-left'>
        <div className='flex items-center gap-2 justify-center md:justify-start'>
          <h1 className='text-3xl font-bold'>{`${profile.firstName} ${profile.lastName}`}</h1>
          {profile.isPrivate && <Lock className='w-5 h-5 text-muted-foreground' />}
        </div>
        <p className='text-muted-foreground'>@{profile.username}</p>
        {/* Joined ... ago */}
        {profile.createdAt && (
          <p className='text-xs text-muted-foreground mt-1'>
            Joined {formatDistanceToNowStrict(parseISO(profile.createdAt), { addSuffix: true })}
          </p>
        )}
        <div className='flex gap-4 my-3 justify-center md:justify-start'>
          {isOwnProfile || !profile.isPrivate ? (
            <>
              <button
                className='font-semibold underline cursor-pointer bg-transparent border-none p-0'
                onClick={() => setOpenType('followers')}
              >
                {profile.followerCount} Followers
              </button>
              <button
                className='font-semibold underline cursor-pointer bg-transparent border-none p-0'
                onClick={() => setOpenType('following')}
              >
                {profile.followingCount} Following
              </button>
            </>
          ) : (
            <>
              <span
                className='font-semibold text-muted-foreground cursor-not-allowed select-none opacity-60'
                style={{ pointerEvents: 'none' }}
              >
                {profile.followerCount} Followers
              </span>
              <span
                className='font-semibold text-muted-foreground cursor-not-allowed select-none opacity-60'
                style={{ pointerEvents: 'none' }}
              >
                {profile.followingCount} Following
              </span>
            </>
          )}
        </div>
        {profile.bio && <p className='mt-2 text-sm'>{profile.bio}</p>}
        {profile.location && (
          <div className='flex items-center gap-1 text-sm text-muted-foreground mt-2 justify-center md:justify-start'>
            <MapPin className='w-4 h-4' />
            {profile.location}
          </div>
        )}
      </div>

      {/* Dialog for followers/following */}
      <Dialog open={!!openType} onOpenChange={() => setOpenType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{openType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          </DialogHeader>
          <div>
            {openType === 'followers' ? (
              <FollowerList userId={profile.id} />
            ) : (
              <FollowingList userId={profile.id} isOwnProfile={isOwnProfile} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
