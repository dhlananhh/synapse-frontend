import { notificationSocketClient } from '@/libs/socketClient'
import { SOCKET_EVENTS } from './socket-events'
import { Notification } from '@/types/services/notification'

export const notificationSocket = {
  connect: () => {
    notificationSocketClient.connect()
  },

  disconnect: () => {
    notificationSocketClient.disconnect()
  },

  onServerNotification: (callback: (payload: Notification) => void) => {
    notificationSocketClient.off(SOCKET_EVENTS.NOTIFICATION)
    notificationSocketClient.on(SOCKET_EVENTS.NOTIFICATION, callback)
  },
}
