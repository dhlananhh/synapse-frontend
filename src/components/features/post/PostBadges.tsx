import React from 'react'

export function PostBadges({ isNSFW, isSpoiler }: { isNSFW: boolean; isSpoiler: boolean }) {
  return (
    <div className='mb-2 text-xs text-muted-foreground'>
      {isNSFW && (
        <span className='mr-2 rounded bg-red-500/10 px-1.5 py-0.5 text-red-500'>NSFW</span>
      )}
      {isSpoiler && (
        <span className='mr-2 rounded bg-yellow-500/10 px-1.5 py-0.5 text-yellow-500'>Spoiler</span>
      )}
    </div>
  )
}
