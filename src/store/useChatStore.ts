import { create } from 'zustand'
import { Conversation } from '@/types/services/message'

interface ChatStore {
  isChatOpen: boolean
  activeConversation: Conversation | null
  toggleChat: () => void
  setActiveConversation: (conversation: Conversation | null) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatOpen: false,
  activeConversation: null,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
}))
