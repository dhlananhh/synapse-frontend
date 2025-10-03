"use client";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Community } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { TCreateCommunitySchema } from "@/libs/validators/community-validator";
import { CommunityInfoForm } from "./CommunityInfoForm";
import { CommunityImageForm } from "./CommunityImageForm";


type WizardStep = "info" | "images";


export function CommunityCreationWizard() {
  const router = useRouter();
  const [ step, setStep ] = useState<WizardStep>("info");
  const [ createdCommunity, setCreatedCommunity ] = useState<Community | null>(null);
  const [ isSubmittingInfo, setIsSubmittingInfo ] = useState(false);

  const handleInfoSubmit = async (data: TCreateCommunitySchema) => {
    setIsSubmittingInfo(true);
    try {
      const response = await communityService.createCommunity(data);
      setCreatedCommunity(response.data);
      toast.success("Community info saved! Now for the fun part.");
      setStep("images");
    } catch (error: any) {
      toast.error("Failed to create community", {
        description: error.response?.data?.errors[ 0 ]?.message
          || "Please check the name and try again."
      });
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  const handleFinish = (communityName: string) => {
    toast.success("Community created successfully!");
    router.push(`/c/${communityName}`);
  };

  return (
    <div>
      { step === "info" && (
        <CommunityInfoForm
          onSubmit={ handleInfoSubmit }
          isSubmitting={ isSubmittingInfo }
        />
      ) }
      { step === "images" && createdCommunity && (
        <CommunityImageForm
          community={ createdCommunity }
          onFinish={ handleFinish }
        />
      ) }
    </div>
  );
}
