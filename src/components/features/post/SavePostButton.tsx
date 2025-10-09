'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/libs/utils'

interface SavePostButtonProps {
  postId: string
}

export default function SavePostButton({ postId }: SavePostButtonProps) {
  // const { user, isPostSaved, toggleSavePost } = useAuth()
  const { user } = useAuth()
  // const saved = isPostSaved(postId)

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to save posts.')
      return
    }

    // toggleSavePost(postId)
    // toast.success(saved ? 'Post unsaved' : 'Post saved successfully!')
  }

  return (
    <Button
      onClick={handleToggleSave}
      variant='ghost'
      size='sm'
      className='rounded-full flex items-center gap-1.5 px-2'
    >
      {/* <Bookmark className={cn('h-5 w-5', saved && 'fill-primary text-primary')} /> */}
      {/* <span className='hidden sm:inline'>{saved ? 'Unsave' : 'Save'}</span> */}
    </Button>
  )
}
