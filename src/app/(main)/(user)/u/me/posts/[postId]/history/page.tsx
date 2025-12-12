'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import EditHistoryViewer from '@/components/features/post/EditHistoryViewer'

export default function PostEditHistoryPage() {
  const { postId } = useParams<{ postId: string }>()
  const router = useRouter()

  return (
    <div className='max-w-2xl mx-auto p-4 sm:p-8 bg-background rounded-2xl shadow'>
      <div className='flex items-center gap-2 mb-6'>
        <button
          onClick={() => router.back()}
          className='inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-muted transition'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </button>
        <h2 className='text-xl font-bold ml-2'>Edit History</h2>
      </div>
      <EditHistoryViewer postId={postId} />
    </div>
  )
}
