import React from 'react'

export function LinkChips({ links }: { links: string[] }) {
  if (!links?.length) return null
  return (
    <div className='mt-2 flex flex-wrap gap-2'>
      {links.map((u, i) => (
        <a
          key={`${u}-${i}`}
          href={/^(https?:)?\/\//i.test(u) ? u : `https://${u}`}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-primary hover:underline'
        >
          {u}
        </a>
      ))}
    </div>
  )
}
