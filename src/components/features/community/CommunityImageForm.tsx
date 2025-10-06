'use client'

import React, { useState, useRef } from 'react'
import { Community } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ImagePlus, Upload, Loader2 } from 'lucide-react'

interface CommunityImageFormProps {
  community: Community
  onFinish: (communityName: string) => void
}

export function CommunityImageForm({ community, onFinish }: CommunityImageFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const [isUploading, setIsUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'banner'
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      if (type === 'avatar') {
        setAvatarFile(file)
        setAvatarPreview(previewUrl)
      } else {
        setBannerFile(file)
        setBannerPreview(previewUrl)
      }
    }
    event.target.value = ''
  }

  const handleUploadAndFinish = async () => {
    setIsUploading(true)
    const uploadPromises: Promise<any>[] = []

    if (avatarFile) {
      uploadPromises.push(communityService.updateAvatar(community.id, avatarFile))
    }
    if (bannerFile) {
      uploadPromises.push(communityService.updateBanner(community.id, bannerFile))
    }

    try {
      await Promise.all(uploadPromises)
      toast.success('Images uploaded successfully!')
      onFinish(community.name)
    } catch (error: any) {
      toast.error('Image upload failed.', {
        description: error.response?.data?.message || 'Please check the file and try again.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const hasFilesToUpload = !!avatarFile || !!bannerFile

  return (
    <Card className='mt-10'>
      <CardHeader>
        <CardTitle>Add Images (Optional)</CardTitle>
        <CardDescription>
          Give your community a unique look and feel. You can always change these later.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Avatar Section */}
        <div className='space-y-3'>
          <Label className='text-base font-semibold'>Avatar</Label>
          <div className='flex items-center gap-4'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src={avatarPreview ?? undefined} />
              <AvatarFallback className='bg-secondary'>
                <ImagePlus className='h-10 w-10 text-muted-foreground' />
              </AvatarFallback>
            </Avatar>
            <Button type='button' variant='outline' onClick={() => avatarInputRef.current?.click()}>
              <Upload className='mr-2 h-4 w-4' />
              Choose File
            </Button>
            <input
              ref={avatarInputRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              className='hidden'
              onChange={(e) => handleFileChange(e, 'avatar')}
            />
          </div>
        </div>

        <Separator />

        {/* Banner Section */}
        <div className='space-y-3'>
          <Label className='text-base font-semibold'>Banner</Label>
          <div
            className='w-full h-36 bg-secondary rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed hover:border-primary transition-colors'
            onClick={() => bannerInputRef.current?.click()}
            style={{
              backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!bannerPreview && (
              <div className='text-muted-foreground flex flex-col items-center gap-2'>
                <ImagePlus className='h-8 w-8' />
                <p className='text-sm font-medium'>Click to upload banner</p>
              </div>
            )}
          </div>
          <input
            ref={bannerInputRef}
            type='file'
            accept='image/jpeg,image/png,image/webp'
            className='hidden'
            onChange={(e) => handleFileChange(e, 'banner')}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-2 pt-4 border-t'>
          <Button type='button' variant='ghost' onClick={() => onFinish(community.name)}>
            Skip for now
          </Button>
          <Button
            type='button'
            onClick={handleUploadAndFinish}
            disabled={!hasFilesToUpload || isUploading}
          >
            {isUploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isUploading ? 'Uploading...' : 'Save & Finish'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
