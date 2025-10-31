import React, { useEffect, useRef } from 'react'
import Message from './Message'
import { Message as MessageType } from '@/types/services/message'

interface MessageListProps {
  messages: MessageType[]
}

export default function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth', // Add smooth scrolling effect
      })
    }
  }, [messages])

  return (
    <div ref={containerRef} className='flex-1 overflow-y-auto p-4 h-full scrollbar-hide'>
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
