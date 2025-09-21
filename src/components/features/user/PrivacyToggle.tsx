"use client";


import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/modules/services/user-service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


interface PrivacyToggleProps {
  initialIsPrivate: boolean;
  userId: string;
}


export function PrivacyToggle({ initialIsPrivate, userId }: PrivacyToggleProps) {
  const { user } = useAuth();
  const [ isPrivate, setIsPrivate ] = useState(initialIsPrivate);
  const [ isLoading, setIsLoading ] = useState(false);

  const isOwner = user?.id === userId;
  if (!isOwner) {
    return null;
  }

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await userService.togglePrivacy(userId);
      setIsPrivate(checked);
      toast.success(`Your account is now ${checked ? "private" : "public"}.`);
    } catch (error: any) {
      toast.error("Failed to update privacy", {
        description: error.response?.data?.message || "Please try again later."
      });
      setIsPrivate(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="privacy-mode"
        checked={ isPrivate }
        onCheckedChange={ handleToggle }
        disabled={ isLoading }
      />
      <Label htmlFor="privacy-mode">
        Private Account
      </Label>
    </div>
  );
}
