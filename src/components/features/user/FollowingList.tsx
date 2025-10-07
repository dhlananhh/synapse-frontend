'use client'

import React, { useEffect, useState } from 'react'
import { FollowingRecord } from '@/types/services/user'
import { userService } from '@/modules/services/user-service'
import { FollowingItem } from './FollowingItem'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function FollowingList({
  userId,
  isOwnProfile,
}: {
  userId: string
  isOwnProfile?: boolean
}) {
  const [following, setFollowing] = useState<FollowingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    userService
      .getFollowing(userId)
      .then(setFollowing)
      .catch(() => setFollowing([]))
      .finally(() => setLoading(false))
  }, [userId])

  const handleUnfollow = async (targetId: string) => {
    setUnfollowingId(targetId)
    try {
      await userService.unfollowUser(targetId)
      setFollowing((prev) => prev.filter((item) => item.id !== targetId))
    } catch {
      // Optionally show error
    } finally {
      setUnfollowingId(null)
      setConfirmId(null)
    }
  }

  if (loading) return <div>Loading...</div>
  if (following.length === 0) return <div>No following found.</div>

  return (
    <>
      <ul>
        {following.map((item) => (
          <li key={item.id} className='flex items-center justify-between'>
            <Link
              href={`/profile/${item.following.id}`}
              className='block hover:bg-accent rounded transition flex-1'
            >
              <FollowingItem following={item.following} />
            </Link>
            {isOwnProfile && (
              <Button
                variant='destructive'
                size='sm'
                disabled={unfollowingId === item.id}
                onClick={() => setConfirmId(item.id)}
                className='ml-2'
              >
                {unfollowingId === item.id ? 'Unfollowing...' : 'Unfollow'}
              </Button>
            )}
          </li>
        ))}
      </ul>
      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfollow user?</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to unfollow this user?</div>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => confirmId && handleUnfollow(confirmId)}
              disabled={!!unfollowingId}
            >
              {unfollowingId ? 'Unfollowing...' : 'Unfollow'}
            </Button>
            <Button variant='outline' onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
