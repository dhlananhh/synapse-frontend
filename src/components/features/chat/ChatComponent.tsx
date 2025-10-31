'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import { useChatStore } from '@/store/useChatStore'

export default function ChatComponent() {
  const { isChatOpen, toggleChat, activeConversation, setActiveConversation } = useChatStore() // Access chat store
  const [isOpen, setIsOpen] = useState(true) // State to manage collapse/expand

  return (
    <div
      className={`fixed bottom-0 right-4 z-50 border shadow-lg bg-card transition-all ${
        isChatOpen
          ? isOpen
            ? 'h-[700px] w-[800px] rounded-t-lg'
            : 'h-[50px] w-[200px] rounded-t-lg'
          : 'hidden'
      }`}
    >
      {/* Header with toggle and close buttons */}
      <div className='flex items-center justify-between p-2 bg-muted rounded-t-lg'>
        <span className='font-bold text-sm'>Chats</span>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsOpen((prev) => !prev)} // Toggle collapse/expand
            className='p-1 rounded hover:bg-muted/50 transition'
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? <ChevronDown className='h-5 w-5' /> : <ChevronUp className='h-5 w-5' />}
          </button>
          <button
            onClick={toggleChat} // Close the chat component
            className='p-1 rounded hover:bg-muted/50 transition'
            title='Close Chat'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className='flex h-full'>
          <ConversationList
            activeConversation={activeConversation} // Pass active conversation
            onSelectConversation={setActiveConversation} // Update active conversation
          />
          <ChatWindow conversation={activeConversation} />
        </div>
      )}
    </div>
  )
}
