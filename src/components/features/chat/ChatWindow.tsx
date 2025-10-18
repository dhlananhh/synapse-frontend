"use client";

import {
  useState,
  useRef,
  useEffect,
  FormEvent,
} from "react";
import { useChatStore } from "@/store/useChatStore";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Minus, Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { Thread } from "@/types/services/chat";

interface ChatWindowProps {
  thread: Thread;
  myUserId: string;
}

export function ChatWindow({
  thread,
  myUserId,
}: ChatWindowProps) {
  const { minimizeChat, closeChat, sendMessage } =
    useChatStore();
  const [ messageText, setMessageText ] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const otherParticipant = thread.participants.find(
    (p) => p.id !== myUserId
  );

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [ thread.messages ]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(thread.id, messageText.trim(), myUserId);
      setMessageText("");
    }
  };

  if (!otherParticipant) return null;

  return (
    <Card className="flex h-120 w-90 flex-col rounded-t-lg shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b p-2">
        <div className="flex cursor-pointer items-center gap-2">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={ otherParticipant.avatarUrl ?? "" }
              />
              <AvatarFallback>
                { otherParticipant.username
                  .charAt(0)
                  .toUpperCase() }
              </AvatarFallback>
            </Avatar>
            <span
              className={ `ring-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full ring-2 ${otherParticipant.isOnline ? "bg-green-500" : "bg-gray-400"}` }
              title={
                otherParticipant.isOnline
                  ? "Online"
                  : "Offline"
              }
            />
          </div>
          <div>
            <p className="text-sm font-semibold">
              { otherParticipant.username }
            </p>
            <p className="text-muted-foreground text-xs">
              { otherParticipant.isOnline
                ? "Active now"
                : "Offline" }
            </p>
          </div>
        </div>

        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={ () => minimizeChat(thread.id) }
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={ () => closeChat(thread.id) }
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea
          className="h-full p-3"
          ref={ scrollAreaRef }
        >
          <div className="space-y-4">
            { thread.messages.map((msg) => (
              <ChatMessage
                key={ msg.id }
                message={ msg }
                isMe={ msg.senderId === myUserId }
              />
            )) }
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-2">
        <form
          onSubmit={ handleSend }
          className="flex w-full gap-2"
        >
          <Input
            value={ messageText }
            onChange={ (e) => setMessageText(e.target.value) }
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send Message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
