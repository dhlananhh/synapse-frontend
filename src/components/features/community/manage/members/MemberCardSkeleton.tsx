"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <Skeleton className="mb-3 h-20 w-20 rounded-full" />

        <Skeleton className="mb-1.5 h-5 w-3/5" />
        <Skeleton className="h-4 w-2/5" />

        <Skeleton className="mt-2 h-5 w-1/4" />

        <Skeleton className="mt-4 h-10 w-full" />
      </CardContent>
    </Card>
  );
}
