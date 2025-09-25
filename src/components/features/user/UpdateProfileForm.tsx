"use client";


import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { UserProfile } from "@/types/services/user";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  bio: z.string().max(255, "Bio must not exceed 255 characters").optional(),
  location: z.string().max(100, "Location must not exceed 100 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;


interface UpdateProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
}


export function UpdateProfileForm({
  initialData,
  onSubmit,
  isSubmitting
}: UpdateProfileFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      username: initialData.username || "",
      bio: initialData.bio || "",
      location: initialData.location || "",
    },
  });

  return (
    <Form
      { ...form }
    >
      <form
        onSubmit={ form.handleSubmit(onSubmit) }
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */ }
          <FormField
            control={ form.control }
            name="firstName"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      { ...field }
                      placeholder="Enter your first name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }
          />

          {/* Last Name */ }
          <FormField
            control={ form.control }
            name="lastName"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      { ...field }
                      placeholder="Enter your last name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }
          />
        </div>

        {/* Username */ }
        <FormField
          control={ form.control }
          name="username"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    { ...field }
                    placeholder="Enter your username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }
        />

        {/* Bio */ }
        <FormField
          control={ form.control }
          name="bio"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    { ...field }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }
        />

        {/* Location */ }
        <FormField
          control={ form.control }
          name="location"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Earth"
                    { ...field }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }
        />

        {/* Submit Button */ }
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={ isSubmitting }
          >
            {
              isSubmitting
                ? "Saving..."
                : "Save Changes"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
