import { notificationApiClient } from '@/libs/apiClient'
import type {
  Notification,
  NotificationsResponse,
  NotificationPagination,
} from '@/types/services/notification'

export type FetchParams = {
  cursor?: string
  limit?: number
  onlyUnread?: boolean
}

/**
 * Fetch notifications from the notification service (cursor-based pagination).
 * GET /notifications
 *
 * Query params:
 * - cursor: string (optional) - cursor for pagination
 * - limit: number (optional)
 * - onlyUnread: boolean (optional)
 *
 * Returns NotificationsResponse as defined in types/services/notification.d.ts
 */
export async function getNotifications(params?: FetchParams): Promise<NotificationsResponse> {
  try {
    const resp = await notificationApiClient.get<NotificationsResponse>('api/notifications', {
      params: {
        cursor: params?.cursor,
        limit: params?.limit,
        onlyUnread: params?.onlyUnread,
      },
    })

    // API always returns the paginated shape { items, pagination }
    return resp.data
  } catch (err) {
    // Rethrow for caller to handle
    throw err
  }
}

/**
 * Response shape for unread count endpoint
 */
export type UnreadCountResponse = {
  unread: number
}

/**
 * Fetch unread notifications count.
 * GET /api/notifications/unread/count
 *
 * Returns the number (resp.data.unread)
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const resp = await notificationApiClient.get<UnreadCountResponse>(
      'api/notifications/unread/count'
    )
    return resp.data.unread
  } catch (err) {
    throw err
  }
}

/**
 * Mark a single notification as read.
 * GET /api/notifications/:id/read
 *
 * Returns true on success (HTTP 2xx), otherwise throws.
 */
export async function markNotificationRead(id: string): Promise<boolean> {
  try {
    const resp = await notificationApiClient.patch(
      `/api/notifications/${encodeURIComponent(id)}/read`
    )
    return resp.status >= 200 && resp.status < 300
  } catch (err) {
    throw err
  }
}

/**
 * Mark all notifications as read.
 * GET /api/notifications/read
 *
 * Returns true on success (HTTP 2xx), otherwise throws.
 */
export async function markAllAsRead(): Promise<boolean> {
  try {
    const resp = await notificationApiClient.patch('/api/notifications/read')
    return resp.status >= 200 && resp.status < 300
  } catch (err) {
    throw err
  }
}

const notificationService = {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllAsRead,
}

export default notificationService
