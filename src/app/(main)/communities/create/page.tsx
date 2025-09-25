"use client";


import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CreateCommunityForm from "@/components/features/community/CreateCommunityForm";
import { Skeleton } from "@/components/ui/skeleton";
import { PATHS } from "@/libs/paths";


export const dynamic = "force-dynamic";


export default function CreateCommunityPage() {
  const { user } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push(`${PATHS.login}?from=${PATHS.createCommunity}`);
    }
  }, [ user, router ]);

  if (user === undefined) {
    return (
      <Skeleton className="h-96 w-full" />
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <CreateCommunityForm />
    </div>
  );
}
