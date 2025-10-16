"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/modules/services/user-service";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UserNav } from "./UserNav";
import { BrainCircuit } from "lucide-react";
import MobileNav from "@/components/shared/MobileNav";
import SearchBar from "@/components/shared/SearchBar";
import { UserProfile } from "@/types/services/user";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const [ profile, setProfile ] =
    useState<UserProfile | null>(null);

  useEffect(() => {
    if (user?.id) {
      userService.getUserProfile(user.id).then(setProfile);
    } else {
      setProfile(null);
    }
  }, [ user?.id ]);

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      );
    }

    if (user && profile) {
      return <UserNav user={ profile } />;
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="bg-background/80 fixed inset-x-0 top-0 z-50 h-16 border-b backdrop-blur-lg">
      <div className="container mx-auto flex h-full max-w-7xl items-center gap-4">
        {/* Left: Logo & App Name */ }
        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="md:hidden">
            <MobileNav />
          </div>
          <Link
            href="/"
            className="hidden items-center gap-2 md:flex"
          >
            <BrainCircuit className="text-primary h-8 w-8" />
            <p className="text-foreground hidden text-xl font-bold lg:block">
              Synapse
            </p>
          </Link>
        </div>

        {/* Center: Search Bar */ }
        <div className="flex flex-1 justify-center px-4">
          <SearchBar />
        </div>

        {/* Right: Auth/User Nav */ }
        <div className="flex flex-shrink-0 items-center gap-2">
          { renderAuthSection() }
        </div>
      </div>
    </header>
  );
}
