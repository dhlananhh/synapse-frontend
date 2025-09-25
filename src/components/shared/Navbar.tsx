"use client";


import React from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UserNav } from "./UserNav";
import { BrainCircuit } from "lucide-react";


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
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur 
      supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 mb-2"
          >
            <BrainCircuit className="h-10 w-10 text-primary" />
            <span className="font-bold">Synapse</span>
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
