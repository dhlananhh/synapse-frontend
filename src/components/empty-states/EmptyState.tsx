import React from 'react'

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className='rounded-md border p-6 text-center text-sm text-muted-foreground'>
      {children}
    </div>
  )
}
