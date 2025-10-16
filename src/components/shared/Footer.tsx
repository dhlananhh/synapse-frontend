"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/libs/paths";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary h-6 w-6" />
          <span className="font-bold">Synapse</span>
        </div>
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Synapse. All
          rights reserved.
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
