"use client";


import React, {
  useEffect,
  useState
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  UserPreferences,
  UpdateUserPreferencesPayload
} from "@/types/services/user";
import { userService } from "@/modules/services/user-service";
import { PreferencesForm } from "@/components/features/settings/PreferencesForm";
import {
  savePreferencesToSession,
  getPreferencesFromSession
} from "@/libs/sessionStorageManager";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordForm } from "@/components/features/settings/ChangePasswordForm";


export default function SettingsPage() {
  const { user: currentUser } = useAuth();
  const [ preferences, setPreferences ] = useState<UserPreferences | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      const loadPreferences = async () => {
        setIsLoading(true);
        const sessionPrefs = getPreferencesFromSession();
        if (sessionPrefs) {
          setPreferences(sessionPrefs);
          setIsLoading(false);
        }

        try {
          const serverPrefs = await userService.getUserPreferences(currentUser.id);
          setPreferences(serverPrefs);
          savePreferencesToSession(serverPrefs);
        } catch (error) {
          toast.error("Could not load settings from server.");
          if (!sessionPrefs) setPreferences(null);
        } finally {
          if (isLoading)
            setIsLoading(false);
        }
      };
      loadPreferences();
    }
  }, [ currentUser?.id, isLoading ]);

  const handleUpdatePreferences = async (data: UpdateUserPreferencesPayload) => {
    if (!currentUser?.id)
      return;
    setIsSubmitting(true);
    try {
      const updatedPrefs = await userService.updateUserPreferences(currentUser.id, data);
      setPreferences(updatedPrefs);
      savePreferencesToSession(updatedPrefs);
      toast.success("Preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to save preferences.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <SettingsPageSkeleton />;
    }

    if (!preferences) {
      return (
        <div>
          Could not load your preferences. Please try refreshing the page.
        </div>
      );
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: User Preferences Form */ }
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            Display & Language
          </h2>
          <PreferencesForm
            initialData={ preferences }
            onSave={ handleUpdatePreferences }
            isSubmitting={ isSubmitting }
          />
        </div>

        {/* Column 2: Change Password Form */ }
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            Change your account password
          </h2>
          <ChangePasswordForm />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          User Preferences
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings.
        </p>
      </div>
      <Separator />
      { renderContent() }
    </div>
  );
}


function SettingsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="border rounded-lg p-6 space-y-8">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="border rounded-lg p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
