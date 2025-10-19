"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import Link from "next/link";
import { toast } from "sonner";
import { SimpleProfile } from "@/types/services/user";
import { communityService } from "@/modules/services/community-service";
import { userService } from "@/modules/services/user-service";
import { useDebounce } from "@/hooks/useDebounce";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Loader2,
  UserX,
  Search
} from "lucide-react";


interface AllModeratorsDialogProps {
  communityId: string;
  communityName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}


function DialogModeratorItem({ user }: { user: SimpleProfile }) {
  return (
    <li className="border-b last:border-b-0">
      <Link
        href={ `/u/${user.username}` }
        className="flex items-center gap-4 p-3 group hover:bg-muted/50 transition-colors"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={ user.avatarUrl ?? "" }
            alt={ user.username }
          />
          <AvatarFallback>
            { user.username?.[ 0 ]?.toUpperCase() ?? "?" }
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold group-hover:underline">
            { `u/${user.username}` }
          </p>
        </div>
      </Link>
    </li>
  );
}


export function AllModeratorsDialog({
  communityId,
  communityName,
  isOpen,
  onOpenChange,
}: AllModeratorsDialogProps) {
  const [ moderators, setModerators ] = useState<SimpleProfile[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isLoadingMore, setIsLoadingMore ] = useState(false);
  const [ nextCursor, setNextCursor ] = useState<string | null>(null);
  const [ hasMore, setHasMore ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchModerators = useCallback(async (cursor?: string | null) => {
    const isNewSearch = !cursor;
    const loadingSetter = isNewSearch ? setIsLoading : setIsLoadingMore;
    loadingSetter(true);

    try {
      const res = await communityService.getMembers(communityId, {
        role: "MODERATOR",
        limit: 20,
        cursor: cursor,
        q: debouncedSearchTerm.trim(),
      });

      const members = res?.members ?? [];
      const userIds = members.map(m => m.userId).filter(Boolean);
      let profiles: SimpleProfile[] = [];

      if (userIds.length > 0) {
        profiles = await userService.getSimpleProfiles(userIds);
      }

      setModerators(prev => (isNewSearch ? profiles : [ ...prev, ...profiles ]));
      setHasMore(res.pagination?.hasMore ?? false);
      setNextCursor(res.pagination?.nextCursor ?? null);

    } catch (err) {
      toast.error("Failed to load the list of moderators.");
      console.error("Fetch Moderators Error:", err);
    } finally {
      loadingSetter(false);
    }
  }, [ communityId, debouncedSearchTerm ]);

  useEffect(() => {
    if (isOpen) {
      fetchModerators();
    } else {
      setSearchTerm("");
      setModerators([]);
      setIsLoading(true);
      setHasMore(false);
      setNextCursor(null);
    }
  }, [ isOpen, debouncedSearchTerm, fetchModerators ]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && nextCursor) {
      fetchModerators(nextCursor);
    }
  }

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <DialogContent className="sm:max-w-md flex flex-col h-[70vh] max-h-[500px]">
        <DialogHeader>
          <DialogTitle>
            Moderators of c/{ communityName }
          </DialogTitle>
          <DialogDescription>
            These are the members who help manage and maintain the community.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username..."
            className="pl-9"
            value={ searchTerm }
            onChange={ (e) => setSearchTerm(e.target.value) }
          />
        </div>

        <div className="flex-1 overflow-hidden">
          {
            isLoading ? (
              <div className="space-y-2 p-1">
                {
                  [ ...Array(6) ].map((_, i) =>
                    <div key={ i } className="flex items-center gap-4 p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  )
                }
              </div>
            ) : moderators.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <UserX className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold text-muted-foreground">
                  {
                    searchTerm
                      ? "No moderators found"
                      : "This community has no moderators yet."
                  }
                </p>
                {
                  searchTerm && (
                    <p className="text-sm text-muted-foreground">
                      Try a different search term.
                    </p>
                  )
                }
              </div>
            ) : (
              // List of moderators
              <ScrollArea className="h-full pr-4">
                <ul>
                  {
                    moderators.map((user) =>
                      <DialogModeratorItem
                        key={ user.id }
                        user={ user }
                      />
                    )
                  }
                </ul>
                {
                  hasMore && (
                    <div className="py-4 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={ handleLoadMore }
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
              </ScrollArea>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
