"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function FollowerItem({
  follower,
}: {
  follower: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={follower.avatarUrl ?? undefined}
          alt={follower.username}
        />
        <AvatarFallback>
          {follower.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">
          {follower.firstName} {follower.lastName}
        </div>
        <div className="text-muted-foreground text-xs">
          @{follower.username}
        </div>
      </div>
    </div>
  );
}
