import React from 'react'
import Image from 'next/image'
import type { PostVersion } from '@/types/services/post'
import { useState } from 'react'

interface VersionMediaPostProps {
  version: PostVersion
}

export default function VersionMediaPost({ version }: VersionMediaPostProps) {
  const { versionMedia, contentHtml } = version
  const [ current, setCurrent ] = useState(0)

  if (!versionMedia || versionMedia.length === 0) {
    return <div className='text-muted-foreground text-sm'>No media attached.</div>
  }

  const currentMedia = versionMedia[ current ]

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? versionMedia.length - 1 : prev - 1))
  const handleNext = () => setCurrent((prev) => (prev === versionMedia.length - 1 ? 0 : prev + 1))

  return (
    <div className='flex flex-col items-center gap-2'>
      {/* Content above media */ }
      { contentHtml && (
        <div
          className='prose prose-invert max-w-none text-sm prose-p:my-2 w-full'
          dangerouslySetInnerHTML={ { __html: contentHtml } }
        />
      ) }
      <div className='relative w-full flex justify-center items-center'>
        { currentMedia.type === 'IMAGE' ? (
          <Image
            src={ currentMedia.url }
            alt={ currentMedia.filename }
            className='max-h-96 rounded-md object-contain w-full bg-muted'
            style={ { maxWidth: 480 } }
          />
        ) : currentMedia.type === 'VIDEO' ? (
          <video
            controls
            src={ currentMedia.url }
            className='max-h-96 rounded-md object-contain w-full bg-muted'
            style={ { maxWidth: 480 } }
          />
        ) : (
          <div className='flex items-center gap-2 text-muted-foreground'>
            Unsupported media type
          </div>
        ) }

        { versionMedia.length > 1 && (
          <>
            <button
              onClick={ handlePrev }
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-1 shadow'
              aria-label='Previous media'
              type='button'
            >
              &#8592;
            </button>
            <button
              onClick={ handleNext }
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-1 shadow'
              aria-label='Next media'
              type='button'
            >
              &#8594;
            </button>
          </>
        ) }
      </div>
      { versionMedia.length > 1 && (
        <div className='flex gap-1 mt-1'>
          { versionMedia.map((_, idx) => (
            <span
              key={ idx }
              className={ `inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-muted-foreground/30'
                }` }
            />
          )) }
        </div>
      ) }
      <div className='text-xs text-muted-foreground mt-1'>
        { currentMedia.filename } ({ current + 1 }/{ versionMedia.length })
      </div>
    </div>
  )
}
