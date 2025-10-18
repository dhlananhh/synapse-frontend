import type { PostVersion } from '@/types/services/post'

interface VersionTextPostProps {
  version: PostVersion
}

export default function VersionTextPost({ version }: VersionTextPostProps) {
  return (
    <div>
      {version.contentHtml && (
        <div
          className='prose prose-invert max-w-none text-sm prose-p:my-2'
          dangerouslySetInnerHTML={{ __html: version.contentHtml }}
        />
      )}
    </div>
  )
}
