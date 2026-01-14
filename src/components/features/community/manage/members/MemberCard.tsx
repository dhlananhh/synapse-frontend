'use client'

import React from 'react'
import Link from 'next/link'
import { CommunityMember } from '@/types/services/community'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  Gavel,
  ShieldOff,
  Trash2,
  Shield,
  Star,
} from 'lucide-react'

interface MemberCardProps {
  member: CommunityMember
  // Role of the person performing community member management
  currentUserRole?: 'OWNER' | 'MODERATOR' | 'MEMBER'

  // Action for "Pending" tab
  onApprove?: (userId: string, username: string) => void
  onReject?: (userId: string, username: string) => void

  // Action for "Banned" tab
  onUnban?: (userId: string, username: string) => void

  // Action for "Curent" tab
  onBan?: (userId: string, username: string) => void
  onRemove?: (userId: string, username: string) => void
  onPromote?: (userId: string, username: string) => void // Owner only
  onDemote?: (userId: string, username: string) => void // Owner only
}

export function MemberCard({
  member,
  currentUserRole,
  onApprove,
  onReject,
  onUnban,
  onBan,
  onRemove,
  onPromote,
  onDemote,
}: MemberCardProps) {
  const canManageModerator = currentUserRole === 'OWNER' && member.role === 'MODERATOR'
  const canManageMember = currentUserRole === 'OWNER' || currentUserRole === 'MODERATOR'

  const renderActions = () => {
    // --- Context: PENDING TAB ---
    if (onApprove && onReject) {
      return (
        <div className='flex flex-wrap gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onReject(member.userId, member.username)}
          >
            <UserX className='mr-2 h-4 w-4' />
            Reject
          </Button>
          <Button size='sm' onClick={() => onApprove(member.userId, member.username)}>
            <UserCheck className='mr-2 h-4 w-4' />
            Approve
          </Button>
        </div>
      )
    }

    // --- Context: BANNED TAB ---
    if (onUnban) {
      return (
        <Button size='sm' variant='outline' onClick={() => onUnban(member.userId, member.username)}>
          <ShieldOff className='mr-2 h-4 w-4' />
          Unban
        </Button>
      )
    }

    // --- Context: CURRENT MEMBERS TAB ---
    // Only show the actions menu if the user has permission and the member is not the Owner
    const canShowActionsMenu =
      (canManageModerator || (canManageMember && member.role === 'MEMBER')) &&
      member.role !== 'OWNER'

    if (canShowActionsMenu) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Member Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Owner-Only Actions */}
            {currentUserRole === 'OWNER' && member.role === 'MEMBER' && (
              <DropdownMenuItem onClick={() => onPromote?.(member.userId, member.username)}>
                <Shield className='mr-2 h-4 w-4' />
                Promote to Moderator
              </DropdownMenuItem>
            )}
            {currentUserRole === 'OWNER' && member.role === 'MODERATOR' && (
              <DropdownMenuItem onClick={() => onDemote?.(member.userId, member.username)}>
                <UserCheck className='mr-2 h-4 w-4' />
                Demote to Member
              </DropdownMenuItem>
            )}
            {currentUserRole === 'OWNER' && <DropdownMenuSeparator />}

            {/* Dangerous actions */}
            <DropdownMenuItem
              onClick={() => onBan?.(member.userId, member.username)}
              className='text-destructive focus:bg-destructive/10'
            >
              <Gavel className='mr-2 h-4 w-4' />
              Ban Member
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRemove?.(member.userId, member.username)}
              className='text-destructive focus:bg-destructive/10'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Remove from Community
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return null
  }

  return (
    <div className='hover:bg-muted/50 flex items-center justify-between border-b p-3 transition-colors last:border-b-0'>
      <div className='flex items-center gap-4'>
        <Link href={`/u/${member.userId}`}>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={''} alt={`@${member.username}`} />
            <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <div className='flex items-center gap-2'>
            <Link href={`/u/${member.userId}`} className='font-semibold hover:underline'>
              {member.username}
            </Link>
            {/* Badges show roles */}
            {member.role === 'OWNER' && (
              <div title='Owner' className='flex items-center text-yellow-500'>
                <Star className='h-4 w-4 fill-yellow-500' />
              </div>
            )}
            {member.role === 'MODERATOR' && (
              <div title='Moderator' className='flex items-center text-blue-500'>
                <Shield className='h-4 w-4 fill-blue-500' />
              </div>
            )}
          </div>
          {/* {member.joinedAt && (
            <p className="text-muted-foreground text-xs">
              Joined{" "}
              {new Date(
                member.joinedAt
              ).toLocaleDateString()}
            </p>
          )} */}
        </div>
      </div>
      <div className='shrink-0'>{renderActions()}</div>
    </div>
  )
}
