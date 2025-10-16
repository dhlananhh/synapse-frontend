"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Home, ArrowBigLeft } from "lucide-react";

interface ForbiddenDisplayProps {
  title?: string;
  description?: string;
}

export default function ForbiddenDisplay({
  title = "Access Denied",
  description = "You do not have the necessary permissions to view this page or resource.",
}: ForbiddenDisplayProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-destructive/10 mb-6 rounded-full p-6">
        <Lock className="text-destructive h-16 w-16" />
      </div>

      <h1 className="text-destructive text-4xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="text-muted-foreground mt-4 max-w-md">
        {description}
      </p>

      <div className="mt-8 flex gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          <ArrowBigLeft className="mr-1 h-5 w-5" />
          Go Back
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="mr-1 h-5 w-5" /> Go to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
