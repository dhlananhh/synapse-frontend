"use client";


import React, {
  useState,
  useEffect
} from "react";
import Link from "next/link";
import {
  useSearchParams,
  useRouter
} from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchCommunityResult } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { useAuth } from "@/context/AuthContext";
import { CommunityRow } from "@/components/features/community/CommunityRow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Telescope,
  Plus,
  ArrowLeft
} from "lucide-react";


export default function CommunitiesDirectoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [ communities, setCommunities ] = useState<SearchCommunityResult[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ searchTerm, setSearchTerm ] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        // Fetch danh sách communities, sắp xếp theo số lượng member để hiển thị "Top"
        const res = await communityService.searchCommunities(
          debouncedSearch,
          undefined,
          50,
          "members"
        );
        setCommunities(res.communities);
      } catch (error) {
        console.error("Failed to load communities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();

    // Cập nhật URL khi search thay đổi để người dùng có thể share link
    if (debouncedSearch) {
      router.replace(`/c?q=${debouncedSearch}`, { scroll: false });
    } else {
      router.replace(`/c`, { scroll: false });
    }

  }, [ debouncedSearch, router ]);


  return (
    <div className="w-full py-12 mx-auto">
      {/* Header Section */ }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Today's Top Communities
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse the most popular communities on Synapse.
          </p>
        </div>

        {
          user && (
            <Button asChild>
              <Link href="/c/create">
                <Plus className="h-4 w-4" />
                Create Community
              </Link>
            </Button>
          )
        }
      </div>

      {/* Filter / Search Bar */ }
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter communities..."
          className="pl-10 h-11 bg-background"
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
        />
      </div>

      {/* Content Section */ }
      <Card>
        {
          isLoading ? (
            // Skeleton Loading State
            <div className="p-4 space-y-4">
              {
                [ ...Array(8) ].map((_, i) => (
                  <div
                    key={ i }
                    className="flex items-center gap-4"
                  >
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))
              }
            </div>
          ) : communities.length > 0 ? (
            // Render List
            <div className="divide-y divide-border">
              {
                communities.map((community, index) => (
                  <CommunityRow
                    key={ community.id }
                    community={ community }
                    index={ index + 1 }
                  />
                ))
              }
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <Telescope className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">
                No communities found
              </h3>
              <p className="text-muted-foreground">
                We couldn't find any communities matching "{ searchTerm }".
              </p>
              {
                user && (
                  <Button
                    variant="link"
                    asChild
                    className="mt-2 text-primary"
                  >
                    <Link href="/c/create">
                      Create a new one instead?
                    </Link>
                  </Button>
                )
              }
            </div>
          )
        }
      </Card>
    </div>
  );
}
