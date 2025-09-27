"use client";


import React, { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { RelationshipStatus, UserProfile } from "@/types/services/user";
import { userService } from "@/modules/services/user-service";

import { UpdateProfileDialog } from "./UpdateProfileDialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  UserCheck,
  Lock,
  UserPlus
} from "lucide-react";


interface UserProfileHeaderProps {
  user: UserProfile;
  onProfileUpdate: (updatedUser: UserProfile) => void;
  onRelationshipUpdate: (newStatus: RelationshipStatus) => void;
}


export function UserProfileHeader({
  user,
  onProfileUpdate,
  onRelationshipUpdate
}: UserProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === user.id;
  console.log("is own profile", isOwnProfile)

  const [ isProcessing, setIsProcessing ] = useState(false);

  const handleFollow = async () => {
    setIsProcessing(true);
    try {
      const response = await userService.followUser(user.id);
      onRelationshipUpdate({
        ...user.relationshipStatus!,
        isFollowing: response.status === "ACCEPTED",
        isRequested: response.status === "PENDING",
      });
      toast.success(response.message);
    } catch (error: any) {
      toast.error("Follow action failed.");
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleUnfollow = async () => {
    setIsProcessing(true);
    try {
      await userService.unfollowUser(user.id);
      onRelationshipUpdate({
        ...user.relationshipStatus!,
        isFollowing: false
      });
      toast.success(`You have unfollowed ${user.username}`);
    } catch (error: any) {
      toast.error("Unfollow action failed.");
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsProcessing(true);
    try {
      await userService.cancelFollowRequest(user.id);
      onRelationshipUpdate({
        ...user.relationshipStatus!,
        isRequested: false
      });
      toast.success("Follow request cancelled.");
    } catch (error: any) {
      toast.error("Action failed.");
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    setIsProcessing(true);
    try {
      await userService.acceptFollowRequest(user.id);

      onRelationshipUpdate({
        ...user.relationshipStatus!,
        requestsYou: false,
        followsYou: true,
      });

      toast.success(`You have accepted ${user.username}'s follow request.`);

    } catch (error: any) {
      toast.error("Failed to accept request.", {
        description: error.response?.data?.message || "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    setIsProcessing(true);
    try {
      await userService.rejectFollowRequest(user.id);

      onRelationshipUpdate({
        ...user.relationshipStatus!,
        requestsYou: false,
      });

      toast.success("Follow request rejected.");

    } catch (error: any) {
      toast.error("Failed to reject request.", {
        description: error.response?.data?.message || "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };


  const renderActionButton = () => {
    if (isOwnProfile) {
      return (
        <UpdateProfileDialog
          user={ user }
          onProfileUpdate={ onProfileUpdate }
        />
      )
    }

    if (!user.relationshipStatus) {
      return (
        <Button
          onClick={ () => window.location.href = '/login' }
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </Button>
      );
    }

    const { isFollowing, isRequested, followsYou, requestsYou } = user.relationshipStatus;

    if (requestsYou) {
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={ handleAcceptRequest }
            disabled={ isProcessing }
            size="sm"
          >
            Accept
          </Button>
          <Button
            onClick={ handleRejectRequest }
            disabled={ isProcessing }
            size="sm"
            variant="secondary"
          >
            Reject
          </Button>
        </div>
      );
    }

    if (isFollowing) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <Button
              variant="secondary"
              disabled={ isProcessing }
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Following
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-red-600"
              onClick={ handleUnfollow }
            >
              Unfollow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (isRequested) {
      return (
        <Button
          variant="secondary"
          onClick={ handleCancelRequest }
          disabled={ isProcessing }
        >
          Requested
        </Button>
      );
    }

    if (followsYou && !isFollowing) {
      return (
        <Button
          onClick={ handleFollow }
          disabled={ isProcessing }
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Follow Back
        </Button>
      );
    }

    return (
      <Button
        onClick={ handleFollow }
        disabled={ isProcessing }
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Follow
      </Button>
    );
  };


  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-card border rounded-lg">
      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary">
        <AvatarImage
          src={ user.avatarUrl || undefined }
          alt={ user.username }
        />
        <AvatarFallback>
          {
            user.username.charAt(0).toUpperCase()
          }
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <h1 className="text-3xl font-bold">
            {
              `${user.firstName} ${user.lastName}`
            }
          </h1>
          {
            user.isPrivate && <Lock className="w-5 h-5 text-muted-foreground" />
          }
        </div>
        <p className="text-muted-foreground">
          @{ user.username }
        </p>
        <div className="flex gap-4 my-3 justify-center md:justify-start">
          <span className="font-semibold">
            { user.followerCount } Followers
          </span>
          <span className="font-semibold">
            { user.followingCount } Following
          </span>
        </div>
        {
          user.bio && (
            <p className="mt-2 text-sm">
              { user.bio }
            </p>
          )
        }
        {
          user.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2 justify-center md:justify-start">
              <MapPin className="w-4 h-4" />
              { user.location }
            </div>
          )
        }
        <div className="shrink-0">
          { renderActionButton() }
        </div>
      </div>
    </div >
  );
}
