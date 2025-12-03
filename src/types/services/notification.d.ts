export interface Notification {
  id?: string
  userId?: string
  type: string
  title: string
  message: string | null
  metadata?: Record<string, unknown> | null
  isRead?: boolean
  createdAt: string // ISO 8601 timestamp
}

export interface NotificationPagination {
  hasMore: boolean
  nextCursor?: string | null
}

export interface NotificationsResponse {
  items: Notification[]
  pagination: NotificationPagination
}
