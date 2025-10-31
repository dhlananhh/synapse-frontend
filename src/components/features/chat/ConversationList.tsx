import React, { useEffect, useState } from 'react'
import Conversation from './Conversation'
import { LastMessage } from '@/types/services/message'
import { useSocket } from '@/context/SocketContext'
import { fetchUserConversations } from '@/modules/services/message-service'
import { Conversation as ConversationType, Pagination } from '@/types/services/message'
import { useChatStore } from '@/store/useChatStore'

export default function ConversationList() {
  const { joinChatRoom, onConversationUpdate } = useSocket()
  const { activeConversation, setActiveConversation } = useChatStore() // Access chat store
  const [conversations, setConversations] = useState<ConversationType[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true)
      try {
        const { conversations: fetchedConversations, pagination: fetchedPagination } =
          await fetchUserConversations({ limit: 10 })
        setConversations(fetchedConversations)
        setPagination(fetchedPagination)
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [])

  // Listen for conversation updates
  useEffect(() => {
    const handleConversationUpdate = (payload: {
      conversationId: string
      lastMessage: LastMessage
    }) => {
      console.log('ayooo update bro : ', payload)
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) =>
          conversation.id === payload.conversationId
            ? { ...conversation, lastMessage: payload.lastMessage }
            : conversation
        )

        // Sort conversations by lastMessage.createdAt in descending order
        return updatedConversations.sort((a, b) => {
          const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
          const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
          return dateB - dateA // Newer messages come first
        })
      })
    }

    onConversationUpdate(handleConversationUpdate)

    return () => {
      onConversationUpdate(() => {}) // Unregister the listener
    }
  }, [onConversationUpdate])

  const handleSelectConversation = (conversation: ConversationType) => {
    setActiveConversation(conversation) // Update active conversation in the store
    joinChatRoom(conversation.id as string) // Emit an event to join the room with the conversation ID
  }

  const loadMoreConversations = async () => {
    if (!pagination?.hasMore || loading) return

    setLoading(true)
    try {
      const { conversations: moreConversations, pagination: newPagination } =
        await fetchUserConversations({ limit: 10, cursor: pagination.nextCursor })
      setConversations((prev) => [...prev, ...moreConversations])
      setPagination(newPagination)
    } catch (error) {
      console.error('Failed to load more conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-1/3 border-r p-4 overflow-y-auto scrollbar-hide'>
      <h2 className='text-lg font-bold mb-4'>Conversations</h2>
      <ul className='space-y-4'>
        {conversations.map((conversation) => (
          <Conversation
            key={conversation.id}
            {...conversation}
            isActive={conversation.id === activeConversation?.id} // Compare with store's active conversation
            onClick={() => handleSelectConversation(conversation)} // Use store to update active conversation
          />
        ))}
      </ul>
      {pagination?.hasMore && (
        <button
          onClick={loadMoreConversations}
          disabled={loading}
          className='mt-4 w-full bg-primary text-white py-2 rounded hover:bg-primary/90'
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
