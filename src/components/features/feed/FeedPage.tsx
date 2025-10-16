"use client";

import React from "react";
import CreatePostWidget from "@/components/shared/CreatePostWidget";
import { Navbar } from "@/components/shared/Navbar";
import TopCommunitiesWidget from "@/components/features/community/widgets/TopCommunitiesWidget";

export default function FeedPage() {
  return (
    <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-6">
      <Navbar />

      <div className="md:col-span-2">
        <CreatePostWidget />
      </div>
      <aside className="hidden md:block">
        <div className="sticky top-20 space-y-4">
          <TopCommunitiesWidget />
        </div>
      </aside>
    </div>
  );
}
