import React from 'react'

export function PostCardSkeleton() {
  return (
    <div className='animate-pulse rounded-md border bg-card p-4'>
      <div className='mb-3 h-5 w-1/2 rounded bg-muted' />
      <div className='mb-2 h-3 w-1/4 rounded bg-muted' />
      <div className='h-3 w-full rounded bg-muted' />
      <div className='mt-2 h-3 w-5/6 rounded bg-muted' />
    </div>
  )
}
