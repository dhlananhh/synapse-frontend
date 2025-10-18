import type { PostVersion } from '@/types/services/post'
import { format } from 'date-fns'
import VersionTextPost from './VersionTextPost'
import VersionMediaPost from './VersionMediaPost'
import VersionLinkPost from './VersionLinkPost'
import ModerationActionCard from '../ModerationActionCard'

interface VersionCardProps {
  version: PostVersion
}

export default function VersionCard({ version }: VersionCardProps) {
  return (
    <div className='rounded-lg border bg-card p-4 shadow-sm'>
      <div className='flex items-center gap-3 mb-2'>
        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-xs shadow-sm border border-primary/30'>
          Version {version.versionNumber}
        </span>
        <span className='inline-flex items-center px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold text-xs border border-muted-foreground/10 ml-2'>
          {format(new Date(version.createdAt), 'yyyy-MM-dd HH:mm')}
        </span>
        {version.versionNumber === 1 && (
          <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold border border-primary/30 ml-1'>
            OG
          </span>
        )}
      </div>
      <div className='text-lg font-bold mb-1'>{version.title}</div>
      <div className='mb-2'>
        {version.type === 'TEXT' && <VersionTextPost version={version} />}
        {version.type === 'MEDIA' && <VersionMediaPost version={version} />}
        {version.type === 'LINK' && <VersionLinkPost version={version} />}
      </div>
      {/* Moderation action for this version */}
      {version.moderationAction && (
        <div className='mt-3'>
          <ModerationActionCard action={version.moderationAction} />
        </div>
      )}
    </div>
  )
}
