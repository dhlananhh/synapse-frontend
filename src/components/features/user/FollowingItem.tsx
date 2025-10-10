"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function FollowingItem({
  following,
}: {
  following: {
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
          src={following.avatarUrl ?? undefined}
          alt={following.username}
        />
        <AvatarFallback>
          {following.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">
          {following.firstName} {following.lastName}
        </div>
        <div className="text-muted-foreground text-xs">
          @{following.username}
        </div>
      </div>
    </div>
  );
}
