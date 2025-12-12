"use client"


import React from "react"
import FeedPage from "@/components/features/feed/FeedPage"
import RecentPosts from "@/components/features/feed/RecentPosts"


export default function Home() {
  return (
    <div className="container max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 py-6">
      <div className="flex flex-col gap-4">
        <FeedPage />
      </div>

      <aside className="hidden lg:block h-fit sticky top-[80px] space-y-4">
        <div className="bg-card/50 rounded-lg border border-border p-4">
          <RecentPosts />
        </div>
      </aside>
    </div>
  )
}
