'use client'

import React, { Suspense } from 'react'
import FeedPage from '@/components/features/feed/FeedPage'

export default function Feed() {
  return (
    <div className='mt-14'>
      <Suspense fallback={null}>
        <FeedPage />
      </Suspense>
    </div>
  )
}
