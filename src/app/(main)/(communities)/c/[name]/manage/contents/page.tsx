'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useCommunity, useCommunityFlairs } from '@/context/CommunityContext'
import { postService } from '@/modules/services/post-service'
import { userService } from '@/modules/services/user-service'
import type { PostDetails } from '@/types/services/post'
import type { SimpleProfile } from '@/types/services/user'
import PendingPostAccordion from '@/components/features/post/PendingPostAccordion'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { ActionConfirmDialog } from '@/components/features/community/manage/members/ActionConfirmDialog'

const POST_TYPES = ['TEXT', 'MEDIA', 'LINK'] as const
type PostTypeFilter = (typeof POST_TYPES)[number] | 'ALL'

export default function ManageContentsPage() {
  const community = useCommunity()
  const flairs = useCommunityFlairs()
  const [posts, setPosts] = useState<PostDetails[]>([])
  const [authorProfiles, setAuthorProfiles] = useState<Record<string, SimpleProfile>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<PostTypeFilter>('ALL')

  // Dialog state
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; postId?: string }>({
    open: false,
  })
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; postId?: string }>({
    open: false,
  })
  const [rejectReason, setRejectReason] = useState('')

  // Local state for managing approval and rejection loading states
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  // Fetch pending posts and author profiles
  const fetchPendingPosts = useCallback(async () => {
    if (!community?.id) return
    setIsLoading(true)
    setError(null)
    try {
      const params: any = {}
      if (typeFilter !== 'ALL') {
        params.types = typeFilter
      }
      const res = await postService.listPendingCommunityPosts(community.id, params)
      setPosts(res.posts)
      // Batch fetch author profiles
      const authorIds = Array.from(new Set(res.posts.map((p) => p.authorId)))
      if (authorIds.length) {
        const profiles = await userService.getSimpleProfiles(authorIds)
        const profileMap: Record<string, SimpleProfile> = {}
        for (const profile of profiles) {
          profileMap[profile.id] = profile
        }
        setAuthorProfiles(profileMap)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load pending posts')
    } finally {
      setIsLoading(false)
    }
  }, [community?.id, typeFilter])

  useEffect(() => {
    fetchPendingPosts()
  }, [fetchPendingPosts])

  // Approve handler
  const handleApprove = (postId: string) => {
    setApproveDialog({ open: true, postId })
  }
  const confirmApprove = async () => {
    if (!approveDialog.postId) return
    setIsApproving(true)
    try {
      await postService.approvePost(approveDialog.postId)
      setPosts((prev) => prev.filter((p) => p.id !== approveDialog.postId))
      toast.success('Post approved successfully!')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to approve post')
    } finally {
      setIsApproving(false)
      setApproveDialog({ open: false })
    }
  }

  // Reject handler
  const handleReject = (postId: string) => {
    setRejectDialog({ open: true, postId })
  }
  const confirmReject = async (reason?: string) => {
    if (!rejectDialog.postId) return
    if (!reason || !reason.trim()) {
      toast.error('Please provide a reason for rejection.')
      return
    }
    setIsRejecting(true)
    try {
      await postService.rejectPost(rejectDialog.postId, reason)
      setPosts((prev) => prev.filter((p) => p.id !== rejectDialog.postId))
      toast.success('Post rejected.')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to reject post')
    } finally {
      setIsRejecting(false)
      setRejectDialog({ open: false })
    }
  }

  if (!community?.id) {
    return <div className='p-8 text-center text-muted-foreground'>No community found.</div>
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return <div className='p-8 text-center text-destructive'>{error}</div>
  }

  if (posts.length === 0) {
    return <div className='p-8 text-center text-muted-foreground'>No pending posts to review.</div>
  }

  return (
    <>
      <div className='mb-6'>
        <Link href={`/c/${community.name}/manage`}>
          <button className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4'>
            <ArrowLeft className='h-5 w-5' />
            Back to Moderation Tools
          </button>
        </Link>
        <h2 className='text-2xl font-bold mb-2'>Reviewing Pending Posts</h2>
      </div>
      <div className='flex gap-2 mb-4'>
        <Button
          variant={typeFilter === 'ALL' ? 'default' : 'outline'}
          className={typeFilter === 'ALL' ? 'font-bold' : ''}
          onClick={() => setTypeFilter('ALL')}
          size='sm'
        >
          All
        </Button>
        {POST_TYPES.map((type) => (
          <Button
            key={type}
            variant={typeFilter === type ? 'default' : 'outline'}
            className={typeFilter === type ? 'font-bold' : ''}
            onClick={() => setTypeFilter(type)}
            size='sm'
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>
      <div className='flex flex-col gap-6'>
        {posts.map((post) => {
          const flair = flairs.find((f) => f.id === post.flairId) || null
          return (
            <PendingPostAccordion
              key={post.id}
              post={post}
              authorProfile={authorProfiles[post.authorId]}
              flair={flair}
              actions={
                <div className='flex gap-3 mt-4'>
                  <Button
                    size='sm'
                    variant='default'
                    className='bg-green-600 hover:bg-green-700 text-white rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-1'
                    onClick={() => handleApprove(post.id)}
                  >
                    <span className='inline-block'>✔</span>
                    Approve
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    className='rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-1'
                    onClick={() => handleReject(post.id)}
                  >
                    <span className='inline-block'>✖</span>
                    Reject
                  </Button>
                </div>
              }
            />
          )
        })}
      </div>
      <ActionConfirmDialog
        isOpen={approveDialog.open}
        onOpenChange={(open) => setApproveDialog({ open })}
        onConfirm={confirmApprove}
        title='Approve Post'
        description='Approving this post ? This will publish the post in the community'
        actionLabel='Approve'
        isConfirming={isApproving}
      />
      <ActionConfirmDialog
        isOpen={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog({ open })}
        onConfirm={confirmReject}
        title='Reject Post'
        description='Please provide a reason for rejection:'
        actionLabel='Reject'
        isConfirming={isRejecting}
        withReason={{
          label: 'Reason',
          placeholder: 'Reason for rejection',
          isRequired: true,
        }}
      />
    </>
  )
}
