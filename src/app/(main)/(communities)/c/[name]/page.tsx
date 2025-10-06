'use client'

import { useSearchParams } from 'next/navigation'
import CommunityHeader from '@/components/features/community/CommunityHeader'
import CommunityPostFeed from '@/components/features/community/CommunityPostFeed'
import { useCommunity } from '@/context/CommunityContext'
import { useMembership } from '@/context/MembershipContext'
import { format } from 'date-fns'

export default function CommunityPage() {
  const community = useCommunity()
  const membershipContext = useMembership?.()
  const membership = membershipContext?.membership ?? null
  const setMembership = membershipContext?.setMembership
  const searchParams = useSearchParams()
  const activeFlairId = searchParams.get('flair')
  if (!community) return <div>Loadddding...</div>

  return (
    <div>
      <CommunityHeader
        community={community}
        membership={membership}
        onMembershipChange={setMembership}
      />
      {/* <CreatePostWidget /> */}
      <div className='mt-6'>
        {/* <CommunityPostFeed communityId={community.id} flairId={activeFlairId} /> */}
      </div>
      <span></span>
    </div>
  )
}
