"use client";

import React, { useState } from "react";
import { userService } from "@/modules/services/user-service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PrivacyConfirmDialog } from "./PrivacyConfirmDialog";
import { UserProfile } from "@/types/services/user";

interface PrivacyToggleProps {
  profile: UserProfile;
  onPrivacyChange: (isPrivate: boolean) => void;
}

export function PrivacyToggle({
  profile,
  onPrivacyChange,
}: PrivacyToggleProps) {
  const [isPrivate, setIsPrivate] = useState(
    profile.isPrivate
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => setIsConfirming(true);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await userService.togglePrivacy();
      const newPrivacy = !isPrivate;
      setIsPrivate(newPrivacy);
      onPrivacyChange(newPrivacy);
      toast.success(
        `Your profile is nowwww ${newPrivacy ? "private" : "public"}.`
      );
    } catch {
      toast.error("Failed to update privacy setting.");
    } finally {
      setLoading(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="privacy-switch">
        Private Profile
      </Label>
      <Switch
        id="privacy-switch"
        checked={isPrivate}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <PrivacyConfirmDialog
        isOpen={isConfirming}
        onOpenChange={setIsConfirming}
        onConfirm={handleConfirm}
        isMakingPrivate={!isPrivate}
      />
    </div>
  );
}
