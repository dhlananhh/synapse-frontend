'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useMembership } from '@/context/MembershipContext'
import { useCommunity, useSetCommunity } from '@/context/CommunityContext'
import { UpdateCommunityDialog } from '@/components/features/community/manage/dialogs/UpdateCommunityDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  Cake,
  Users,
  Settings,
  Globe,
  Lock,
  Info,
  UserPlus,
  FileText,
  TriangleAlert,
  ShieldCheck,
  FolderKanban,
} from 'lucide-react'
import type { Community } from '@/types/services/community'

export default function AboutCommunityWidget() {
  const community = useCommunity()
  const setCommunity = useSetCommunity()
  const { user } = useAuth()
  const membershipContext = useMembership()
  const membership = membershipContext?.membership ?? null

  // don't render until community is available
  if (!community) return null

  // determine role/status from membership (use membership primarily)
  const role = membership?.role ?? (user?.id === community.ownerId ? 'OWNER' : undefined)
  const membershipStatus = membership?.status ?? undefined

  const isOwner = role === 'OWNER'
  const isModerator = role === 'MODERATOR'
  const canManage = membershipStatus === 'ACTIVE' && (isModerator || isOwner)

  const handleUpdate = (updated: Community) => {
    setCommunity(updated)
  }

  // safe createdAt parsing
  const createdAtDate = useMemo(() => {
    if (!community?.createdAt) return null
    const d = new Date(community.createdAt)
    return Number.isNaN(d.getTime()) ? null : d
  }, [community?.createdAt])

  return (
    <>
      <Card>
        <CardHeader>
          <Link href={`/c/${community.name}`}>
            <CardTitle
              className='cursor-pointer hover:text-primary transition-colors hover:scale-[1.03] hover:bg-muted/40 px-2 py-1 rounded'
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <Info className='h-5 w-5 inline mr-2 transition-transform group-hover:scale-110' />
              <span>About c/{community.name}</span>
            </CardTitle>
          </Link>
        </CardHeader>

        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>{community.description}</p>

          <div className='flex flex-col gap-3 text-sm'>
            <div className='flex items-center gap-2'>
              <Cake className='h-5 w-5' />
              <span>
                Created {createdAtDate ? format(createdAtDate, 'MMM d, yyyy') : 'Unknown'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {community.isPrivate ? (
                <span className='inline-flex items-center gap-2 px-2 py-1 rounded bg-indigo-600 text-white text-sm font-semibold'>
                  <Lock className='w-4 h-4 text-white' />
                  Private
                </span>
              ) : (
                <span className='inline-flex items-center gap-2 px-2 py-1 rounded bg-green-600 text-white text-sm font-semibold'>
                  <Globe className='w-4 h-4 text-white' />
                  Public
                </span>
              )}

              {community.isNSFW && (
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-600 text-white text-xs font-bold'>
                  <TriangleAlert className='w-4 h-4 text-white' />
                  NSFW
                </span>
              )}

              {community.moderationMode && (
                <span className='inline-flex items-center gap-2 px-2 py-1 rounded bg-amber-600 text-white text-sm font-semibold'>
                  <ShieldCheck className='w-4 h-4 text-white' />
                  Moderated
                </span>
              )}
            </div>
            <hr />

            <Link
              href={`/c/${community.name}/members`}
              className='flex items-center gap-2 hover:text-primary font-medium cursor-pointer'
            >
              <Users className='h-5 w-5' />
              <span>{community.memberCount.toLocaleString()} members</span>
            </Link>
          </div>

          {/* Moderator / Owner actions (use membership role & status) */}
          {(canManage || isOwner) && (
            <>
              <hr />
              <div className='space-y-2'>
                <h4 className='font-semibold text-sm'>
                  {/* {isOwner ? 'Owner Actions' : 'Moderator Actions'} */}
                </h4>

                {/* Manage Members - available to moderators & owners (if active)
                {canManage && (
                  <Button asChild className='w-full' variant='outline'>
                    <Link
                      href={`/c/${community.name}/manage`}
                      className='flex items-center justify-center gap-2 w-full'
                    >
                      <UserPlus className='h-4 w-4' />
                      Manage Members
                    </Link>
                  </Button>
                )} */}

                {/* Manage Contents - available to moderators & owners (if active) */}
                {/* {canManage && (
                  <Button asChild className='w-full' variant='outline'>
                    <Link
                      href={`/c/${community.name}/manage/contents`}
                      className='flex items-center justify-center gap-2 w-full'
                    >
                      <FileText className='h-4 w-4' />
                      Manage Contents
                    </Link>
                  </Button>
                )} */}

                {/* Community Management - available to moderators & owners (if active) */}
                {canManage && (
                  <Button asChild className='w-full' variant='outline'>
                    <Link
                      href={`/c/${community.name}/manage`}
                      className='flex w-full items-center justify-center gap-2'
                    >
                      <FolderKanban className='h-4 w-4' />
                      Manage this community
                    </Link>
                  </Button>
                )}

                {/* Edit Community - available only to owner
                {isOwner && <UpdateCommunityDialog community={community} onUpdate={handleUpdate} />} */}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
