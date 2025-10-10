"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Community } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Users, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopCommunitiesWidget() {
  const { user } = useAuth();
  const [topCommunities, setTopCommunities] = useState<
    Community[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopCommunities = async () => {
      setIsLoading(true);
      try {
        const response =
          await communityService.getCommunities();
        setTopCommunities(response.communities);
      } catch (error) {
        console.error(
          "Failed to fetch top communities:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCommunities();
  }, []);

  const renderSkeleton = () => (
    <ul className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <li key={i} className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="text-primary h-6 w-6" />
          <CardTitle>Top Communities</CardTitle>
        </div>
        <CardDescription>
          Discover the most popular communities on Synapse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <ul className="space-y-4">
            {topCommunities.map((community, index) => (
              <li key={community.id}>
                <Link
                  href={`/c/${community.name}`}
                  className="group flex items-center gap-3"
                >
                  <span className="text-muted-foreground w-6 text-center text-lg font-bold">
                    {index + 1}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={community.avatarUrl || ""}
                    />
                    <AvatarFallback>
                      {community.name
                        .slice(0, 1)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-semibold group-hover:underline">
                      c/{community.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {community.memberCount.toLocaleString()}{" "}
                      members
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button
            className="w-full"
            variant="outline"
            asChild
          >
            <Link href={`/c`}>View All</Link>
          </Button>

          {user && (
            <Button className="w-full" asChild>
              <Link href={`/c/create`}>
                <PlusCircle className="h-4 w-4" />
                Create your own community
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
