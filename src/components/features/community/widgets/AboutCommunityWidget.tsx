import React, { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/context/MembershipContext";
import {
  useCommunity,
  useSetCommunity,
} from "@/context/CommunityContext";
import type { Community } from "@/types/services/community";
import { UpdateCommunityDialog } from "@/components/features/community/manage/dialogs/UpdateCommunityDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cake,
  Users,
  Settings,
  Globe,
  Lock,
  Info,
  UserPlus,
  FileText,
  TriangleAlert,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";

export default function AboutCommunityWidget() {
  const community = useCommunity();
  const setCommunity = useSetCommunity();
  const { user } = useAuth();
  const membershipContext = useMembership();

  const createdAtDate = useMemo(() => {
    if (!community?.createdAt) return null;
    const d = new Date(community.createdAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [community?.createdAt]);

  if (!community) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const membership = membershipContext?.membership ?? null;
  const role =
    membership?.role ??
    (user?.id === community.ownerId ? "OWNER" : undefined);
  const membershipStatus = membership?.status ?? undefined;

  const isOwner = role === "OWNER";
  const isModerator = role === "MODERATOR";
  const canManage =
    membershipStatus === "ACTIVE" &&
    (isModerator || isOwner);

  const handleUpdate = (updated: Community) => {
    setCommunity(updated);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Info className="mr-2 inline h-5 w-5" />
            <span>About c/{community.name}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {community.description}
          </p>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Cake className="h-5 w-5" />
              <span>
                Created{" "}
                {createdAtDate
                  ? format(createdAtDate, "MMM d, yyyy")
                  : "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {community.isPrivate ? (
                <span className="inline-flex items-center gap-2 rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white">
                  <Lock className="h-4 w-4 text-white" />
                  Private
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white">
                  <Globe className="h-4 w-4 text-white" />
                  Public
                </span>
              )}

              {community.isNSFW && (
                <span className="inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs font-bold text-white">
                  <TriangleAlert className="h-4 w-4 text-white" />
                  NSFW
                </span>
              )}

              {community.moderationMode && (
                <span className="inline-flex items-center gap-2 rounded bg-amber-600 px-2 py-1 text-sm font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-white" />
                  Moderated
                </span>
              )}
            </div>
            <hr />

            <Link
              href={`/c/${community.name}/members`}
              className="hover:text-primary flex cursor-pointer items-center gap-2 font-medium"
            >
              <Users className="h-5 w-5" />
              <span>
                {community.memberCount.toLocaleString()}{" "}
                members
              </span>
            </Link>
          </div>

          {(canManage || isOwner) && (
            <>
              <hr />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  {isOwner
                    ? "Owner Actions"
                    : "Moderator Actions"}
                </h4>

                {/* Community Management - available to moderators & owners (if active) */}
                {canManage && (
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                  >
                    <Link
                      href={`/c/${community.name}/manage`}
                      className="flex w-full items-center justify-center gap-2"
                    >
                      <FolderKanban className="h-4 w-4" />
                      Manage this community
                    </Link>
                  </Button>
                )}

                {/* Manage Members - available to moderators & owners (if active) */}
                {canManage && (
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                  >
                    <Link
                      href={`/c/${community.name}/manage/members`}
                      className="flex w-full items-center justify-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Manage Members
                    </Link>
                  </Button>
                )}

                {/* Manage Contents - available to moderators & owners (if active) */}
                {canManage && (
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                  >
                    <Link
                      href={`/c/${community.name}/manage/contents`}
                      className="flex w-full items-center justify-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Manage Contents
                    </Link>
                  </Button>
                )}

                {/* Edit Community - available only to owner */}
                {isOwner && (
                  <UpdateCommunityDialog
                    community={community}
                    onUpdate={handleUpdate}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
