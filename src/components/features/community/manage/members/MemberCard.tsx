"use client";


import React from "react";
import Link from "next/link";
import { CommunityMember } from "@/types/services/community";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  Gavel,
  ShieldOff,
  Trash2
} from "lucide-react";


interface MemberCardProps {
  member: CommunityMember;
  type: "pending" | "current" | "banned";
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  onBan?: (userId: string) => void;
  onUnban?: (userId: string) => void;
  onRemove?: (userId: string) => void;
}


export function MemberCard({
  member,
  type,
  onApprove,
  onReject,
  onBan,
  onUnban,
  onRemove
}: MemberCardProps) {
  const renderActions = () => {
    switch (type) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={ () => onReject?.(member.userId) }
            >
              <UserX className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={ () => onApprove?.(member.userId) }
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        );
      case "current":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={ () => onBan?.(member.userId) }
                className="text-destructive"
              >
                <Gavel className="h-4 w-4 mr-2" />
                Ban User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={ () => onRemove?.(member.userId) }
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove from Community
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "banned":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={ () => onUnban?.(member.userId) }
          >
            <ShieldOff className="h-4 w-4 mr-2" />
            Unban
          </Button>
        )
      default:
        return null;
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={ member.userId || "" }
          />
          <AvatarFallback>
            { member.username.charAt(0).toUpperCase() }
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={ `/u/${member.username}` }
            className="font-semibold hover:underline"
          >
            { member.username }
          </Link>
          {
            type === "current" && (
              <Badge
                variant={ member.role === "OWNER" ? "default" : "secondary" }
                className="ml-2"
              >
                { member.role }
              </Badge>
            )
          }
        </div>
      </div>
      { renderActions() }
    </div>
  );
}
