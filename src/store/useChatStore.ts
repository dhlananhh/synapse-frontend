import { create } from "zustand";
import {
  User,
  Message,
  Thread,
} from "@/types/services/chat";

interface ChatState {
  threads: Thread[];
  openThreads: Thread[];
  minimizedThreads: Thread[];
  isThreadsListOpen: boolean;

  // Actions
  initializeThreads: (myUserId: string) => void;
  toggleThreadsList: () => void;
  openChat: (threadId: string) => void;
  closeChat: (threadId: string) => void;
  minimizeChat: (threadId: string) => void;
  sendMessage: (
    threadId: string,
    messageText: string,
    myUserId: string
  ) => void;
}

// ---- MOCK DATA ----
const mockUserAlice: User = {
  id: "user001",
  username: "Alice",
  avatarUrl: null,
  isOnline: true,
};
const mockUserBob: User = {
  id: "user002",
  username: "Bob",
  avatarUrl: null,
  isOnline: false,
};
const mockUserCandace: User = {
  id: "user003",
  username: "Candace",
  avatarUrl: null,
  isOnline: true,
};

const createMockThreads = (myUserId: string): Thread[] => {
  const meAsUserObject = [
    mockUserAlice,
    mockUserBob,
    mockUserCandace,
  ].find((u) => u.id === myUserId) || {
    id: myUserId,
    username: "Me",
    isOnline: true,
  };

  return [
    {
      id: "thread-1",
      participants: [meAsUserObject, mockUserBob],
      messages: [
        {
          id: "msg-2",
          text: "Pretty good!",
          senderId: "user002",
          timestamp: new Date().toISOString(),
        },
      ],
      lastMessage: {
        id: "msg-2",
        text: "Pretty good!",
        senderId: "user002",
        timestamp: new Date().toISOString(),
      },
    },
    {
      id: "thread-2",
      participants: [meAsUserObject, mockUserCandace],
      messages: [
        {
          id: "msg-3",
          text: "Did you see the latest update?",
          senderId: "user003",
          timestamp: new Date().toISOString(),
        },
      ],
      lastMessage: {
        id: "msg-3",
        text: "Did you see the latest update?",
        senderId: "user003",
        timestamp: new Date().toISOString(),
      },
    },
  ];
};

export const useChatStore = create<ChatState>(
  (set, get) => ({
    threads: [],
    openThreads: [],
    minimizedThreads: [],
    isThreadsListOpen: false,

    initializeThreads: (myUserId: string) => {
      set({ threads: createMockThreads(myUserId) });
    },

    toggleThreadsList: () =>
      set((state) => ({
        isThreadsListOpen: !state.isThreadsListOpen,
      })),

    openChat: (threadId: string) => {
      const threadToOpen = get().threads.find(
        (t) => t.id === threadId
      );
      if (!threadToOpen) return;

      set((state) => ({
        openThreads: [
          threadToOpen,
          ...state.openThreads.filter(
            (t) => t.id !== threadId
          ),
        ],
        minimizedThreads: state.minimizedThreads.filter(
          (t) => t.id !== threadId
        ),
        isThreadsListOpen: false,
      }));
    },

    closeChat: (threadId: string) => {
      set((state) => ({
        openThreads: state.openThreads.filter(
          (t) => t.id !== threadId
        ),
        minimizedThreads: state.minimizedThreads.filter(
          (t) => t.id !== threadId
        ),
      }));
    },

    minimizeChat: (threadId: string) => {
      const threadToMinimize = get().openThreads.find(
        (t) => t.id === threadId
      );
      if (!threadToMinimize) return;

      set((state) => ({
        openThreads: state.openThreads.filter(
          (t) => t.id !== threadId
        ),
        minimizedThreads: [
          ...state.minimizedThreads,
          threadToMinimize,
        ],
      }));
    },

    sendMessage: (
      threadId: string,
      messageText: string,
      myUserId: string
    ) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        text: messageText,
        senderId: myUserId,
        timestamp: new Date().toISOString(),
      };

      const updateThreadWithNewMessage = (
        thread: Thread
      ) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
            lastMessage: newMessage,
          };
        }
        return thread;
      };

      set((state) => ({
        threads: state.threads.map(
          updateThreadWithNewMessage
        ),
        openThreads: state.openThreads.map(
          updateThreadWithNewMessage
        ),
      }));
    },
  })
);
