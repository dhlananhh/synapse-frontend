"use client";


import React, {
  useEffect,
  useState
} from "react";
import { useParams } from "next/navigation";

import {
  FollowerResponse,
  FollowingResponse,
  UserProfile
} from "@/types/services/user";
import { userService } from "@/modules/services/user-service";

import { UserProfileHeader } from "@/components/features/user/UserProfileHeader";
import { UserProfileTabs } from "@/components/features/user/UserProfileTabs";
import UserProfileSkeleton from "@/components/features/user/UserProfileSkeleton";


interface Counts {
  followers: number;
  following: number;
}


export function UserProfileInterface() {
  const params = useParams();
  const userId = params.userId as string;

  const [ user, setUser ] = useState<UserProfile | null>(null);
  const [ loading, setLoading ] = useState(true);

  const [ followers, setFollowers ] = useState<FollowerResponse[]>([]);
  const [ following, setFollowing ] = useState<FollowingResponse[]>([]);
  const [ counts, setCounts ] = useState<Counts>({ followers: 0, following: 0 });

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);

          const [ userData, followersData, followingData ] = await Promise.all([
            userService.getUserProfile(userId),
            userService.getFollowers(userId),
            userService.getFollowing(userId)
          ]);

          setUser(userData);
          setFollowers(followersData);
          setFollowing(followingData);
          setCounts({
            followers: followersData.length,
            following: followingData.length
          });
        } catch (error) {
          console.error(`Failed to fetch profile data for user ${userId}:`, error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [ userId ]);

  if (loading) {
    return (
      <UserProfileSkeleton />
    )
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">
          User not found.
        </h2>
        <p className="text-muted-foreground">
          The user you are looking for does not exist or the profile could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <UserProfileHeader
        user={ user }
        counts={ counts }
      />
      <UserProfileTabs
        userId={ user.id }
        followers={ followers }
        following={ following }
      />
    </div>
  );
}
