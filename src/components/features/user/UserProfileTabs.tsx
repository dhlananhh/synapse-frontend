"use client";


import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { FollowList } from "./FollowList";


interface UserProfileTabsProps {
  userId: string;
}


export function UserProfileTabs({ userId }: UserProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <div className="p-10 text-center text-muted-foreground border rounded-md">
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
