'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import NotificationItem from '@/components/shared/NotificationItem'
import type { Notification } from '@/types/services/notification'
import notificationService from '@/modules/services/notification-service'
import { notificationSocket } from '@/modules/services/socket/notification-socket'

type Props = {
  initialNotifications?: Notification[]
  onOpen?: () => void
}

export default function NotificationPopover({ initialNotifications = [], onOpen }: Props) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] =
    useState<(Notification & Record<string, any>)[]>(initialNotifications)
  const [previews, setPreviews] = useState<(Notification & Record<string, any>)[]>([]) // transient previews shown when popover closed
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const mountedRef = useRef(true)

  // store timers for transient notifications so we can clear them on unmount
  const transientTimers = useRef<Map<string, number[]>>(new Map())

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      // clear any pending timers
      transientTimers.current.forEach((ids) => ids.forEach((id) => clearTimeout(id)))
      transientTimers.current.clear()
    }
  }, [])

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  // fetch unread count helper
  const fetchUnread = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      if (!mountedRef.current) return
      setUnreadCount(count)
    } catch {
      // ignore errors for unread fetch
    }
  }

  // initial unread fetch
  useEffect(() => {
    fetchUnread()
    // optional: poll unread count every 60s (remove if not desired)
    const t = setInterval(fetchUnread, 60000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  // subscribe to socket for real-time notifications
  useEffect(() => {
    // connect socket when component mounts (adjust if you connect elsewhere globally)
    try {
      notificationSocket.connect()
    } catch {
      // ignore connect errors here
    }

    const handle = (payload: Notification) => {
      console.log('new noti bro ', payload)
      if (!mountedRef.current) return
      const localId = payload.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const item = { ...payload, __localId: localId }

      // show incoming at top of list
      setNotifications((prev) => [item, ...prev])

      // increment unread count for badge
      setUnreadCount((c) => c + 1)

      // also show a transient preview when popover is closed
      setPreviews((prev) => [item, ...prev].slice(0, 3)) // keep small stack

      // schedule fade then removal for the transient preview (and cleanup)
      const fadeDelay = 3000 // ms before starting fade
      const fadeDuration = 400 // ms duration of fade
      const fadeTimer = window.setTimeout(() => {
        // mark for fade (used for CSS opacity)
        setNotifications((prev) =>
          prev.map((n) => (n.__localId === localId ? { ...n, __fade: true } : n))
        )
        setPreviews((prev) =>
          prev.map((n) => (n.__localId === localId ? { ...n, __fade: true } : n))
        )

        // schedule actual removal after fade completes
        const removeTimer = window.setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.__localId !== localId))
          setPreviews((prev) => prev.filter((n) => n.__localId !== localId))
          transientTimers.current.delete(localId)
        }, fadeDuration)

        transientTimers.current.set(localId, [
          fadeTimer as unknown as number,
          removeTimer as unknown as number,
        ])
      }, fadeDelay)

      // store fadeTimer for cleanup (removeTimer will be added above)
      transientTimers.current.set(localId, [fadeTimer as unknown as number])
    }

    notificationSocket.onServerNotification(handle)

    return () => {
      // unsubscribe / disconnect
      try {
        notificationSocket.disconnect()
      } catch {
        // ignore
      }
      // clear timers
      transientTimers.current.forEach((ids) => ids.forEach((id) => clearTimeout(id)))
      transientTimers.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // clear transient previews when popover is opened (user sees full list)
  useEffect(() => {
    if (open) setPreviews([])
  }, [open])

  const fetchNotifications = async (cursor?: string | null) => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const resp = await notificationService.getNotifications({
        cursor: cursor ?? undefined,
        limit: 20,
        onlyUnread: false,
      })
      if (!mountedRef.current) return

      if (cursor) {
        setNotifications((prev) => [...prev, ...resp.items])
      } else {
        setNotifications(resp.items)
      }

      setHasMore(Boolean(resp.pagination?.hasMore))
      setNextCursor(resp.pagination?.nextCursor ?? null)
    } catch (err: any) {
      if (!mountedRef.current) return
      setError(err?.message ?? 'Failed to load notifications')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) {
      fetchNotifications(undefined)
      // refresh unread count when opening (server may mark read elsewhere)
      fetchUnread()
      if (onOpen) onOpen()
    }
  }

  const loadMore = () => {
    if (loading || !hasMore) return
    fetchNotifications(nextCursor ?? undefined)
  }

  // mark all notifications as read (calls API, updates local state)
  const handleMarkAllAsRead = async () => {
    if (loading) return
    setLoading(true)
    try {
      const ok = await notificationService.markAllAsRead()
      if (ok) {
        // set unread badge to 0 and mark local items as read
        setUnreadCount(0)
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setPreviews([])
      }
    } catch (err) {
      // swallow / optionally log; UI stays consistent
      console.error('Failed to mark all notifications as read', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative' ref={ref}>
      <button
        aria-label='Notifications'
        title='Notifications'
        onClick={toggle}
        className='cursor-pointer p-2 rounded hover:bg-muted/50 transition relative'
      >
        <Bell className='w-6 h-6' />
        {/* badge shows unread count (prefers unreadCount from service) */}
        {unreadCount > 0 ? (
          <span className='absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white rounded-full bg-red-500'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : notifications.length > 0 ? (
          <span className='absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500' />
        ) : null}
      </button>

      {/* transient preview stack (shows even when popover closed) */}
      {!open && previews.length > 0 && (
        <div className='absolute right-0 mt-2 w-80 z-50 pointer-events-none'>
          <div className='flex flex-col gap-2'>
            {previews.map((n, i) => {
              const key = n.__localId ?? n.id ?? `${n.createdAt ?? 'n'}-${i}`
              const isFading = Boolean(n.__fade)
              return (
                <div
                  key={key}
                  className={`pointer-events-auto transition-all duration-300 transform ${
                    isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                  }`}
                >
                  <div className='bg-background border rounded shadow-md overflow-hidden'>
                    <NotificationItem
                      notification={n}
                      onClick={() => {
                        setPreviews([])
                        setOpen(false)
                        // refresh unread when user interacts with preview
                        fetchUnread()
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-background border rounded shadow-lg z-50'>
          <div className='p-2 border-b'>
            <p className='font-medium'>Notifications</p>
          </div>

          <div className='max-h-80 overflow-y-auto scrollbar-hide'>
            {loading && notifications.length === 0 ? (
              <div className='p-4 text-sm text-muted-foreground'>Loading...</div>
            ) : error ? (
              <div className='p-4 text-sm text-destructive'>{error}</div>
            ) : notifications.length === 0 ? (
              <div className='p-4 text-sm text-muted-foreground'>No notifications</div>
            ) : (
              notifications.map((n, i) => {
                const key = n.__localId ?? n.id ?? `${n.createdAt ?? 'n'}-${i}`
                const isFading = Boolean(n.__fade)
                return (
                  <div
                    key={key}
                    className={`transition-opacity duration-300 ${
                      isFading ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <NotificationItem
                      notification={n}
                      onClick={() => {
                        setOpen(false)
                        // refresh unread when user opens a notification
                        fetchUnread()
                      }}
                    />
                  </div>
                )
              })
            )}
          </div>

          <div className='p-2 border-t flex items-center justify-between gap-2'>
            <div className='flex-1'>
              {hasMore ? (
                <button
                  className='text-sm text-primary hover:underline'
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              ) : (
                <span className='text-sm text-muted-foreground'>No more notifications</span>
              )}
            </div>

            <div>
              <button
                className='text-sm text-primary hover:underline'
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                {loading ? 'Marking...' : 'Mark all as read'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
