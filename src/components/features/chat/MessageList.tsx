import React, { useEffect, useRef } from 'react'
import Message from './Message'
import { Message as MessageType } from '@/types/services/message'
import { useSocket } from '@/context/SocketContext'

interface MessageListProps {
  messages: MessageType[]
  conversationId: string
  onFetchOlderMessages: () => Promise<void> // Callback to fetch older messages
}

export default function MessageList({
  messages,
  conversationId,
  onFetchOlderMessages,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { markMessagesAsRead } = useSocket() // Use the socket context

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth', // Add smooth scrolling effect
      })
    }
  }, [messages])

  // Emit the `message:read` event when the component is rendered
  useEffect(() => {
    if (messages.length > 0) {
      const lastReadMessageId = messages[messages.length - 1].id // Get the last message ID
      markMessagesAsRead(conversationId as string, lastReadMessageId) // Emit the event
    }
  }, [messages, conversationId, markMessagesAsRead])

  // Detect when the user scrolls to the top
  const handleScroll = async () => {
    if (containerRef.current) {
      if (containerRef.current.scrollTop === 0) {
        await onFetchOlderMessages() // Fetch older messages when scrolled to the top
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className='flex-1 overflow-y-auto p-4 h-full scrollbar-hide'
      onScroll={handleScroll} // Attach scroll handler
    >
      {messages.length === 0 ? (
        <div className='text-center text-muted-foreground'>
          You currently have no messages with this person yet
        </div>
      ) : (
        messages.map((message) => <Message key={message.id} message={message} />)
      )}
    </div>
  )
}
