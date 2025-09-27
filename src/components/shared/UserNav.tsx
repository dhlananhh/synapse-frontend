"use client";


import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/services/user";
import { authService } from "@/modules/services/auth-service";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LogOut,
  Settings,
  UserRound
} from "lucide-react";


interface UserNavProps {
  user: UserProfile;
}


export function UserNav({ user }: UserNavProps) {
  const { user: authUser, logout } = useAuth();
  const [ userId, setUserId ] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (authUser?.id) {
        try {
          const profile = await authService.getMe();
          setUserId(profile.id);
        } catch (error) {
          console.error("Failed to fetch user ID for UserNav", error);
        }
      }
    };
    fetchUserId();
  }, [ authUser ]);

  if (!authUser)
    return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
      >
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={ user.avatarUrl || "" }
              alt={ `@${user.username}` }
            />
            <AvatarFallback>
              { user.username.charAt(0).toUpperCase() }
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              { `${user.firstName} ${user.lastName}` }
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{ user.username }
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {
            userId && (
              <DropdownMenuItem asChild>
                <Link
                  href={ `/u/${userId}` }
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            )
          }
          <DropdownMenuItem asChild>
            <Link
              href={ `/settings` }
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={ logout }
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
