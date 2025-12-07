import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


interface LinkViewerProps {
  links: {
    url: string
    title: string
    description: string
    thumbnail: string | null
  }[]
}


export default function LinkViewer({ links }: LinkViewerProps) {
  const getDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      return hostname.replace('www.', '')
    } catch {
      return ''
    }
  }

  return (
    <div className='space-y-4'>
      {
        links.map((link, index) => (
          <Link
            key={ index }
            href={ link.url }
            target='_blank'
            rel='noopener noreferrer'
            className='group block h-32 overflow-hidden rounded-xl border border-border bg-secondary/40 transition-colors duration-200 hover:bg-secondary/70 hover:shadow-sm'
          >
            <div className='flex h-full'>
              {/* Thumbnail */ }
              { link.thumbnail ? (
                <div className='relative w-32 flex-shrink-0'>
                  <Image
                    src={ link.thumbnail }
                    alt={ link.title }
                    fill
                    className='border-r border-border object-cover'
                  />
                </div>
              ) : (
                <div className='flex w-24 flex-shrink-0 items-center justify-center bg-secondary/60 border-r border-border text-2xl font-bold text-muted-foreground'>
                  🔗
                </div>
              ) }

              <div className='flex min-w-0 flex-1 flex-col justify-center p-3'>
                <h4 className='mb-1 line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
                  { link.title }
                </h4>

                <p className='line-clamp-2 text-xs text-muted-foreground mb-1'>
                  { link.description }
                </p>

                <p className='text-[10px] text-muted-foreground/70 uppercase tracking-wide'>
                  { getDomain(link.url) }
                </p>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  )
}
