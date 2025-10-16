"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FollowList } from "./FollowList";
import {
  FollowerResponse,
  FollowingResponse,
} from "@/types/services/user";

interface UserProfileTabsProps {
  userId: string;
  followers: FollowerResponse[];
  following: FollowingResponse[];
}

export function UserProfileTabs({
  userId,
  followers,
  following,
}: UserProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="followers">
          Followers
        </TabsTrigger>
        <TabsTrigger value="following">
          Following
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <div className="text-muted-foreground rounded-md border p-10 text-center">
          Posts feature coming soon!
        </div>
      </TabsContent>

      <TabsContent value="followers">
        <FollowList type="followers" userId={userId} />
      </TabsContent>

      <TabsContent value="following">
        <FollowList type="following" userId={userId} />
      </TabsContent>
    </Tabs>
  );
}
