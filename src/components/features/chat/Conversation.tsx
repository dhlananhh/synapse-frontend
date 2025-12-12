import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Conversation as ConversationType } from '@/types/services/message'
import { useAuth } from '@/context/AuthContext' // Import the useAuth hook

interface ConversationProps extends ConversationType {
  isActive: boolean
  onClick: () => void
}

export default function Conversation({
  name,
  avatarUrl,
  lastMessage,
  isActive,
  unreadCount,
  onClick,
}: ConversationProps) {
  const { user } = useAuth() // Get the current user from the AuthContext

  return (
    <li
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm ${
        isActive ? 'bg-primary text-white' : 'hover:bg-muted'
      }`}
      onClick={onClick}
    >
      <Avatar className='w-10 h-10 border-1 border-primary'>
        <AvatarImage src={avatarUrl || undefined} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex-1'>
        <p className={`${unreadCount > 0 ? 'font-bold' : 'text-sm text-muted-foreground'}`}>
          u/{name}
        </p>
        <p className={`${unreadCount > 0 ? 'font-bold' : 'text-sm text-muted-foreground'}`}>
          {lastMessage
            ? lastMessage.sender === user?.username // Compare the sender with the current user's username
              ? `You: ${lastMessage.content}`
              : lastMessage.content
            : 'No messages yet'}
        </p>
      </div>
      {unreadCount > 0 && (
        <div className='flex items-center'>
          <span className='text-xs font-bold text-white bg-red-500 rounded-full px-1 py-1'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </div>
      )}
    </li>
  )
}
