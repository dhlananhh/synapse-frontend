"use client";


import React, {
  useEffect,
  useState
} from "react";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCommunity,
  useSetCommunity
} from "@/context/CommunityContext";
import { useMembership } from "@/context/MembershipContext";
import { Community } from "@/types/services/community";
import { TUpdateCommunityDetailsSchema } from "@/libs/validators/community-validator";
import { communityService } from "@/modules/services/community-service";
import UpdateCommunityForm from "@/components/features/community/UpdateCommunityForm";
import { ImageUploader } from "@/components/features/community/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Lock,
  Loader2,
  ImageIcon
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


export default function EditCommunityPage() {
  const initialCommunity = useCommunity();
  const setCommunityContext = useSetCommunity();
  const membershipContext = useMembership();
  const router = useRouter();

  const [ community, setCommunity ] = useState<Community | null>(initialCommunity);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  useEffect(() => {
    setCommunity(initialCommunity);
  }, [ initialCommunity ]);

  const isLoadingContext = !community || !membershipContext;
  const isOwner = membershipContext?.membership?.role === "OWNER";

  if (isLoadingContext) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-20">
        <Lock className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          Only the owner of { " " }
          <span className="font-semibold">
            c/{ community.name }
          </span>
          { " " } can edit these settings.
        </p>
        <Button
          variant="outline"
          onClick={ () => router.back() }
          className="mt-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const handleFormSubmit = async (formData: TUpdateCommunityDetailsSchema) => {
    setIsSubmitting(true);
    try {
      const response = await communityService.updateCommunity(community.id, formData);
      toast.success("The latest changes to the community have been successfully updated!", {
        duration: 5000,
      });
      setCommunity(response);
      setTimeout(() => {
        router.push(`/c/${response.name}`)
      }, 5000);
    } catch (error: any) {
      toast.error("Failed to save settings.", {
        description: error.response?.data?.errors?.[ 0 ]?.message
          || error.response?.data?.message
          || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (
    type: "avatar" | "banner",
    file: File
  ): Promise<string | null> => {
    let response;
    if (type === "avatar") {
      response = await communityService.updateAvatar(community.id, file);
    } else {
      response = await communityService.updateBanner(community.id, file);
    }

    const updatedCommunity = response.data;
    setCommunity(updatedCommunity);
    setCommunityContext(updatedCommunity);

    return type === "avatar" ? updatedCommunity.avatarUrl : updatedCommunity.bannerUrl;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Button
        variant="ghost"
        onClick={ () => router.back() }
        className="mb-4 -ml-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to c/{ community.name }
      </Button>

      {/* Card for Community details */ }
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Edit Community Details
          </CardTitle>
          <CardDescription>
            Update your community's name, description, and privacy settings.
            Changes will be visible to everyone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateCommunityForm
            initialData={ community }
            onSubmit={ handleFormSubmit }
            isSubmitting={ isSubmitting }
          />
        </CardContent>
      </Card>

      {/* Card for image uploader */ }
      <Card>
        <CardHeader>
          <CardTitle>
            Community Visuals
          </CardTitle>
          <CardDescription>
            Customize a new aesthetic look of your community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Uploader */ }
          <ImageUploader
            label="Community Avatar"
            description="Appears on your community's page and in feeds."
            currentImageUrl={ community.avatarUrl }
            onUpload={ (file) => handleImageUpload("avatar", file) }
            renderPreview={
              (previewUrl) => (
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={ previewUrl ?? undefined }
                  />
                  <AvatarFallback className="text-3xl">
                    { community.name.charAt(0).toUpperCase() }
                  </AvatarFallback>
                </Avatar>
              )
            }
          />
          <Separator />
          {/* Banner Uploader */ }
          <ImageUploader
            label="Community Banner"
            description="Appears at the top of your community page."
            currentImageUrl={ community.bannerUrl }
            onUpload={ (file) => handleImageUpload("banner", file) }
            renderPreview={ (previewUrl) => (
              <div className="w-48 aspect-[3/1] bg-secondary rounded-md flex items-center justify-center border-2 border-dashed">
                {
                  previewUrl ? (
                    <Image
                      src={ previewUrl }
                      alt="Banner Preview"
                      className="w-full h-full object-cover rounded-md"
                      width={ 500 }
                      height={ 500 }
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )
                }
              </div>
            )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
