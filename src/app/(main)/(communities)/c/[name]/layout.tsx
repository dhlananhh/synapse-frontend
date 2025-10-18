'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { communityService } from '@/modules/services/community-service'
import {
  Community,
  CommunityMembership,
  CommunityFlair,
  CommunityRule,
} from '@/types/services/community'
import { CommunityContext } from '@/context/CommunityContext'
import CommunityRulesWidget from '@/components/features/community/widgets/CommunityRulesWidget'
import ModeratorListWidget from '@/components/features/community/widgets/ModeratorListWidget'
import { MembershipContext } from '@/context/MembershipContext'
import CommunityFlairsWidget from '@/components/features/community/widgets/CommunityFlairsWidget'
import AboutCommunityWidget from '@/components/features/community/widgets/AboutCommunityWidget'

interface CommunityLayoutProps {
  children: React.ReactNode
  params: any
}

export default function CommunityLayout({ children, params }: CommunityLayoutProps) {
  // Unwrap params using React.use as required by Next.js App Router
  const { name } = React.use(params) as { name: string }
  const [community, setCommunity] = useState<Community | null>(null)
  const [membership, setMembership] = useState<CommunityMembership | null>(null)
  const [flairs, setFlairs] = useState<CommunityFlair[]>([])
  const [rules, setRules] = useState<CommunityRule[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const activeFlairId = searchParams.get('flair')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    communityService
      .getCommunityByName(name)
      .then(async (communityData) => {
        if (!isMounted) return
        setCommunity(communityData)
        // Fetch membership, flairs, and rules using community id
        const [membershipData, flairsData, rulesData] = await Promise.all([
          communityService.getMembership(name),
          communityService.getFlairs(communityData.id),
          communityService.getRules(communityData.id),
        ])
        if (isMounted) {
          setMembership(membershipData)
          setFlairs(flairsData)
          setRules(rulesData)
        }
      })
      .catch(() => {
        if (isMounted) {
          setCommunity(null)
          setMembership(null)
          setFlairs([])
          setRules([])
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [name])

  if (loading) return <div>Loading...</div>
  if (!community) {
    notFound()
    return null
  }

  return (
    <CommunityContext.Provider
      value={{ community, setCommunity, flairs, setFlairs, rules, setRules }}
    >
      <MembershipContext.Provider value={{ membership, setMembership }}>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4'>
          <div className='col-span-2'>{children}</div>
          <aside className='hidden md:block'>
            <div className='sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2 space-y-4'>
              <AboutCommunityWidget />
              <CommunityFlairsWidget />
              <CommunityRulesWidget />
              <ModeratorListWidget />
            </div>
          </aside>
        </div>
      </MembershipContext.Provider>
    </CommunityContext.Provider>
  )
}
