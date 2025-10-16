"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authService } from "@/modules/services/auth-service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BrainCircuit } from "lucide-react";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

interface VerifyCodeFormProps {
  email: string;
  onSuccess: () => void;
}

export function VerifyResetCodeForm({
  email,
  onSuccess,
}: VerifyCodeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      await authService.verifyPasswordResetCode({
        email,
        code: values.code,
      });
      toast.success("Code Verified", {
        description: "You can now set a new password.",
      });
      onSuccess();
    } catch (error: any) {
      toast.error("Invalid Code", {
        description:
          error.response?.data?.message ||
          "The code is incorrect or has expired. Please try again.",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="items-center text-center">
        <Link
          href="/"
          className="mb-2 flex flex-col items-center gap-2"
        >
          <BrainCircuit className="text-primary h-10 w-10" />
          <CardTitle className="text-2xl">
            Synapse
          </CardTitle>
        </Link>
        <CardTitle className="mt-5 text-2xl uppercase">
          Enter Verification Code
        </CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit code to {email}. It
          expires in 5 minutes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enter your verification code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Verifying..."
                : "Verify Code"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
