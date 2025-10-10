"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FollowerRecord } from "@/types/services/user";
import { userService } from "@/modules/services/user-service";
import { FollowerItem } from "./FollowerItem";

export function FollowerList({
  userId,
}: {
  userId: string;
}) {
  const [followers, setFollowers] = useState<
    FollowerRecord[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getFollowers(userId)
      .then(setFollowers)
      .catch(() => setFollowers([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (followers.length === 0)
    return <div>No followers found.</div>;

  return (
    <ul>
      {followers.map((item) => (
        <li key={item.id}>
          <Link
            href={`/profile/${item.follower.id}`}
            className="hover:bg-accent block rounded transition"
          >
            <FollowerItem follower={item.follower} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
