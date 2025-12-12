'use client'

import { useEffect, useState } from 'react'
import { postService } from '@/modules/services/post-service'
import type { PostVersion } from '@/types/services/post'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import VersionCard from './version/VersionCard'

interface EditHistoryViewerProps {
  postId: string
}

export default function EditHistoryViewer({ postId }: EditHistoryViewerProps) {
  const [versions, setVersions] = useState<PostVersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    postService
      .getPostVersions(postId)
      .then((data) => {
        setVersions(data)
      })
      .catch(() => setError('Failed to load edit history'))
      .finally(() => setIsLoading(false))
  }, [postId])

  // Sort versions descending by versionNumber (latest first)
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber)

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

  if (!versions.length) {
    return <div className='p-8 text-center text-muted-foreground'>No edit history found.</div>
  }

  return (
    <div className='flex flex-col w-full gap-8'>
      {sortedVersions.map((version) => (
        <VersionCard key={version.id} version={version} />
      ))}
    </div>
  )
}
