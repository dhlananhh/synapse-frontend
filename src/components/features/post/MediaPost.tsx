'use client'

import React, { useState } from 'react'
import type { PostDetails } from '@/types/services/post'
import { ArrowLeft, ArrowRight, Image, Video } from 'lucide-react'

interface MediaPostProps {
  post: PostDetails
}

const MediaPost: React.FC<MediaPostProps> = ({ post }) => {
  const { media } = post
  const [current, setCurrent] = useState(0)

  if (!media || media.length === 0) {
    return <div className='text-muted-foreground text-sm'>No media attached.</div>
  }

  const currentMedia = media[current]

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  const handleNext = () => setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1))

  return (
    <div className='flex flex-col items-center gap-2'>
      {/* Display post body content if available */}
      {post.contentHtml && (
        <div
          className='w-full mb-2 prose prose-sm max-w-none dark:prose-invert'
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      )}
      <div className='relative w-full flex justify-center items-center'>
        {currentMedia.type === 'IMAGE' ? (
          <img
            src={currentMedia.url}
            alt={currentMedia.filename}
            className='max-h-96 rounded-md object-contain w-full bg-muted'
            style={{ maxWidth: 480 }}
          />
        ) : currentMedia.type === 'VIDEO' ? (
          <video
            controls
            src={currentMedia.url}
            className='max-h-96 rounded-md object-contain w-full bg-muted'
            style={{ maxWidth: 480 }}
          />
        ) : (
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Image className='w-6 h-6' />
            Unsupported media type
          </div>
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-1 shadow'
              aria-label='Previous media'
              type='button'
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
            <button
              onClick={handleNext}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-1 shadow'
              aria-label='Next media'
              type='button'
            >
              <ArrowRight className='w-5 h-5' />
            </button>
          </>
        )}
      </div>
      {media.length > 1 && (
        <div className='flex gap-1 mt-1'>
          {media.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${
                idx === current ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
      <div className='text-xs text-muted-foreground mt-1'>
        {currentMedia.filename} ({current + 1}/{media.length})
      </div>
    </div>
  )
}

export default MediaPost
