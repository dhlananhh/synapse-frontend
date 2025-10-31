import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='min-h-screen flex items-center justify-center bg-secondary'>{children}</main>
  )
}
