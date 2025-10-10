"use client";

import React from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } =
    useNotificationStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
          >
            <CheckCheck className="mr-1 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
              />
            ))
          ) : (
            <p className="text-muted-foreground p-6 text-center">
              You have no new notifications.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
