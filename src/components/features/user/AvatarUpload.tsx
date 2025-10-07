'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { userService } from '@/modules/services/user-service'
import { toast } from 'sonner'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
const MAX_SIZE_MB = 3

export function AvatarUpload({
  onUploaded,
  currentAvatarUrl,
}: {
  onUploaded?: (avatarUrl: string) => void
  currentAvatarUrl?: string | null
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setAvatarError('Only JPEG and PNG images are allowed.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setAvatarError('Image must be less than 3MB.')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    setAvatarUploading(true)
    setAvatarError(null)
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      const response = await userService.updateUserAvatar(formData)
      toast.success('Avatar updated!')
      setAvatarFile(null)
      setAvatarPreview(null)
      if (onUploaded && response?.avatarUrl) onUploaded(response.avatarUrl)
    } catch (error: any) {
      setAvatarError(error.response?.data?.message || 'Failed to upload avatar.')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='mb-4 flex flex-col items-center'>
      <div className='mt-2 flex flex-col items-center justify-center'>
        <div
          className='relative w-20 h-20 cursor-pointer flex items-center justify-center'
          onClick={handleImageClick}
        >
          <Image
            src={avatarPreview || currentAvatarUrl || '/default-avatar.png'}
            alt='Avatar'
            fill
            className='rounded-full object-cover border border-muted'
            style={{ aspectRatio: '1/1' }}
          />
        </div>
        <span className='text-xs text-muted-foreground mt-2'>Click to change avatar</span>
        <input
          ref={fileInputRef}
          type='file'
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className='hidden'
        />
      </div>
      {avatarError && <div className='text-destructive text-sm mt-1'>{avatarError}</div>}
      <Button
        type='button'
        disabled={!avatarFile || avatarUploading}
        onClick={handleAvatarUpload}
        className='mt-2'
      >
        {avatarUploading ? 'Uploading...' : 'Upload Avatar'}
      </Button>
    </div>
  )
}
