'use client'

import { Suspense } from 'react'
import { CommunityCreationWizard } from '@/components/features/community/CommunityCreationWizard'

export default function CreateCommunityPage() {
  return (
    <div className='container mx-auto max-w-2xl py-8'>
      <h1 className='text-3xl font-bold mb-2'>Create a new community</h1>
      <p className='text-muted-foreground mb-8'>
        Build and grow a community about a topic you are passionate about.
      </p>
      <Suspense fallback={null}>
        <CommunityCreationWizard />
      </Suspense>
    </div>
  )
}
