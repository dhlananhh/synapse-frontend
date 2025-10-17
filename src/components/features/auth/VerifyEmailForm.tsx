"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authService } from "@/modules/services/auth-service";
import {
  VerifyEmailSchema,
  TVerifyEmailSchema,
} from "@/libs/validators/auth-validator";

import VerifyEmailSkeleton from "@/components/features/auth/VerifyEmailSkeleton";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ isClient, setIsClient ] = useState(false);
  const [ isResending, setIsResending ] = useState(false);
  const email = searchParams.get("email");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<TVerifyEmailSchema>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: { code: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TVerifyEmailSchema) => {
    if (!email) return;

    try {
      await authService.verifyEmail({
        email,
        code: data.code,
      });
      toast.success("Email Verified!", {
        description:
          "Your account is now active. You can log in.",
      });
      router.push("/login");
    } catch (error: any) {
      toast.error("Verification Failed", {
        description:
          error.response?.data?.message ||
          "Invalid or expired code.",
      });
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await authService.resendVerification({ email });
      toast.info("A new verification code has been sent.");
    } catch (error: any) {
      toast.error("Failed to Resend Code", {
        description:
          error.response?.data?.message ||
          "Please try again later.",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!isClient) {
    return <VerifyEmailSkeleton />;
  }

  if (!email) {
    return (
      <Card className="mx-auto w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">
            Error
          </CardTitle>
          <CardDescription>
            Email parameter is missing from the URL. Please
            return to the registration page and try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/register">Go to Registration</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-lg shadow-xl">
      <CardHeader className="items-center text-center">
        <Link
          href="/"
          className="mb-4 flex flex-col items-center gap-2"
        >
          <BrainCircuit className="text-primary h-10 w-10" />
          <CardTitle className="text-2xl">
            Synapse
          </CardTitle>
        </Link>

        <CardTitle className="mt-5 text-2xl uppercase">
          Verify Your Email
        </CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit verification code to{ " " }
          <strong>{ email }</strong>. <br />
          Please enter it below to activate your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form { ...form }>
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-6"
          >
            <FormField
              control={ form.control }
              name="code"
              render={ ({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={ 6 } { ...field }>
                      <InputOTPGroup>
                        <InputOTPSlot index={ 0 } />
                        <InputOTPSlot index={ 1 } />
                        <InputOTPSlot index={ 2 } />
                        <InputOTPSlot index={ 3 } />
                        <InputOTPSlot index={ 4 } />
                        <InputOTPSlot index={ 5 } />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              ) }
            />
            <Button
              type="submit"
              className="w-full"
              disabled={ isSubmitting }
            >
              { isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify Account"
              ) }
            </Button>
          </form>
        </Form>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          Didn&apos;t receive a code?{ " " }
          <Button
            variant="link"
            className="h-auto p-0"
            onClick={ handleResendCode }
            disabled={ isResending }
          >
            { isResending ? "Sending..." : "Resend Code" }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
