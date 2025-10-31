import React, { useEffect, useState } from 'react'
import { X, FileText, Play } from 'lucide-react'

interface MediaFile {
  file: File
  previewUrl: string
  type: 'image' | 'video' | 'document'
}

interface MediaPreviewSectionProps {
  mediaFiles: MediaFile[]
  onRemoveMedia: (index: number) => void
}

export default function MediaPreviewSection({
  mediaFiles,
  onRemoveMedia,
}: MediaPreviewSectionProps) {
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const generateVideoThumbnails = async () => {
      const thumbnails: { [key: string]: string } = {}
      for (const media of mediaFiles) {
        if (media.type === 'video') {
          const thumbnail = await getVideoThumbnail(media.file)
          thumbnails[media.file.name] = thumbnail
        }
      }
      setVideoThumbnails(thumbnails)
    }

    generateVideoThumbnails()
  }, [mediaFiles])

  const getVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      video.src = URL.createObjectURL(file)
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0 // Seek to the first frame
      })

      video.addEventListener('seeked', () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context?.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png')) // Return the thumbnail as a data URL
      })
    })
  }

  const renderMediaSection = (type: 'image' | 'video' | 'document') => {
    const filteredFiles = mediaFiles.filter((media) => media.type === type)
    if (filteredFiles.length === 0) return null // Only render if there are files of this type

    return (
      <div className='mb-4'>
        <h3 className='text-sm font-bold mb-2 capitalize'>{type}s</h3>
        <div
          className={`grid ${
            type === 'image' || type === 'video' ? 'grid-cols-5' : 'grid-cols-3'
          } gap-2`}
        >
          {filteredFiles.map((media) => (
            <div
              key={media.file.name} // Use a unique key based on the file name
              className={`relative ${
                type === 'document'
                  ? 'w-full h-12'
                  : type === 'image' || type === 'video'
                  ? 'w-full h-16'
                  : 'w-full h-24'
              } bg-muted-foreground rounded flex items-center justify-between`}
            >
              {type === 'document' ? (
                <div className='flex items-center gap-2 w-full'>
                  <FileText className='h-5 w-5 text-primary flex-shrink-0' />
                  <span className='text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap flex-grow'>
                    {media.file.name}
                  </span>
                </div>
              ) : (
                <div className='relative w-full h-full'>
                  <img
                    src={
                      type === 'video' && videoThumbnails[media.file.name]
                        ? videoThumbnails[media.file.name]
                        : media.previewUrl
                    }
                    alt={media.file.name}
                    className='w-full h-full object-cover rounded'
                  />
                  {type === 'video' && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Play className='h-6 w-6 text-white bg-gray-800 bg-opacity-50 rounded-full p-1' />
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => onRemoveMedia(mediaFiles.indexOf(media))} // Pass the correct index
                className='absolute -top-1 -right-1 bg-red-800 text-white rounded-full p-1 hover:bg-red-700'
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='p-4 mb-2 bg-muted rounded-md shadow-md max-h-64 overflow-y-auto scrollbar-hide'>
      {renderMediaSection('image')}
      {renderMediaSection('video')}
      {renderMediaSection('document')}
    </div>
  )
}
