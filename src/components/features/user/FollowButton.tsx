"use client";


import React, {
  useState,
  useEffect
} from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/modules/services/user-service";
import { UserProfile } from "@/types/services/user";
import { toast } from "sonner";


type FollowState = "FOLLOW" | "FOLLOWING" | "PENDING" | "NOT_LOGGED_IN" | "OWN_PROFILE";


interface FollowButtonProps {
  targetUser: UserProfile;
}


export function FollowButton({ targetUser }: FollowButtonProps) {
  const { user: currentUser, followingIds, isAuthenticated, updateFollowing } = useAuth();
  const [ followState, setFollowState ] = useState<FollowState>("FOLLOW");
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFollowState("NOT_LOGGED_IN");
    } else if (currentUser?.id === targetUser.id) {
      setFollowState("OWN_PROFILE");
    } else if (followingIds.has(targetUser.id)) {
      setFollowState("FOLLOWING");
    } else {
      setFollowState("FOLLOW");
    }
  }, [ followingIds, currentUser, targetUser, isAuthenticated ]);


  const handleFollow = async () => {
    setIsLoading(true);
    const previousState = followState;
    const isPrivate = targetUser.isPrivate;
    const newState = isPrivate ? "PENDING" : "FOLLOWING";
    setFollowState(newState);
    if (newState === "FOLLOWING") updateFollowing(targetUser.id, "follow");

    try {
      const result = await userService.followUser(targetUser.id);
      toast.success(
        result.message || (
          isPrivate
            ? "Follow request sent!"
            : `You are now following @${targetUser.username}`
        )
      );
    } catch (error: any) {
      toast.error("Failed to follow", {
        description: error.response?.data?.message
      });
      setFollowState(previousState);
      if (newState === "FOLLOWING")
        updateFollowing(targetUser.id, "unfollow");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    const previousState = followState;
    setFollowState("FOLLOW");
    updateFollowing(targetUser.id, "unfollow");

    try {
      await userService.unfollowUser(targetUser.id);
      toast.info(`You have unfollowed @${targetUser.username}`);
    } catch (error: any) {
      toast.error("Failed to unfollow", {
        description: error.response?.data?.message
      });
      setFollowState(previousState);
      updateFollowing(targetUser.id, "follow");
    } finally {
      setIsLoading(false);
    }
  };


  if (followState === "OWN_PROFILE") {
    return (
      <Button variant="outline">
        Edit Profile
      </Button>
    )
  }

  if (followState === "NOT_LOGGED_IN") {
    return (
      <Button>Follow</Button>
    )
  }

  switch (followState) {
    case "FOLLOWING":
      return (
        <Button
          variant="outline"
          onClick={ handleUnfollow }
          disabled={ isLoading }
        >
          Unfollow
        </Button>
      )

    case "PENDING":
      return (
        <Button
          variant="outline"
          disabled
        >
          Pending
        </Button>
      )

    case "FOLLOW":
    default:
      return (
        <Button
          onClick={ handleFollow }
          disabled={ isLoading }
        >
          Follow
        </Button>
      )
  }
}
