import React, { useState, useRef, useEffect } from 'react'
import { SendHorizonal, Image, Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { useSocket } from '@/context/SocketContext'
import MediaPreviewSection from './MediaPreviewSection'
import { uploadMediaFile } from '@/modules/services/message-service'
import { Attachment } from '@/modules/services/socket/socket-types'

interface MessageInputProps {
  conversationId: string
}

interface MediaFile {
  file: File
  previewUrl: string
  type: 'image' | 'video' | 'document'
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { sendMessage } = useSocket()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null) // Ref for the emoji picker

  const MAX_TEXTAREA_HEIGHT = 250

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const newHeight = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT)
    ta.style.height = `${newHeight}px`
    ta.style.overflowY = ta.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
  }

  const handleSendMessage = async () => {
    if (message.trim() || mediaFiles.length > 0) {
      const attachments: Attachment[] = []

      for (const media of mediaFiles) {
        try {
          const uploadedFile = await uploadMediaFile(conversationId, media.file)
          attachments.push(uploadedFile)
        } catch (error) {
          console.error(`Failed to upload file ${media.file.name}:`, error)
        }
      }

      const payload = {
        conversationId,
        text: message.trim(),
        attachments,
      }

      sendMessage(payload)
      setMessage('')
      setMediaFiles([])
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
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

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setMessage((prev) => prev + emoji.emoji)
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  return (
    <div className='p-4 bg-background relative'>
      {/* Media Preview Section */}
      {mediaFiles.length > 0 && (
        <MediaPreviewSection mediaFiles={mediaFiles} onRemoveMedia={handleRemoveMedia} />
      )}

      {/* Message Input Section */}
      <div className='flex items-center gap-2'>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Message'
          className='flex-1 rounded-sm px-4 py-2 bg-muted focus:outline-none resize-none'
          rows={1}
          style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }}
        />
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className='p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/90'
        >
          <Smile className='h-5 w-5' />
        </button>
        <button
          onClick={handleImageIconClick}
          className='p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/90'
        >
          <Image className='h-5 w-5' />
        </button>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && mediaFiles.length === 0}
          className={`p-2 rounded-full ${
            message.trim() || mediaFiles.length > 0
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <SendHorizonal className='h-5 w-5' />
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef} // Attach ref to the emoji picker
          className='absolute bottom-16 left-4 z-10'
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

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
