import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Conversation as ConversationType } from '@/types/services/message' // Import the Conversation type

interface ConversationProps extends ConversationType {
  isActive: boolean
  onClick: () => void
}

export default function Conversation({
  name,
  avatarUrl,
  lastMessage,
  isActive,
  onClick,
}: ConversationProps) {
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
      <div>
        <p className=''>u/{name}</p>
        <p className='text-sm text-muted-foreground'>
          {lastMessage ? `${lastMessage.sender}: ${lastMessage.content}` : 'No messages yet'}
        </p>
      </div>
    </li>
  )
}
