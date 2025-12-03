'use client'

import { useSearchParams } from 'next/navigation'
import CommunityHeader from '@/components/features/community/CommunityHeader'
import FeedList from '@/components/features/feed/FeedList'
import { useCommunity } from '@/context/CommunityContext'
import { useMembership } from '@/context/MembershipContext'

export default function CommunityPage() {
  const community = useCommunity()
  const membershipContext = useMembership()
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
      <div className='mt-6'>
        <FeedList
          showFlair={true}
          type='hot'
          communityId={community.id}
          flairId={activeFlairId ?? undefined}
        />
      </div>
      <span></span>
    </div>
  )
}
