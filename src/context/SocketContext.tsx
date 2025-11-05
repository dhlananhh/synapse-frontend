'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { messageSocket } from '@/modules/services/socket/message-socket'
import { useAuth } from '@/context/AuthContext'
import { SendMessagePayload } from '@/modules/services/socket/socket-types'
import { Message } from '@/types/services/message'
import { LastMessage } from '@/types/services/message'

interface SocketContextProps {
  isConnected: boolean
  sendMessage: (payload: SendMessagePayload) => void
  joinChatRoom: (chatId: string) => void
  leaveChatRoom: (chatId: string) => void
  onNewMessage: (callback: (message: Message) => void) => void
  onConversationUpdate: (
    callback: (payload: { conversationId: string; lastMessage: LastMessage }) => void
  ) => void
  markMessagesAsRead: (conversationId: string, lastReadMessageId: string) => void // Add this method
}

const SocketContext = createContext<SocketContextProps | null>(null)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth() // Get the authenticated user from AuthContext

  useEffect(() => {
    if (user) {
      // Connect to the socket server when the user is authenticated
      messageSocket.connect()

      // Listen for connection status using messageSocket abstraction
      messageSocket.onConnect(() => {
        setIsConnected(true)
        console.log('Socket connected')
      })

      messageSocket.onDisconnect(() => {
        setIsConnected(false)
        console.log('Socket disconnected')
      })

      return () => {
        // Disconnect from the socket server when the provider unmounts
        messageSocket.disconnect()
      }
    }
  }, [user]) // Re-run the effect when the user changes

  const sendMessage = (payload: SendMessagePayload) => {
    messageSocket.sendMessage(payload)
  }

  const joinChatRoom = (chatId: string) => {
    messageSocket.joinChatRoom(chatId)
  }

  const leaveChatRoom = (chatId: string) => {
    messageSocket.leaveChatRoom(chatId)
  }

  const onNewMessage = (callback: (message: Message) => void) => {
    messageSocket.onNewMessage(callback)
  }

  const onConversationUpdate = (
    callback: (payload: { conversationId: string; lastMessage: LastMessage }) => void
  ) => {
    messageSocket.onConversationUpdate(callback)
  }

  const markMessagesAsRead = (conversationId: string, lastReadMessageId: string) => {
    messageSocket.markMessagesAsRead(conversationId, lastReadMessageId)
  }

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        sendMessage,
        joinChatRoom,
        leaveChatRoom,
        onNewMessage,
        onConversationUpdate,
        markMessagesAsRead, // Expose the method here
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
