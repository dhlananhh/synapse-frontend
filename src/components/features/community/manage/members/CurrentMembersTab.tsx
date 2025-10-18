'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { CommunityMember } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import { MemberCard } from '@/components/features/community/manage/members/MemberCard'
import { ActionConfirmDialog } from '@/components/features/community/manage/members/ActionConfirmDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, User, Search } from 'lucide-react'

interface CurrentMembersTabProps {
  communityId: string
  currentUserRole?: 'OWNER' | 'MODERATOR' | 'MEMBER'
}

interface ActionState {
  type: 'ban' | 'remove' | 'promote' | 'demote'
  userId: string
  username: string
}

export function CurrentMembersTab({ communityId, currentUserRole }: CurrentMembersTabProps) {
  const [members, setMembers] = useState<CommunityMember[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 1000) // 1 second delay

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const [actionState, setActionState] = useState<ActionState | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const fetchMembers = useCallback(
    async (isNewSearch: boolean) => {
      const cursor = isNewSearch ? null : nextCursor
      const loadingSetter = isNewSearch ? setIsLoading : setIsLoadingMore
      loadingSetter(true)

      try {
        const response = await communityService.getMembers(communityId, {
          q: debouncedSearchTerm,
          cursor: cursor,
        })
        const newMembers = response.members || []

        setMembers((prev) => (isNewSearch ? newMembers : [...prev, ...newMembers]))
        setHasMore(response.pagination?.hasMore ?? false)
        setNextCursor(response.pagination?.nextCursor ?? null)
      } catch (error) {
        toast.error('Failed to load community members.')
      } finally {
        loadingSetter(false)
      }
    },
    [communityId, debouncedSearchTerm, nextCursor]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [debouncedSearchTerm])

  const handleTriggerAction = (userId: string, username: string, action: ActionState['type']) => {
    setActionState({ type: action, userId, username })
  }

  const performAction = async (reason?: string) => {
    if (!actionState) return
    const { userId, username, type: action } = actionState

    // Require reason for ban and remove
    if ((action === 'ban' || action === 'remove') && !reason?.trim()) {
      toast.error(`Please provide a reason to ${action} this user.`)
      return
    }

    setIsConfirming(true)
    const originalMembers = [...members]
    let actionToastId: string | number | undefined = toast.loading(
      `Performing action: ${action}...`
    )

    try {
      if (action === 'ban' || action === 'remove')
        setMembers((prev) => prev.filter((m) => m.userId !== userId))
      else if (action === 'promote')
        setMembers((prev) =>
          prev.map((m) => (m.userId === userId ? { ...m, role: 'MODERATOR' } : m))
        )
      else if (action === 'demote')
        setMembers((prev) => prev.map((m) => (m.userId === userId ? { ...m, role: 'MEMBER' } : m)))

      switch (action) {
        case 'ban':
          await communityService.banMember(communityId, userId, { reason: reason!.trim() })
          break
        case 'remove':
          await communityService.removeMember(communityId, userId, { reason: reason!.trim() })
          break
        case 'promote':
          await communityService.promoteMember(communityId, userId, {
            reason: reason?.trim() || undefined,
          })
          break
        case 'demote':
          await communityService.demoteMember(communityId, userId, {
            reason: reason?.trim() || undefined,
          })
          break
      }

      toast.success(`Successfully performed "${action}" on @${username}.`, { id: actionToastId })
    } catch (error: any) {
      setMembers(originalMembers)
      toast.error(`Failed to ${action} @${username}.`, {
        description: error.response?.data?.message || 'Please try again.',
        id: actionToastId,
      })
    } finally {
      setIsConfirming(false)
      setActionState(null)
    }
  }

  const renderContent = () => {
    if (isLoading && members.length === 0) {
      return (
        <div className='flex justify-center p-8'>
          <Loader2 className='animate-spin' />
        </div>
      )
    }

    if (members.length === 0) {
      return (
        <div className='p-8 text-center'>
          <User className='text-muted-foreground mx-auto h-12 w-12' />
          <h3 className='mt-4 font-semibold'>No members found</h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            {searchTerm
              ? 'Try a different search term.'
              : 'This community has no other members yet.'}
          </p>
        </div>
      )
    }

    return (
      <div>
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserRole={currentUserRole}
            // Các hàm này bây giờ sẽ mở dialog
            onBan={(userId, username) => handleTriggerAction(userId, username, 'ban')}
            onRemove={(userId, username) => handleTriggerAction(userId, username, 'remove')}
            onPromote={(userId, username) => handleTriggerAction(userId, username, 'promote')}
            onDemote={(userId, username) => handleTriggerAction(userId, username, 'demote')}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Search Bar */}
      <div className='relative border-b p-3'>
        <Search className='text-muted-foreground absolute top-1/2 left-6 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Search by username...'
          className='pl-8'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {renderContent()}

      {/* Load More Button */}
      {hasMore && (
        <div className='flex justify-center border-t p-4'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => fetchMembers(false)}
            disabled={isLoadingMore}
          >
            {isLoadingMore && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Load More
          </Button>
        </div>
      )}

      <ActionConfirmDialog
        isOpen={!!actionState}
        onOpenChange={() => setActionState(null)}
        title={`Are you sure you want to ${actionState?.type} @${actionState?.username}?`}
        description={
          actionState?.type === 'ban'
            ? 'This user will be permanently banned and removed.'
            : actionState?.type === 'remove'
            ? 'This user will be removed from the community.'
            : actionState?.type === 'promote'
            ? 'This will grant the user moderator permissions.'
            : 'This will remove moderator permissions from the user.'
        }
        actionLabel={`Confirm ${actionState?.type}`}
        isConfirming={isConfirming}
        withReason={
          actionState
            ? {
                label:
                  actionState.type === 'promote'
                    ? 'Reason for promotion (optional)'
                    : actionState.type === 'demote'
                    ? 'Reason for demotion (optional)'
                    : actionState.type === 'ban'
                    ? 'Reason for ban (required)'
                    : actionState.type === 'remove'
                    ? 'Reason for removal (required)'
                    : 'Reason (optional)',
                placeholder:
                  actionState.type === 'ban' || actionState.type === 'remove'
                    ? 'Provide a reason (required)...'
                    : 'Provide a reason...',
              }
            : undefined
        }
        onConfirm={performAction}
      />
    </div>
  )
}
