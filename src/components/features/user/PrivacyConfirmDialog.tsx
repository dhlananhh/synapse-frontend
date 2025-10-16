"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PrivacyConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isMakingPrivate: boolean;
}

export function PrivacyConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isMakingPrivate,
}: PrivacyConfirmDialogProps) {
  const title = isMakingPrivate
    ? "Make Account Private?"
    : "Make Account Public?";

  const description = isMakingPrivate
    ? "Only your followers will be able to see your posts and activity. New users will have to send you a follow request. Are you sure you want to continue?"
    : "Your profile and posts will be visible to everyone on Synapse. Are you sure you want to continue?";

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
