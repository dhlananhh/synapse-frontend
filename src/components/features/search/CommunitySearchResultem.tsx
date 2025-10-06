import Link from 'next/link'
import { SearchCommunityResult } from '@/types/services/community'
import { Lock, TriangleAlert } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function CommunitySearchResultItem({ community }: { community: SearchCommunityResult }) {
  return (
    <li>
      <Link
        href={`/c/${community.name}`}
        className='py-6 px-2 flex items-center gap-4 min-h-[90px] rounded hover:bg-accent transition'
      >
        {/* Avatar */}
        <div className='w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center'>
          {community.avatarUrl ? (
            <img
              src={community.avatarUrl}
              alt={community.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-muted-foreground text-xl'>{community.name[0].toUpperCase()}</span>
          )}
        </div>
        {/* Info */}
        <div>
          <div className='font-semibold text-lg'>c/{community.name}</div>
          <div className='flex gap-2 mt-2 mb-2'>
            {community.status === 'PRIVATE' && (
              <span
                title='Private Community'
                className='inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-700 text-white text-xs font-bold'
              >
                <Lock className='w-4 h-4' />
                Private
              </span>
            )}
            {community.isNSFW && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='inline-flex items-center gap-1 px-3 py-1 rounded bg-purple-600 text-white text-xs font-bold cursor-pointer'>
                    <TriangleAlert className='w-4 h-4' />
                    NSFW
                  </span>
                </TooltipTrigger>
                <TooltipContent side='right'>This community contains mature content</TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className='text-base text-muted-foreground'>{community.description}</div>
          <div className='flex gap-4 text-sm text-muted-foreground mt-1'>
            <span>
              <span className='font-semibold'>
                {community.memberCount} member{community.memberCount > 1 ? 's' : ''}
              </span>
            </span>
            <span>
              <span className='font-semibold'>
                {community.postCount} post{community.postCount > 1 ? 's' : ''}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}
