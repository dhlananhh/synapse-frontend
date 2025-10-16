"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BrainCircuit,
  Home,
  LogIn,
  Menu,
  UserPlus,
} from "lucide-react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle asChild>
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <BrainCircuit className="text-primary h-7 w-7" />
              <span className="text-xl font-bold">
                Synapse
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <Suspense
            fallback={
              <div className="text-muted-foreground mt-10 text-center">
                Searching...
              </div>
            }
          ></Suspense>
        </div>
        <Separator />

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="hover:bg-secondary text-foreground flex items-center rounded-md p-2"
            onClick={() => setIsOpen(false)}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Link>

          <Separator className="my-2" />

          {user ? (
            <>
              <div className="p-2">
                <h4 className="mb-2 font-semibold">
                  My Stuff
                </h4>
                <Link
                  href={`/u/${user.email}`}
                  className="hover:bg-secondary flex items-center rounded-md p-2"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="hover:bg-secondary flex items-center rounded-md p-2"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="hover:bg-secondary flex w-full items-center rounded-md p-2 text-left"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:bg-secondary text-foreground flex items-center rounded-md p-2"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="mr-3 h-5 w-5" />
                Log In
              </Link>
              <Link
                href="/register"
                className="hover:bg-secondary text-foreground flex items-center rounded-md p-2"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="mr-3 h-5 w-5" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
