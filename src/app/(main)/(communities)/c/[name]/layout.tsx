"use client"

import React, { useEffect, useState } from "react"
import { notFound, useSearchParams } from "next/navigation"
import { communityService } from "@/modules/services/community-service"
import {
  Community,
  CommunityMembership,
  CommunityFlair,
  CommunityRule,
} from "@/types/services/community"
import { CommunityContext } from "@/context/CommunityContext"
import { MembershipContext } from "@/context/MembershipContext"

// UI Widgets
import AboutCommunityWidget from "@/components/features/community/widgets/AboutCommunityWidget"
import CommunityFlairsWidget from "@/components/features/community/widgets/CommunityFlairsWidget"
import CommunityRulesWidget from "@/components/features/community/widgets/CommunityRulesWidget"
import ModeratorListWidget from "@/components/features/community/widgets/ModeratorListWidget"
import { Loader2 } from "lucide-react"


interface CommunityLayoutProps {
  children: React.ReactNode
  params: any
}


export default function CommunityLayout({ children, params }: CommunityLayoutProps) {
  const { name } = React.use(params) as { name: string }
  const [ community, setCommunity ] = useState<Community | null>(null)
  const [ membership, setMembership ] = useState<CommunityMembership | null>(null)
  const [ flairs, setFlairs ] = useState<CommunityFlair[]>([])
  const [ rules, setRules ] = useState<CommunityRule[]>([])
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    communityService.getCommunityByName(name)
      .then(async (communityData) => {
        if (!isMounted) return
        setCommunity(communityData)
        try {
          const [ membershipData, flairsData, rulesData ] = await Promise.all([
            communityService.getMembership(name),
            communityService.getFlairs(communityData.id),
            communityService.getRules(communityData.id),
          ])
          if (isMounted) {
            setMembership(membershipData)
            setFlairs(flairsData)
            setRules(rulesData)
          }
        } catch (error) {
          console.error("Error loading supplementary data", error)
        }
      })
      .catch(() => { if (isMounted) setCommunity(null) })
      .finally(() => { if (isMounted) setLoading(false) })
    return () => { isMounted = false }
  }, [ name ])


  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!community) {
    notFound()
    return null
  }

  return (
    <CommunityContext.Provider
      value={ { community, setCommunity, flairs, setFlairs, rules, setRules } }
    >
      <MembershipContext.Provider
        value={ { membership, setMembership } }
      >

        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 gap-6 py-6 md:grid-cols-12">

          <main className="md:col-span-8 space-y-4">
            { children }
          </main>

          <aside className="hidden md:block md:col-span-4">
            <div className="sticky top-20 flex flex-col gap-4 overflow-y-auto scrollbar-hide pt-6">
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
