"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServerCrash, Home } from "lucide-react";

export default function NotFoundDisplay() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-secondary mb-6 rounded-full p-6">
        <ServerCrash className="text-primary h-16 w-16" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight">
        404 - Page Not Found
      </h1>

      <p className="text-muted-foreground mt-4 max-w-md">
        Oops! The page you are looking for does not exist.
        It might have been moved, deleted, or you may have
        typed the URL incorrectly.
      </p>

      <Button asChild className="mt-8">
        <Link href="/">
          <Home className="mr-1 h-5 w-5" />
          Go back to Homepage
        </Link>
      </Button>
    </div>
  );
}
