'use client'

import React, { Suspense } from 'react'
import VerifyEmailForm from '@/components/features/auth/VerifyEmailForm'

export const dynamic = 'force-dynamic'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  )
}
