"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { useParams } from "next/navigation";
import { fetchCommunityMembers } from "@/libs/mock-api";
import { User } from "@/types";
import { mockCommunities } from "@/libs/mock-data";
import MemberCard from "@/components/features/community/MemberCard";
import MemberCardSkeleton from "@/components/features/community/MemberCardSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";


export default function MembersPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const community = mockCommunities.find(c => c.slug === slug);

  const [ members, setMembers ] = useState<(User & { role?: string })[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isLoadingMore, setIsLoadingMore ] = useState(false);
  const [ page, setPage ] = useState(1);
  const [ hasMore, setHasMore ] = useState(true);

  const loadMembers = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const { data: newMembers, hasMore: newHasMore } = await fetchCommunityMembers(slug, page);
      setMembers(prev => isInitial ? newMembers : [ ...prev, ...newMembers ]);
      setHasMore(newHasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      if (isInitial) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, [ page, slug ]);

  useEffect(() => {
    if (slug) {
      loadMembers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ slug ]);

  return (
    <div className="mt-5">
      <div className="mb-4">
        <Link
          href={ `/c/${slug}` }
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Back to c/{ slug }
        </Link>

        <h1 className="text-2xl font-bold mt-1">
          Community Members
        </h1>
      </div>

      {
        isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            { Array.from({ length: 12 }).map((_, i) => <MemberCardSkeleton key={ i } />) }
          </div>
        )
      }

      {
        !isLoading && members.length === 0 && (
          <EmptyState
            Icon={ Users }
            title="No Members Yet"
            description={ `Be the first one to join c/${slug} and start the conversation!` }
          />
        )
      }

      {
        !isLoading && members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              members.map(
                member => (
                  <MemberCard key={ member.id } member={ member } />
                )
              )
            }
          </div>
        )
      }

      {
        hasMore && !isLoading && (
          <div className="mt-6 text-center">
            <Button
              onClick={ () => loadMembers(false) }
              disabled={ isLoadingMore }
            >
              { isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
              Load More
            </Button>
          </div>
        )
      }
    </div>
  );
}
