'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import type { SearchPost } from '@/types/services/post'
import MediaViewer from '@/components/features/feed/MediaViewer'
import LinkViewer from '@/components/features/feed/LinkViewer'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type Props = {
  post: SearchPost
}

function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}

export function PostSearchResultItem({ post }: Props) {
  const router = useRouter()

  const thumbnail =
    post.links?.[0]?.thumbnail ?? post.media?.find((m) => m.type === 'IMAGE')?.url ?? null

  const contentText = useMemo(() => stripHtml(post.contentHtml || ''), [post.contentHtml])
  const words = useMemo(
    () => (contentText ? contentText.split(/\s+/).filter(Boolean) : []),
    [contentText]
  )

  const WORD_LIMIT = 100
  const isLong = words.length > WORD_LIMIT
  const [expanded, setExpanded] = useState(false)

  const preview = isLong && !expanded ? words.slice(0, WORD_LIMIT).join(' ') + '…' : contentText

  const communityName = post.community?.name ?? ''
  const timeLabel = (() => {
    try {
      return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    } catch {
      return post.createdAt
    }
  })()

  // MediaViewer expects media: { key, url }[]
  const mediaForViewer = (post.media ?? []).map((m) => ({ key: m.key, url: m.url }))

  const postPath = communityName
    ? `/c/${encodeURIComponent(communityName)}/posts/${post.id}`
    : `/posts/${post.id}`

  const handleNavigate = (e: React.MouseEvent | React.KeyboardEvent) => {
    // if the user clicked a real link inside the card (e.g. LinkViewer anchors), don't intercept
    const target = e.target as HTMLElement | null
    if (target && target.closest && target.closest('a')) return

    // allow keyboard Enter to activate
    router.push(postPath)
  }

  return (
    <li className='p-4 border-b last:border-b-1 bg-background'>
      <div className='flex items-start gap-4'>
        <div className='flex-shrink-0'>
          <Link href={post.community?.id ? `/c/${post.community.id}` : '#'} className='block'>
            <Avatar className='w-10 h-10'>
              {post.community?.avatarUrl ? (
                <AvatarImage src={post.community.avatarUrl} alt={communityName} />
              ) : (
                <AvatarFallback>{communityName?.slice(0, 2).toUpperCase() || 'C'}</AvatarFallback>
              )}
            </Avatar>
          </Link>
        </div>

        {/* clickable area (does NOT wrap LinkViewer/MediaViewer anchors) */}
        <div
          className='flex-1 min-w-0 cursor-pointer'
          role='link'
          tabIndex={0}
          onClick={handleNavigate}
          onKeyDown={(e) => {
            if ((e as React.KeyboardEvent).key === 'Enter') handleNavigate(e)
          }}
        >
          <div className='flex items-center justify-between gap-3'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Link
                  href={post.community?.id ? `/c/${post.community.name}` : '#'}
                  className='hover:underline font-medium text-sm'
                >
                  c/{communityName}
                </Link>
                <span>•</span>
                <span>{timeLabel}</span>
              </div>

              <div className='block'>
                <h3 className='mt-2 text-sm font-semibold text-foreground truncate'>
                  {post.title}
                </h3>
              </div>

              {post.contentHtml && (
                <div className='mt-2 text-sm text-muted-foreground'>
                  <p className='whitespace-pre-wrap'>{preview}</p>
                  {isLong && (
                    <button
                      onClick={(e) => {
                        // prevent parent click navigation when toggling expand
                        e.stopPropagation()
                        setExpanded((s) => !s)
                      }}
                      className='mt-2 text-xs text-primary hover:underline'
                      aria-expanded={expanded}
                    >
                      {expanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={post.title}
                className='w-28 h-20 rounded object-cover flex-shrink-0'
              />
            )}
          </div>

          {/* Link or Media preview below content */}
          <div className='mt-3'>
            {post.type === 'MEDIA' && post.media && post.media.length > 0 && (
              <div className='rounded-md overflow-hidden' onClick={(e) => e.stopPropagation()}>
                <MediaViewer media={mediaForViewer} />
              </div>
            )}

            {post.type === 'LINK' && post.links && post.links.length > 0 && (
              <div className='mt-2' onClick={(e) => e.stopPropagation()}>
                <LinkViewer
                  links={
                    post.links as {
                      url: string
                      title: string
                      description: string
                      thumbnail: string | null
                    }[]
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export default PostSearchResultItem
