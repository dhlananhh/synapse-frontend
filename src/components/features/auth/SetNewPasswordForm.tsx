"use client";


import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BrainCircuit } from "lucide-react";


const formSchema = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.newPassword, {
  message: "Passwords don't match",
  path: [ "confirmPassword" ],
});


export function SetNewPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await authService.setNewPassword({ newPassword: values.newPassword });
      toast("Success!", {
        description: "Your password has been reset. You can now log in.",
      });
      router.push("/login");
    } catch (error) {
      toast("Error", {
        description: "Your session may have expired. Please start the process over.",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-lg shadow-xl">
      <CardHeader className="items-center text-center">
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
          Choose a strong password for your account.
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
              name="newPassword"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <FormField
              control={ form.control }
              name="confirmPassword"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
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
              disabled={ form.formState.isSubmitting }
            >
              {
                form.formState.isSubmitting
                  ? "Saving..."
                  : "Set New Password"
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card >
  );
}
