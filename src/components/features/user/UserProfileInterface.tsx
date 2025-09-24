"use client";


import React, {
  useEffect,
  useState
} from "react";
import { useParams } from "next/navigation";
import { UserProfile } from "@/types/services/user";
import { userService } from "@/modules/services/user-service";
import { UserProfileHeader } from "@/components/features/user/UserProfileHeader";
import { UserProfileTabs } from "@/components/features/user/UserProfileTabs";
import UserProfileSkeleton from "@/components/features/user/UserProfileSkeleton";


export function UserProfileInterface() {
  const params = useParams();
  const userId = params.userId as string;
  const [ user, setUser ] = useState<UserProfile | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userData = await userService.getUserProfile(userId);
          setUser(userData);
        } catch (error) {
          console.error(`Failed to fetch profile for user ${userId}:`, error);
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
      />
      <UserProfileTabs
        userId={ user.id }
      />
    </div>
  );
}
