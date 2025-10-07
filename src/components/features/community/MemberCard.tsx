"use client";


import React from "react";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


interface MemberCardProps {
  member: User & { role?: string };
}


export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="hover:border-primary/50 hover:shadow-lg transition-all">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Link
          href={ `/u/${member.username}` }
          className="flex flex-col items-center group"
        >
          <UserAvatar user={ member } className="h-20 w-20 mb-3" />
          <p className="font-bold text-lg group-hover:underline">
            { member.displayName || member.username }
          </p>
          <p className="text-sm text-muted-foreground">
            u/{ member.username }
          </p>
        </Link>

        {
          member.role === "Moderator" && (
            <Badge variant="secondary" className="mt-2">
              { member.role }
            </Badge>
          )
        }

        <Button asChild className="w-full mt-4">
          <Link
            href={ `/u/${member.username}` }
          >
            View Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}