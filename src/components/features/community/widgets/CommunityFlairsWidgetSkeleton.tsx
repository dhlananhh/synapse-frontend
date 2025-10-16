"use client";


import React from "react";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export default function CommunityFlairsWidgetSkeleton() {
  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
      </CardContent>
    </Card>
  )
}
