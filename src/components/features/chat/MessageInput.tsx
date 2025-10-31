import React, { useState, useRef } from 'react'
import { SendHorizonal, Image } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'
import MediaPreviewSection from './MediaPreviewSection'
import { uploadMediaFile } from '@/modules/services/message-service'
import { Attachment } from '@/modules/services/socket/socket-types'

interface MessageInputProps {
  conversationId: string // Pass the conversation ID as a prop
}

interface MediaFile {
  file: File
  previewUrl: string
  type: 'image' | 'video' | 'document'
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]) // Store selected media files
  const { sendMessage } = useSocket() // Use the sendMessage method from SocketContext
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Ref for the textarea
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for the file input

  const MAX_TEXTAREA_HEIGHT = 250 // px - adjust as needed (prevents excessive vertical growth)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // Auto-resize textarea while enforcing a max height
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto' // reset to measure correct scrollHeight
    const newHeight = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT)
    ta.style.height = `${newHeight}px`
    ta.style.overflowY = ta.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
  }

  const handleSendMessage = async () => {
    if (message.trim() || mediaFiles.length > 0) {
      const attachments: Attachment[] = []
      // Log the list of selected files
      console.log('Selected files:', mediaFiles)

      // Upload each media file to S3 and collect the metadata
      for (const media of mediaFiles) {
        try {
          const uploadedFile = await uploadMediaFile(conversationId, media.file)
          attachments.push(uploadedFile) // Add the uploaded file metadata to attachments
        } catch (error) {
          console.error(`Failed to upload file ${media.file.name}:`, error)
        }
      }

      const payload = {
        conversationId,
        text: message.trim(),
        attachments, // Include uploaded media metadata
      }

      console.log('Message payload:', payload)

      sendMessage(payload) // Emit the message:send event
      setMessage('') // Clear the input field
      setMediaFiles([]) // Clear media files
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto' // Reset height after clearing
        textareaRef.current.style.overflowY = 'hidden'
      }
    }
  }

  const handleAddMedia = (files: File[]) => {
    const newMediaFiles = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : ('document' as 'image' | 'video' | 'document'),
    }))
    setMediaFiles((prev) => [...prev, ...newMediaFiles])

    // Reset the file input value to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Trigger file picker
    }
  }

  return (
    <div className='p-4 bg-background'>
      {/* Media Preview Section */}
      {mediaFiles.length > 0 && (
        <MediaPreviewSection mediaFiles={mediaFiles} onRemoveMedia={handleRemoveMedia} />
      )}

      {/* Message Input Section */}
      <div className='flex items-center gap-2'>
        <textarea
          ref={textareaRef} // Attach the ref to the textarea
          value={message}
          onChange={handleInputChange} // Auto-resize with max height
          placeholder='Message'
          className='flex-1 rounded-sm px-4 py-2 bg-muted focus:outline-none resize-none'
          rows={1} // Initial height
          style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }} // visual cap (same as JS max)
        />
        <button
          onClick={handleImageIconClick} // Trigger file picker
          className='p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/90'
        >
          <Image className='h-5 w-5' />
        </button>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && mediaFiles.length === 0} // Disable button if input is empty
          className={`p-2 rounded-full ${
            message.trim() || mediaFiles.length > 0
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <SendHorizonal className='h-5 w-5' />
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='image/*,video/*,.pdf,.doc,.docx,.txt'
        onChange={(e) => handleAddMedia(Array.from(e.target.files || []))}
        className='hidden'
      />
    </div>
  )
}
