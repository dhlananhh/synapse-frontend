"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotificationStore } from "@/store/useNotificationStore";
import { mockPosts, allMockUsers } from "@/libs/mock-data";
import { Notification, NotificationType } from "@/types";

const generateRandomNotification = (): Notification => {
  const actor =
    allMockUsers[
      Math.floor(Math.random() * allMockUsers.length)
    ];
  const randomPost =
    mockPosts[Math.floor(Math.random() * mockPosts.length)];
  const type: NotificationType = [
    "NEW_COMMENT",
    "POST_UPVOTE",
    "NEW_FOLLOWER",
  ][Math.floor(Math.random() * 3)] as NotificationType;

  let message = "";
  let entityUrl = "";

  switch (type) {
    case "NEW_COMMENT":
      message = `commented on your post: "${randomPost.title.substring(0, 20)}..."`;
      entityUrl = `/p/${randomPost.id}`;
      break;
    case "POST_UPVOTE":
      message = `upvoted your post: "${randomPost.title.substring(0, 20)}..."`;
      entityUrl = `/p/${randomPost.id}`;
      break;
    case "NEW_FOLLOWER":
      message = "started following you.";
      entityUrl = `/u/${actor.username}`;
      break;
  }

  return {
    id: `notif_${Date.now()}`,
    type,
    actor,
    message,
    entityUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
};

export default function NotificationSimulator() {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const newNotif = generateRandomNotification();
        addNotification(newNotif);
      }, 15000);
    }

    if (!user && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, addNotification]);

  return null;
}
