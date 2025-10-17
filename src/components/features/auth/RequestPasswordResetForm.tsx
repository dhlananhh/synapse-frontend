"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authService } from "@/modules/services/auth-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BrainCircuit } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

interface RequestCodeFormProps {
  onSuccess: (email: string) => void;
}

export function RequestPasswordResetForm({
  onSuccess,
}: RequestCodeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      await authService.requestPasswordReset({
        email: values.email,
      });
      toast.success("Code Sent", {
        description:
          "A password reset code has been sent to your email.",
      });
      onSuccess(values.email);
    } catch (error) {
      toast.error("Error", {
        description:
          "Failed to send reset code. Please check the email and try again.",
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
          Reset Your Password
        </CardTitle>
        <CardDescription>
          Enter your email to receive a verification code.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form { ...form }>
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-4"
          >
            <FormField
              control={ form.control }
              name="email"
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      { ...field }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />

            <Button
              type="submit"
              className="w-full"
              disabled={ form.formState.isSubmitting }
            >
              {
                form.formState.isSubmitting
                  ? "Sending..."
                  : "Send Code"
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
