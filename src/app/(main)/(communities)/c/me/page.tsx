"use client";


import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { communityService } from "@/modules/services/community-service";
import { MyCommunity } from "@/types/services/community";
import { MyCommunityRow } from "@/components/features/community/me/MyCommunityRow";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { List } from "lucide-react";


export default function MyCommunitiesPage() {
  const [ allCommunities, setAllCommunities ] = useState<MyCommunity[]>([]);
  const [ filteredCommunities, setFilteredCommunities ] = useState<MyCommunity[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ searchTerm, setSearchTerm ] = useState("");

  useEffect(() => {
    const fetchMyCommunities = async () => {
      setIsLoading(true);
      try {
        const communities = await communityService.getMyCommunities({ statuses: [ "ACTIVE" ] });
        setAllCommunities(communities);
        setFilteredCommunities(communities);
      } catch (error) {
        toast.error("Failed to load your communities.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyCommunities();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allCommunities.filter(community =>
      community.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredCommunities(filtered);
  }, [ searchTerm, allCommunities ]);

  const handleLeaveCommunity = (communityId: string) => {
    setAllCommunities(prev => prev.filter(c => c.communityId !== communityId));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">
        My Communities
      </h1>
      <p className="text-muted-foreground mb-6">
        A list of all communities you are a member of.
      </p>

      <div className="mb-6">
        <Input
          placeholder="Filter your communities..."
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        {
          isLoading ? (
            <div className="p-4 space-y-4">
              {
                [ ...Array(5) ].map(
                  (_, i) => (
                    <Skeleton
                      key={ i }
                      className="h-16 w-full"
                    />
                  )
                )
              }
            </div>
          ) : filteredCommunities.length > 0 ? (
            <div>
              {
                filteredCommunities.map(community => (
                  <MyCommunityRow
                    key={ community.communityId }
                    community={ community }
                    onLeave={ handleLeaveCommunity }
                  />
                ))
              }
            </div>
          ) : (
            <div className="p-12 text-center">
              <List className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">
                {
                  searchTerm
                    ? "No communities found"
                    : "You haven't joined any communities yet."
                }
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {
                  searchTerm
                    ? "Try a different filter term."
                    : "Explore and join communities to get started!"
                }
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
}
