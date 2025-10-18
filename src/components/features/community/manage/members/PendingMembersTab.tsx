"use client";


import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { CommunityMember } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { MemberCard } from "@/components/features/community/manage/members/MemberCard";
import { ActionConfirmDialog } from "@/components/features/community/manage/members/ActionConfirmDialog";
import {
  Loader2,
  UserRoundPlus
} from "lucide-react";


interface PendingMembersTabProps {
  communityId: string;
  currentUserRole?: "OWNER" | "MODERATOR" | "MEMBER";
}

interface ActionState {
  type: "approve" | "reject";
  userId: string;
  username: string;
}


export function PendingMembersTab({
  communityId,
  currentUserRole,
}: PendingMembersTabProps) {
  const [ requests, setRequests ] = useState<
    CommunityMember[]
  >([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ actionState, setActionState ] = useState<ActionState | null>(null);
  const [ isConfirming, setIsConfirming ] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await communityService.getPendingRequests(communityId);
      setRequests(response.requests);
    } catch (error) {
      toast.error("Failed to load pending requests.");
      console.error("Fetch Pending Requests Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [ communityId ]);

  useEffect(() => {
    fetchRequests();
  }, [ fetchRequests ]);

  const handleTriggerAction = (
    userId: string,
    username: string,
    action: "approve" | "reject"
  ) => {
    if (action === "approve") {
      performAction(userId, username, action);
    } else {
      setActionState({ type: action, userId, username });
    }
  };

  const performAction = async (
    userId: string,
    username: string,
    action: ActionState[ "type" ],
    reason?: string
  ) => {
    setIsConfirming(true);
    const originalRequests = [ ...requests ];
    const actionToastId = toast.loading(`Processing request...`);

    setRequests((prev) => prev.filter((req) => req.userId !== userId));

    try {
      if (action === "approve") {
        await communityService.approveJoinRequest(communityId, userId);
        toast.success(
          `The join request from @${username} has been successfully approved!`,
          { id: actionToastId }
        );
      } else {
        await communityService.rejectJoinRequest(communityId, userId, { reason });
        toast.success(
          `The join request from @${username} has been successfully rejected!`,
          { id: actionToastId }
        );
      }
    } catch (error: any) {
      setRequests(originalRequests);
      toast.error(`Failed to ${action} request.`, {
        description: error.response?.data?.message,
        id: actionToastId
      });
    } finally {
      setIsConfirming(false);
      setActionState(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center">
        <UserRoundPlus className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">
          All Caught Up!
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          There are no pending requests to join this community.
        </p>
      </div>
    );
  }


  return (
    <div>
      {
        requests.map((request) => (
          <MemberCard
            key={ request.id }
            member={ request }
            currentUserRole={ currentUserRole }
            onApprove={ (userId, username) => handleTriggerAction(userId, username, "approve") }
            onReject={ (userId, username) => handleTriggerAction(userId, username, "reject") }
          />
        ))
      }

      <ActionConfirmDialog
        isOpen={ actionState?.type === "reject" }
        onOpenChange={ () => setActionState(null) }
        title={ `Reject join request from @${actionState?.username}?` }
        description="You can provide an optional reason. The user will not be notified."
        actionLabel="Confirm Reject"
        isConfirming={ isConfirming }
        withReason={ {
          label: "Reason (optional)",
          placeholder: "e.g., Account seems suspicious..."
        } }
        onConfirm={
          (reason) =>
            performAction(
              actionState!.userId,
              actionState!.username,
              "reject",
              reason
            )
        }
      />
    </div>
  );
}
