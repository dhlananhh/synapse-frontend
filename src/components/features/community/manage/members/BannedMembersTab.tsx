'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { CommunityMember } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import { MemberCard } from './MemberCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UserX, Search, X } from 'lucide-react'
import { ActionConfirmDialog } from './ActionConfirmDialog' // confirm dialog

interface BannedMembersTabProps {
  communityId: string
  currentUserRole?: 'OWNER' | 'MODERATOR' | 'MEMBER'
}

export function BannedMembersTab({ communityId, currentUserRole }: BannedMembersTabProps) {
  const [bannedMembers, setBannedMembers] = useState<CommunityMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  // Ask-confirm state for unban
  const [confirmUnban, setConfirmUnban] = useState<{ userId: string; username: string } | null>(
    null
  )
  const [isConfirming, setIsConfirming] = useState(false)

  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500)
    return () => clearTimeout(id)
  }, [searchTerm])

  // Fetch banned members (supports cursor + q)
  const fetchBannedMembers = useCallback(
    async (cursor?: string | null) => {
      const loadingSetter = cursor ? setIsLoadingMore : setIsLoading
      loadingSetter(true)
      try {
        const response = await communityService.getBannedMembers(communityId, {
          cursor: cursor ?? null,
          q: debouncedSearch || undefined,
        })
        const newMembers = response.members || []

        setBannedMembers((prev) => (cursor ? [...prev, ...newMembers] : newMembers))
        setHasMore(response.pagination?.hasMore ?? false)
        setNextCursor(response.pagination?.nextCursor ?? null)
      } catch (error) {
        toast.error('Failed to load the list of banned members.')
        console.error('Fetch Banned Members Error:', error)
      } finally {
        loadingSetter(false)
      }
    },
    [communityId, debouncedSearch]
  )

  // Initial + search refresh
  useEffect(() => {
    fetchBannedMembers(undefined)
  }, [fetchBannedMembers])

  // Open confirm dialog instead of unbanning immediately
  const handleUnban = (userId: string, username: string) => {
    setConfirmUnban({ userId, username })
  }

  // Perform unban after confirmation
  const performUnban = async () => {
    if (!confirmUnban) return
    const { userId, username } = confirmUnban
    const originalMembers = [...bannedMembers]
    setIsConfirming(true)

    // optimistic UI
    setBannedMembers((prev) => prev.filter((member) => member.userId !== userId))

    try {
      await communityService.unbanMember(communityId, userId)
      toast.success(`User @${username} has been unbanned successfully!`)
    } catch (error: any) {
      setBannedMembers(originalMembers)
      toast.error(`Failed to unban @${username}.`, {
        description: error?.response?.data?.message || 'Please try again.',
      })
    } finally {
      setIsConfirming(false)
      setConfirmUnban(null)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (bannedMembers.length === 0 && !debouncedSearch) {
    return (
      <div className='p-8'>
        <div className='mb-4 flex items-center gap-2'>
          <div className='relative w-full'>
            <Search className='pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search banned members by username…'
              className='pl-8'
            />
            {searchTerm && (
              <button
                type='button'
                className='absolute right-2 top-2.5 rounded p-0.5 text-muted-foreground hover:text-foreground'
                onClick={() => setSearchTerm('')}
                aria-label='Clear search'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>

        <div className='text-center'>
          <UserX className='text-muted-foreground mx-auto h-12 w-12' />
          <h3 className='mt-4 text-lg font-semibold'>No Banned Members</h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            There are currently no members banned from this community.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search bar */}
      <div className='mb-4 flex items-center gap-2'>
        <div className='relative w-full'>
          <Search className='pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search banned members by username…'
            className='pl-8'
          />
          {searchTerm && (
            <button
              type='button'
              className='absolute right-2 top-2.5 rounded p-0.5 text-muted-foreground hover:text-foreground'
              onClick={() => setSearchTerm('')}
              aria-label='Clear search'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      </div>

      {bannedMembers.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserRole={currentUserRole}
          onUnban={handleUnban} // open confirm dialog
        />
      ))}

      {hasMore && (
        <div className='flex justify-center border-t p-4'>
          <Button
            variant='outline'
            onClick={() => fetchBannedMembers(nextCursor)}
            disabled={isLoadingMore}
          >
            {isLoadingMore && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Load More
          </Button>
        </div>
      )}

      {/* Unban confirmation dialog */}
      <ActionConfirmDialog
        isOpen={!!confirmUnban}
        onOpenChange={() => setConfirmUnban(null)}
        title={confirmUnban ? `Unban @${confirmUnban.username}?` : 'Unban'}
        description='This will restore the user’s ability to participate in the community.'
        actionLabel='Confirm Unban'
        isConfirming={isConfirming}
        onConfirm={performUnban}
      />
    </div>
  )
}
