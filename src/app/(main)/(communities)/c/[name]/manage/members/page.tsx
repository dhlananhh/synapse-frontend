"use client";


import React from "react";
import { useCommunity } from "@/context/CommunityContext";
import { useMembership } from "@/context/MembershipContext";
import { PendingMembersTab } from "@/components/features/community/manage/members/PendingMembersTab";
import { CurrentMembersTab } from "@/components/features/community/manage/members/CurrentMembersTab";
import { BannedMembersTab } from "@/components/features/community/manage/members/BannedMembersTab";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";


export default function ManageMembersPage() {
  const community = useCommunity();
  const membershipContext = useMembership();
  const currentUserRole = membershipContext?.membership?.role;

  if (!community) {
    return (
      <div className="mt-10 text-2xl">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Members</h1>
        <p className="text-muted-foreground">Manage join requests, current members, and bans for r/{ community.name }.</p>
      </div>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Join Requests</TabsTrigger>
          <TabsTrigger value="current">Members</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 border rounded-lg overflow-hidden">
          <PendingMembersTab communityId={ community.id } currentUserRole={ currentUserRole } />
        </TabsContent>

        <TabsContent value="current" className="mt-4 border rounded-lg overflow-hidden">
          <CurrentMembersTab communityId={ community.id } currentUserRole={ currentUserRole } />
        </TabsContent>

        <TabsContent value="banned" className="mt-4 border rounded-lg overflow-hidden">
          <BannedMembersTab communityId={ community.id } currentUserRole={ currentUserRole } />
        </TabsContent>
      </Tabs>
    </div>
  );
}
