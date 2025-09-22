"use client";


import React from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function UserProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Skeleton className="w-32 h-32 rounded-full" />
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
  )
}
