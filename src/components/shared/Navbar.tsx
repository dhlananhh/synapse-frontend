"use client";


import React from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UserNav } from "./UserNav";
import { BrainCircuit } from "lucide-react";
import MobileNav from "@/components/shared/MobileNav";


export function Navbar() {
  const { user, isLoading } = useAuth();

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      );
    }

    if (user) {
      return (
        <UserNav user={ user } />
      )
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
    <header
      className="fixed top-0 inset-x-0 h-16 z-50 border-b bg-background/80 backdrop-blur-lg"
    >
      <div className="container h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileNav />
          </div>

          <Link
            href="/"
            className="hidden md:flex items-center gap-2"
          >
            <BrainCircuit
              className="h-8 w-8 text-primary"
            />
            <p className="hidden lg:block text-xl font-bold text-foreground">
              Synapse
            </p>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center">
            { renderAuthSection() }
          </nav>
        </div>
      </div>
    </header>
  );
}
