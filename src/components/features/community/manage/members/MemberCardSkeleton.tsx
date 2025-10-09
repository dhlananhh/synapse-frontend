"use client";


import React from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export default function MemberCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Skeleton className="h-20 w-20 rounded-full mb-3" />

        <Skeleton className="h-5 w-3/5 mb-1.5" />
        <Skeleton className="h-4 w-2/5" />

        <Skeleton className="h-5 w-1/4 mt-2" />

        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}
