"use client";


import React, { useState } from "react";
import { useAuth } from "@/context/MockAuthContext";
import { Community } from "@/types";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  VolumeX,
  Volume2
} from "lucide-react";
import { toast } from "sonner";


interface CommunityHeaderProps {
  community: Community;
}


export default function CommunityHeader({ community }: CommunityHeaderProps) {
  const {
    user,
    isSubscribed,
    subscribeToCommunity,
    unsubscribeFromCommunity,
    isMuted,
    toggleMuteCommunity
  } = useAuth();

  const [ isConfirmingLeave, setIsConfirmingLeave ] = useState(false);
  const [ isLeaveDialogOpen, setIsLeaveDialogOpen ] = useState(false);

  const subscribed = isSubscribed(community.id);
  const muted = isMuted(community.id);

  const handleSubscription = () => {
    if (subscribed) {
      setIsLeaveDialogOpen(true);
    } else {
      subscribeToCommunity(community.id);
    }
  };

  const handleToggleMute = () => {
    toggleMuteCommunity(community.id);
    toast.success(
      muted
        ? `Unmuted c/${community.slug}`
        : `Muted c/${community.slug}. Posts from this community won't appear in your feeds.`
    );
  }

  const handleConfirmLeave = async () => {
    setIsConfirmingLeave(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    unsubscribeFromCommunity(community.id);
    setIsConfirmingLeave(false);
    setIsLeaveDialogOpen(false);
  }

  return (
    <>
      <div className="mb-6">
        <div className="h-24 bg-secondary rounded-t-lg" />
        <div className="p-4 bg-card rounded-b-lg flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-8">
          <div className="flex items-end gap-3">
            <Avatar className="h-16 w-16 border-4 border-card">
              <AvatarImage
                src={ community.imageUrl }
                alt={ community.name }
              />
              <AvatarFallback>
                { community.name.slice(0, 2).toUpperCase() }
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                { community.name }
              </h1>
              <p className="text-sm text-muted-foreground">
                c/{ community.slug }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {
              user && (
                <Button onClick={ handleSubscription }>
                  { subscribed ? "Leave" : "Join" }
                </Button>
              )
            }

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={ handleToggleMute }>
                  { muted ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" /> }
                  { muted ? `Unmute c/${community.slug}` : `Mute c/${community.slug}` }
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={ isLeaveDialogOpen }
        onOpenChange={ setIsLeaveDialogOpen }
        onConfirm={ handleConfirmLeave }
        title={ `Leave c/${community.slug}?` }
        description={
          `Are you sure you want to leave this community? You will no longer see its posts in your home feed.`
        }
        confirmText="Leave Community"
        isConfirming={ isConfirmingLeave }
      />
    </>
  )
}
