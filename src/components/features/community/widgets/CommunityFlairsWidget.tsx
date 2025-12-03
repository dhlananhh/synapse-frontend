'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Community } from '@/types/services/community'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Tag, Settings } from 'lucide-react'
import { useMembership } from '@/context/MembershipContext'
import { Button } from '@/components/ui/button'
import { useCommunity, useCommunityFlairs, useSetCommunityFlairs } from '@/context/CommunityContext'
import { ManageCommunityFlairsDialog } from '@/components/features/community/manage/dialogs/ManageCommunityFlairsDialog'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function CommunityFlairsWidget() {
  const community = useCommunity()
  const communityName = community?.name ?? ''
  const membershipContext = useMembership()
  const membership = membershipContext?.membership ?? null
  const isOwner = membership?.role === 'OWNER'
  const isModerator = membership?.role === 'MODERATOR'
  const canEditFlairs = isOwner || isModerator

  // Use flairs from context
  const flairs = useCommunityFlairs()
  const setFlairs = useSetCommunityFlairs()

  // No need to fetch flairs here, context already provides them
  const loading = !community // loading state can be improved if needed
  const error = null

  // Navigation for selecting a flair -> updates ?flair=... which the page reads to filter posts
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeFlairId = searchParams?.get('flair') ?? null

  const handleFlairClick = (flairId: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    // toggle: if clicking currently active flair, remove filter
    if (params.get('flair') === flairId) {
      params.delete('flair')
    } else {
      params.set('flair', flairId)
    }
    const query = params.toString()
    const dest = query ? `${pathname}?${query}` : pathname
    router.push(dest)
  }

  return (
    <Card className='p-2'>
      <Accordion type='single' collapsible>
        <AccordionItem value='flairs'>
          <CardHeader className='p-2'>
            <div className='flex items-center justify-between w-full gap-2'>
              <div className='flex items-center gap-2'>
                <Tag className='w-5 h-5' />-{' '}
                <CardTitle className='m-0 p-0'>{`Flairs (${flairs.length})`}</CardTitle>
              </div>

              <div className='flex items-center gap-3'>
                {/* {canEditFlairs && (
                  <ManageCommunityFlairsDialog
                    community={community as Community}
                    flairs={flairs}
                    setFlairs={setFlairs}
                    trigger={
                      <Button variant='ghost' size='icon' aria-label='Manage flairs'>
                        <Settings className='w-5 h-5' />
                      </Button>
                    }
                  />
                )} */}
                <AccordionTrigger className='px-2 py-0 rounded-md text-sm'>
                  {/* Trigger arrow/icon styling depends on your Accordion implementation */}
                </AccordionTrigger>
              </div>
            </div>
          </CardHeader>

          <AccordionContent>
            <CardContent>
              {loading ? (
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-4 w-1/2' />
                  </div>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-4 w-1/3' />
                  </div>
                </div>
              ) : error ? (
                <p className='text-sm text-destructive'>{error}</p>
              ) : flairs.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  This community currently has no flairs.
                </p>
              ) : (
                <ul className='space-y-3'>
                  {flairs.map((flair) => (
                    <li
                      key={flair.id}
                      className={`flex items-start gap-3 cursor-pointer rounded-md p-2 hover:bg-muted ${
                        activeFlairId === flair.id ? 'bg-muted/60 ring-1 ring-primary' : ''
                      }`}
                      onClick={() => handleFlairClick(flair.id)}
                      role='button'
                      aria-pressed={activeFlairId === flair.id}
                    >
                      <span
                        aria-hidden
                        style={{ backgroundColor: flair.color ?? '#CBD5E1' }}
                        className='inline-block h-6 w-6 rounded-full ring-1 ring-border'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='font-medium'>{flair.name}</span>
                        </div>
                        {flair.description && (
                          <p className='text-sm text-muted-foreground mt-1'>{flair.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
