"use client";


import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/modules/services/auth-service";
import {
  ChangePasswordSchema,
  TChangePasswordSchema
} from "@/libs/validators/auth-validator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Loader2 } from "lucide-react";


export function ChangePasswordForm() {
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const form = useForm<TChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });

  const onSubmit = async (data: TChangePasswordSchema) => {
    setIsSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully!", {
        description: "You will need to use your new password for your next login.",
        duration: 5000,
      });

      form.reset();
    } catch (error: any) {
      toast.error("Failed to change password.", {
        description: error.response?.data?.message
          || "Please check your current password.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password for enhanced account security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          { ...form }
        >
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-6"
          >
            <FormField
              control={ form.control }
              name="currentPassword"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Password
                    </FormLabel>
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
              name="newPassword"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>
                      New Password
                    </FormLabel>
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
                    <FormLabel>
                      Confirm New Password</FormLabel>
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
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={ isSubmitting }
              >
                {
                  isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
