"use client";


import React, { useState } from "react";
import { toast } from "sonner";
import { communityService } from "@/modules/services/community-service";
import { CommunityFlair } from "@/types/services/community";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { CommunityFlairForm } from "@/components/features/community/CommunityFlairForm";


interface UpdateFlairDialogProps {
  communityId: string;
  flair: CommunityFlair;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFlairUpdated: (updatedFlair: CommunityFlair) => void;
  children: React.ReactNode;
}


export function UpdateFlairDialog({
  communityId,
  flair,
  onFlairUpdated,
  isOpen,
  onOpenChange,
  children
}: UpdateFlairDialogProps) {
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await communityService.updateFlair(communityId, flair.id, formData);
      toast.success(`Flair "${response.name}" updated successfully!`);
      onFlairUpdated(response);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to update flair.", {
        description: error.response?.data?.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Flair</DialogTitle>
          <DialogDescription>
            Make changes to the flair "{ flair.name }".
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <CommunityFlairForm
            initialData={ flair }
            onSubmit={ handleFormSubmit }
            isSubmitting={ isSubmitting }
            onCancel={ () => onOpenChange(false) }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
