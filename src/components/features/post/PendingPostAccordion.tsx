'use client'

import React from 'react'
import type { PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { PostBadges } from './PostBadges'
import TextPost from './TextPost'
import MediaPost from './MediaPost'
import LinkPost from './LinkPost'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'

interface PendingPostAccordionProps {
  post: PostDetails
  authorProfile?: SimpleProfile
  flair?: { name: string; color?: string } | null
  actions?: React.ReactNode // Approve/Reject buttons
}

function getPreviewText(html: string, wordLimit = 100) {
  const text = html.replace(/<[^>]+>/g, '')
  const words = text.split(/\s+/)
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text
}

const PendingPostAccordion: React.FC<PendingPostAccordionProps> = ({
  post,
  authorProfile,
  flair,
  actions,
}) => (
  <Accordion
    type='single'
    collapsible
    className='rounded-2xl border border-muted bg-card shadow-sm hover:shadow-lg transition-shadow'
  >
    <AccordionItem value={post.id}>
      <AccordionTrigger className='px-4 py-3 rounded-t-2xl hover:bg-muted/60 transition-colors'>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            {authorProfile?.avatarUrl ? (
              <img
                src={authorProfile.avatarUrl}
                alt={authorProfile.username}
                className='w-6 h-6 rounded-full object-cover'
              />
            ) : (
              <span className='w-6 h-6 rounded-full bg-muted flex items-center justify-center text-base text-muted-foreground'>
                {authorProfile?.username?.[0]?.toUpperCase() || post.authorId[0]?.toUpperCase()}
              </span>
            )}
            <span className='font-medium text-foreground'>
              {authorProfile?.username ? `u/${authorProfile.username}` : post.authorId}
            </span>
            {/* Flair badge */}
            {flair && (
              <span
                className='ml-2 rounded px-2 py-0.5 text-xs font-medium'
                style={{
                  backgroundColor: flair.color || '#eee',
                  color: '#fff',
                }}
              >
                {flair.name}
              </span>
            )}
            {/* Timestamp */}
            <span className='ml-2'>
              • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className='mt-1 text-xl font-semibold'>{post.title}</div>
          <PostBadges isNSFW={post.isNSFW} isSpoiler={post.isSpoiler} />
        </div>
      </AccordionTrigger>
      <AccordionContent className='bg-muted/40 px-4 pt-4 pb-4 rounded-b-2xl border-t border-muted'>
        {post.type === 'TEXT' && <TextPost post={post} />}
        {post.type === 'MEDIA' && <MediaPost post={post} />}
        {post.type === 'LINK' && <LinkPost post={post} />}
        {actions && (
          <>
            <Separator className='my-4' />
            <span>Your decision : </span>
            <div className='flex gap-2'>{actions}</div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

export default PendingPostAccordion
