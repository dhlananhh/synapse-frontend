"use client";

import React from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/services/user";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PrivateProfileViewProps {
  user: UserProfile;
  isFollowing: boolean;
  isPending: boolean;
}

export function PrivateProfileView({
  user,
  isFollowing,
  isPending,
}: PrivateProfileViewProps) {
  const { user: currentUser } = useAuth();

  return (
    <div className="w-full">
      <div className="bg-card flex flex-col items-center gap-6 rounded-lg border p-6 md:flex-row md:items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage
            src={user.avatarUrl || undefined}
            alt={user.username}
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">
            {`${user.firstName} ${user.lastName}`}
          </h1>
          <p className="text-muted-foreground">
            @{user.username}
          </p>
          <div className="my-3 flex justify-center gap-4 md:justify-start">
            <span className="font-semibold">
              {user.followerCount} Followers
            </span>
            <span className="font-semibold">
              {user.followingCount} Following
            </span>
          </div>
        </div>
        <Button>
          {isPending
            ? "Requested"
            : isFollowing
              ? "Following"
              : "Follow"}
        </Button>
      </div>

      <div className="mt-8 border-t border-dashed py-16 text-center">
        <Lock className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">
          This Account is Private
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Follow this account to see their posts and
          activities.
        </p>
        {!currentUser && (
          <p className="text-muted-foreground mt-1 text-sm">
            Already follow?
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
