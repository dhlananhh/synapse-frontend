"use client";

import { useChatStore } from "@/store/useChatStore";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThreadsListProps {
  myUserId: string;
}

export function ThreadsList({ myUserId }: ThreadsListProps) {
  const threads = useChatStore((state) => state.threads);
  const openChat = useChatStore((state) => state.openChat);

  return (
    <Card className="w-120 h-80 shadow-2xl absolute bottom-14 right-0 flex flex-col">
      <CardHeader className="p-3 border-b">
        <h3 className="font-semibold text-base px-1">Conversations</h3>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-2">
            {
              threads.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No conversations started yet.
                </p>
              ) : (
                threads.map((thread) => {
                  const otherParticipant = thread.participants.find((p) => p.id !== myUserId);
                  if (!otherParticipant) return null;

                  const lastMsg = thread.lastMessage;
                  const lastMessagePreview = lastMsg
                    ? `${lastMsg.senderId === myUserId ? "You: " : ""} ${lastMsg.text}`
                    : "Click to start conversation...";

                  return (
                    <div
                      key={ thread.id }
                      onClick={ () => openChat(thread.id) }
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={ otherParticipant.avatarUrl ?? "" } />
                          <AvatarFallback>
                            { otherParticipant.username.charAt(0).toUpperCase() }
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={ `absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background
                                    ${otherParticipant.isOnline ? "bg-green-500" : "bg-gray-400"}` }
                          title={ otherParticipant.isOnline ? "Online" : "Offline" }
                        />
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-sm truncate">
                          { otherParticipant.username }
                        </p>
                        <p
                          className="text-xs text-muted-foreground truncate"
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
