"use client";


import React, {
  useState,
  useRef
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Community } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Image as ImageIcon,
  Upload,
  Loader2
} from "lucide-react";


interface UpdateCommunityImagesDialogProps {
  community: Community;
  onUpdate: (updatedCommunity: Community) => void;
}


export function UpdateCommunityImagesDialog({
  community,
  onUpdate
}: UpdateCommunityImagesDialogProps) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isUploading, setIsUploading ] = useState(false);

  const [ avatarPreview, setAvatarPreview ] = useState<string | null>(community.avatarUrl);
  const [ bannerPreview, setBannerPreview ] = useState<string | null>(community.bannerUrl);
  const [ avatarFile, setAvatarFile ] = useState<File | null>(null);
  const [ bannerFile, setBannerFile ] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner"
  ) => {
    const file = event.target.files?.[ 0 ];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "avatar") {
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
      } else {
        setBannerFile(file);
        setBannerPreview(previewUrl);
      }
    }
    event.target.value = "";
  };

  const handleSaveChanges = async () => {
    setIsUploading(true);
    let latestCommunityData = community;

    try {
      if (avatarFile) {
        const response = await communityService.updateAvatar(community.id, avatarFile);
        latestCommunityData = response.data;
        toast.success("Avatar updated successfully!");
      }

      if (bannerFile) {
        const response = await communityService.updateBanner(community.id, bannerFile);
        latestCommunityData = response.data;
        toast.success("Banner updated successfully!");
      }

      if (avatarFile || bannerFile) {
        onUpdate(latestCommunityData);
      }

      setIsOpen(false);

    } catch (error: any) {
      toast.error("Failed to upload images.", {
        description: error.response?.data?.message
          || "Please try again later!",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAvatarFile(null);
      setBannerFile(null);
      setAvatarPreview(community.avatarUrl);
      setBannerPreview(community.bannerUrl);
    }
    setIsOpen(open);
  }

  const hasChanges = !!avatarFile || !!bannerFile;

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ handleOpenChange }
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          <Camera className="h-4 w-4" />
          Change Images
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Update Community Images
          </DialogTitle>
          <DialogDescription>
            Change the avatar and banner for your community.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Avatar Section */ }
          <div className="space-y-2">
            <Label className="font-semibold">
              Avatar Image
            </Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={ avatarPreview ?? undefined }
                />
                <AvatarFallback className="bg-secondary">
                  <ImageIcon
                    className="h-10 w-10 text-muted-foreground"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={ () => avatarInputRef.current?.click() }
                >
                  <Upload className="h-4 w-4" />
                  Upload Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: Square image (e.g., 512x512px)
                </p>
              </div>
              <input
                ref={ avatarInputRef }
                type="file"
                accept="image/*"
                className="hidden"
                onChange={ (e) => handleFileChange(e, "avatar") }
              />
            </div>
          </div>
          {/* Banner Section */ }
          <div className="space-y-2">
            <Label className="font-semibold">
              Banner Image
            </Label>
            <div
              className="relative w-full aspect-[3/1] bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed cursor-pointer"
              onClick={ () => bannerInputRef.current?.click() }
            >
              {
                bannerPreview ? (
                  <Image
                    src={ bannerPreview }
                    alt="Banner Preview"
                    className="w-full h-full object-cover rounded-md"
                    width={ 500 }
                    height={ 500 }
                  />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-1">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-sm font-medium">
                      Click to upload banner
                    </p>
                  </div>
                )
              }
              <p className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                Recommended: 3:1 ratio (e.g., 1920x640px)
              </p>
            </div>
            <input
              ref={ bannerInputRef }
              type="file"
              accept="image/*"
              className="hidden"
              onChange={ (e) => handleFileChange(e, "banner") }
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={ handleSaveChanges }
            disabled={ !hasChanges || isUploading }
          >
            {
              isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            }
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
