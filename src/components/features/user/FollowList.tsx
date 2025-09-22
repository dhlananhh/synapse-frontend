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
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


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
        console.error(`Failed to fetch ${type}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [ userId, type ]);

  if (loading)
    return (
      <div>Loading...</div>
    )

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {
            list.map(
              (item) => {
                const user = "follower" in item ? item.follower : item.following;
                return (
                  <div
                    key={ user.id }
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={ user.avatarUrl || undefined }
                        />
                        <AvatarFallback>
                          { user.username.charAt(0).toUpperCase() }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {
                            `${user.firstName} ${user.lastName}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{ user.username }
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                    >
                      View
                    </Button>
                  </div>
                )
              }
            )
          }
          {
            list.length === 0 && (
              <p className="text-center text-muted-foreground">
                No { type } found.
              </p>
            )
          }
        </div>
      </CardContent>
    </Card>
  );
}
