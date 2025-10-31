export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: {
    SEND: 'message:send',
    RECEIVE: 'message:receive',
    EDIT: 'message:edit',
    DELETE: 'message:delete',
    REACT: 'message:react',
    FORWARD: 'message:forward',
    PIN: 'message:pin',
    UNPIN: 'message:unpin',
  },
  CONVERSATION: {
    UPDATE: 'conversation:update',
  },
  ROOM: {
    JOIN: 'room:join',
    LEAVE: 'room:leave',
  },
  TYPING: {
    START: 'typing:start',
    STOP: 'typing:stop',
  },
  PRESENCE: {
    ONLINE: 'presence:online',
    OFFLINE: 'presence:offline',
  },
}
