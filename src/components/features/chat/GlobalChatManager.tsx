"use client";


import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/store/useChatStore";
import { ThreadsList } from "./ThreadsList";
import { ChatWindow } from "./ChatWindow";
import { Button } from "@/components/ui/button";


export function GlobalChatManager() {
  const {
    user: currentUser,
    isLoading: isAuthLoading
  } = useAuth();

  const {
    isThreadsListOpen,
    openThreads,
    minimizedThreads,
    openChat,
    initializeThreads,
    threads
  } = useChatStore();

  const myUserId = currentUser?.id;

  useEffect(() => {
    if (myUserId && threads.length === 0) {
      initializeThreads(myUserId);
    }
  }, [ myUserId, threads, initializeThreads ]);

  if (isAuthLoading || !myUserId) {
    return null;
  }

  const getOtherParticipant = (thread: any) => thread.participants.find((p: any) => p.id !== myUserId);

  return (
    <div className="fixed bottom-0 right-4 z-50 flex items-end gap-4">

      <div className="flex flex-row-reverse gap-4">
        {
          minimizedThreads.map(thread => (
            <Button
              key={ thread.id }
              onClick={ () => openChat(thread.id) }
              className="shadow-lg rounded-t-lg rounded-b-none w-60 justify-start"
            >
              { getOtherParticipant(thread)?.username }
            </Button>
          ))
        }
      </div>

      <div className="relative">
        {
          isThreadsListOpen && <ThreadsList myUserId={ myUserId } />
        }
      </div>

      {
        openThreads.map(thread => (
          <ChatWindow
            key={ thread.id }
            thread={ thread }
            myUserId={ myUserId }
          />
        ))
      }
    </div>
  );
}
