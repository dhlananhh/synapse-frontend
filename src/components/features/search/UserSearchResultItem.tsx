import Link from 'next/link'
import { SearchUserResult } from '@/types/services/user'
import { Lock } from 'lucide-react'

export function UserSearchResultItem({ user }: { user: SearchUserResult }) {
  return (
    <li>
      <Link
        href={`/profile/${user.id}`}
        className='flex items-center gap-5 py-6 px-2 min-h-[80px] hover:bg-accent rounded-lg transition'
      >
        {/* Avatar */}
        <div className='w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center'>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className='w-full h-full object-cover' />
          ) : (
            <span className='text-muted-foreground text-2xl'>{user.username[0].toUpperCase()}</span>
          )}
        </div>
        {/* Info */}
        <div>
          <div className='font-semibold text-md flex items-center gap-1'>
            u/{user.username}
            {user.isPrivate && <Lock className='w-5 h-5 text-muted-foreground' />}
          </div>
          <div className='text-base text-muted-foreground'>
            {user.firstName} {user.lastName} &middot; {user.followerCount} followers
          </div>
        </div>
      </Link>
    </li>
  )
}
