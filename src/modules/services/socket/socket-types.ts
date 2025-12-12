// Attachment type for messages

export interface Attachment {
  type: 'image' | 'video' | 'document' // Type of the attachment
  key: string // Unique key for the attachment
  name?: string // Optional name of the attachment
  size?: number // Optional size of the attachment in bytes
}

// Payload for sending a message
export interface SendMessagePayload {
  conversationId: string // ID of the conversation
  text?: string // Optional text content of the message
  attachments?: Attachment[] // Optional list of attachments
}

// Payload for receiving a message
export interface ReceiveMessagePayload {
  id: string // ID of the message
  conversationId: string // ID of the conversation the message belongs to
  sender: {
    userId: string // ID of the sender
    username: string // Username of the sender
    avatarUrl: string // Avatar URL of the sender
  }
  text: string // Text content of the message
  attachments: Attachment[] // List of attachments
  createdAt: string // Timestamp of when the message was created
}

// Payload for joining a chat room
export interface JoinRoomPayload {
  conversationId: string // Updated to match the schema
}

// Payload for leaving a chat room
export interface LeaveRoomPayload {
  conversationId: string // Updated to match the schema
}

// Payload for typing events
export interface TypingPayload {
  conversationId: string // Updated to match the schema
  userId: string
}

// Payload for presence events
export interface PresencePayload {
  userId: string
  status: 'online' | 'offline'
}
