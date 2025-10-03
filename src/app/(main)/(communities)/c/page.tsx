"use client";


import React, { useState } from "react";
import { toast } from "sonner";
import { Community } from "@/types/services/community";
import { UpdateCommunityDialog } from "@/components/features/community/UpdateCommunityDialog";
import { ManageCommunityFlairDialog } from "@/components/features/community/ManageCommunityFlairDialog";


const mockCommunityData: Community = {
  id: "comm001",
  name: "javascript-developers",
  description: "A community for JavaScript developers to share knowledge, ask questions, and discuss the latest trends in JS development.",
  status: "ACTIVE",
  ownerId: "user001",
  memberCount: 15789,
  postCount: 420,
  isPrivate: false,
  isNSFW: false,
  moderationMode: false,
  avatarKey: null,
  bannerKey: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};


const mockCurrentUser = {
  id: "user001",
};


export default function TestCommunityUpdatePage() {
  const [ communityData, setCommunityData ] = useState<Community>(mockCommunityData);

  const handleCommunityUpdate = (updatedCommunity: Community) => {
    console.log("Parent page received updated data:", updatedCommunity);
    setCommunityData(updatedCommunity);
    toast.info("Test page UI has been updated to reflect the changes.");
  };

  const isOwner = mockCurrentUser.id === communityData.ownerId;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Test Environment</h2>
        <p className="text-yellow-700 dark:text-yellow-400">
          This is a sandboxed page for testing the "Update Community" feature. The data below is mocked.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Community Details (Live Preview)</h1>

        <div className="p-6 border rounded-lg bg-card text-card-foreground space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Current Community Data</h2>
          <div>
            <p>
              <strong>Name:</strong> { " " }
              { communityData.name }
            </p>
          </div>
          <div>
            <p>
              <strong>Description:</strong> { " " }
              { communityData.description }
            </p>
          </div>
          <div>
            <p><strong>Is Private:</strong> { " " }
              <span
                className={ communityData.isPrivate ? "font-bold text-red-500" : "" }
              >
                { String(communityData.isPrivate) }</span>
            </p>
          </div>
          <div>
            <p>
              <strong>Is NSFW:</strong> { " " }
              <span
                className={ communityData.isNSFW ? "font-bold text-red-500" : "" }
              >
                { String(communityData.isNSFW) }
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Moderation Mode:</strong> { " " }
              <span
                className={ communityData.moderationMode ? "font-bold text-red-500" : "" }
              >
                { String(communityData.moderationMode) }</span>
            </p>
          </div>
          <div>
            <p>
              <strong>Owner ID:</strong> { " " }
              { communityData.ownerId }
            </p>
          </div>
          <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-bold">
            You are currently simulated as the OWNER of this community.
          </div>
        </div>

        <div className="border-t pt-6 text-center">
          <h3 className="text-lg font-medium mb-4">Action Panel</h3>
          { isOwner ? (
            <div className="flex gap-2">
              <UpdateCommunityDialog
                community={ communityData }
                onUpdate={ handleCommunityUpdate }
              />
              <ManageCommunityFlairDialog
                community={ communityData }
              />
            </div>
          ) : (
            <p className="text-red-500 font-semibold">
              The "Update" button would not be visible because you are not the owner.
            </p>
          ) }
        </div>
      </div>
    </div>
  );
}
