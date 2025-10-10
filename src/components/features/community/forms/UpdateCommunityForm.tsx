"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Community } from "@/types/services/community";
import {
  TUpdateCommunityDetailsSchema,
  UpdateCommunityDetailsSchema,
} from "@/libs/validators/community-validator";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface UpdateCommunityFormProps {
  initialData: Community;
  onSubmit: (
    data: TUpdateCommunityDetailsSchema
  ) => Promise<void>;
  isSubmitting: boolean;
}

export default function UpdateCommunityForm({
  initialData,
  onSubmit,
  isSubmitting,
}: UpdateCommunityFormProps) {
  const form = useForm<TUpdateCommunityDetailsSchema>({
    resolver: zodResolver(UpdateCommunityDetailsSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      isPrivate: initialData.isPrivate || false,
      isNSFW: initialData.isNSFW || false,
      moderationMode: initialData.moderationMode || false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Community name must be 3-50 characters long
                and can only contain letters, numbers,
                underscores, and hyphens.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Private Community</FormLabel>
                <FormDescription>
                  Only approved members can view and post.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isNSFW"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Adult Content (NSFW)</FormLabel>
                <FormDescription>
                  Check this box if your community contains
                  content intended for members aged 18 and
                  older.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moderationMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Moderation Mode</FormLabel>
                <FormDescription>
                  All posts require moderator approval.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
