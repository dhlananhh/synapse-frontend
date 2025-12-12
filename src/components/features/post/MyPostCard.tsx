'use client'

import type { Post, PostDetails } from '@/types/services/post'
import TextPost from './TextPost'
import MediaPost from './MediaPost'
import LinkPost from './LinkPost'
import { formatDistanceToNow } from 'date-fns'
import { FilePen, Clock, CheckCircle, Lock, UserX, ShieldOff } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-muted text-muted-foreground border',
    icon: <FilePen className='w-4 h-4' />,
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    icon: <Clock className='w-4 h-4' />,
  },
  PUBLISHED: {
    label: 'Published',
    color: 'bg-green-100 text-green-800 border border-green-300',
    icon: <CheckCircle className='w-4 h-4' />,
  },
  LOCKED: {
    label: 'Locked',
    color: 'bg-blue-100 text-blue-800 border border-blue-300',
    icon: <Lock className='w-4 h-4' />,
  },
  REMOVED_AUTHOR: {
    label: 'Removed (Author)',
    color: 'bg-red-100 text-red-800 border border-red-300',
    icon: <UserX className='w-4 h-4' />,
  },
  REMOVED_MOD: {
    label: 'Removed (Mod)',
    color: 'bg-red-100 text-red-800 border border-red-300',
    icon: <ShieldOff className='w-4 h-4' />,
  },
}

interface MyPostCardProps {
  post: PostDetails
}

const MyPostCard = ({ post }: MyPostCardProps) => {
  const status = statusConfig[post.status] || statusConfig.DRAFT

  return (
    <div className='rounded-2xl border bg-card p-4 shadow-sm flex flex-col gap-2 transition hover:shadow-lg hover:border-primary/60 group-hover:border-primary/80 cursor-pointer'>
      {/* First line: Community avatar, name • timestamp */}
      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        <Avatar className='h-5 w-5'>
          <AvatarImage src={post.community.avatarUrl || ''} alt={post.community.name} />
          <AvatarFallback>{post.community.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <Link
          href={`/c/${post.community.name}`}
          className='font-semibold text-foreground hover:underline'
          onClick={(e) => e.stopPropagation()} // Optional: prevents bubbling if you add card-level click handlers in the future
        >
          c/{post.community.name}
        </Link>
        <span className='mx-1'>•</span>
        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
        <span
          className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}
        >
          {status.icon}
          {status.label}
        </span>
      </div>
      {/* Second line: Title (make this the clickable link) */}
      <Link
        href={`/u/me/posts/${post.id}`}
        className='text-xl sm:text-2xl font-bold text-foreground mb-1 break-words hover:underline focus:underline'
        tabIndex={0}
      >
        {post.title}
      </Link>
      {/* Post content */}
      <div>
        {post.type === 'TEXT' && <TextPost post={post} />}
        {post.type === 'MEDIA' && <MediaPost post={post} />}
        {post.type === 'LINK' && <LinkPost post={post} />}
      </div>
    </div>
  )
}

export default MyPostCard
