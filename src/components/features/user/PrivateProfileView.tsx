"use client";


import React from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/services/user";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";


interface PrivateProfileViewProps {
  user: UserProfile;
  counts: { followers: number; following: number; };
  isFollowing: boolean;
  isPending: boolean;
}


export function PrivateProfileView({
  user,
  counts,
  isFollowing,
  isPending
}: PrivateProfileViewProps) {
  const { user: currentUser } = useAuth();

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-card border rounded-lg">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage
            src={ user.avatarUrl || undefined }
            alt={ user.username }
          />
          <AvatarFallback>
            { user.username.charAt(0).toUpperCase() }
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">
            { `${user.firstName} ${user.lastName}` }
          </h1>
          <p className="text-muted-foreground">
            @{ user.username }
          </p>
          <div className="flex gap-4 my-3 justify-center md:justify-start">
            <span className="font-semibold">
              { counts.followers } Followers
            </span>
            <span className="font-semibold">
              { counts.following } Following
            </span>
          </div>
        </div>
        <Button>
          {
            isPending
              ? "Requested"
              : (isFollowing ? "Following" : "Follow")
          }
        </Button>
      </div>

      <div className="mt-8 border-t border-dashed py-16 text-center">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          This Account is Private
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Follow this account to see their posts and activity.
        </p>
        {
          !currentUser && (
            <p className="mt-1 text-sm text-muted-foreground">
              Already follow?
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          )
        }
      </div>
    </div>
  );
}
