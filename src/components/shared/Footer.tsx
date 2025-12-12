"use client";


import React from "react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-background/80 w-full fixed inset-x-0 bottom-0 z-50 h-16 border-b backdrop-blur-lg border-t">
      <div className="mx-auto flex max-w-full flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary h-6 w-6" />
          <span className="font-bold">Synapse</span>
        </div>
        <p className="text-muted-foreground text-sm">
          &copy; { new Date().getFullYear() } Synapse.
          All rights reserved.
        </p>
        <div className="flex gap-4 text-sm font-medium">
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
