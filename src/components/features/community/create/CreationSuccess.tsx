"use client";


import React from "react";
import Link from "next/link";
import { Community } from "@/types/services/community";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  CheckCircle,
  ArrowRight
} from "lucide-react";


interface CreationSuccessProps {
  community: Community;
}


export function CreationSuccess({ community }: CreationSuccessProps) {
  const { width, height } = useWindowSize();

  return (
    <>
      {
        width && height && (
          <Confetti
            width={ width }
            height={ height }
            recycle={ false }
            numberOfPieces={ 500 }
            tweenDuration={ 8000 }
            gravity={ 0.1 }
          />
        )
      }

      <div className="flex flex-col items-center text-center py-10">
        <CheckCircle className="h-20 w-20 text-green-500 mb-6" />

        <h1 className="text-4xl font-bold tracking-tight mb-3">
          A New Community Created Successfully!
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-lg">
          Congratulations! Your new community, { " " }
          <span className="font-semibold text-primary">
            c/{ community.name }
          </span>, { " " }
          is now live. Let&apos;s get started by visiting its page.
        </p>

        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-border">
              <AvatarImage
                src={ community.avatarUrl || "" }
              />
              <AvatarFallback className="text-4xl">
                { community.name.charAt(0).toUpperCase() }
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">
              { community.name }
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              { community.description }
            </p>
          </CardContent>
        </Card>

        <Button
          asChild
          size="lg"
          className="mt-10 animate-pulse"
        >
          <Link
            href={ `/c/${community.name}` }
          >
            Visit Your Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </>
  );
}
