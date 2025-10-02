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
import { BrainCircuit, Home, LogIn, Menu, UserPlus } from "lucide-react";


export default function MobileNav() {
  const [ isOpen, setIsOpen ] = useState(false);
  const { user, logout } = useAuth();

  return (
    <Sheet open={ isOpen } onOpenChange={ setIsOpen }>
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
              onClick={ () => setIsOpen(false) }
            >
              <BrainCircuit className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">Synapse</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <Suspense fallback={
            <div className="text-center text-muted-foreground mt-10">
              Searching...</div>
          }>
          </Suspense>
        </div>
        <Separator />

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center p-2 rounded-md hover:bg-secondary text-foreground"
            onClick={ () => setIsOpen(false) }
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </Link>

          <Separator className="my-2" />

          {
            user ? (
              <>
                <div className="p-2">
                  <h4 className="font-semibold mb-2">My Stuff</h4>
                  <Link
                    href={ `/u/${user.email}` }
                    className="flex items-center p-2 rounded-md hover:bg-secondary"
                    onClick={ () => setIsOpen(false) }
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center p-2 rounded-md hover:bg-secondary"
                    onClick={ () => setIsOpen(false) }
                  >
                    Settings
                  </Link>
                  <button
                    onClick={ () => { logout(); setIsOpen(false); } }
                    className="w-full text-left flex items-center p-2 rounded-md hover:bg-secondary"
                  >
                    Log Out
                  </button>
                </div>

              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center p-2 rounded-md hover:bg-secondary text-foreground"
                  onClick={ () => setIsOpen(false) }
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center p-2 rounded-md hover:bg-secondary text-foreground"
                  onClick={ () => setIsOpen(false) }
                >
                  <UserPlus className="h-5 w-5 mr-3" />
                  Sign Up
                </Link>
              </>
            )
          }
        </div>
      </SheetContent>
    </Sheet>
  );
}
