// User type
export type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  password?: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
  karma: {
    post: number
    comment: number
  }
  gender: string
  birthday?: string
  bannerUrl?: string
}

// UserFromJwt type
export type UserFromJwt = {
  sub: string
  email: string
  role: string
}

// Trophy type
export type Trophy = {
  id: string
  name: string
  description: string
  Icon: React.ElementType
}

// Comment type
export type Comment = {
  id: string
  text: string
  author: User
  createdAt: string
  votes: number
  replies?: Comment[]
  receivedAwards?: Award[]
}

// UserComment interface
export interface UserComment extends Comment {
  postTitle: string
  postId: string
  postAuthor: string
}

// Community type
// export type Community = {
//   id: string;
//   slug: string;
//   name: string;
//   imageUrl?: string;
//   description: string;
//   createdAt: string;
//   memberCount: number;
//   ownerId: string;
//   moderatorIds: string[];
// };

// Post type
// export type Post = {
//   id: string
//   title: string
//   content: string
//   author: User
//   community: {
//     id: string
//     slug: string
//     name: string
//   }
//   createdAt: string
//   votes: number
//   comments: Comment[]
//   flair?: Flair
//   receivedAwards?: Award[]
// }

// Flair type
export type Flair = {
  id: string
  name: string
  color: string
  communityId: string
}

// Award type
export type Award = {
  id: string
  name: string
  description: string
  cost: number
  Icon: React.ElementType
}

// NotificationType
export type NotificationType = 'NEW_COMMENT' | 'POST_UPVOTE' | 'NEW_FOLLOWER'

// Notification type
export type Notification = {
  id: string
  type: NotificationType
  actor: User
  entityUrl: string
  message: string
  isRead: boolean
  createdAt: string
}

// SortType
export type SortType = 'hot' | 'new' | 'top'

// Activity type
export type Activity = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

// Message type
export type Message = {
  id: string
  text: string
  senderId: string
  timestamp: string
}

// Conversation type
export type Conversation = {
  contact: User
  messages: Message[]
}

// ChatState interface
export interface ChatState {
  conversation: Conversation | null
  conversations: Conversation[]
  activeConversationId: string | null
  isWidgetOpen: boolean
  openChat: (contact: User) => void
  closeChat: () => void
  sendMessage: (text: string, user: User) => void
  _receiveSimulatedReply: (contactId: string, originalText: string) => void
}

// NotificationState interface
export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
}

export interface Participant {
  avatarUrl: string;
  username: string;
  isOnline: boolean;
}

// Language type
export type Language = {
  code: string
  name: string
  FlagComponent: React.ElementType
}

// View Mode type
export type ViewMode = 'card' | 'compact'

// CommunityMemberWithRole type
export type CommunityMemberWithRole = User & { role?: 'Owner' | 'Moderator' }
