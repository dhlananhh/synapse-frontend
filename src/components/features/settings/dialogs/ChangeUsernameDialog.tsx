"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUserProfileSchema,
  UserProfileSchema
} from "@/libs/validators/user-validator";
import { toast } from "sonner";
import { useAuth } from "@/context/MockAuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";


interface ChangeUsernameDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}


export default function ChangeUsernameDialog({
  isOpen,
  onOpenChange
}: ChangeUsernameDialogProps) {

  const { user, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TUserProfileSchema>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: { username: user?.username || "" }
  });

  const onSubmit = async (data: TUserProfileSchema) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Updating username:", data);
    updateUserProfile(data);
    toast.success("Username updated successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change username</DialogTitle>
          <DialogDescription className="">
            You'll be able to change your username back to { " " }
            <span className="font-semibold">{ user?.username }</span>
            { " " } for another 14 days.
          </DialogDescription>
        </DialogHeader>
        <form
          id="change-username-form"
          onSubmit={ handleSubmit(onSubmit) }
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="username">New username</Label>
            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-muted-foreground">
                u/
              </p>
              <Input
                id="username"
                type="text" { ...register("username") }
                className="pl-6"
              />
            </div>
            { errors.username && <p className="text-sm text-destructive">{ errors.username.message }</p> }
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={ () => onOpenChange(false) }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="change-username-form"
            disabled={ isSubmitting || !isDirty }
          >
            { isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            Change Username
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
