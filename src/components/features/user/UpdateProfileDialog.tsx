"use client";


import React, { useState } from "react";
import { toast } from "sonner";

import {
  UserProfile,
  UpdateUserProfilePayload
} from "@/types/services/user";
import { userService } from "@/modules/services/user-service";

import { UpdateProfileForm } from "./UpdateProfileForm";
import { PrivacyConfirmDialog } from "./PrivacyConfirmDialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


interface UpdateProfileDialogProps {
  user: UserProfile;
  onProfileUpdate: (updatedUser: UserProfile) => void;
}


export function UpdateProfileDialog({ user, onProfileUpdate }: UpdateProfileDialogProps) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ isPrivacyConfirmOpen, setIsPrivacyConfirmOpen ] = useState(false);
  const [ isPrivate, setIsPrivate ] = useState(user.isPrivate);

  const handleFormSubmit = async (data: UpdateUserProfilePayload) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateUserProfile(user.id, data);
      toast.success("Profile updated successfully!");
      onProfileUpdate(updatedUser);
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Failed to update profile.", {
        description: error.response?.data?.error || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPrivacyChange = async () => {
    try {
      const response = await userService.togglePrivacy(user.id);
      setIsPrivate(response.isPrivate);
      onProfileUpdate({ ...user, isPrivate: response.isPrivate });
      toast.success(`Your profile is now ${response.isPrivate ? "private" : "public"}.`);

    } catch (error: any) {
      toast.error("Failed to update privacy setting.", {
        description: error.response?.data?.error || "Please try again.",
      });
    }
  };

  const handleSwitchClick = () => {
    setIsPrivacyConfirmOpen(true);
  };

  return (
    <>
      <Dialog
        open={ isOpen }
        onOpenChange={ setIsOpen }
      >
        <DialogTrigger asChild>
          <Button variant="outline">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <UpdateProfileForm
              initialData={ user }
              onSubmit={ handleFormSubmit }
              isSubmitting={ isSubmitting }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="font-semibold">
              Privacy Settings
            </Label>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm">
                Private Account
              </p>
              <Switch
                checked={ isPrivate }
                onCheckedChange={ handleSwitchClick }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <PrivacyConfirmDialog
        isOpen={ isPrivacyConfirmOpen }
        onOpenChange={ setIsPrivacyConfirmOpen }
        onConfirm={ handleConfirmPrivacyChange }
        isMakingPrivate={ !isPrivate }
      />
    </>
  );
}
