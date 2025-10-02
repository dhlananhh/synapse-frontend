"use client";


import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Community } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Users, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/libs/paths";


// const getTopCommunities = (): Community[] => {
//   return [ ...mockCommunities ].sort((a, b) => b.memberCount - a.memberCount).slice(0, 5);
// }


export default function TopCommunitiesWidget() {
  // const topCommunities = getTopCommunities();
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Communities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {/* {
            topCommunities.map((community, index) => (
              <li key={ community.id }>
                <Link
                  href={ `/c/${community.slug}` }
                  className="flex items-center gap-3 group"
                >
                  <span className="font-bold text-lg">
                    { index + 1 }
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={ community.imageUrl } />
                    <AvatarFallback>
                      { community.name.slice(0, 2).toUpperCase() }
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold group-hover:underline">
                      c/{ community.slug }
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center">
                      { community.memberCount.toLocaleString() } members
                    </div>
                  </div>
                </Link>
              </li>
            ))
          } */}
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            className="w-full mt-6"
            variant="outline"
            asChild
          >
            <Link href="#">View All</Link>
          </Button>

          {
            user && (
              <Button
                className="w-full"
                asChild
              >
                <Link href={ PATHS.createCommunity }>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Community
                </Link>
              </Button>
            )
          }
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            className="w-full mt-6"
            variant="outline"
            asChild
          >
            <Link href={ `/c/create` }>
              Create your own community
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
