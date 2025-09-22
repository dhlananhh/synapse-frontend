"use client";


import React from "react";
import { FollowList } from "@/components/features/user/FollowList";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";


interface UserProfileTabsProps {
  userId: string;
}


export function UserProfileTabs({ userId }: UserProfileTabsProps) {
  return (
    <Tabs
      defaultValue="posts"
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="p-4 text-center text-muted-foreground">
          Posts feature coming soon!
        </div>
      </TabsContent>
      <TabsContent value="followers">
        <FollowList
          userId={ userId }
          type="followers"
        />
      </TabsContent>
      <TabsContent value="following">
        <FollowList
          userId={ userId }
          type="following"
        />
      </TabsContent>
    </Tabs>
  );
}
