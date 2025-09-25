"use client";

import React from "react";
import { useChatStore } from "@/store/useChatStore";
import { Conversation, Message } from "@/types"
import { useAuth } from "@/context/MockAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Send, CornerDownLeft } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import { format } from "date-fns";


function ChatMessage({ message, conversation, user }: {
  message: Message,
  conversation: Conversation,
  user: any
}) {
  const isSender = message.senderId === user.id;
  const author = isSender ? user : conversation.contact;

  if (message.senderId === "system") {
    return <p className="text-xs text-center text-muted-foreground my-2">{ message.text }</p>
  }

  return (
    <div className={ cn("flex items-end gap-2 text-sm", isSender ? "justify-end" : "justify-start") }>
      {
        !isSender && <UserAvatar user={ author } className="h-6 w-6" />
      }
      <div className="flex flex-col gap-1">
        <div className={
          cn(
            "p-2.5 rounded-lg max-w-[250px] break-words",
            isSender ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
          )
        }>
          <p>{ message.text }</p>
        </div>
        <p className={
          cn(
            "text-xs text-muted-foreground",
            isSender ? "text-right" : "text-left"
          )
        }>
          { format(new Date(message.timestamp), "h:mm a") }
        </p>
      </div>
    </div>
  );
}


export default function ChatWidget() {
  const { user } = useAuth();
  const { isWidgetOpen, activeConversationId, conversations, closeChat, sendMessage } = useChatStore();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [ messageText, setMessageText ] = useState("");

  const activeConversation = conversations.find(c => c.contact.id === activeConversationId);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ activeConversation?.messages ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && user) {
      sendMessage(messageText.trim(), user);
      setMessageText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isWidgetOpen || !activeConversation) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-full max-w-sm flex flex-col h-[65vh] max-h-[550px] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <UserAvatar user={ activeConversation.contact } />
          <CardTitle className="text-base">{ activeConversation.contact.username }</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={ closeChat }>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-3 flex-grow overflow-y-auto">
        <div className="space-y-4">
          { activeConversation.messages.map(msg => (
            <ChatMessage key={ msg.id } message={ msg } conversation={ activeConversation } user={ user } />
          )) }
          <div ref={ messageEndRef } />
        </div>
      </CardContent>

      <div className="p-3 border-t bg-card">
        <form onSubmit={ handleSendMessage } className="relative">
          <Textarea
            value={ messageText }
            onChange={ (e) => setMessageText(e.target.value) }
            onKeyDown={ handleKeyDown }
            placeholder={ `Message ${activeConversation.contact.username}...` }
            rows={ 2 }
            className="resize-none pr-20"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <p className="text-xs text-muted-foreground"><CornerDownLeft /></p>
            <Button type="submit" size="icon" disabled={ !messageText.trim() }>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
