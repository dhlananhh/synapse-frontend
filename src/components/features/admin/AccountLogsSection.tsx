'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Edit3,
  UserX,
  PauseCircle,
  Key,
  MailCheck,
  RefreshCw,
} from 'lucide-react'
import { authService } from '@/modules/services/auth-service'
import { userService } from '@/modules/services/user-service'
import { AccountLog, AccountDetails } from '@/types/services/auth'
import type { SimpleProfile } from '@/types/services/user'
import { toast } from 'sonner'

interface AccountLogsSectionProps {
  accountDetails: AccountDetails | null
}

const PAGE_SIZE = 6

export const AccountLogsSection: React.FC<AccountLogsSectionProps> = ({ accountDetails }) => {
  const [logs, setLogs] = useState<AccountLog[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [reloadCount, setReloadCount] = useState(0)

  // simple profile fetched via userService.getSimpleProfiles
  const [profile, setProfile] = useState<SimpleProfile | null>(null)
  // actor profiles map keyed by id/username (best-effort)
  const [actorProfiles, setActorProfiles] = useState<Record<string, SimpleProfile>>({})

  useEffect(() => {
    let mounted = true
    async function fetchLogs() {
      if (!accountDetails?.id) {
        setLogs([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const res = await authService.fetchAccountLogs(accountDetails.id)
        if (!mounted) return
        const items: AccountLog[] = Array.isArray(res) ? res : res.logs ?? []
        setLogs(items ?? [])
        setPageIndex(0)
      } catch (err) {
        console.error('Failed to fetch account logs', err)
        toast.error('Failed to fetch account logs.')
        if (mounted) setLogs([])
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    fetchLogs()
    return () => {
      mounted = false
    }
    // adding reloadCount will re-run the fetch when incremented
  }, [accountDetails, reloadCount])

  // fetch simple profile (avatar, canonical username etc.) using userService for the main account
  useEffect(() => {
    let mounted = true
    async function fetchProfile() {
      setProfile(null)
      if (!accountDetails?.userId) return
      try {
        const profiles = await userService.getSimpleProfiles([accountDetails.userId])
        if (!mounted) return
        setProfile(Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null)
      } catch (err) {
        console.error('Failed to fetch simple profile', err)
      }
    }
    fetchProfile()
    return () => {
      mounted = false
    }
  }, [accountDetails, reloadCount])

  // fetch actor profiles (performedBy) when logs change
  useEffect(() => {
    let mounted = true
    async function fetchActors() {
      setActorProfiles({})
      if (!logs || logs.length === 0) return
      const ids = Array.from(
        new Set(
          logs
            .map((l) => l.performedBy)
            .filter((v): v is string => Boolean(v) && v !== 'system' && v !== 'SYSTEM')
        )
      )
      if (ids.length === 0) return

      try {
        const profiles = await userService.getSimpleProfiles(ids)
        if (!mounted) return
        const map: Record<string, SimpleProfile> = {}
        profiles.forEach((p) => {
          const keys = [p.id ?? (p as any).userId, (p as any).userId ?? (p as any).id, p.username]
          keys.forEach((k) => {
            if (k) map[String(k)] = p
          })
        })
        setActorProfiles(map)
      } catch (err) {
        console.error('Failed to fetch actor profiles', err)
      }
    }
    fetchActors()
    return () => {
      mounted = false
    }
  }, [logs, reloadCount])

  // pagination uses raw logs (no client-side search/filters)
  const filtered = useMemo(() => {
    return logs ?? []
  }, [logs])

  useEffect(() => {
    setPageIndex(0)
  }, [logs])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = pageIndex * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, total)
  const pageItems = filtered.slice(start, end)

  // human friendly action mapper
  const actionMeta: Record<
    string,
    { label: string; icon: React.ReactNode; color: string; bg: string }
  > = {
    ACCOUNT_CREATED: {
      label: 'created',
      icon: <UserPlus size={16} />,
      color: 'text-green-700',
      bg: 'bg-green-50',
    },
    ACCOUNT_UPDATED: {
      label: 'updated',
      icon: <Edit3 size={16} />,
      color: 'text-sky-700',
      bg: 'bg-sky-50',
    },
    ACCOUNT_BANNED: {
      label: 'banned',
      icon: <UserX size={16} />,
      color: 'text-red-700',
      bg: 'bg-red-50',
    },
    ACCOUNT_SUSPENDED: {
      label: 'suspended',
      icon: <PauseCircle size={16} />,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    ACCOUNT_ACTIVATED: {
      label: 'activated',
      icon: <CheckCircle size={16} />,
      color: 'text-green-700',
      bg: 'bg-green-50',
    },
    PASSWORD_CHANGED: {
      label: 'password changed',
      icon: <Key size={16} />,
      color: 'text-violet-700',
      bg: 'bg-violet-50',
    },
    EMAIL_VERIFIED: {
      label: 'email verified',
      icon: <MailCheck size={16} />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  }

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const timeAgo = (iso?: string) => {
    if (!iso) return ''
    const now = Date.now()
    const then = new Date(iso).getTime()
    const diff = Math.floor((now - then) / 1000) // seconds
    if (diff < 5) return 'just now'
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    const days = Math.floor(diff / 86400)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(days / 365)}y ago`
  }

  const renderStatusIcon = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className='text-green-500' size={16} />
      case 'SUSPENDED':
        return <XCircle className='text-red-500' size={16} />
      case 'PENDING':
        return <Clock className='text-amber-500' size={16} />
      default:
        return null
    }
  }

  if (isLoading) return <Skeleton className='h-40 w-full' />

  return (
    <div className='p-3 border-4 rounded-lg space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold'>Account Logs ({total})</h3>

        {/* reload button */}
        <div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setReloadCount((c) => c + 1)}
            aria-label='Reload logs'
            title='Reload'
          >
            <RefreshCw className={`${isLoading ? 'animate-spin' : ''} h-4 w-4`} />
          </Button>
        </div>
      </div>

      {/* account header */}
      {accountDetails ? (
        <Link href={`/u/${accountDetails.userId}`} className='block'>
          <div className='border rounded p-3 bg-muted/5 hover:bg-muted/10 transition mt-4 mb-2'>
            <div className='flex items-center gap-3'>
              {/* avatar with fallback */}
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.username ?? accountDetails.username}
                  className='w-10 h-10 rounded-full object-cover shrink-0'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center text-sm font-semibold shrink-0'>
                  {(profile?.username ?? accountDetails.username)?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-3'>
                  <span className='font-medium truncate'>
                    u/{profile?.username ?? accountDetails.username}
                  </span>
                  <div className='flex items-center gap-1'>
                    {renderStatusIcon(accountDetails.status)}
                    <span className='text-sm text-muted-foreground'>{accountDetails.status}</span>
                  </div>
                </div>

                <div className='text-sm text-muted-foreground mt-1 flex flex-wrap gap-4'>
                  <div>
                    <span className='font-medium mr-1'>Created:</span>
                    {new Date(accountDetails.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className='font-medium mr-1'>Verified:</span>
                    {accountDetails.verifiedAt
                      ? new Date(accountDetails.verifiedAt).toLocaleDateString()
                      : 'No'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className='text-sm text-muted-foreground'>No account selected</div>
      )}
      <hr />

      {/* logs list (fixed PAGE_SIZE slots with placeholders) */}
      <ul className='space-y-2'>
        {Array.from({ length: PAGE_SIZE }).map((_, idx) => {
          const log = pageItems[idx]
          if (log) {
            const meta = actionMeta[log.action ?? ''] ?? {
              label: (log.action ?? '').toLowerCase().replace(/_/g, ' '),
              icon: <Clock size={16} />,
              color: 'text-gray-700',
              bg: 'bg-gray-50',
            }
            const formatted = formatDate(log.createdAt)
            const ago = timeAgo(log.createdAt)

            // actor profile lookup (best-effort)
            const actorKey = log.performedBy ?? ''
            const actor = actorProfiles[String(actorKey)]
            const actorName = actor?.username ?? log.performedBy ?? 'system'
            const actorAvatar = actor?.avatarUrl ?? null

            return (
              <li key={log.id} className='border rounded-md overflow-hidden'>
                <div className='p-4 flex items-start gap-3'>
                  <div
                    className={`${meta.bg} p-2 rounded-md shrink-0 flex items-center justify-center`}
                  >
                    <div className={`${meta.color}`}>{meta.icon}</div>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0 flex gap-3'>
                        {/* actor avatar + name */}
                        <div className='flex items-center gap-3 min-w-0'>
                          {actorAvatar ? (
                            <img
                              src={actorAvatar}
                              alt={actorName}
                              className='w-9 h-9 rounded-full object-cover shrink-0'
                            />
                          ) : (
                            <div className='w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center text-sm font-semibold shrink-0'>
                              {actorName?.[0]?.toUpperCase() ?? '?'}
                            </div>
                          )}

                          <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-sm truncate'>u/{actorName}</span>
                              <span className='text-xs text-muted-foreground'>
                                {formatted} · {ago}
                              </span>
                            </div>

                            {log.details ? (
                              <div className='text-xs mt-1 text-amber-600 dark:text-amber-300'>
                                Reason:{' '}
                                <span className='font-medium text-amber-800 dark:text-amber-100'>
                                  {log.details}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          }

          // placeholder to preserve height
          return (
            <li
              key={`placeholder-${idx}`}
              className='overflow-hidden h-24 bg-transparent'
              aria-hidden
            >
              <div className='p-3 h-full' />
            </li>
          )
        })}
      </ul>

      {/* pagination row: left=page, center=showing, right=buttons */}
      <div className='flex items-center mt-1'>
        <div className='text-sm text-muted-foreground'>
          Page {pageIndex + 1}/{pageCount}
        </div>

        <div className='flex-1 text-center text-sm text-muted-foreground'>
          Showing {total === 0 ? 0 : start + 1}–{end} of {total}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            aria-label='Previous logs page'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageIndex >= pageCount - 1}
            aria-label='Next logs page'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
