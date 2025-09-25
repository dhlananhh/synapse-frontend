"use client";


import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CreatePostForm from "@/components/features/post/CreatePostForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";


export const dynamic = "force-dynamic";


export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;

    if (user === null) {
      router.push("/login?from=/submit");
    }
  }, [ user, router ]);

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>Share your thoughts with a community.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <CreatePostForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
