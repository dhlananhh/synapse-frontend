'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import FeedList from './FeedList'
import RecentPosts from './RecentPosts'

export default function FeedPage() {
  const searchParams = useSearchParams()
  const feedType = searchParams.get('feed') || 'hot' // Default to 'hot' if no feed type is provided

  return (
    <div className='flex min-h-screen py-4 justify-center'>
      <main className='w-2xl max-w-3xl'>
        <FeedList type={feedType as 'hot' | 'trending' | 'top' | 'global'} />
      </main>
      <aside className='w-80 ml-8 h-screen sticky top-[64px]'>
        <RecentPosts />
      </aside>
    </div>
  )
}
