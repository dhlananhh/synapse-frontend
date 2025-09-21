"use client";


import React, {
  useEffect,
  useState
} from "react";
import { UserProfile } from "@/types/services/user";
import { userService } from "@/modules/services/user-service";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { PrivacyToggle } from "@/components/features/user/PrivacyToggle";
import { FollowButton } from "@/components/features/user/FollowButton";
import {
  MapPin,
  CalendarDays,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [ user, setUser ] = useState<UserProfile | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const searchResult = await userService.searchUsers(params.username, 1, 1);
        if (searchResult.length > 0 && searchResult[ 0 ].username === params.username) {
          const fullProfile = await userService.getUserProfile(searchResult[ 0 ].id);
          setUser(fullProfile);
        } else {
          throw new Error("User not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [ params.username ]);

  if (isLoading) {
    return (
      <UserProfileSkeleton />
    )
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 text-red-500">
        {
          error || "Could not load user profile."
        }
      </div>
    )
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long",
  });


  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Profile Header */ }
      <div className="flex flex-col md:flex-row items-start gap-8 p-6 bg-card border rounded-lg">
        <Avatar className="h-32 w-32 border-4 border-primary shrink-0">
          <AvatarImage
            src={ user.avatarUrl ?? undefined }
            alt={ user.username }
          />
          <AvatarFallback>
            { user.firstName[ 0 ] } { " " } { user.lastName[ 0 ] }
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                { user.firstName } { " " } { user.lastName }
              </h1>
              <p className="text-lg text-muted-foreground">
                @{ user.username }
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <FollowButton targetUser={ user } />
            </div>
          </div>

          <p className="mt-4 text-base">
            { user.bio || "No bio yet." }
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
            {
              user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{ user.location }</span>
                </div>
              )
            }

            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>
                Joined { joinedDate }
              </span>
            </div>

            <PrivacyToggle
              userId={ user.id }
              initialIsPrivate={ user.isPrivate }
            />
          </div>

          <div className="flex items-center gap-6 mt-6">
            <div className="text-center">
              <span className="font-bold block text-lg">
                { user._count?.following ?? 0 }
              </span>
              <span className="text-sm text-muted-foreground">
                Following
              </span>
            </div>
            <div className="text-center">
              <span className="font-bold block text-lg">
                { user._count?.followers ?? 0 }
              </span>
              <span className="text-sm text-muted-foreground">
                Followers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */ }
      <Tabs defaultValue="posts" className="mt-8">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          {
            user.isPrivate
              ? (
                <p className="text-center p-8 border rounded-lg bg-card">
                  This account is private. Follow to see their posts.
                </p>
              )
              : (
                <p className="text-center p-8 border rounded-lg bg-card">
                  Posts will be listed here.
                </p>
              )
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}

// A Skeleton loader for the profile page
const UserProfileSkeleton = () => (
  <div className="container max-w-4xl mx-auto py-8">
    <div className="flex flex-col md:flex-row items-start gap-8 p-6 bg-card border rounded-lg">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="flex-1 space-y-4 w-full">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
    <div className="mt-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-48 w-full mt-4" />
    </div>
  </div>
);
