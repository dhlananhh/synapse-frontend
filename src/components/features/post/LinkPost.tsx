'use client'

import React from 'react'
import type { PostDetails } from '@/types/services/post'

interface LinkPostProps {
  post: PostDetails
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
      <div className='mt-3 flex flex-wrap gap-2'>
        {post.links.map((url, idx) => (
          <a
            key={idx}
            href={/^(https?:)?\/\//i.test(url) ? url : `https://${url}`}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-primary hover:underline'
          >
            {url}
          </a>
        ))}
      </div>
    )}
  </div>
)

export default LinkPost
