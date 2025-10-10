"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ThreadsList } from "./ThreadsList";
import { ChatWindow } from "./ChatWindow";

export function ChatTray() {
  const { user: currentUser, isLoading: isAuthLoading } =
    useAuth();

  const isThreadsListOpen = useChatStore(
    (state) => state.isThreadsListOpen
  );
  const toggleThreadsList = useChatStore(
    (state) => state.toggleThreadsList
  );
  const openThreads = useChatStore(
    (state) => state.openThreads
  );
  const minimizedThreads = useChatStore(
    (state) => state.minimizedThreads
  );
  const openChat = useChatStore((state) => state.openChat);
  const initializeThreads = useChatStore(
    (state) => state.initializeThreads
  );
  const threads = useChatStore((state) => state.threads);

  const myUserId = currentUser?.id;

  useEffect(() => {
    if (myUserId && threads.length === 0) {
      initializeThreads(myUserId);
    }
  }, [myUserId, threads, initializeThreads]);

  if (isAuthLoading || !myUserId) {
    return null;
  }

  const getOtherParticipant = (thread: any) =>
    thread.participants.find((p: any) => p.id !== myUserId);

  return (
    <div className="fixed right-4 bottom-0 z-50 flex items-end gap-4">
      <div className="flex gap-4">
        {minimizedThreads.map((thread) => (
          <Button
            key={thread.id}
            onClick={() => openChat(thread.id)}
            className="w-60 justify-start rounded-t-lg rounded-b-none shadow-2xl"
          >
            {getOtherParticipant(thread)?.username}
          </Button>
        ))}
      </div>

      <div className="relative">
        {isThreadsListOpen && (
          <ThreadsList myUserId={myUserId} />
        )}
        <Button
          onClick={toggleThreadsList}
          className="w-60 justify-between rounded-t-lg rounded-b-none shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <MessageSquare /> Chats
          </div>
          {isThreadsListOpen ? (
            <ChevronDown />
          ) : (
            <ChevronUp />
          )}
        </Button>
      </div>

      {openThreads.map((thread) => (
        <ChatWindow
          key={thread.id}
          thread={thread}
          myUserId={myUserId}
        />
      ))}
    </div>
  );
}
