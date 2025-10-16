"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { MapPin, Lock } from "lucide-react";
import {
  FollowerRecord,
  FollowingRecord,
  UserProfile,
} from "@/types/services/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { userService } from "@/modules/services/user-service";
import { FollowerItem } from "./FollowerItem";
import { FollowingItem } from "./FollowingItem";
import { FollowerList } from "./FollowerList";
import { FollowingList } from "./FollowingList";
import { useAuth } from "@/context/AuthContext";
import {
  formatDistanceToNowStrict,
  parseISO,
} from "date-fns";

export function GeneralProfileCard({
  profile,
}: {
  profile: UserProfile;
}) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === profile.id;

  const [openType, setOpenType] = useState<
    "followers" | "following" | null
  >(null);
  const [list, setList] = useState<
    FollowerRecord[] | FollowingRecord[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!openType) return;
    setLoading(true);
    const fetchList = async () => {
      try {
        if (openType === "followers") {
          const res: FollowerRecord[] =
            await userService.getFollowers(profile.id);
          setList(res);
        } else {
          const res: FollowingRecord[] =
            await userService.getFollowing(profile.id);
          setList(res);
        }
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [openType, profile.id]);

  return (
    <>
      <Avatar className="border-primary h-24 w-24 border-4 md:h-32 md:w-32">
        <AvatarImage
          src={profile.avatarUrl || undefined}
          alt={profile.username}
        />
        <AvatarFallback>
          {profile.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <h1 className="text-3xl font-bold">{`${profile.firstName} ${profile.lastName}`}</h1>
          {profile.isPrivate && (
            <Lock className="text-muted-foreground h-5 w-5" />
          )}
        </div>
        <p className="text-muted-foreground">
          @{profile.username}
        </p>
        {/* Joined ... ago */}
        {profile.createdAt && (
          <p className="text-muted-foreground mt-1 text-xs">
            Joined{" "}
            {formatDistanceToNowStrict(
              parseISO(profile.createdAt),
              {
                addSuffix: true,
              }
            )}
          </p>
        )}
        <div className="my-3 flex justify-center gap-4 md:justify-start">
          {isOwnProfile || !profile.isPrivate ? (
            <>
              <button
                className="cursor-pointer border-none bg-transparent p-0 font-semibold underline"
                onClick={() => setOpenType("followers")}
              >
                {profile.followerCount} Followers
              </button>
              <button
                className="cursor-pointer border-none bg-transparent p-0 font-semibold underline"
                onClick={() => setOpenType("following")}
              >
                {profile.followingCount} Following
              </button>
            </>
          ) : (
            <>
              <span
                className="text-muted-foreground cursor-not-allowed font-semibold opacity-60 select-none"
                style={{ pointerEvents: "none" }}
              >
                {profile.followerCount} Followers
              </span>
              <span
                className="text-muted-foreground cursor-not-allowed font-semibold opacity-60 select-none"
                style={{ pointerEvents: "none" }}
              >
                {profile.followingCount} Following
              </span>
            </>
          )}
        </div>
        {profile.bio && (
          <p className="mt-2 text-sm">{profile.bio}</p>
        )}
        {profile.location && (
          <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-sm md:justify-start">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </div>
        )}
      </div>

      {/* Dialog for followers/following */}
      <Dialog
        open={!!openType}
        onOpenChange={() => setOpenType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {openType === "followers"
                ? "Followers"
                : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div>
            {openType === "followers" ? (
              <FollowerList userId={profile.id} />
            ) : (
              <FollowingList
                userId={profile.id}
                isOwnProfile={isOwnProfile}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
