"use client";

import { PendingFollowRequest } from "@/types/services/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PendingRequestItem({
  requester,
  onAccept,
  onReject,
}: {
  requester: PendingFollowRequest["requester"];
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={`/profile/${requester.id}`}
        className="hover:bg-accent flex flex-1 items-center gap-3 rounded px-2 py-1 transition"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={requester.avatarUrl ?? undefined}
            alt={requester.username}
          />
          <AvatarFallback>
            {requester.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">
            {requester.firstName} {requester.lastName}
          </div>
          <div className="text-muted-foreground text-xs">
            @{requester.username}
          </div>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button size="sm" onClick={onAccept}>
          Accept
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
