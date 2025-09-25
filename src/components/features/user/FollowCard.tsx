"use client";


import React from "react";
import Link from "next/link";
import { FollowInfo } from "@/types/services/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


interface FollowCardProps {
  user: FollowInfo;
}


export function FollowCard({ user }: FollowCardProps) {
  return (
    <div className="flex items-center justify-between space-x-4 p-2 hover:bg-accent rounded-md">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={ user.avatarUrl || undefined }
            alt={ `@${user.username}` }
          />
          <AvatarFallback>
            { user.username.charAt(0).toUpperCase() }
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">
            { `${user.firstName} ${user.lastName}` }
          </p>
          <p className="text-sm text-muted-foreground">
            @{ user.username }
          </p>
        </div>
      </div>

      <Button
        asChild
        variant="secondary"
        size="sm"
      >
        <Link
          href={ `/u/${user.id}` }
        >
          View Profile
        </Link>
      </Button>
    </div>
  );
}
