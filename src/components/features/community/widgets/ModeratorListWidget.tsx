"use client";

import React, { useEffect, useState } from "react";
import { Community } from "@/types/services/community";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { SimpleProfile } from "@/types/services/user";
import { userService } from "@/modules/services/user-service";
import { communityService } from "@/modules/services/community-service";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunity } from "@/context/CommunityContext";

function ModeratorItem({ user }: { user: SimpleProfile }) {
  return (
    <li>
      <Link
        href={`/u/${user.username}`}
        className="group hover:bg-muted/60 flex items-center gap-3 rounded-md px-2 py-1 transition-colors"
      >
        <Avatar className="h-8 w-8">
          {user.avatarUrl ? (
            <AvatarImage
              src={user.avatarUrl}
              alt={user.username}
            />
          ) : (
            <AvatarFallback>
              {user.username?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{`u/${user.username}`}</span>
          <span className="text-muted-foreground text-xs">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function ModeratorListWidget() {
  const community = useCommunity();
  const communityId = community?.id ?? "";

  const [moderators, setModerators] = useState<
    SimpleProfile[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadModerators = async () => {
      if (!communityId) {
        if (mounted) {
          setModerators([]);
          setIsLoading(false);
          setError(null);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // fetch members with role=MODERATOR, limit=5
        const res = await communityService.getMembers(
          communityId,
          {
            role: "MODERATOR",
            limit: 5,
          }
        );
        const members = res?.members ?? [];
        if (!mounted) return;

        const userIds = members
          .map((m) => m.userId)
          .filter(Boolean);
        if (userIds.length === 0) {
          setModerators([]);
          return;
        }

        const profiles =
          await userService.getSimpleProfiles(userIds);
        if (!mounted) return;
        setModerators(profiles);
      } catch (err: any) {
        console.error("Failed to fetch moderators:", err);
        if (mounted) {
          setModerators([]);
          setError("Failed to load moderators.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadModerators();

    return () => {
      mounted = false;
    };
  }, [communityId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Moderators
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">
            {error}
          </p>
        ) : moderators.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No moderators found.
          </p>
        ) : (
          <ul className="space-y-3">
            {moderators.map((user) => (
              <ModeratorItem key={user.id} user={user} />
            ))}
          </ul>
        )}

        {/* only show button when we actually have moderators */}
        {!isLoading && moderators.length > 0 && (
          <div className="mt-4 flex justify-center pt-4">
            <Button variant="outline" size="sm">
              View all moderators
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
