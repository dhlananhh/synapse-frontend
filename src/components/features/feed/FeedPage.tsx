"use client";


import React from "react";
import CreatePostWidget from "@/components/shared/CreatePostWidget";
// import PostFeed from "@/components/features/post/PostFeed";
import TopCommunitiesWidget from "@/components/features/community/widgets/TopCommunitiesWidget";
import { Navbar } from "@/components/shared/Navbar";


export default function FeedPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 py-6">
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
      </div>
      <div className="md:col-span-2">
        <CreatePostWidget />
        {/* <PostFeed /> */ }
      </div>
      <aside className="hidden md:block">
        <div className="sticky top-20 space-y-4">
          <TopCommunitiesWidget />
        </div>
      </aside>
    </div>
  );
}
