import { messageSocketClient } from '@/libs/socketClient'
import { SOCKET_EVENTS } from './socket-events'
import { SendMessagePayload } from './socket-types'
import { Message } from '@/types/services/message'
import { LastMessage } from '@/types/services/message'

export const messageSocket = {
  connect: () => {
    messageSocketClient.connect()
  },

  disconnect: () => {
    messageSocketClient.disconnect()
  },

  onConnect: (callback: () => void) => {
    messageSocketClient.on(SOCKET_EVENTS.CONNECT, callback)
  },

  onDisconnect: (callback: () => void) => {
    messageSocketClient.on(SOCKET_EVENTS.DISCONNECT, callback)
  },

  onNewMessage: (callback: (message: Message) => void) => {
    // Remove any existing listener for new messages
    messageSocketClient.off(SOCKET_EVENTS.MESSAGE.RECEIVE)

    // Add the new listener
    messageSocketClient.on(SOCKET_EVENTS.MESSAGE.RECEIVE, callback)
  },

  onConversationUpdate: (
    callback: (payload: { conversationId: string; lastMessage: LastMessage }) => void
  ) => {
    // Remove any existing listener for conversation updates
    messageSocketClient.off(SOCKET_EVENTS.CONVERSATION.UPDATE)

    // Add the new listener
    messageSocketClient.on(SOCKET_EVENTS.CONVERSATION.UPDATE, callback)
  },

  sendMessage: (payload: SendMessagePayload) => {
    messageSocketClient.emit(SOCKET_EVENTS.MESSAGE.SEND, payload)
  },

  joinChatRoom: (payload: string) => {
    messageSocketClient.emit(SOCKET_EVENTS.ROOM.JOIN, payload)
  },

  leaveChatRoom: (payload: string) => {
    messageSocketClient.emit(SOCKET_EVENTS.ROOM.LEAVE, payload)
  },
}
