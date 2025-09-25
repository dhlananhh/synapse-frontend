"use client";


import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/MockAuthContext";
import { Community } from "@/types";
import EditCommunityDialog from "../manage/dialogs/EditCommunityDialog";
import ModeratorListWidget from "./ModeratorListWidget";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Cake,
  Users,
  Settings
} from "lucide-react";


interface AboutCommunityWidgetProps {
  community: Community;
}


export default function AboutCommunityWidget({ community }: AboutCommunityWidgetProps) {
  const { user } = useAuth();
  const isOwner = user?.id === community.ownerId;

  const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            About c/{ community.slug }
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            { community.description }
          </p>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Cake className="h-5 w-5" />
              <span>
                Created { format(new Date(community.createdAt), "MMM d, yyyy") }
              </span>
            </div>
            <hr />

            <Link
              href={ `/c/${community.slug}/members` }
              className="flex items-center gap-2 hover:text-primary"
            >
              <Users className="h-5 w-5" />
              <span>
                { community.memberCount.toLocaleString() } members
              </span>
            </Link>
          </div>

          <div>
            <hr className="my-3" />
            <h4 className="font-semibold text-sm mb-2">
              Moderators
            </h4>
            <ModeratorListWidget community={ community } />
          </div>

          <Button
            asChild
            className="w-full mt-2"
          >
            <Link href={ `/c/${community.slug}/members` }>
              View All Members
            </Link>
          </Button>

          {
            isOwner && (
              <>
                <hr />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    Owner Actions
                  </h4>
                  <Button
                    onClick={ () => setIsEditDialogOpen(true) }
                    variant="secondary"
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Community
                  </Button>
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                  >
                    <Link href={ `/c/${community.slug}/manage` }>
                      Manage Members
                    </Link>
                  </Button>
                </div>
              </>
            )
          }
        </CardContent>
      </Card>


      {
        isOwner && (
          <EditCommunityDialog
            community={ community }
            isOpen={ isEditDialogOpen }
            onOpenChange={ setIsEditDialogOpen }
          />
        )
      }
    </>
  )
}
