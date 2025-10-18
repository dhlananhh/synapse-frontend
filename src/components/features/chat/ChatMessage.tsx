"use client";

import { Message } from "@/types/services/chat";

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
}

export function ChatMessage({
  message,
  isMe,
}: ChatMessageProps) {
  return (
    <div
      className={
        `flex 
        ${isMe ? "justify-end" : "justify-start"}`
      }
    >
      <div
        className={
          `max-w-[75%] rounded-2xl px-3 py-2 
          ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`
        }
      >
        <p className="text-sm">{ message.text }</p>
      </div>
    </div>
  );
}
