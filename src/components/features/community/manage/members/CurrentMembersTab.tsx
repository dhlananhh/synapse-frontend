"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { CommunityMember } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { MemberCard } from "@/components/features/community/manage/members/MemberCard";
import { ActionConfirmDialog } from "@/components/features/community/manage/members/ActionConfirmDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Search
} from "lucide-react";


interface CurrentMembersTabProps {
  communityId: string;
  currentUserRole?: "OWNER" | "MODERATOR" | "MEMBER";
}


interface ActionState {
  type: "ban" | "remove" | "promote" | "demote";
  userId: string;
  username: string;
}


export function CurrentMembersTab({
  communityId,
  currentUserRole,
}: CurrentMembersTabProps) {
  const [ members, setMembers ] = useState<CommunityMember[]>([]);

  const [ searchTerm, setSearchTerm ] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const [ isLoading, setIsLoading ] = useState(true);
  const [ isLoadingMore, setIsLoadingMore ] = useState(false);
  const [ nextCursor, setNextCursor ] = useState<string | null>(null);
  const [ hasMore, setHasMore ] = useState(false);

  const [ actionState, setActionState ] = useState<ActionState | null>(null);
  const [ isConfirming, setIsConfirming ] = useState(false);

  const fetchMembers = useCallback(async (isNewSearch: boolean) => {
    const cursor = isNewSearch ? null : nextCursor;
    const loadingSetter = isNewSearch ? setIsLoading : setIsLoadingMore;
    loadingSetter(true);

    try {
      const response = await communityService.getMembers(communityId, {
        q: debouncedSearchTerm,
        cursor: cursor,
      });
      const newMembers = response.members || [];

      setMembers((prev) => isNewSearch ? newMembers : [ ...prev, ...newMembers ]);
      setHasMore(response.pagination?.hasMore ?? false);
      setNextCursor(response.pagination?.nextCursor ?? null);

    } catch (error) {
      toast.error("Failed to load community members.");
    } finally {
      loadingSetter(false);
    }
  }, [ communityId, debouncedSearchTerm, nextCursor ]);

  useEffect(() => {
    fetchMembers(true);
  }, [ debouncedSearchTerm, fetchMembers ]);

  const handleTriggerAction = (
    userId: string,
    username: string,
    action: ActionState[ "type" ]
  ) => {
    setActionState({ type: action, userId, username });
  };

  const performAction = async (reason?: string) => {
    if (!actionState) return;

    const { userId, username, type: action } = actionState;

    setIsConfirming(true);
    const originalMembers = [ ...members ];
    const actionToastId = toast.loading(`Processing action: ${action}...`);

    try {
      if (action === "ban" || action === "remove") {
        setMembers(prev => prev.filter((m) => m.userId !== userId));
      } else if (action === "promote") {
        setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: "MODERATOR" } : m));
      } else if (action === "demote") {
        setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: "MEMBER" } : m));
      }

      switch (action) {
        case "ban":
          await communityService.banMember(communityId, userId, reason);
          break;
        case "remove":
          await communityService.removeMember(communityId, userId);
          break;
        case "promote":
          await communityService.updateMemberRole(communityId, userId, "MODERATOR");
          break;
        case "demote":
          await communityService.updateMemberRole(communityId, userId, "MEMBER");
          break;
      }

      toast.success(`Successfully performed "${action}" on @${username}.`, { id: actionToastId });
    } catch (error: any) {
      setMembers(originalMembers);
      toast.error(`Failed to ${action} @${username}.`,
        {
          description: error.response?.data?.message || "Please try again.",
          id: actionToastId
        }
      );
    } finally {
      setIsConfirming(false);
      setActionState(null);
    }
  };

  const renderContent = () => {
    if (isLoading && members.length === 0) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      );
    };

    if (members.length === 0) {
      return (
        <div className="p-8 text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">
            No members found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {
              searchTerm
                ? "Try a different search term."
                : "This community has no other members yet."
            }
          </p>
        </div>
      );
    }

    return (
      <div>
        {
          members.map((member) => (
            <MemberCard
              key={ member.id }
              member={ member }
              currentUserRole={ currentUserRole }
              onBan={ (userId, username) => handleTriggerAction(userId, username, "ban") }
              onRemove={ (userId, username) => handleTriggerAction(userId, username, "remove") }
              onPromote={ (userId, username) => handleTriggerAction(userId, username, "promote") }
              onDemote={ (userId, username) => handleTriggerAction(userId, username, "demote") }
            />
          ))
        }
      </div>
    );
  };

  return (
    <div>
      <div className="relative border-b p-3">
        <Search className="absolute top-1/2 left-6 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by username..."
          className="pl-8"
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
        />
      </div>

      { renderContent() }

      {
        hasMore && (
          <div className="flex justify-center border-t p-4">
            <Button
              size="sm"
              variant="outline"
              onClick={ () => fetchMembers(false) }
              disabled={ isLoadingMore }
            >
              {
                isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              }
              Load More
            </Button>
          </div>
        )
      }


      <ActionConfirmDialog
        isOpen={ !!actionState }
        onOpenChange={ () => setActionState(null) }
        title={ `Are you sure you want to ${actionState?.type} @${actionState?.username}?` }
        description={
          actionState?.type === "ban" ? "This user will be permanently banned and removed from the community." :
            actionState?.type === "remove" ? "This user will be removed from the community. They can rejoin later." :
              `You are about to change the role for this user.`
        }
        actionLabel={ `Confirm ${actionState?.type}` }
        isConfirming={ isConfirming }
        withReason={
          (actionState?.type === "ban" || actionState?.type === "remove") ? {
            label: `Reason for ${actionState.type} (optional)`,
            placeholder: "e.g., Violating Rule #1: Be Respectful"
          } : undefined
        }
        onConfirm={ performAction }
      />
    </div>
  );
}
