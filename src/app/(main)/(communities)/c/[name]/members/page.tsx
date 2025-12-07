"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

// Types & Services
import { Community, CommunityMember } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";

// Icons
import {
  Search,
  Loader2,
  Shield,
  Crown
} from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";


function MemberItem({ member }: { member: CommunityMember }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <Link
        href={ `/u/${member.username}` }
        className="flex items-center gap-3 group"
      >
        <Avatar className="h-10 w-10 border">
          <AvatarImage
            src={ member.avatarUrl ?? "" }
            alt={ member.username }
          />
          <AvatarFallback>
            { member.username.charAt(0).toUpperCase() }
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm group-hover:underline flex items-center gap-1">
            {
              member.username }
            {
              member.role === "OWNER"
              && <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            }
            {
              member.role === "MODERATOR"
              && <Shield className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
            }
          </span>
          <span className="text-xs text-muted-foreground">
            Joined { member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "N/A" }
          </span>
        </div>
      </Link>

      <div>
        {
          member.role === "OWNER"
          && <Badge variant="secondary" className="text-xs">Owner</Badge>
        }
        {
          member.role === "MODERATOR"
          && <Badge variant="secondary" className="text-xs">Mod</Badge>
        }
      </div>
    </div>
  );
}


interface PageProps {
  params: Promise<{ name: string }>;
}


export default function CommunityMembersPage({ params }: PageProps) {
  const { name } = React.use(params);
  const communityName = decodeURIComponent(name);

  const [ community, setCommunity ] = useState<Community | null>(null);
  const [ members, setMembers ] = useState<CommunityMember[]>([]);
  const [ searchTerm, setSearchTerm ] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [ isLoadingPage, setIsLoadingPage ] = useState(true);
  const [ isLoadingMembers, setIsLoadingMembers ] = useState(false);
  const [ nextCursor, setNextCursor ] = useState<string | null>(null);
  const [ hasMore, setHasMore ] = useState(false);

  useEffect(() => {
    async function init() {
      setIsLoadingPage(true);
      try {
        const comRes = await communityService.getCommunityByName(communityName);
        if (comRes) {
          setCommunity(comRes);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch community:", error);
        notFound();
      } finally {
        setIsLoadingPage(false);
      }
    }
    init();
  }, [ communityName ]);


  const fetchMembers = useCallback(async (isNewSearch: boolean = false) => {
    if (!community?.id) return;

    const cursorToUse = isNewSearch ? null : nextCursor;
    setIsLoadingMembers(true);

    try {
      const res = await communityService.getMembers(community.id, {
        q: debouncedSearchTerm,
        limit: 20,
        cursor: cursorToUse
      });

      const newMembers = res.members || [];

      setMembers(prev => isNewSearch ? newMembers : [ ...prev, ...newMembers ]);

      setHasMore(res.pagination?.hasMore ?? false);
      setNextCursor(res.pagination?.nextCursor ?? null);

    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("This community's member list is private.");
      } else {
        toast.error("Failed to load members.");
      }
    } finally {
      setIsLoadingMembers(false);
    }
  }, [
    community?.id,
    debouncedSearchTerm,
    nextCursor
  ]);


  useEffect(() => {
    if (community?.id) {
      fetchMembers(true);
    }
  }, [
    community?.id,
    debouncedSearchTerm,
    fetchMembers
  ]);


  if (isLoadingPage) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full md:w-72" />
        </div>
        <Separator />
        <div className="grid gap-3 md:grid-cols-2">
          {
            [ ...Array(8) ]
              .map((_, i) =>
                <Skeleton
                  key={ i }
                  className="h-16 w-full rounded-lg"
                />
              )
          }
        </div>
      </div>
    );
  }

  if (!community) return null;

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Members
          </h1>
          <p className="text-muted-foreground mt-1">
            Showing all { community.memberCount.toLocaleString() } members of c/{ community.name }
          </p>
        </div>

        {/* Search Bar */ }
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Find a member..."
            className="pl-9 bg-background"
            value={ searchTerm }
            onChange={ (e) => setSearchTerm(e.target.value) }
          />
        </div>
      </div>

      <Separator />

      <div>
        {
          members.length === 0 && !isLoadingMembers ? (
            // Empty State
            <div className="text-center py-20 text-muted-foreground">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 opacity-50" />
              </div>
              <h3 className="font-semibold text-lg">No members found</h3>
              <p>
                {
                  searchTerm
                    ? `We couldn't find anyone matching "${searchTerm}"`
                    : "This community seems to be empty."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {
                  members.map((member) => (
                    <MemberItem
                      key={ `${member.userId}-${member.role}` }
                      member={ member }
                    />
                  ))
                }
              </div>

              {
                isLoadingMembers && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )
              }

              {
                !isLoadingMembers && hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="ghost"
                      onClick={ () => fetchMembers(false) }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Load More
                    </Button>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  );
}
