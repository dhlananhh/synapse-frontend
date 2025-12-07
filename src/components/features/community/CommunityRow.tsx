"use client";


import React, { useState } from "react";
import Link from "next/link";
import { SearchCommunityResult } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


interface CommunityRowProps {
  community: SearchCommunityResult;
  index: number;
}

export function CommunityRow({ community, index }: CommunityRowProps) {
  const { user } = useAuth();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isJoined, setIsJoined ] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to join communities.");
      return;
    }

    setIsLoading(true);
    try {
      await communityService.joinCommunity(community.id);
      setIsJoined(true);
      toast.success(`Welcome to c/${community.name}!`);
    } catch (error: any) {
      toast.error("Failed to join.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {/* Index Number */ }
        <span className="text-muted-foreground w-6 text-center font-semibold text-lg">
          { index }
        </span>

        {/* Avatar */ }
        <Avatar className="h-12 w-12 border">
          <AvatarImage
            src={ community.avatarUrl ?? "" }
          />
          <AvatarFallback>
            { community.name.charAt(0).toUpperCase() }
          </AvatarFallback>
        </Avatar>

        {/* Info */ }
        <Link
          href={ `/c/${community.name}` }
          className="flex-1 overflow-hidden"
        >
          <div className="flex flex-col">
            <h3 className="font-bold text-base group-hover:underline truncate">
              c/{ community.name }
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
              { community.description || "No description provided." }
            </p>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Users className="w-3 h-3" />
              <span>
                { community.memberCount.toLocaleString() } members
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Action Button */ }
      <div className="pl-4">
        {
          isJoined ? (
            <Button
              variant="outline"
              size="sm"
              className="w-24"
            >
              Joined
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-24"
              onClick={ handleJoin }
              disabled={ isLoading }
            >
              { isLoading ? "..." : "Join" }
            </Button>
          )
        }
      </div>
    </div>
  );
}
