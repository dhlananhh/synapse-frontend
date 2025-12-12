import React, { useEffect, useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { Message } from '@/types/services/message'
import { fetchMessages } from '@/modules/services/message-service'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSocket } from '@/context/SocketContext'
import { useChatStore } from '@/store/useChatStore'

export default function ChatWindow() {
  const { activeConversation } = useChatStore() // Use the active conversation from the store
  const [ messages, setMessages ] = useState<Message[]>([])
  const [ loading, setLoading ] = useState(false)
  const [ cursor, setCursor ] = useState<string | null>(null) // Track the cursor for paging
  const { onNewMessage, leaveChatRoom, joinChatRoom } = useSocket() // Use the SocketContext to listen for events
  const [ previousConversationId, setPreviousConversationId ] = useState<string | null>(null)

  // Fetch messages when the active conversation changes
  useEffect(() => {
    if (!activeConversation) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        const { messages: fetchedMessages, pagination } = await fetchMessages(
          activeConversation.id,
          {
            limit: 20,
          }
        ) // Fetch messages for the conversation
        setMessages(fetchedMessages)
        setCursor(pagination.nextCursor) // Set the cursor for paging
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [ activeConversation ])

  // Fetch older messages when scrolling to the top
  const fetchOlderMessages = async () => {
    if (!cursor || !activeConversation) return // No more messages to fetch

    try {
      const { messages: olderMessages, pagination } = await fetchMessages(activeConversation.id, {
        limit: 20,
        cursor,
      })
      setMessages((prevMessages) => [ ...olderMessages, ...prevMessages ]) // Prepend older messages
      setCursor(pagination.nextCursor) // Update the cursor
    } catch (error) {
      console.error('Failed to fetch older messages:', error)
    }
  }

  // Listen for new messages from the server
  useEffect(() => {
    if (!activeConversation) return

    const handleNewMessage = (newMessage: Message) => {
      console.log('new message sent from server: ', newMessage)
      if (newMessage.conversationId === activeConversation.id) {
        setMessages((prevMessages) => [ ...prevMessages, newMessage ]) // Append the new message to the list
      }
    }

    // Join the new chat room
    if (activeConversation.id !== previousConversationId) {
      if (previousConversationId) {
        leaveChatRoom(previousConversationId) // Leave the previous room
      }
      joinChatRoom(activeConversation.id) // Join the new room
      setPreviousConversationId(activeConversation.id) // Update the previous conversation ID
    }

    onNewMessage(handleNewMessage) // Register the event listener
    console.log('new message handler registered !')

    return () => {
      // Cleanup only when the component unmounts
      onNewMessage(() => { }) // Properly unregister the listener
    }
  }, [ activeConversation, onNewMessage, previousConversationId, joinChatRoom, leaveChatRoom ])

  if (!activeConversation) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        Select a conversation to start chatting
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-hidden h-13/14'>
      {/* Header */ }
      <div className='flex items-center gap-3 p-3 border-t border-b bg-muted'>
        <Avatar className='w-10 h-10 border-1 border-primary'>
          <AvatarImage
            src={ activeConversation.avatarUrl || undefined }
            alt={ activeConversation.name }
          />
          <AvatarFallback>{ activeConversation.name.charAt(0).toUpperCase() }</AvatarFallback>
        </Avatar>
        <div>
          <p className='font-bold'>{ activeConversation.name }</p>
          <p className='text-sm text-muted-foreground'>
            { activeConversation.type === 'direct' ? 'Direct Message' : 'Group Chat' }
          </p>
        </div>
      </div>

      {/* Messages */ }
      <div className='flex-grow overflow-y-auto scrollbar-hide'>
        { loading ? (
          <div className='flex items-center justify-center h-full'>Loading messages...</div>
        ) : (
          <MessageList
            conversationId={ activeConversation.id }
            messages={ messages }
            onFetchOlderMessages={ fetchOlderMessages }
          />
        ) }
      </div>

      {/* Message Input */ }
      <MessageInput conversationId={ activeConversation.id } />
    </div>
  )
}
