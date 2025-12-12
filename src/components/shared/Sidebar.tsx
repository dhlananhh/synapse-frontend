"use client"


import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Flame, TrendingUp, Star, Globe } from "lucide-react"
import CommunitySection from "./CommunitySection"
import { communityService } from "@/modules/services/community-service"
import { SearchCommunityResult, MyCommunity } from "@/types/services/community"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/libs/utils"


export default function Sidebar() {
  const { user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedFeed = searchParams.get("feed") || "hot"

  const feedOptions = [
    { label: "Hot", value: "hot", icon: <Flame className="h-5 w-5" /> },
    { label: "Trending", value: "trending", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Top", value: "top", icon: <Star className="h-5 w-5" /> },
    { label: "Global", value: "global", icon: <Globe className="h-5 w-5" /> },
  ]

  const handleFeedSelection = (feed: "hot" | "trending" | "top" | "global") => {
    router.push(`/home?feed=${feed}`)
  }

  const [ topCommunities, setTopCommunities ] = useState<SearchCommunityResult[]>([])
  const [ myCommunities, setMyCommunities ] = useState<MyCommunity[]>([])
  const [ recentCommunities, setRecentCommunities ] = useState<SearchCommunityResult[]>([])

  useEffect(() => {
    const fetchTopCommunities = async () => {
      try {
        const response = await communityService.searchCommunities(
          undefined,
          undefined,
          5,
          "members"
        )
        setTopCommunities(response.communities)
      } catch (error) {
        console.error("Failed to fetch top communities:", error)
      }
    }

    const fetchMyCommunities = async () => {
      try {
        const response = await communityService.getMyCommunities({ statuses: [ "ACTIVE" ] })
        setMyCommunities(response)
      } catch (error) {
        console.error("Failed to fetch my communities:", error)
      }
    }

    const fetchRecentCommunities = async () => {
      try {
        const response = await communityService.fetchRecentCommunities()
        console.log("ayo ", response)
        setRecentCommunities(response)
      } catch (error) {
        console.error("Failed to fetch recent communities:", error)
      }
    }

    fetchTopCommunities()
    if (user && !isLoading) {
      fetchMyCommunities()
      fetchRecentCommunities()
    }
  }, [ user, isLoading ])

  return (
    <aside className="w-70 bg-card/50 border-r border-border h-screen pt-8 overflow-y-auto scrollbar-hide px-2 hidden md:block fixed left-0 top-14 pb-20">
      <div className="p-2 space-y-2">
        {/* Feed Selection */ }
        <div>
          <ul className="space-y-1">
            {
              feedOptions.map((option) => (
                <li
                  key={ option.value }
                >
                  <button
                    onClick={ () =>
                      handleFeedSelection(option.value as "hot" | "trending" | "top" | "global")
                    }
                    className={
                      cn(
                        "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all duration-200",
                        selectedFeed === option.value
                          ? "bg-secondary text-primary font-medium shadow-sm" // selected status
                          : "text-muted-foreground hover:bg-accent hover:text-foreground" // normal status
                      )
                    }
                  >
                    { option.icon }
                    <span className="text-sm font-medium">
                      { option.label }
                    </span>
                  </button>
                </li>
              ))
            }
          </ul>
        </div>

        <div className="h-px bg-border my-3 mx-2" />

        {/* Recent Communities */ }
        {
          user && !isLoading && (
            <CommunitySection
              title="Recent Communities"
              communities={ recentCommunities.map((community) => ({
                id: community.id,
                name: community.name,
                avatarUrl: community.avatarUrl || "/images/default-community-avatar.png",
              })) }
            />
          )
        }

        {/* Top Communities */ }
        <CommunitySection
          title="Top Communities"
          showMoreOption={ true }
          communities={
            topCommunities.map((community) => ({
              id: community.id,
              name: community.name,
              avatarUrl: community.avatarUrl || "/images/default-community-avatar.png",
            }))
          }
        />

        {/* My Communities */ }
        {
          user && !isLoading && (
            <CommunitySection
              title="My Communities"
              showManageOptions={ true }
              communities={
                myCommunities.map((community) => ({
                  id: community.communityId,
                  name: community.name,
                  avatarUrl: community.avatarUrl || "/images/default-avatar.png",
                }))
              }
            />
          )
        }
      </div>
    </aside>
  )
}
