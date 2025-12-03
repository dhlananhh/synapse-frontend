'use client'

import React from 'react'
import { PostDetails, PostMediaType } from '@/types/services/post'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Image, Video } from 'lucide-react'

interface PostPreviewProps {
  post: PostDetails
}

export default function PostPreview({ post }: PostPreviewProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/c/${post.community.name}/posts/${post.id}`) // Navigate to post
  }

  const renderMediaMetadata = (mediaType: PostMediaType, mediaCount: number) => {
    return (
      <div className='absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded'>
        {mediaType === 'IMAGE' ? <Image className='h-4 w-4' /> : <Video className='h-4 w-4' />}
        <span>{mediaCount}</span>
      </div>
    )
  }

  return (
    <div
      className='p-4 border rounded-lg bg-muted hover:bg-gray-700 cursor-pointer transition-colors relative'
      onClick={handleClick}
    >
      {/* Header Section */}
      <div className='flex items-center gap-3 mb-2'>
        {/* Community Avatar */}
        <Avatar className='w-8 h-8 border border-gray-400'>
          {post.community.avatarUrl ? (
            <AvatarImage src={post.community.avatarUrl} alt={post.community.name} />
          ) : (
            <AvatarFallback>{post.community.name.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>

        {/* Community Name and Timestamp */}
        <div>
          <p className='text-sm font-medium'>c/{post.community.name}</p>
          <p className='text-xs text-gray-500'>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Title */}
      <h4 className='text-sm font-light mb-2'>{post.title}</h4>

      {/* Media Preview */}
      {post.type === 'MEDIA' && post.media.length > 0 && (
        <div className='relative'>
          <img
            src={post.media[0].url}
            alt={post.media[0].filename}
            className='w-full h-40 object-cover rounded-lg'
          />
          {renderMediaMetadata(post.media[0].type, post.media.length)}
        </div>
      )}

      {/* Interactions */}
      <div className='mt-2 text-xs text-gray-400 flex items-center gap-2'>
        <span>{post.score > 0 ? post.score : 0} upvotes</span>•
        <span>{post.commentCount} comments</span>
      </div>
    </div>
  )
}
