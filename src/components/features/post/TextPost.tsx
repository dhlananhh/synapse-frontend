'use client'

import React from 'react'
import type { PostDetails } from '@/types/services/post'

interface TextPostProps {
  post: PostDetails
}

const TextPost: React.FC<TextPostProps> = ({ post }) => (
  <div>
    {post.contentHtml && (
      <div
        className='prose prose-invert max-w-none text-sm prose-p:my-2 line-clamp-6'
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    )}
  </div>
)

export default TextPost
