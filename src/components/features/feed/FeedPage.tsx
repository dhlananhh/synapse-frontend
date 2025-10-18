"use client";


import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import TopCommunitiesWidget from "@/components/features/community/widgets/TopCommunitiesWidget";


export default function FeedPage() {
  return (
    <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-6">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] lg:grid-cols-[420px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            <TopCommunitiesWidget />
          </div>
        </aside>
      </div>

    </div>
  );
}
