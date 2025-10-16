"use client";

import { CommunityCreationWizard } from "@/components/features/community/create/CommunityCreationWizard";

export default function CreateCommunityPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-2 text-3xl font-bold">
        Create a new community
      </h1>
      <p className="text-muted-foreground mb-8">
        Build and grow a community about a topic you are
        passionate about.
      </p>
      <CommunityCreationWizard />
    </div>
  );
}
