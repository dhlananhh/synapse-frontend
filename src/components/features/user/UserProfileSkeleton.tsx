"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
}
