"use client";

import React, { useState } from "react";
import { RequestPasswordResetForm } from "./RequestPasswordResetForm";
import { VerifyResetCodeForm } from "./VerifyResetCodeForm";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

type Step = "request" | "verify" | "set_new_password";

export function ResetPasswordFlow() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");

  const handleCodeRequestSuccess = (
    requestedEmail: string
  ) => {
    setEmail(requestedEmail);
    setStep("verify");
  };

  const handleVerificationSuccess = () => {
    setStep("set_new_password");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {step === "request" && (
        <RequestPasswordResetForm
          onSuccess={handleCodeRequestSuccess}
        />
      )}
      {step === "verify" && (
        <VerifyResetCodeForm
          email={email}
          onSuccess={handleVerificationSuccess}
        />
      )}
      {step === "set_new_password" && (
        <SetNewPasswordForm />
      )}
    </div>
  );
}
