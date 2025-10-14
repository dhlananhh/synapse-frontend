"use client";


import React, { useState } from "react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authService } from "@/modules/services/auth-service";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


const formSchema = z.object({
  current_password: z.string().min(1, "Current password is required."),
  new_password: z.string().min(8, "New password must be at least 8 characters."),
});

type FormValues = z.infer<typeof formSchema>;


export function ChangePasswordForm() {
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: data.current_password,
        newPassword: data.new_password,
      });

      toast.success("Password changed successfully!", {
        description: "You will need to use your new password next time you log in.",
      });

      form.reset();

    } catch (error: any) {
      toast.error("Failed to change password.", {
        description: error.response?.data?.message || "Please check your current password and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          For your security, we recommend choosing a strong password that you don"t use elsewhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          { ...form }>

          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-6"
          >
            <FormField
              control={ form.control }
              name="current_password"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password"
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
              name="new_password"
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
                    <FormDescription>Must be at least 8 characters long.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={ isSubmitting }
              >
                {
                  isSubmitting
                    ? "Updating..."
                    : "Update Password"
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
