"use client";


import React, {
  useEffect,
  useState
} from "react";
import { useParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import {
  FollowerResponse,
  FollowingResponse,
  UserProfile,
  RelationshipStatus
} from "@/types/services/user";
import { userService } from "@/modules/services/user-service";

import { UserProfileHeader } from "@/components/features/user/UserProfileHeader";
import { UserProfileTabs } from "@/components/features/user/UserProfileTabs";
import { PrivateProfileView } from './PrivateProfileView';
import UserProfileSkeleton from "@/components/features/user/UserProfileSkeleton";


export function UserProfileInterface() {
  const params = useParams();
  const {
    user: currentUser,
    isLoading: isAuthLoading
  } = useAuth();
  const userId = params.userId as string;

  const [ user, setUser ] = useState<UserProfile | null>(null);
  const [ loading, setLoading ] = useState(true);

  const [ followers, setFollowers ] = useState<FollowerResponse[]>([]);
  const [ following, setFollowing ] = useState<FollowingResponse[]>([]);

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
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
        } catch (error) {
          console.error(`Failed to fetch profile data for user ${userId}:`, error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [ userId ]);

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleRelationshipUpdate = (newStatus: RelationshipStatus | null) => {
    if (user) {
      setUser(prevProfile => {
        if (!prevProfile) return null;
        const newFollowerCount = newStatus?.isFollowing
          ? prevProfile.followerCount + 1
          : prevProfile.followerCount - 1;

        return {
          ...prevProfile,
          relationshipStatus: newStatus,
          followerCount: newFollowerCount < 0 ? 0 : newFollowerCount,
        };
      });
    }
  }

  if (isAuthLoading || loading) {
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

  const isOwnProfile = currentUser?.id === userId;
  console.log("current user id: ", currentUser?.id)
  console.log("user.id: ", user.id)
  console.log("userId: ", userId)
  const isFollowing = user.relationshipStatus?.isFollowing ?? false;
  const isPending = user.relationshipStatus?.isRequested ?? false;
  const canViewProfile = !user.isPrivate || isOwnProfile || isFollowing;

  if (canViewProfile) {
    return (
      <div className="container mx-auto max-w-4xl py-8 space-y-8">
        <UserProfileHeader
          user={ user }
          onProfileUpdate={ handleProfileUpdate }
          onRelationshipUpdate={ handleRelationshipUpdate }
        />

        <UserProfileTabs
          userId={ user.id }
          followers={ followers }
          following={ following }
        />
      </div>
    );
  }

  return (
    <PrivateProfileView
      user={ user }
      isFollowing={ isFollowing }
      isPending={ isPending }
    />
  );
}
