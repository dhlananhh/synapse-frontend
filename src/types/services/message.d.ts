interface FetchConversationsParams {
  limit?: number
  cursor?: string | null
}

type ConversationType = 'direct' | 'group'

export interface LastMessage {
  content: string
  createdAt: string
  sender: string
}

export interface Conversation {
  id: string
  type: ConversationType // 'direct' or 'group'
  name: string
  avatarUrl: string
  updatedAt: string
  lastMessage?: LastMessage // Optional, as it may not always be present
}

export interface Pagination {
  hasMore: boolean
  nextCursor: string | null
}

export interface FetchConversationsResponse {
  conversations: Conversation[]
  pagination: Pagination
}

export interface Attachment {
  type: 'image' | 'video' | 'document' // Type of the attachment
  url: string // URL of the attachment
  name: string // Name of the file
  size: number // Size of the file in bytes
}

export interface Sender {
  userId: string // ID of the sender
  username: string // Username of the sender
  avatarUrl: string // Avatar URL of the sender
}

export interface Message {
  id: string // Message ID
  conversationId: string // ID of the conversation the message belongs to
  sender: Sender // Sender details
  text: string // Message text
  attachments: Attachment[] // List of attachments
  createdAt: string // Timestamp of when the message was created
}

export interface FetchMessagesParams {
  limit?: number // Optional limit for pagination
  cursor?: string | null // Optional cursor for pagination
}

export interface FetchMessagesResponse {
  messages: Message[] // List of messages
  pagination: Pagination // Pagination object
}
