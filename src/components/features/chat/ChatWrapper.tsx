'use client'

import React from 'react'
import ChatComponent from '@/components/features/chat/ChatComponent'
import { useChatStore } from '@/store/useChatStore'
import { useAuth } from '@/context/AuthContext'

export default function ChatWrapper() {
  const isChatOpen = useChatStore((state) => state.isChatOpen)
  const { user } = useAuth() // Check if the user is authenticated
  console.log('user is ', user, ' and chat open flag ', isChatOpen)

  // Only render the chat component if the user is authenticated and the chat is open
  if (!user || !isChatOpen) {
    return null
  }
  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <ChatComponent />
    </div>
  )
}
