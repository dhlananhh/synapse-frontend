"use client";


import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authService } from "@/modules/services/auth-service";

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
  new_password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});


interface SetNewPasswordFormProps {
  resetToken: string;
  onSuccess: () => void;
}


export function SetNewPasswordForm({ resetToken, onSuccess }: SetNewPasswordFormProps) {
  const [ isLoading, setIsLoading ] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { new_password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await authService.setNewPassword({ reset_token: resetToken, new_password: values.new_password });
      toast.success("Password updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to set new password", {
        description: error.response?.data?.message || "Your reset token might be expired."
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
          Set a New Password
        </CardTitle>
        <CardDescription>
          Choose a new, strong password for your account.
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
              name="new_password"
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Set New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
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
              disabled={ isLoading }
            >
              { isLoading ? "Saving..." : "Set New Password" }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
