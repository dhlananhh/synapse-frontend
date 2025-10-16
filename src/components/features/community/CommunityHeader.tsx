import Image from "next/image";
import {
  Community,
  CommunityMembership,
} from "@/types/services/community";
import {
  Lock,
  TriangleAlert,
  Plus,
  LogOut,
  X,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { communityService } from "@/modules/services/community-service";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface CommunityHeaderProps {
  community: Community;
  membership: CommunityMembership | null;
  onMembershipChange?: (
    membership: CommunityMembership | null
  ) => void;
}

export default function CommunityHeader({
  community,
  membership,
  onMembershipChange,
}: CommunityHeaderProps) {
  const [loading, setLoading] = useState<
    "join" | "cancel" | "leave" | null
  >(null);
  const [showLeaveConfirm, setShowLeaveConfirm] =
    useState(false);

  // Handler for joining community
  const handleJoin = async () => {
    setLoading("join");
    try {
      await communityService.joinCommunity(community.id);
      if (onMembershipChange) {
        const updated =
          await communityService.getMembership(
            community.name
          );
        onMembershipChange(updated);
      }
    } finally {
      setLoading(null);
    }
  };

  // Handler for cancel join request
  const handleCancelJoin = async () => {
    setLoading("cancel");
    try {
      await communityService.cancelJoinRequest(
        community.id
      );
      if (onMembershipChange) {
        const updated =
          await communityService.getMembership(
            community.name
          );
        onMembershipChange(updated);
      }
    } finally {
      setLoading(null);
    }
  };

  // Handler for leaving community (with confirmation)
  const handleLeave = async () => {
    setShowLeaveConfirm(false);
    setLoading("leave");
    try {
      await communityService.leaveCommunity(community.id);
      if (onMembershipChange) {
        // After leaving, membership will be null
        onMembershipChange(null);
      }
    } finally {
      setLoading(null);
    }
  };

  // Membership control button
  let membershipControl: React.ReactNode = null;
  if (!membership) {
    membershipControl = (
      <Button
        variant="default"
        size="sm"
        onClick={handleJoin}
        disabled={loading === "join"}
      >
        <Plus className="mr-1 h-4 w-4" />
        Join
      </Button>
    );
  } else if (membership.status === "PENDING") {
    membershipControl = (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancelJoin}
        disabled={loading === "cancel"}
      >
        <X className="mr-1 h-4 w-4" />
        Cancel join request
      </Button>
    );
  } else if (membership.status === "ACTIVE") {
    if (
      membership.role === "MODERATOR" ||
      membership.role === "MEMBER"
    ) {
      membershipControl = (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLeaveConfirm(true)}
            disabled={loading === "leave"}
          >
            <LogOut className="mr-1 h-4 w-4" />
            Leave
          </Button>
          <ConfirmDialog
            open={showLeaveConfirm}
            title="Leave Community"
            description="Are you sure you want to leave this community?"
            confirmText="Leave"
            onConfirm={handleLeave}
            onOpenChange={setShowLeaveConfirm}
            isConfirming={loading === "leave"}
          />
        </>
      );
    }
  }

  const showCreatePost =
    membership && membership.status === "ACTIVE";

  return (
    <div className="bg-background mb-6 overflow-hidden rounded-lg shadow">
      {/* Banner */}
      <div className="bg-muted relative h-40 w-full rounded-lg">
        {community.bannerUrl && (
          <Image
            src={community.bannerUrl}
            alt={`${community.name} banner`}
            className="h-full w-full rounded-lg object-cover"
          />
        )}
        {/* Avatar overlay with z-index */}
        <div className="absolute -bottom-15 left-8 z-10">
          <div className="bg-muted border-background flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg">
            {community.avatarUrl ? (
              <Image
                src={community.avatarUrl}
                alt={community.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-3xl">
                {community.name && community.name.length > 0
                  ? community.name[0].toUpperCase()
                  : "?"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 ml-28 flex items-center gap-2 px-8 text-3xl font-bold">
        c/{community.name}
        {community.status === "PRIVATE" && (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-700 px-2 py-1 text-xs font-bold text-white">
            <Lock className="h-4 w-4" />
            Private
          </span>
        )}
        {/* Action buttons */}
        <div className="ml-auto flex gap-2">
          {membershipControl}
          {showCreatePost && (
            <Button variant="secondary" size="sm">
              <Pencil className="mr-1 h-4 w-4" />
              Create Post
            </Button>
          )}
        </div>
      </div>
      <div className="pb-10" />
    </div>
  );
}
