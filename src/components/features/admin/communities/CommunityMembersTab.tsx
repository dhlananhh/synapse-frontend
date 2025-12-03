'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { communityService } from '@/modules/services/community-service'
import { fetchResolvedItems } from '@/modules/services/report-service'
import { userService } from '@/modules/services/user-service'
import type { CommunityMember } from '@/types/services/community'
import type { ResolvedItemsResponse, ResolvedItem } from '@/types/services/report'
import type { SimpleProfile } from '@/types/services/user'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, Crown, Shield } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import ResolvedItemCard from '@/components/features/report/ResolvedItemCard' // added

type Props = {
  communityId: string
  limit?: number
}

export default function CommunityMembersTab({ communityId, limit = 20 }: Props) {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [membersNextCursor, setMembersNextCursor] = useState<string | null>(null)
  const [membersHasMore, setMembersHasMore] = useState(false)
  const [isLoadingMoreMembers, setIsLoadingMoreMembers] = useState(false)

  const [membershipResolved, setMembershipResolved] = useState<ResolvedItem[]>([])
  const [loadingMembershipResolved, setLoadingMembershipResolved] = useState(false)

  // profiles for members (batched)
  const [profilesMap, setProfilesMap] = useState<Record<string, SimpleProfile>>({})

  // accordion state for members section
  const [membersOpen, setMembersOpen] = useState<boolean>(true)

  // search + role filter
  const [q, setQ] = useState<string>('')
  const [debouncedQ, setDebouncedQ] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('') // OWNER | MODERATOR | MEMBER | ''

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 350)
    return () => clearTimeout(t)
  }, [q])

  const fetchMembers = useCallback(
    async (opts?: { cursor?: string | null; append?: boolean }) => {
      if (!communityId) return
      const { cursor = null, append = false } = opts || {}
      if (!append) setLoadingMembers(true)

      try {
        const params: Record<string, any> = { limit }
        if (cursor) params.cursor = cursor
        if (debouncedQ) params.q = debouncedQ
        if (selectedRole) params.role = selectedRole
        const resp = await communityService.getMembers(communityId, params)
        const items = Array.isArray(resp?.members) ? resp.members : []
        if (append) setMembers((prev) => [...prev, ...items])
        else setMembers(items)

        setMembersHasMore(Boolean(resp?.pagination?.hasMore))
        setMembersNextCursor(resp?.pagination?.nextCursor ?? null)

        // batch fetch simple profiles for members we don't have yet
        const ids = Array.from(
          new Set(items.map((m) => m.userId ?? m.id).filter(Boolean))
        ) as string[]
        const missing = ids.filter((id) => !profilesMap[id])
        if (missing.length > 0) {
          try {
            const profiles = await userService.getSimpleProfiles(missing)
            const map: Record<string, SimpleProfile> = {}
            for (const prof of profiles ?? []) {
              const key = (prof.id ?? (prof.userId as string) ?? prof.username) as string
              if (key) map[key] = prof
            }
            setProfilesMap((prev) => ({ ...prev, ...map }))
          } catch (err) {
            console.warn('Failed to fetch member profiles', err)
          }
        }
      } catch (err) {
        if (!opts?.append) toast.error('Failed to load members')
      } finally {
        if (!opts?.append) setLoadingMembers(false)
      }
    },
    [communityId, debouncedQ, selectedRole, limit, profilesMap]
  )

  // initial / on filter change -> reload first page
  useEffect(() => {
    fetchMembers({ cursor: null, append: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId, debouncedQ, selectedRole, limit])

  const loadMoreMembers = useCallback(async () => {
    if (!communityId || !membersHasMore || isLoadingMoreMembers || !membersNextCursor) return
    setIsLoadingMoreMembers(true)
    try {
      await fetchMembers({ cursor: membersNextCursor, append: true })
    } catch (err) {
      toast.error('Failed to load more members')
    } finally {
      setIsLoadingMoreMembers(false)
    }
  }, [communityId, membersHasMore, isLoadingMoreMembers, membersNextCursor, fetchMembers])

  useEffect(() => {
    if (!communityId) return
    let mounted = true

    async function loadMembershipResolved() {
      setLoadingMembershipResolved(true)
      try {
        const resp = (await fetchResolvedItems({
          communityId,
          limit,
          targetTypes: 'MEMBERSHIP',
        })) as ResolvedItemsResponse
        const items = Array.isArray(resp?.items) ? resp.items : []
        if (mounted) setMembershipResolved(items)
      } catch (err) {
        toast.error('Failed to load membership resolved items')
        if (mounted) setMembershipResolved([])
      } finally {
        if (mounted) setLoadingMembershipResolved(false)
      }
    }

    loadMembershipResolved()
    return () => {
      mounted = false
    }
  }, [communityId, limit])

  const clearFilters = () => {
    setQ('')
    setSelectedRole('')
  }

  const roleIndicator = (role?: string) => {
    switch ((role || '').toUpperCase()) {
      case 'OWNER':
        return <Crown className='w-4 h-4 text-yellow-500' title='Owner' />
      case 'MODERATOR':
        return <Shield className='w-4 h-4 text-indigo-500' title='Moderator' />
      default:
        return null
    }
  }

  // simple handler passed to ResolvedItemCard to update local state when an item is restored/updated
  const handleResolvedUpdate = (itemId: string) => {
    setMembershipResolved((prev) => prev.filter((r) => r.id !== itemId))
  }

  return (
    <div className='space-y-4'>
      {/* Members accordion */}
      <div className='border rounded-md overflow-hidden bg-card'>
        <button
          type='button'
          aria-expanded={membersOpen}
          aria-controls='members-list'
          onClick={() => setMembersOpen((v) => !v)}
          className='w-full flex items-center justify-between px-3 py-2 bg-transparent hover:bg-surface/50 focus:outline-none'
        >
          <div className='flex items-center gap-3'>
            <div className='text-sm font-medium'>Members</div>
            <Badge>{loadingMembers ? 'Loading...' : members.length}</Badge>
          </div>

          <ChevronDown
            className={`w-4 h-4 transition-transform ${membersOpen ? 'rotate-180' : 'rotate-0'}`}
            aria-hidden
          />
        </button>

        <div
          id='members-list'
          className={`px-3 pb-3 transition-[max-height] duration-200 ease-in-out overflow-hidden ${
            membersOpen ? 'pt-2 max-h-[1000px]' : 'max-h-0'
          }`}
        >
          {/* search + role filter (sticky within the members content) */}
          <div className='sticky top-0 z-10 mb-3 py-2 bg-card/80 backdrop-blur-sm'>
            <div className='flex gap-2 items-center'>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search members by username...'
                className='flex-1 px-3 py-2 border rounded-md text-sm bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
              />

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className='px-2 py-2 border rounded-md text-sm bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
                aria-label='Filter by role'
              >
                <option value=''>All roles</option>
                <option value='OWNER'>Owner</option>
                <option value='MODERATOR'>Moderator</option>
                <option value='MEMBER'>Member</option>
              </select>

              <Button size='sm' variant='ghost' onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>

          {/* members list with fixed height to avoid stretching parent */}
          <div className='h-[40vh] overflow-auto space-y-2'>
            {loadingMembers ? (
              <div className='text-sm text-muted-foreground'>Loading members...</div>
            ) : members.length === 0 ? (
              <div className='text-sm text-muted-foreground'>No members found</div>
            ) : (
              members.map((m) => {
                const id = (m.userId ?? m.id) as string
                const profile = profilesMap[id]
                const displayName = profile?.username ?? m.username ?? id
                const avatarUrl = (profile as any)?.avatarUrl ?? (profile as any)?.avatar_url
                return (
                  <div
                    key={id}
                    className='p-2 border rounded-md bg-surface/50 flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={displayName} />
                        ) : (
                          <AvatarFallback>
                            {(displayName?.charAt?.(0) ?? '?').toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className='flex flex-col'>
                        <div className='text-sm'>{displayName}</div>
                        <div className='text-xs text-muted-foreground'>{m.userId ?? m.id}</div>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='text-xs text-muted-foreground'>{m.role ?? 'MEMBER'}</div>
                      <div>{roleIndicator(m.role)}</div>
                    </div>
                  </div>
                )
              })
            )}

            {membersHasMore && (
              <div className='flex justify-center mt-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={loadMoreMembers}
                  disabled={isLoadingMoreMembers}
                >
                  {isLoadingMoreMembers ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Membership resolved items - clearly separated */}
      <div className='border rounded-md p-3 bg-surface/10'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='text-sm font-medium'>Membership resolved items</h4>
          <Badge>{loadingMembershipResolved ? 'Loading...' : membershipResolved.length}</Badge>
        </div>

        {loadingMembershipResolved ? (
          <div className='text-sm text-muted-foreground'>Loading membership logs...</div>
        ) : membershipResolved.length === 0 ? (
          <div className='text-sm text-muted-foreground'>No membership log entries</div>
        ) : (
          <div className='space-y-3'>
            {membershipResolved
              .slice()
              .sort((a, b) => new Date(b.resolvedAt).getTime() - new Date(a.resolvedAt).getTime())
              .map((r) => (
                <ResolvedItemCard
                  key={r.id ?? r.resolvedAt}
                  item={r}
                  updateResolvedState={handleResolvedUpdate}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
