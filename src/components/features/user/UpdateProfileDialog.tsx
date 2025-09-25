"use client";


import React, { useState } from "react";
import { toast } from "sonner";

import { UserProfile } from "@/types/services/user";

import { UpdateProfileForm } from "./UpdateProfileForm";
import { PrivacyConfirmDialog } from "./PrivacyConfirmDialog";
import { userService } from "@/modules/services/user-service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


interface UpdateProfileDialogProps {
  user: UserProfile;
  onProfileUpdate: (updatedUser: UserProfile) => void;
}


export function UpdateProfileDialog({ user, onProfileUpdate }: UpdateProfileDialogProps) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ isConfirmingPrivacy, setIsConfirmingPrivacy ] = useState(false);

  const [ isPrivate, setIsPrivate ] = useState(user.isPrivate);

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateUserProfile(user.id, data);
      toast.success("Profile updated successfully!");
      onProfileUpdate(updatedUser);
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Failed to update profile.", {
        description: error.response?.data?.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPrivacy = async () => {
    try {
      await userService.togglePrivacy(user.id);
      const newPrivacyState = !isPrivate;
      setIsPrivate(newPrivacyState);
      onProfileUpdate({ ...user, isPrivate: newPrivacyState });
      toast.success(`Your profile is now ${newPrivacyState ? "private" : "public"}.`);
    } catch (error: any) {
      toast.error("Failed to update privacy setting.");
    }
  }

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
          </DialogHeader>

          <div className="py-4">
            <UpdateProfileForm
              initialData={ user }
              onSubmit={ handleFormSubmit }
              isSubmitting={ isSubmitting }
            />
          </div>

          <DialogFooter className="flex-col items-start border-t pt-4">
            <Label className="font-semibold">
              Privacy Settings
            </Label>
            <div className="flex items-center space-x-2 mt-2 w-full justify-between">
              <Label htmlFor="privacy-mode">
                Private Account
              </Label>
              <Switch
                id="privacy-mode"
                checked={ isPrivate }
                onCheckedChange={ () => setIsConfirmingPrivacy(true) }
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <PrivacyConfirmDialog
        isOpen={ isConfirmingPrivacy }
        onOpenChange={ setIsConfirmingPrivacy }
        onConfirm={ handleConfirmPrivacy }
        isMakingPrivate={ !isPrivate }
      />
    </>
  );
}
