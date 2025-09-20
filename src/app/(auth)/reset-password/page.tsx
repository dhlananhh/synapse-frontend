"use client";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequestPasswordResetForm } from "@/components/features/auth/RequestPasswordResetForm";
import { VerifyResetCodeForm } from "@/components/features/auth/VerifyResetCodeForm";
import { SetNewPasswordForm } from "@/components/features/auth/SetNewPasswordForm";


type Step = "request" | "verify" | "set_new_password";


export default function ResetPasswordPage() {
  const router = useRouter();
  const [ step, setStep ] = useState<Step>("request");
  const [ email, setEmail ] = useState("");
  const [ resetToken, setResetToken ] = useState("");

  const handleRequestSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("verify");
  };

  const handleVerifySuccess = (verifiedToken: string) => {
    setResetToken(verifiedToken);
    setStep("set_new_password");
  };

  const handleResetSuccess = () => {
    toast.success("Password has been reset successfully! Please log in.");
    router.push("/login");
  };

  const renderStep = () => {
    switch (step) {
      case "request":
        return (
          <RequestPasswordResetForm
            onSuccess={ handleRequestSuccess }
          />
        )

      case "verify":
        return (
          <VerifyResetCodeForm
            email={ email }
            onSuccess={ handleVerifySuccess }
          />
        )

      case "set_new_password":
        return (
          <SetNewPasswordForm
            resetToken={ resetToken }
            onSuccess={ handleResetSuccess }
          />
        )

      default:
        return (
          <RequestPasswordResetForm
            onSuccess={ handleRequestSuccess }
          />
        )
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        { renderStep() }
      </div>
    </div>
  );
}
