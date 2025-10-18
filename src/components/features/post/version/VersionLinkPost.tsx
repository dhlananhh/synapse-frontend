import type { PostVersion } from '@/types/services/post'

interface VersionLinkPostProps {
  version: PostVersion
}

export default function VersionLinkPost({ version }: VersionLinkPostProps) {
  return (
    <div>
      <div className='mb-2'>
        {version.links && version.links.length > 0 ? (
          <ul className='list-disc list-inside'>
            {version.links.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary underline break-all'
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span className='text-muted-foreground text-sm'>No links attached.</span>
        )}
      </div>
      {version.contentHtml && (
        <div
          className='prose prose-invert max-w-none text-sm prose-p:my-2'
          dangerouslySetInnerHTML={{ __html: version.contentHtml }}
        />
      )}
    </div>
  )
}
