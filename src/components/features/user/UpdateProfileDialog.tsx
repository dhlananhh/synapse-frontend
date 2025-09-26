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


interface UpdateProfileDialogProps {
  user: UserProfile;
  onProfileUpdate: (updatedUser: UserProfile) => void;
}


export function UpdateProfileDialog({ user, onProfileUpdate }: UpdateProfileDialogProps) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ isConfirmingPrivacy, setIsConfirmingPrivacy ] = useState(false);

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
