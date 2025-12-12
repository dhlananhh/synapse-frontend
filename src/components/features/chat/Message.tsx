import React, { useState } from 'react'
import { Message as MessageType, Attachment } from '@/types/services/message'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { FileText, ImageOff, VideoOff } from 'lucide-react'

interface MessageProps {
  message: MessageType // Use the Message type directly
}

export default function Message({ message }: MessageProps) {
  const { sender, text, createdAt, attachments } = message

  // Format the timestamp
  const createdDate = new Date(createdAt)
  const now = new Date()
  const isSameDay =
    createdDate.getDate() === now.getDate() &&
    createdDate.getMonth() === now.getMonth() &&
    createdDate.getFullYear() === now.getFullYear()
  const formattedTimestamp = isSameDay
    ? createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : createdDate.toLocaleDateString()

  // Filter attachments by type
  const images = attachments.filter((attachment) => attachment.type === 'image')
  const videos = attachments.filter((attachment) => attachment.type === 'video')
  const documents = attachments.filter((attachment) => attachment.type === 'document')

  // Render attachments based on their type
  const renderAttachment = (attachment: Attachment) => {
    const [hasError, setHasError] = useState(false)

    if (hasError) {
      // Render fallback placeholder
      switch (attachment.type) {
        case 'image':
          return (
            <div className='w-32 h-32 flex items-center justify-center bg-gray-600 rounded-md text-xs font-bold gap-2'>
              <ImageOff className='h-12 w-12 text-gray-800' />
              <span className='text-gray-800'>Image unavailable</span>
            </div>
          )
        case 'video':
          return (
            <div className='w-32 h-32 flex items-center justify-center bg-gray-600 rounded-md text-xs font-bold gap-2'>
              <VideoOff className='h-12 w-12 text-gray-800' />
              <span className='text-gray-800'>Video unavailable</span>
            </div>
          )
        default:
          return null
      }
    }

    switch (attachment.type) {
      case 'image':
        return (
          <img
            src={attachment.url}
            alt={attachment.name}
            className='w-32 h-32 object-cover rounded-md'
            onError={() => setHasError(true)} // Handle error
          />
        )
      case 'video':
        return (
          <video
            src={attachment.url}
            controls
            className='w-32 h-32 object-cover rounded-md'
            onError={() => setHasError(true)} // Handle error
          />
        )
      case 'document':
        return (
          <a
            href={attachment.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-gray-900 border border-gray-500 rounded-md p-3 bg-gray-500 hover:bg-gray-400 shadow-sm hover:shadow-md transition-all duration-200'
          >
            <FileText className='h-5 w-5 text-gray-900' />
            <span className='font-medium truncate'>{attachment.name}</span>
          </a>
        )
      default:
        return null
    }
  }

  return (
    <div className='flex items-start gap-3 mb-4'>
      {/* Avatar */}
      <Avatar className='w-8 h-8'>
        <AvatarImage src={sender.avatarUrl} alt={sender.username} />
        <AvatarFallback>{sender.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div>
        <p>
          <span className='font-bold text-xs'>{sender.username} </span>
          <span className='font-light text-xs'>{formattedTimestamp}</span>
        </p>
        {/* Render message content with line breaks */}
        <p className='text-md whitespace-pre-wrap'>{text}</p>

        {/* Render grouped attachments */}
        {images.length > 0 && (
          <div className='mt-2'>
            <div className='flex flex-wrap gap-2'>
              {images.map((attachment, index) => (
                <div key={index} className='flex-shrink-0'>
                  {renderAttachment(attachment)}
                </div>
              ))}
            </div>
          </div>
        )}
        {videos.length > 0 && (
          <div className='mt-2'>
            <div className='flex flex-wrap gap-2'>
              {videos.map((attachment, index) => (
                <div key={index} className='flex-shrink-0'>
                  {renderAttachment(attachment)}
                </div>
              ))}
            </div>
          </div>
        )}
        {documents.length > 0 && (
          <div className='mt-2'>
            <div className='flex flex-wrap gap-2'>
              {documents.map((attachment, index) => (
                <div key={index} className='flex-shrink-0'>
                  {renderAttachment(attachment)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
