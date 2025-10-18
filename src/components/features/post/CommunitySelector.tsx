'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/libs/utils'
import { communityService } from '@/modules/services/community-service'
import type { MyCommunity } from '@/types/services/community'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface CommunitySelectorProps {
  value: string
  onChange: (communityId: string) => void
  statuses?: ('ACTIVE' | 'LEFT')[]
  disabled?: boolean
  placeholder?: string
  label?: string
  className?: string
  labelClassName?: string
}

export function CommunitySelector({
  value,
  onChange,
  disabled,
  placeholder = 'Select a community',
  label = 'Community',
  className,
  labelClassName,
  statuses,
}: CommunitySelectorProps) {
  const [communities, setCommunities] = useState<MyCommunity[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    communityService
      .getMyCommunities({ statuses: statuses ?? ['ACTIVE'] })
      .then((data) => setCommunities(data))
      .catch(() => setError('Failed to load communities'))
      .finally(() => setLoading(false))
  }, [statuses])

  // Filter communities by query (client-side)
  const filteredCommunities = query
    ? communities.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : communities

  const activeCommunities = filteredCommunities.filter((c) => c.status === 'ACTIVE')
  const leftCommunities = filteredCommunities.filter((c) => c.status === 'LEFT')

  const selected = communities.find((c) => c.communityId === value)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className={cn('text-sm font-medium', labelClassName)}>{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            className='w-full justify-between'
            disabled={disabled}
          >
            <span className='flex items-center'>
              {selected && (
                <Avatar className='mr-2 h-6 w-6'>
                  <AvatarImage src={selected.avatarUrl || ''} alt={selected.name} />
                  <AvatarFallback className='text-[10px]'>
                    {selected.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              {selected
                ? `c/${selected.name}`
                : value === ''
                ? 'All Communities'
                : loading && communities.length === 0
                ? 'Loading...'
                : placeholder}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
          <Command>
            <CommandInput placeholder='Search...' value={query} onValueChange={setQuery} />
            <CommandList>
              {error && <div className='px-3 py-2 text-xs text-destructive'>{error}</div>}
              <CommandEmpty>{loading ? 'Searching...' : 'No results.'}</CommandEmpty>

              {/* All Communities option */}
              <CommandGroup>
                <CommandItem key='all' value='' onSelect={() => onChange('')}>
                  <Check
                    className={cn('mr-2 h-4 w-4', value === '' ? 'opacity-100' : 'opacity-0')}
                  />
                  <span className='font-semibold'>All Communities</span>
                </CommandItem>
              </CommandGroup>

              {activeCommunities.length > 0 && (
                <CommandGroup heading='Your Active Communities'>
                  {activeCommunities.map((c) => (
                    <CommandItem
                      key={c.communityId}
                      value={c.name}
                      onSelect={() => onChange(c.communityId)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          c.communityId === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <Avatar className='mr-2 h-8 w-8'>
                        <AvatarImage src={c.avatarUrl || ''} alt={c.name} />
                        <AvatarFallback className='text-[10px]'>
                          {c.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      c/{c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {activeCommunities.length > 0 && leftCommunities.length > 0 && (
                <Separator className='my-1' />
              )}
              {leftCommunities.length > 0 && (
                <CommandGroup heading='Communities You Left'>
                  {leftCommunities.map((c) => (
                    <CommandItem
                      key={c.communityId}
                      value={c.name}
                      onSelect={() => onChange(c.communityId)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          c.communityId === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <Avatar className='mr-2 h-8 w-8'>
                        <AvatarImage src={c.avatarUrl || ''} alt={c.name} />
                        <AvatarFallback className='text-[10px]'>
                          {c.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      c/{c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
