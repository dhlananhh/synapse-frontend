"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { CommunityMember } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { MemberCard } from "./MemberCard";


interface PendingMembersTabProps { communityId: string; }


export function PendingMembersTab({ communityId }: PendingMembersTabProps) {
  const [ requests, setRequests ] = useState<CommunityMember[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await communityService.getPendingRequests(communityId);
      setRequests(response.requests);
    } catch (error) {
      toast.error("Failed to load pending requests.");
    } finally {
      setIsLoading(false);
    }
  }, [ communityId ]);

  useEffect(() => {
    fetchRequests();
  }, [ fetchRequests ]);

  const handleAction = async (
    userId: string,
    action: "approve" | "reject"
  ) => {
    const originalRequests = [ ...requests ];
    setRequests(prev => prev.filter(r => r.userId !== userId));

    try {
      if (action === "approve") {
        await communityService.approveJoinRequest(communityId, userId);
        toast.success("Member approved.");
      } else {
        await communityService.rejectJoinRequest(communityId, userId);
        toast.success("Request rejected.");
      }
    } catch (error) {
      toast.error(`Failed to ${action} request.`);
      setRequests(originalRequests);
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <div>
      {
        requests.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground p-8">
            No pending join requests.
          </p>
        ) : (
          requests.map(req => (
            <MemberCard
              key={ req.id }
              member={ req }
              type="pending"
              onApprove={ (userId) => handleAction(userId, "approve") }
              onReject={ (userId) => handleAction(userId, "reject") }
            />
          ))
        )
      }
    </div>
  );
}
