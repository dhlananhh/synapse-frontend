"use client";


import React from "react";
import { useChatStore } from "@/store/useChatStore";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";


interface ThreadsListProps {
  myUserId: string;
}


export function ThreadsList({ myUserId }: ThreadsListProps) {
  const threads = useChatStore((state) => state.threads);
  const openChat = useChatStore((state) => state.openChat);

  return (
    <Card className="h-80 w-120 shadow-2xl absolute bottom-0 right-0 flex flex-col">
      <CardHeader className="border-b p-3">
        <h3 className="px-1 text-base font-semibold">
          Conversations
        </h3>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-2">
            {
              threads.length === 0 ? (
                <p className="text-muted-foreground p-4 text-center text-sm">
                  No conversations started yet.
                </p>
              ) : (
                threads.map((thread) => {
                  const otherParticipant =
                    thread.participants.find(
                      (p) => p.id !== myUserId
                    );
                  if (!otherParticipant) return null;

                  const lastMsg = thread.lastMessage;
                  const lastMessagePreview = lastMsg
                    ? `${lastMsg.senderId === myUserId ? "You: " : ""} ${lastMsg.text}`
                    : "Click to start conversation...";

                  return (
                    <div
                      key={ thread.id }
                      onClick={ () => openChat(thread.id) }
                      className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              otherParticipant.avatarUrl ?? ""
                            }
                          />
                          <AvatarFallback>
                            { otherParticipant.username
                              .charAt(0)
                              .toUpperCase() }
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={
                            `ring-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full ring-2 
                            ${otherParticipant.isOnline ? "bg-green-500" : "bg-gray-400"}`
                          }
                          title={
                            otherParticipant.isOnline
                              ? "Online"
                              : "Offline"
                          }
                        />
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold">
                          { otherParticipant.username }
                        </p>
                        <p
                          className="text-muted-foreground truncate text-xs"
                          title={ lastMessagePreview }
                        >
                          { lastMessagePreview }
                        </p>
                      </div>
                    </div>
                  );
                })
              )
            }
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
