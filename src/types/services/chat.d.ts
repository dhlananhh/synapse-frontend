export interface User {
  id: string;
  username: string;
  avatarUrl?: string | null;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  participants: [ User, User ];
  messages: Message[];
  lastMessage?: Message;
}
