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
import { MemberCard } from "./MemberCard";
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


export function CurrentMembersTab({ communityId, currentUserRole }: CurrentMembersTabProps) {
  // State for the list of members
  const [ members, setMembers ] = useState<CommunityMember[]>([]);

  // State for search functionality
  const [ searchTerm, setSearchTerm ] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // State for loading and pagination
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isLoadingMore, setIsLoadingMore ] = useState(false);
  const [ nextCursor, setNextCursor ] = useState<string | null>(null);
  const [ hasMore, setHasMore ] = useState(false);

  // Memoized function to fetch members from the API
  const fetchMembers = useCallback(async (isNewSearch: boolean) => {
    const cursor = isNewSearch ? null : nextCursor;
    const loadingSetter = isNewSearch ? setIsLoading : setIsLoadingMore;
    loadingSetter(true);

    try {
      const response = await communityService.getMembers(communityId, {
        q: debouncedSearchTerm,
        cursor: cursor
      });
      const newMembers = response.members || [];

      setMembers(prev => isNewSearch ? newMembers : [ ...prev, ...newMembers ]);
      setHasMore(response.pagination?.hasMore ?? false);
      setNextCursor(response.pagination?.nextCursor ?? null);
    } catch (error) {
      toast.error("Failed to load community members.");
    } finally {
      loadingSetter(false);
    }
  }, [ communityId, debouncedSearchTerm, nextCursor ]);

  // Effect to trigger a new search when the debounced term changes
  useEffect(() => {
    // Adding a small extra delay to make the UI feel smoother
    const timer = setTimeout(() => {
      fetchMembers(true);
    }, 100);
    return () => clearTimeout(timer);
  }); // fetchMembers is not needed here

  const handleAction = async (
    userId: string,
    username: string,
    action: "ban" | "remove" | "promote" | "demote"
  ) => {
    const originalMembers = [ ...members ];
    let actionToastId: string | number | undefined;

    try {
      actionToastId = toast.loading(`Performing action: ${action}...`);

      if (action === "ban" || action === "remove") {
        setMembers(prev => prev.filter(m => m.userId !== userId));
      } else if (action === "promote") {
        setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: "MODERATOR" } : m));
      } else if (action === "demote") {
        setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: "MEMBER" } : m));
      }

      // API Call
      switch (action) {
        case "ban":
          await communityService.banMember(communityId, userId);
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

      toast.success(`Successfully performed action "${action}" on @${username}.`, { id: actionToastId });

    } catch (error: any) {
      // Rollback on error
      setMembers(originalMembers);
      toast.error(`Failed to ${action} @${username}.`, {
        description: error.response?.data?.message || "Please try again.",
        id: actionToastId
      });
    }
  };

  // --- RENDER LOGIC ---

  const renderContent = () => {
    if (isLoading && members.length === 0) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin" />
        </div>
      )
    }

    if (members.length === 0) {
      return (
        <div className="text-center p-8">
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
          members.map(member => (
            <MemberCard
              key={ member.id }
              member={ member }
              currentUserRole={ currentUserRole }
              onBan={ (userId, username) => handleAction(userId, username, "ban") }
              onRemove={ (userId, username) => handleAction(userId, username, "remove") }
              onPromote={ (userId, username) => handleAction(userId, username, "promote") }
              onDemote={ (userId, username) => handleAction(userId, username, "demote") }
            />
          ))
        }
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */ }
      <div className="p-3 border-b relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by username..."
          className="pl-8"
          value={ searchTerm }
          onChange={ e => setSearchTerm(e.target.value) }
        />
      </div>

      { renderContent() }

      {/* Load More Button */ }
      {
        hasMore && (
          <div className="p-4 flex justify-center border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={ () => fetchMembers(false) }
              disabled={ isLoadingMore }
            >
              {
                isLoadingMore && <Loader2 className="animate-spin h-4 w-4 mr-2" />
              }
              Load More
            </Button>
          </div>
        )
      }
    </div>
  );
}
