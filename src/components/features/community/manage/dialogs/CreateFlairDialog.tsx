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


interface CreateFlairDialogProps {
  communityId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFlairCreated: (newFlair: CommunityFlair) => void;
}


export function CreateFlairDialog({
  communityId,
  isOpen,
  onOpenChange,
  onFlairCreated
}: CreateFlairDialogProps) {
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await communityService.createFlair(communityId, formData);
      toast.success(`Flair "${response.name}" created successfully!`);
      onFlairCreated(response);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to create flair.", {
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Flair</DialogTitle>
          <DialogDescription>
            Flairs help categorize content in your community.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <CommunityFlairForm
            initialData={ null }
            onSubmit={ handleFormSubmit }
            isSubmitting={ isSubmitting }
            onCancel={ () => onOpenChange(false) }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
