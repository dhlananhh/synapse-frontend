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
  const username = params.username as string;
  const [ user, setUser ] = useState<UserProfile | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (username) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userData = await userService.getUserProfile(username);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [ username ]);

  if (loading) {
    return (
      <UserProfileSkeleton />
    )
  }

  if (!user) {
    return (
      <div>User not found.</div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <UserProfileHeader user={ user } />
      <UserProfileTabs userId={ user.id } />
    </div>
  );
}
