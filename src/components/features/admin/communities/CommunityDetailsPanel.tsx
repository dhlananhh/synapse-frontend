import React, { useEffect, useState } from 'react'
import { SearchCommunityResult } from '@/types/services/community'
import CommunityActivityLog from './CommunityActivityLog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { userService } from '@/modules/services/user-service'
import type { SimpleProfile } from '@/types/services/user'

type Props = {
  community: SearchCommunityResult | null
  onClose?: () => void
}

/**
 * Panel that shows selected community details and activity log
 */
export default function CommunityDetailsPanel({ community, onClose }: Props) {
  const [ownerProfile, setOwnerProfile] = useState<SimpleProfile | null>(null)

  useEffect(() => {
    let mounted = true
    if (!community?.ownerId) {
      setOwnerProfile(null)
      return
    }

    ;(async () => {
      try {
        const profiles = await userService.getSimpleProfiles([community.ownerId])
        if (!mounted) return
        setOwnerProfile(Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null)
      } catch (err) {
        console.warn('Failed to fetch owner profile', err)
        if (mounted) setOwnerProfile(null)
      }
    })()

    return () => {
      mounted = false
    }
  }, [community?.ownerId])

  if (!community) {
    return (
      <div className='p-4 border rounded-md'>
        <div className='text-sm text-muted-foreground'>Select a community to view details</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-12 w-12'>
            {community.avatarUrl ? (
              <AvatarImage src={community.avatarUrl} alt={`c/${community.name} avatar`} />
            ) : null}
            <AvatarFallback>{(community.name?.charAt?.(0) ?? '?').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className='text-lg font-semibold'>c/{community.name}</div>
            <div className='text-sm text-muted-foreground'>
              {community.description ?? 'Community'}
            </div>

            {/* Owner info */}
            {community.ownerId && (
              <div className='mt-2 flex items-center gap-3'>
                <Avatar className='h-6 w-6'>
                  {ownerProfile?.avatarUrl ? (
                    <AvatarImage
                      src={ownerProfile.avatarUrl}
                      alt={ownerProfile.username ?? 'Owner'}
                    />
                  ) : (
                    <AvatarFallback>
                      {(
                        ownerProfile?.username?.charAt?.(0) ??
                        community.ownerId.charAt?.(0) ??
                        '?'
                      ).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className='text-sm'>
                  <div className='font-medium'>
                    {ownerProfile ? (
                      `u/${ownerProfile.username}`
                    ) : (
                      <span className='text-xs text-muted-foreground'>{community.ownerId}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          {onClose && (
            <Button variant='ghost' size='sm' onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className=' bg-surface/5'>
        <CommunityActivityLog communityName={community.name} communityId={community.id} />
      </div>
    </div>
  )
}
