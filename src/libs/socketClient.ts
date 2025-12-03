import { io, Socket } from 'socket.io-client'

// Base URLs for the Socket.IO servers
const MESSAGE_SERVER_URL = process.env.NEXT_PUBLIC_MESSAGE_SERVER_URL || 'http://localhost:4000'
const NOTIFICATION_SERVER_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVER_URL || 'http://localhost:5000'

// Create a Socket.IO client instance for the messaging server
export const messageSocketClient: Socket = io(MESSAGE_SERVER_URL, {
  autoConnect: false, // Prevent auto-connection; connect manually when needed
  withCredentials: true, // Send cookies with requests
})

// Create a Socket.IO client instance for the notification server
export const notificationSocketClient: Socket = io(NOTIFICATION_SERVER_URL, {
  autoConnect: false, // Prevent auto-connection; connect manually when needed
  withCredentials: true, // Send cookies with requests
})

// Handle connection errors globally for both clients
messageSocketClient.on('connect_error', (error) => {
  console.error('Message Socket connection error:', error)
})

notificationSocketClient.on('connect_error', (error) => {
  console.error('Notification Socket connection error:', error)
})
