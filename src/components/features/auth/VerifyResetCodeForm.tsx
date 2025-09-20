"use client";


import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/modules/services/auth-service";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { BrainCircuit } from "lucide-react";


const formSchema = z.object({
  code: z.string().min(6, { message: "Code must be 6 digits." }).max(6),
});


interface VerifyResetCodeFormProps {
  email: string;
  onSuccess: (resetToken: string) => void;
}


export function VerifyResetCodeForm({ email, onSuccess }: VerifyResetCodeFormProps) {
  const [ isLoading, setIsLoading ] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyPasswordResetCode({ email, code: values.code });
      toast.success("Code verified successfully!");
      onSuccess(response.reset_token);
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.response?.data?.message || error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardHeader className="items-center">
        <Link
          href="/"
          className="flex flex-col items-center gap-2 mb-2"
        >
          <BrainCircuit className="h-10 w-10 text-primary" />
          <CardTitle className="text-2xl">Synapse</CardTitle>
        </Link>
        <CardTitle className="mt-5 text-2xl uppercase">
          Enter Verification Code
        </CardTitle>
        <CardDescription>
          A 6-digit code was sent to <strong>{ email }</strong>. It will expire soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          { ...form }
        >

          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-4"
          >
            <FormField
              control={ form.control }
              name="code"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your verification code"
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <Button
              type="submit"
              className="w-full"
              disabled={ isLoading }
            >
              { isLoading ? "Verifying..." : "Verify" }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
