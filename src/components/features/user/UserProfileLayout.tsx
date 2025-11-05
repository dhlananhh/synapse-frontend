'use client'

import React from 'react'
import { OwnProfileHeader } from './OwnProfileHeader'

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center w-full max-w-4xl px-4 sm:px-6 lg:px-8 mt-14 mx-auto bg-amber-200'>
      <OwnProfileHeader />
      {children}
    </div>
  )
}
