"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { toast } from "sonner";
import { CommunityMember } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { MemberCard } from "./MemberCard";
import { Loader2, UserRoundPlus } from "lucide-react";


interface PendingMembersTabProps {
  communityId: string;
  currentUserRole?: "OWNER" | "MODERATOR" | "MEMBER";
}


export function PendingMembersTab({ communityId, currentUserRole }: PendingMembersTabProps) {
  const [ requests, setRequests ] = useState<CommunityMember[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

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

  const handleAction = async (
    userId: string,
    username: string,
    action: "approve" | "reject"
  ) => {
    const originalRequests = [ ...requests ];

    setRequests(prev => prev.filter(req => req.userId !== userId));

    try {
      if (action === "approve") {
        await communityService.approveJoinRequest(communityId, userId);
        toast.success(`Approved ${username}"s request to join.`);
      } else {
        await communityService.rejectJoinRequest(communityId, userId);
        toast.success(`Rejected ${username}'s request successfully!`);
      }
    } catch (error: any) {
      toast.error(`Failed to ${action} request.`, {
        description: error.response?.data?.message || "Please try again.",
      });
      setRequests(originalRequests);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-8">
        <UserRoundPlus className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          All Caught Up!
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no pending requests to join this community.
        </p>
      </div>
    );
  }

  return (
    <div>
      {
        requests.map(request => (
          <MemberCard
            key={ request.id }
            member={ request }
            currentUserRole={ currentUserRole }
            onApprove={ (userId, username) => handleAction(userId, username, "approve") }
            onReject={ (userId, username) => handleAction(userId, username, "reject") }
          />
        ))
      }
    </div>
  );
}
