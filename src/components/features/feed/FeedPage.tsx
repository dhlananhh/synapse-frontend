'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import FeedList from './FeedList'


export default function FeedPage() {
  const searchParams = useSearchParams()
  const feedType = searchParams.get('feed') || 'hot'

  return (
    <div className='w-full space-y-4'>
      <FeedList type={ feedType as 'hot' | 'trending' | 'top' | 'global' } />
    </div>
  )
}
