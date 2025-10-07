'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { communityService } from '@/modules/services/community-service'
import type { Community, CommunityFlair } from '@/types/services/community'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Tag, Settings } from 'lucide-react'
import { useMembership } from '@/context/MembershipContext'
import { Button } from '@/components/ui/button'
import { useCommunity } from '@/context/CommunityContext'
import { ManageCommunityFlairsDialog } from '@/components/features/community/manage/dialogs/ManageCommunityFlairsDialog'

export default function CommunityFlairsWidget() {
  const community = useCommunity()
  const communityId = community?.id ?? ''
  const communityName = community?.name ?? ''
  const membershipContext = useMembership()
  const membership = membershipContext?.membership ?? null
  const isOwner = membership?.role === 'OWNER'
  const isModerator = membership?.role === 'MODERATOR'
  const canEditFlairs = isOwner || isModerator
  const [flairs, setFlairs] = useState<CommunityFlair[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await communityService.getFlairs(communityId)
        if (!mounted) return
        setFlairs((res ?? []) as CommunityFlair[])
      } catch (err: any) {
        console.error('Failed to load flairs', err)
        if (mounted) setError('Failed to load flairs')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (communityId) load()
    else {
      setFlairs([])
      setLoading(false)
    }
    return () => {
      mounted = false
    }
  }, [communityId])

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
                {canEditFlairs && (
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
                )}
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
                    <li key={flair.id} className='flex items-start gap-3'>
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
