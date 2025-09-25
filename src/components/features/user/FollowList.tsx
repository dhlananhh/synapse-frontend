"use client";


import React, {
  useEffect,
  useState
} from "react";
import { userService } from "@/modules/services/user-service";
import {
  FollowerResponse,
  FollowingResponse
} from "@/types/services/user";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { FollowCard } from "./FollowCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";


interface FollowListProps {
  userId: string;
  type: "followers" | "following";
}


export function FollowList({ userId, type }: FollowListProps) {
  const [ list, setList ] = useState<(FollowerResponse | FollowingResponse)[]>([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const data = type === "followers"
          ? await userService.getFollowers(userId)
          : await userService.getFollowing(userId);
        setList(data);
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [ userId, type ]);

  if (loading) {
    return (
      <FollowListSkeleton />
    )
  }

  if (list.length === 0) {
    return (
      <EmptyState
        type={ type }
      />
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          {
            list.map((item) => {
              const user = "follower" in item ? item.follower : item.following;
              return (
                <FollowCard
                  key={ user.id }
                  user={ user }
                />
              )
            })
          }
        </div>
      </CardContent>
    </Card>
  );
}


const FollowListSkeleton = () => (
  <div className="space-y-4 p-4">
    {
      [ ...Array(3) ].map((_, i) => (
        <div
          key={ i }
          className="flex items-center space-x-4"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))
    }
  </div>
);


const EmptyState = ({ type }: { type: string }) => (
  <div className="text-center p-10 bg-secondary rounded-md">
    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-semibold">
      No { type } yet
    </h3>
    <p className="mt-2 text-sm text-muted-foreground">
      {
        type === "followers"
          ? "This user doesn't have any followers at the moment."
          : "This user isn't following anyone at the moment."
      }
    </p>
  </div>
);
