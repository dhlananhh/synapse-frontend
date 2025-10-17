"use client";


import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock } from "lucide-react";


export default function AdminProtectedLayout({ children }: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "SYSTEM_ADMIN") {
      router.replace("/");
    }
  }, [ isLoading, user, router ]);

  if (isLoading) {
    return <div className="flex h-[ calc(100vh - 150px) ] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (user?.role !== "SYSTEM_ADMIN") {
    return (
      <div className="text-center py-20">
        <Lock className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-xl font-bold">Access Denied</h1>
        <p>You must be a System Administrator to view this page. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <main>
        { children }
      </main>
    </div>
  );
}
