import { create } from "zustand";
import {
  Message,
  Conversation,
  ChatState
} from "@/types";


export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isWidgetOpen: false,

  openChat: (contact) => {
    set(state => {
      const existingConvo = state.conversations.find(c => c.contact.id === contact.id);
      if (existingConvo) {
        return { isWidgetOpen: true, activeConversationId: contact.id };
      }
      const newConvo: Conversation = {
        contact,
        messages: [ {
          id: `msg_auto_${Date.now()}`,
          text: `You are now connected with ${contact.username}.`,
          senderId: "system",
          timestamp: new Date().toISOString()
        } ],
      };
      return {
        isWidgetOpen: true,
        activeConversationId: contact.id,
        conversations: [ ...state.conversations, newConvo ]
      };
    });
  },

  closeChat: () => set({ isWidgetOpen: false }),

  sendMessage: (text, user) => {
    const activeId = get().activeConversationId;
    if (!activeId) return;

    const newMessage: Message = {
      id: `msg_sent_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date().toISOString()
    };

    set(state => ({
      conversations: state.conversations.map(convo =>
        convo.contact.id === activeId
          ? { ...convo, messages: [ ...convo.messages, newMessage ] }
          : convo
      )
    }));

    get()._receiveSimulatedReply(activeId, text);
  },

  _receiveSimulatedReply: (contactId, originalText) => {
    setTimeout(() => {
      set(state => {
        const convo = state.conversations.find(c => c.contact.id === contactId);
        if (!convo) return state;

        const replyMessage: Message = {
          id: `msg_reply_${Date.now()}`,
          text: `This is a simulated reply to your message about "${originalText.substring(0, 15)}..."`,
          senderId: contactId,
          timestamp: new Date().toISOString()
        };

        return {
          conversations: state.conversations.map(c =>
            c.contact.id === contactId
              ? { ...c, messages: [ ...c.messages, replyMessage ] }
              : c
          )
        };
      });
    }, 1500);
  }
}));
