"use client";

import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { CommunityMember } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { MemberCard } from "./MemberCard";
import { Button } from "@/components/ui/button";
import { Loader2, UserX } from "lucide-react";

interface BannedMembersTabProps {
  communityId: string;
  currentUserRole?: "OWNER" | "MODERATOR" | "MEMBER";
}

export function BannedMembersTab({
  communityId,
  currentUserRole,
}: BannedMembersTabProps) {
  const [bannedMembers, setBannedMembers] = useState<
    CommunityMember[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<
    string | null
  >(null);
  const [hasMore, setHasMore] = useState(false);

  // Fetch initial list of banned members
  const fetchBannedMembers = useCallback(
    async (cursor?: string | null) => {
      const loadingSetter = cursor
        ? setIsLoadingMore
        : setIsLoading;
      loadingSetter(true);
      try {
        const response =
          await communityService.getBannedMembers(
            communityId,
            {
              cursor,
            }
          );
        const newMembers = response.members || [];

        setBannedMembers((prev) =>
          cursor ? [...prev, ...newMembers] : newMembers
        );
        setHasMore(response.pagination?.hasMore ?? false);
        setNextCursor(
          response.pagination?.nextCursor ?? null
        );
      } catch (error) {
        toast.error(
          "Failed to load the list of banned members."
        );
        console.error("Fetch Banned Members Error:", error);
      } finally {
        loadingSetter(false);
      }
    },
    [communityId]
  );

  // Initial fetch
  useEffect(() => {
    fetchBannedMembers();
  }, [fetchBannedMembers]);

  const handleUnban = async (
    userId: string,
    username: string
  ) => {
    const originalMembers = [...bannedMembers];
    setBannedMembers((prev) =>
      prev.filter((member) => member.userId !== userId)
    );

    try {
      await communityService.unbanMember(
        communityId,
        userId
      );
      toast.success(
        `User @${username} has been unbanned successfully!`
      );
    } catch (error: any) {
      toast.error(`Failed to unban @${username}.`, {
        description:
          error.response?.data?.message ||
          "Please try again.",
      });
      setBannedMembers(originalMembers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (bannedMembers.length === 0) {
    return (
      <div className="p-8 text-center">
        <UserX className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">
          No Banned Members
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          There are currently no members banned from this
          community.
        </p>
      </div>
    );
  }

  return (
    <div>
      {bannedMembers.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserRole={currentUserRole}
          onUnban={handleUnban}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center border-t p-4">
          <Button
            variant="outline"
            onClick={() => fetchBannedMembers(nextCursor)}
            disabled={isLoadingMore}
          >
            {isLoadingMore && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
