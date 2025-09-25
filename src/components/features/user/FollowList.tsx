"use client";


import React, {
  useEffect,
  useState
} from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/modules/services/user-service";
import {
  FollowerResponse,
  FollowingResponse
} from "@/types/services/user";

import { FollowCard } from "@/components/features/user/FollowCard";
import FollowListSkeleton from "@/components/features/user/FollowListSkeleton";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";

import {
  Users,
  Lock
} from "lucide-react";


interface FollowListProps {
  userId: string;
  type: "followers" | "following";
}


export function FollowList({ userId, type }: FollowListProps) {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const [ list, setList ] = useState<(FollowerResponse | FollowingResponse)[]>([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      if (!isAuthLoading && currentUser) {
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
      } else if (!isAuthLoading && !currentUser) {
        setLoading(false);
      }
    };

    fetchList();
  }, [ userId, type, currentUser, isAuthLoading ]);


  if (isAuthLoading || loading) {
    return (
      <FollowListSkeleton />
    )
  }

  if (!currentUser) {
    return (
      <LoginRequiredState
        type={ type }
      />
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


const LoginRequiredState = ({ type }: { type: string }) => (
  <div className="text-center p-10 bg-secondary rounded-md">
    <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-semibold">
      Login to see { type }
    </h3>
    <p className="mt-2 text-sm text-muted-foreground">
      You need to be logged in to view this list.
    </p>
    <Button asChild className="mt-4">
      <Link href="/login">Log In</Link>
    </Button>
  </div>
);
