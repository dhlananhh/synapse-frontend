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


interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLogout: () => void;
}


export function LogoutConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirmLogout,
}: LogoutConfirmDialogProps) {
  return (
    <AlertDialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to log out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be returned to the login screen. Any unsaved changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={ onConfirmLogout }
          >
            Confirm Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
