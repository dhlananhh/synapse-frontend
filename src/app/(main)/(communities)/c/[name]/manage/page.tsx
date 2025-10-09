"use client";


import React from "react";
import Link from "next/link";
import { useCommunity } from "@/context/CommunityContext";
import { useMembership } from "@/context/MembershipContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,          // Icon for Members
  ShieldAlert,    // Icon for Reports
  FileText,       // Icon for Content
  Settings,       // Icon for Community Settings
  ShieldCheck,    // Icon for Rules
  Hash,           // Icon for Flairs
  ArrowRight,
  Ban,
  Lock
} from "lucide-react";


export default function CommunityManagePage() {
  const community = useCommunity();
  const membershipContext = useMembership();

  const isLoading = !community || !membershipContext;

  if (isLoading) {
    return <ManagementDashboardSkeleton />;
  }

  const membership = membershipContext.membership;

  // --- PERMISSION CHECK ---
  // Only allow Owners and Moderators to view this page
  const canManage = membership?.role === "OWNER" || membership?.role === "MODERATOR";

  if (!canManage) {
    return (
      <div className="text-center py-20">
        <Lock className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">
          Access Denied
        </h1>
        <p className="mt-2 text-muted-foreground">
          You do not have the required permissions to access the management tools for this community.
        </p>
      </div>
    );
  }

  // List of management tools
  // Both Owner and Moderators have the right to manage the community
  const managementTools = [
    {
      title: "Manage Members",
      description: "View join requests, manage current members, and handle bans.",
      href: `/c/${community.name}/manage/members`,
      icon: Users,
      permission: "all"
    },
    {
      title: "Reported Content",
      description: "Review posts and comments that have been reported by members.",
      href: `/c/${community.name}/manage/reports`,
      icon: ShieldAlert,
      permission: "all"
    },
    {
      title: "Manage Content",
      description: "View, approve, or remove posts and comments within the community.",
      href: `/c/${community.name}/manage/contents`,
      icon: FileText,
      permission: "all"
    },
    {
      title: "Community Settings",
      description: "Update community details like name, description, and privacy settings.",
      href: `/c/${community.name}/settings`,
      icon: Settings,
      permission: "owner"
    },
    {
      title: "Community Rules",
      description: "Create and edit the rules for your community.",
      href: "#",
      icon: ShieldCheck,
      permission: "all"
    },
    {
      title: "Post Flairs",
      description: "Manage the flairs that members can add to their posts.",
      href: "#",
      icon: Hash,
      permission: "all"
    },
  ];

  // Filter out the tools that the current user has access to
  const availableTools = managementTools.filter(tool => {
    if (tool.permission === "all")
      return true;
    return membership?.role === "OWNER";
  });


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Moderation Tools</h1>
        <p className="text-lg text-muted-foreground">
          Manage your community { " " }
          <span className="font-semibold text-primary">
            c/{ community.name }
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          availableTools.map((tool) => (
            <Link
              href={ tool.href }
              key={ tool.title } className="group"
            >
              <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                <CardHeader className="flex-row items-center gap-4">
                  <tool.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>
                      { tool.title }
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    { tool.description }
                  </CardDescription>
                  <div className="flex items-center text-sm font-semibold text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Go to { " " } { tool.title }
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        }
      </div>
    </div>
  );
}


function ManagementDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          [ ...Array(6) ].map((_, i) => (
            <Card
              key={ i }
              className="h-[180px]"
            >
              <CardHeader className="flex-row items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  );
}
