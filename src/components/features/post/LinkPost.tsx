'use client'

import React from 'react'
import type { PostDetails } from '@/types/services/post'

interface LinkPostProps {
  post: PostDetails
}

const normalizeUrl = (url: string) => {
  if (/^(https?:)?\/\//i.test(url)) return url
  return `https://${url}`
}

const getHost = (url: string) => {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const LinkPost: React.FC<LinkPostProps> = ({ post }) => (
  <div>
    {post.contentHtml && (
      <div
        className='prose prose-invert max-w-none text-sm prose-p:my-2 line-clamp-6'
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    )}

    {post.links?.length > 0 && (
      <div className='mt-3 flex flex-col gap-3'>
        {post.links.map((rawLink, idx) => {
          // Support both legacy string links and the new structured link shape
          const link =
            typeof rawLink === 'string'
              ? { url: rawLink, title: rawLink, description: '', thumbnail: null }
              : rawLink

          const href = normalizeUrl(link.url)
          const host = getHost(link.url)

          return (
            <a
              key={idx}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-start gap-3 p-3 rounded-md border hover:shadow-sm transition-colors bg-card'
            >
              {link.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={link.thumbnail}
                  alt={link.title ?? host}
                  className='w-20 h-12 rounded object-cover flex-shrink-0'
                />
              ) : (
                <div className='w-20 h-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0'>
                  {host}
                </div>
              )}

              <div className='flex-1 min-w-0'>
                <div className='font-medium text-sm truncate'>{link.title || host}</div>
                {link.description && (
                  <div className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                    {link.description}
                  </div>
                )}
                <div className='text-xs text-muted-foreground mt-2 truncate'>{host}</div>
              </div>
            </a>
          )
        })}
      </div>
    )}
  </div>
)

export default LinkPost
