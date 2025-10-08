"use client";


import React from "react";
import { useCommunity } from "@/context/CommunityContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { PendingMembersTab } from "@/components/features/community/manage/members/PendingMembersTab";
// Import các component tab khác ở đây khi bạn tạo chúng
// import { CurrentMembersTab } from "@/components/features/community/manage/members/CurrentMembersTab";
// import { BannedMembersTab } from "@/components/features/community/manage/members/BannedMembersTab";


export default function ManageMembersPage() {
  const community = useCommunity();

  if (!community) {
    return (
      <div className="mt-10 text-center text-muted-foreground p-8">
        Loading community data... Please navigate from the community page.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Members</h1>
        <p className="text-muted-foreground">
          Manage join requests, current members, and bans for c/{ community.name }.
        </p>
      </div>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Join Requests</TabsTrigger>
          <TabsTrigger value="current">Current Members</TabsTrigger>
          <TabsTrigger value="banned">Banned Members</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 border rounded-lg">
          <PendingMembersTab communityId={ community.id } />
        </TabsContent>

        <TabsContent value="current" className="mt-4 border rounded-lg">
          {/* Đặt CurrentMembersTab component vào đây */ }
          <p className="p-8 text-center">Current Members section coming soon!</p>
        </TabsContent>

        <TabsContent value="banned" className="mt-4 border rounded-lg">
          {/* Đặt BannedMembersTab component vào đây */ }
          <p className="p-8 text-center">Banned Members section coming soon!</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
