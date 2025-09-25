"use client";


import React, { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/services/user";
import { userService } from "@/modules/services/user-service";

import { UpdateProfileDialog } from "./UpdateProfileDialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  UserCheck,
  Lock
} from "lucide-react";


interface UserProfileHeaderProps {
  user: UserProfile;
  counts: {
    followers: number;
    following: number;
  };
  onProfileUpdate: (updatedUser: UserProfile) => void;
}


export function UserProfileHeader({
  user,
  counts,
  onProfileUpdate
}: UserProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === user.id;

  const [ isFollowing, setIsFollowing ] = useState(false);

  const handleFollow = async () => {
    try {
      await userService.followUser(user.id);
      setIsFollowing(true);
      toast.success(`You are now following ${user.username}`);
    } catch (error: any) {
      toast.error("Failed to follow user.", {
        description: error.response?.data?.message
      });
    }
  };

  const handleTogglePrivacy = async (isPrivate: boolean) => {
    try {
      await userService.togglePrivacy(user.id);
      toast.success(`Your profile is now ${isPrivate ? "private" : "public"}.`);
    } catch (error: any) {
      toast.error("Failed to update privacy settings.", {
        description: error.response?.data?.message,
        duration: 2000,
      });
    }
  }

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
            { counts.followers } Followers
          </span>
          <span className="font-semibold">
            { counts.following } Following
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
        {/*
        {
          isOwnProfile && (
            <div className="flex items-center space-x-2 mt-4 justify-center md:justify-start">
              <Switch
                id="privacy-mode"
                onCheckedChange={ handleTogglePrivacy }
                defaultChecked={ user.isPrivate }
              />
              <Label htmlFor="privacy-mode">
                Private Account
              </Label>
            </div>
          )
        }
        */}
      </div>
      {
        isOwnProfile ? (
          <UpdateProfileDialog
            user={ user }
            onProfileUpdate={ onProfileUpdate }
          />
        ) : (
          <Button
            onClick={ handleFollow }
            variant={ isFollowing ? "secondary" : "default" }
          >
            <UserCheck className="mr-2 h-4 w-4" />
            { isFollowing ? "Following" : "Follow" }
          </Button>
        )
      }
    </div >
  );
}
