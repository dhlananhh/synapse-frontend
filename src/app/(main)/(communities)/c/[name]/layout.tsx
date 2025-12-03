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
import { MembershipContext } from '@/context/MembershipContext'
import AboutCommunityWidget from '@/components/features/community/widgets/AboutCommunityWidget'
import CommunityFlairsWidget from '@/components/features/community/widgets/CommunityFlairsWidget'
import CommunityRulesWidget from '@/components/features/community/widgets/CommunityRulesWidget'
import ModeratorListWidget from '@/components/features/community/widgets/ModeratorListWidget'

interface CommunityLayoutProps {
  children: React.ReactNode
  params: any
}

export default function CommunityLayout({ children, params }: CommunityLayoutProps) {
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
        <div className='flex min-h-screen py-4 justify-center mt-14'>
          {/* Main Content */}
          <main className='w-2xl max-w-3xl'>{children}</main>
          {/* Sidebar */}
          <aside className='w-80 ml-8 sticky top-[78px] overflow-y-auto scrollbar-hide'>
            <div className='space-y-4'>
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
