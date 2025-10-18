"use client";


import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Compass, Users } from "lucide-react";


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-grow items-center justify-center">
        <div className="container py-20 text-center">
          <BrainCircuit className="text-primary mx-auto mb-6 h-20 w-20" />
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Welcome to { " " }
            <span className="text-primary">Synapse</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            The modern discussion forum where minds connect.
            Join communities, share your thoughts, and
            discover new ideas in a vibrant, user-driven
            ecosystem.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/feed">Explore Feed</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Sign Up</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <Compass className="text-primary mb-3 h-10 w-10" />
              <h3 className="font-bold">
                Discover Communities
              </h3>
              <p className="text-muted-foreground text-sm">
                Find your niche in thousands of communities.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-primary mb-3 h-10 w-10" />
              <h3 className="font-bold">
                Engage & Connect
              </h3>
              <p className="text-muted-foreground text-sm">
                Vote on content, comment, and chat in
                real-time.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <BrainCircuit className="text-primary mb-3 h-10 w-10" />
              <h3 className="font-bold">
                Share Your Knowledge
              </h3>
              <p className="text-muted-foreground text-sm">
                Create posts and become a voice in your
                community.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
