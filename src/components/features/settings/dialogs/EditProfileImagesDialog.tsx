"use client";


import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/MockAuthContext";
import { uploadImage } from "@/libs/mock-api";
import { toast } from "sonner";
import { User } from "@/types"
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
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/libs/utils";


interface EditProfileImagesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}


export default function EditProfileImagesDialog({
  isOpen,
  onOpenChange
}: EditProfileImagesDialogProps) {
  const { user, updateUserProfile } = useAuth();

  const [ avatarPreview, setAvatarPreview ] = useState<string | null>(null);
  const [ bannerPreview, setBannerPreview ] = useState<string | null>(null);
  const [ avatarFile, setAvatarFile ] = useState<File | null>(null);
  const [ bannerFile, setBannerFile ] = useState<File | null>(null);

  const [ isSaving, setIsSaving ] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[ 0 ];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatarPreview(previewUrl);
      setAvatarFile(file);
    } else {
      setBannerPreview(previewUrl);
      setBannerFile(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!avatarFile && !bannerFile) {
      toast.info("No new images were selected.");
      return;
    }

    setIsSaving(true);
    const updates: Partial<User> = {};

    try {
      if (avatarFile) {
        const newAvatarUrl = await uploadImage(avatarFile);
        updates.avatarUrl = newAvatarUrl;
      }
      if (bannerFile) {
        const newBannerUrl = await uploadImage(bannerFile);
        updates.bannerUrl = newBannerUrl;
      }

      updateUserProfile(updates);

      toast.success("Profile images updated successfully!");
      onOpenChange(false);

    } catch (error) {
      toast.error("Upload failed.", { description: "Something went wrong. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Customize your Profile
          </DialogTitle>
          <DialogDescription>
            Your avatar and banner represent you across Synapse.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Avatar</h4>
            <div className="flex items-center gap-4">
              <UserAvatar
                user={ {
                  ...(user || { username: "" }),
                  avatarUrl: avatarPreview || user?.avatarUrl,
                } as User }
                className="h-20 w-20 text-3xl"
              />
              <Button
                variant="outline"
                onClick={ () => avatarInputRef.current?.click() }
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Avatar
              </Button>
              <Input
                ref={ avatarInputRef }
                type="file"
                accept="image/*"
                className="hidden"
                onChange={ (e) => handleFileChange(e, "avatar") }
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Profile Banner</h4>
            <div
              onClick={ () => bannerInputRef.current?.click() }
              className={
                cn("relative h-40 w-full rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors",
                  bannerPreview || user?.bannerUrl ? "border-solid" : "border-dashed"
                )
              }
            >
              {
                (bannerPreview || user?.bannerUrl)
                  ? (
                    <Image
                      src={ bannerPreview || user?.bannerUrl || "" }
                      alt="Banner preview"
                      fill
                      style={ { objectFit: "cover" } }
                      className="rounded-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-8 w-8" />
                      <p>Upload a banner</p>
                      <p className="text-xs">
                        1200 x 400 recommended
                      </p>
                    </div>
                  )
              }
              <Input
                ref={ bannerInputRef }
                type="file"
                accept="image/*"
                className="hidden"
                onChange={ (e) => handleFileChange(e, "banner") }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={ () => onOpenChange(false) }
          >
            Cancel
          </Button>
          <Button
            onClick={ handleSaveChanges }
            disabled={ isSaving }
          >
            {
              isSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )
            }
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
