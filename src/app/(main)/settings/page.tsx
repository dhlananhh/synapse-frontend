"use client";


import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/modules/services/user-service";
import {
  UserPreferences,
  UpdateUserPreferencesPayload
} from "@/types/services/user";

import SettingsPageSkeleton from "@/components/features/settings/SettingsPageSkeleton";
import { PreferencesForm } from "@/components/features/settings/PreferencesForm";
import { ChangePasswordForm } from "@/components/features/settings/ChangePasswordForm";

import { Separator } from "@/components/ui/separator";


export default function SettingsPage() {
  const { user: currentUser } = useAuth();
  const [ preferences, setPreferences ] = useState<UserPreferences | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchPreferences = async () => {
        setIsLoading(true);
        try {
          const data = await userService.getUserPreferences(currentUser.id);
          setPreferences(data);
        } catch (error) {
          console.error("Failed to fetch user preferences:", error);
          toast.error("Could not load your settings. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPreferences();
    }
  }, [ currentUser ]);

  const handleUpdatePreferences = async (data: UpdateUserPreferencesPayload) => {
    if (!currentUser) return;

    try {
      const updatedPreferences = await userService.updateUserPreferences(currentUser.id, data);
      setPreferences(updatedPreferences);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SettingsPageSkeleton />
    )
  }

  if (!preferences) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">
          Preferences not found.
        </h2>
        <p className="text-muted-foreground">
          Could not load settings. Please log in to configure your preferences.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mt-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and password.
        </p>
      </div>
      <div className="w-full border-t border-border"></div>

      <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
        <div className="flex flex-col">
          <PreferencesForm
            initialData={ preferences }
            onSave={ handleUpdatePreferences }
          />
        </div>

        <div className="flex flex-col">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
