'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Pause,
  Trash2,
  BrushCleaning,
  Search,
} from 'lucide-react'
import { communityService } from '@/modules/services/community-service'
import type { MyCommunity } from '@/types/services/community'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'

interface CommunitiesSectionProps {
  userId: string
}

const PAGE_SIZE = 5
const DEBOUNCE_MS = 300

export const CommunitiesSection: React.FC<CommunitiesSectionProps> = ({ userId }) => {
  const [communities, setCommunities] = useState<MyCommunity[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)

  // search & filters
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | MyCommunity['role']>('ALL')
  const [membershipFilter, setMembershipFilter] = useState<'ALL' | MyCommunity['status']>('ALL')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  useEffect(() => {
    if (!userId) return
    let mounted = true
    setIsLoading(true)
    setPageIndex(0)
    communityService
      .getUserCommunities(userId, { statuses: ['ACTIVE', 'PENDING', 'BANNED'] })
      .then((items) => {
        if (!mounted) return
        setCommunities(items ?? [])
      })
      .catch((err) => {
        console.error('Failed to fetch user communities', err)
        toast.error('Failed to fetch user communities.')
        if (mounted) setCommunities([])
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [userId])

  // filter/paginate client-side
  const filtered = useMemo(() => {
    if (!communities) return []
    let list = communities
    if (debouncedQuery?.trim()) {
      const q = debouncedQuery.trim().toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }
    if (roleFilter !== 'ALL') {
      list = list.filter((c) => c.role === roleFilter)
    }
    if (membershipFilter !== 'ALL') {
      list = list.filter((c) => c.status === membershipFilter)
    }
    return list
  }, [communities, debouncedQuery, roleFilter, membershipFilter])

  useEffect(() => {
    // reset page when filters/search change
    setPageIndex(0)
  }, [debouncedQuery, roleFilter, membershipFilter])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = pageIndex * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, total)
  const pageItems = filtered.slice(start, end)

  // helpers
  const truncateWords = (text: string | undefined, limit = 30) => {
    if (!text) return ''
    const words = text.trim().split(/\s+/)
    if (words.length <= limit) return text
    return words.slice(0, limit).join(' ') + '...'
  }

  const statusIcon = (status: MyCommunity['communityStatus']) => {
    const baseClass = 'inline-block mr-1'
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className={`${baseClass} text-green-500`} size={16} />
      case 'SUSPENDED':
        return <Pause className={`${baseClass} text-amber-500`} size={16} />
      case 'DELETED':
        return <Trash2 className={`${baseClass} text-red-500`} size={16} />
      default:
        return null
    }
  }

  const membershipBadge = (status: MyCommunity['status']) => {
    const base = 'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full'
    switch (status) {
      case 'ACTIVE':
        return <span className={`${base} bg-green-100 text-green-800`}>Active</span>
      case 'PENDING':
        return <span className={`${base} bg-amber-100 text-amber-800`}>Pending</span>
      case 'BANNED':
        return <span className={`${base} bg-red-100 text-red-800`}>Banned</span>
      case 'LEFT':
        return <span className={`${base} bg-gray-100 text-gray-800`}>Left</span>
      default:
        return null
    }
  }

  const roleBadge = (role: MyCommunity['role']) => {
    const base = 'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full'
    switch (role) {
      case 'OWNER':
        return <span className={`${base} bg-amber-100 text-amber-800`}>Owner</span>
      case 'MODERATOR':
        return <span className={`${base} bg-sky-100 text-sky-800`}>Mod</span>
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Member</span>
    }
  }

  // options with color indicators
  const roleOptions: { value: 'ALL' | MyCommunity['role']; label: string; dot?: string }[] = [
    { value: 'ALL', label: 'All roles' },
    { value: 'MEMBER', label: 'Member', dot: 'bg-gray-400' },
    { value: 'MODERATOR', label: 'Moderator', dot: 'bg-sky-400' },
    { value: 'OWNER', label: 'Owner', dot: 'bg-amber-400' },
  ]

  const membershipOptions: { value: 'ALL' | MyCommunity['status']; label: string; dot?: string }[] =
    [
      { value: 'ALL', label: 'All membership status' },
      { value: 'ACTIVE', label: 'Active', dot: 'bg-green-400' },
      { value: 'PENDING', label: 'Pending', dot: 'bg-amber-400' },
      { value: 'BANNED', label: 'Banned', dot: 'bg-red-400' },
      { value: 'LEFT', label: 'Left', dot: 'bg-gray-400' },
    ]

  if (isLoading) {
    return <Skeleton className='h-40 w-full' />
  }

  return (
    <div className='p-4 border-4 rounded-lg space-y-3'>
      {/* Title row */}
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold'>Communities involved ({total})</h3>
      </div>

      {/* search on its own row, filters next row (clearly visible in dark mode) */}
      <div className='flex flex-wrap gap-2 items-center mt-3'>
        <Search size={24} />
        <Input
          placeholder='Search communities by name...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-94'
        />
      </div>

      <div className='flex flex-wrap gap-2 items-center mt-2 mb-6'>
        {/* role dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='min-w-[11rem] justify-start'>
              <span className='inline-flex items-center mr-2'>
                {roleOptions.find((o) => o.value === roleFilter)?.dot ? (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      roleOptions.find((o) => o.value === roleFilter)?.dot
                    }`}
                  />
                ) : null}
              </span>
              <span className='truncate text-sm'>
                {roleOptions.find((o) => o.value === roleFilter)?.label ?? 'Role'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-48'>
            <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roleOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onSelect={() => setRoleFilter(opt.value as any)}
                className='flex items-center gap-2 text-sm'
              >
                {opt.dot && <span className={`inline-block w-2 h-2 rounded-full ${opt.dot}`} />}
                <span>{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* membership dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='min-w-[14rem] justify-start'>
              <span className='inline-flex items-center mr-2'>
                {membershipOptions.find((o) => o.value === membershipFilter)?.dot ? (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      membershipOptions.find((o) => o.value === membershipFilter)?.dot
                    }`}
                  />
                ) : null}
              </span>
              <span className='truncate text-sm'>
                {membershipOptions.find((o) => o.value === membershipFilter)?.label ?? 'Membership'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-56'>
            <DropdownMenuLabel>Filter by membership</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {membershipOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onSelect={() => setMembershipFilter(opt.value as any)}
                className='flex items-center gap-2 text-sm'
              >
                {opt.dot && <span className={`inline-block w-2 h-2 rounded-full ${opt.dot}`} />}
                <span>{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* clear filters button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            setQuery('')
            setRoleFilter('ALL')
            setMembershipFilter('ALL')
            setPageIndex(0)
          }}
          aria-label='Clear filters'
        >
          <BrushCleaning className={`text-blue-400`} size={16} />
          Clear filters
        </Button>
      </div>

      <ul className='space-y-2'>
        {Array.from({ length: PAGE_SIZE }).map((_, idx) => {
          const item = pageItems[idx]
          if (item) {
            return (
              <li key={item.communityId} className='border rounded-md overflow-hidden h-24'>
                <Link
                  href={`/c/${encodeURIComponent(item.name)}`}
                  className='block p-2 hover:bg-muted/50 transition-colors flex items-center gap-3 h-full'
                >
                  {item.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className='w-10 h-10 rounded-full object-cover shrink-0'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center text-sm font-semibold shrink-0'>
                      {item.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}

                  <div className='flex-1 min-w-0 h-full flex flex-col justify-center'>
                    <div className='flex items-center justify-between w-full gap-3'>
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <span className='font-medium text-primary/90 truncate'>
                            c/{item.name}
                          </span>
                          {statusIcon((item as any).communityStatus)}
                        </div>
                        <div className='text-sm text-muted-foreground mt-1 leading-tight'>
                          {truncateWords(item.description, 30)}
                        </div>
                      </div>

                      {/* right-most: membership status then role badge */}
                      <div className='flex-shrink-0 ml-2 flex flex-col items-end gap-1'>
                        <div>{membershipBadge(item.status)}</div>
                        <div>{roleBadge(item.role)}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          }

          // blank placeholder slot (preserve height)
          return (
            <li
              key={`placeholder-${idx}`}
              className='overflow-hidden h-24 bg-transparent'
              aria-hidden
            />
          )
        })}
      </ul>

      {/* layout: left = page, center = showing, right = buttons */}
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
            aria-label='Previous communities page'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageIndex >= pageCount - 1}
            aria-label='Next communities page'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
