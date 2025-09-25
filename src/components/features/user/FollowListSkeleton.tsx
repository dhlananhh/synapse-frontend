"use client";


import React from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function FollowListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {
        [ ...Array(3) ].map((_, i) => (
          <div
            key={ i }
            className="flex items-center space-x-4"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))
      }
    </div>
  )
}
