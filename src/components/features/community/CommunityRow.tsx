"use client";


import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SearchCommunityResult } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Settings,
  Check,
  Lock,
  Globe
} from "lucide-react";


interface CommunityRowProps {
  community: SearchCommunityResult;
  index: number;
  currentUserRole?: "OWNER" | "MODERATOR" | "MEMBER";
}


export function CommunityRow({
  community,
  index,
  currentUserRole
}: CommunityRowProps) {
  const { user } = useAuth();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ localRole, setLocalRole ] = useState(currentUserRole);

  useEffect(() => {
    setLocalRole(currentUserRole);
  }, [ currentUserRole ]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to join communities.");
      return;
    }

    setIsLoading(true);
    try {
      await communityService.joinCommunity(community.id);
      setLocalRole("MEMBER");
      toast.success(`Welcome to c/${community.name}!`);
    } catch (error: any) {
      toast.error("Failed to join.", { description: error.response?.data?.message });
    } finally {
      setIsLoading(false);
    }
  }

  const renderActionButton = () => {
    if (localRole === "OWNER" || localRole === "MODERATOR") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-24 gap-1"
          asChild
        >
          <Link
            href={ `/c/${community.name}/manage` }
          >
            <Settings className="w-3.5 h-3.5" /> Manage
          </Link>
        </Button>
      );
    }

    if (localRole === "MEMBER") {
      return (
        <Button
          variant="secondary"
          size="sm"
          className="w-24 gap-1"
          disabled
        >
          <Check className="w-3.5 h-3.5" /> Joined
        </Button>
      );
    }

    return (
      <Button
        size="sm"
        className="w-24"
        onClick={ handleJoin }
        disabled={ isLoading }
      >
        { isLoading ? "..." : "Join" }
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <span className="text-muted-foreground w-6 text-center font-semibold text-lg">
          { index }
        </span>

        <Avatar className="h-12 w-12 border">
          <AvatarImage src={ community.avatarUrl ?? "" } />
          <AvatarFallback>
            { community.name.charAt(0).toUpperCase() }
          </AvatarFallback>
        </Avatar>

        <Link
          href={ `/c/${community.name}` }
          className="flex-1 overflow-hidden"
        >
          <div className="flex flex-col gap-1">
            {/* Dòng tên và Role */ }
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base group-hover:underline truncate">
                c/{ community.name }
              </h3>
              {
                localRole === "OWNER" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1 py-0 h-5"
                  >
                    Owner
                  </Badge>
                )
              }
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1">
              { community.description || "No description provided." }
            </p>

            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Users className="w-3 h-3" />
                <span>{ community.memberCount.toLocaleString() } members</span>
              </div>

              <span className="text-[10px] text-muted-foreground">•</span>

              <div className="flex items-center text-xs text-muted-foreground gap-1">
                {
                  community.isPrivate ? (
                    <span className="flex items-center gap-1 text-purple-600 bg-purple-500/10 px-1.5 py-0.5 rounded-full dark:text-purple-400 dark:bg-purple-950/30">
                      <Lock className="w-3 h-3" />
                      <span className="font-medium">Private</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full dark:text-green-400 dark:bg-green-950/30">
                      <Globe className="w-3 h-3" />
                      <span className="font-medium">Public</span>
                    </span>
                  )
                }
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="pl-4">
        { renderActionButton() }
      </div>
    </div>
  );
}
