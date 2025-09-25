"use client";


import React from "react";
import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/context/MockAuthContext";
import { mockCommunities } from "@/libs/mock-data";
import ForbiddenDisplay from "@/components/shared/ForbiddenDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import ManageMembersTab from "@/components/features/community/manage/tabs/ManageMembersTab";
import ManageFlairsTab from "@/components/features/community/manage/tabs/ManageFlairsTab";
import DangerZoneTab from "@/components/features/community/manage/tabs/DangerZoneTab";


export const dynamic = "force-dynamic";


export default function ManageCommunityPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { user } = useAuth();

  const community = mockCommunities.find(c => c.slug === slug);

  if (user === undefined || !community) {
    return <Skeleton className="h-48 w-full" />;
  }

  const isOwner = user?.id === community.ownerId;

  if (!isOwner) {
    return <ForbiddenDisplay
      title="Permission Denied"
      description="You must be the community owner to access these settings."
    />;
  }

  if (!community) {
    notFound();
  }

  return (
    <div className="mt-5">
      <h1 className="text-3xl font-bold">
        Manage Community
      </h1>
      <p className="text-muted-foreground mt-2">
        You are managing { " " }
        <span className="font-semibold text-primary">
          c/{ community.slug }
        </span>
      </p>

      <Tabs defaultValue="members" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="members">Members & Moderators</TabsTrigger>
          <TabsTrigger value="settings">General Settings</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <ManageMembersTab community={ community } />
        </TabsContent>
        <TabsContent value="flairs">
          <ManageFlairsTab community={ community } />
        </TabsContent>
        <TabsContent value="settings">
          <p className="p-4 text-muted-foreground">
            Community general settings will be here...
          </p>
        </TabsContent>
        <TabsContent value="danger">
          <DangerZoneTab community={ community } />
        </TabsContent>
      </Tabs>
    </div>
  );
}
