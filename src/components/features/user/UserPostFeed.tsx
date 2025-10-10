"use client";

import React from "react";
import { Post } from "@/types";
import PostCard from "@/components/features/post/PostCard";
import EmptyState from "@/components/shared/EmptyState";
import { MessageSquarePlus } from "lucide-react";

export default function UserPostFeed({
  posts,
}: {
  posts: Post[];
}) {
  if (posts.length === 0) {
    return (
      <div className="col-span-full mt-6">
        <EmptyState
          Icon={MessageSquarePlus}
          title="No Posts Yet"
          description={`This user hasn't created any posts. When they do, their posts will appear here.`}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
