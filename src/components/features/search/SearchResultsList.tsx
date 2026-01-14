import { UserSearchResultItem } from '@/components/features/search/UserSearchResultItem'
import { CommunitySearchResultItem } from '@/components/features/search/CommunitySearchResultem'
import PostSearchResultItem from '@/components/features/search/PostSearchResultItem'
import { SearchUserResult } from '@/types/services/user'
import { SearchCommunityResult } from '@/types/services/community'
import type { SearchPost } from '@/types/services/post'

interface SearchResultsListProps {
  type: string
  userResults: SearchUserResult[]
  communityResults: SearchCommunityResult[]
  postResults?: SearchPost[]
}

export function SearchResultsList({
  type,
  userResults,
  communityResults,
  postResults = [],
}: SearchResultsListProps) {
  if (type === 'user') {
    return (
      <ul className='divide-y divide-muted bg-background rounded-lg shadow-sm'>
        {userResults.map((user) => (
          <UserSearchResultItem key={user.id} user={user} />
        ))}
      </ul>
    )
  }
  if (type === 'community') {
    return (
      <ul className='divide-y divide-muted bg-background rounded-lg shadow-sm'>
        {communityResults.map((community) => (
          <CommunitySearchResultItem key={community.id} community={community} />
        ))}
      </ul>
    )
  }
  if (type === 'post') {
    return postResults.length > 0 ? (
      <ul className='divide-y divide-muted bg-background rounded-lg shadow-sm'>
        {postResults.map((post) => (
          <PostSearchResultItem key={post.id} post={post} />
        ))}
      </ul>
    ) : (
      <div className='text-muted-foreground py-8 text-center'>
        <span className='text-base'>No posts found.</span>
      </div>
    )
  }
  return (
    <div className='text-muted-foreground py-8 text-center'>
      <span className='text-base'>Search for this type is not implemented yet.</span>
    </div>
  )
}
