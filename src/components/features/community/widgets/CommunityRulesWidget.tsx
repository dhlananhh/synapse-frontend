import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { ListOrdered, Settings } from 'lucide-react'
import { ManageRulesDialog } from '@/components/features/community/manage/dialogs/ManageRulesDialog'
import { useMembership } from '@/context/MembershipContext'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCommunity, useCommunityRules, useSetCommunityRules } from '@/context/CommunityContext'

export default function CommunityRulesWidget() {
  const community = useCommunity()
  const communityName = community?.name ?? ''
  const membershipContext = useMembership()
  const membership = membershipContext?.membership ?? null
  const isOwner = membership?.role === 'OWNER'

  // Use rules from context
  const rules = useCommunityRules()
  const setRules = useSetCommunityRules()

  const loading = !community // You can improve this loading state if needed
  const error = null

  const sortedRules = rules.length ? [...rules].sort((a, b) => a.order - b.order) : []

  return (
    <Card>
      <CardHeader className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <ListOrdered className='w-5 h-5' />
          <CardTitle className='m-0 p-0'>
            {communityName ? `${communityName} Rules` : 'Rules'}
          </CardTitle>
        </div>

        {/* {isOwner && community && (
          <ManageRulesDialog
            community={community}
            rules={rules}
            setRules={setRules}
            trigger={
              <Button variant='ghost' size='icon' aria-label='Manage rules'>
                <Settings className='w-6 h-6' />
              </Button>
            }
          />
        )} */}
      </CardHeader>
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
        ) : sortedRules.length === 0 ? (
          <p className='text-sm text-muted-foreground'>This community currently has no rules.</p>
        ) : (
          <Accordion type='multiple' className='w-full'>
            {sortedRules.map((rule) => (
              <AccordionItem value={rule.id} key={rule.id}>
                <AccordionTrigger className='font-semibold'>{`${rule.order}/ ${rule.title}`}</AccordionTrigger>
                <AccordionContent className='text-muted-foreground text-sm'>
                  {rule.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
