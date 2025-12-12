"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import FeedPage from "@/components/features/feed/FeedPage";
import LandingPage from "@/components/features/landing/LandingPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Skeleton className='h-16 w-16 rounded-full' />
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    );
  }

  if (user) {
    return <FeedPage />
  }

  return <LandingPage />;
}
