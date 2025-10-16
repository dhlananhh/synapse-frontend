"use client";


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import i18n from "@/libs/i18n";
import {
  UserPreferences,
  UpdateUserPreferencesPayload
} from "@/types/services/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";


const preferencesSchema = z.object({
  theme: z.enum([ "light", "dark" ]),
  language: z.string(),
  extras: z.object({
    notifications: z.boolean(),
  }),
});
type FormValues = z.infer<typeof preferencesSchema>;


interface PreferencesFormProps {
  initialData: UserPreferences;
  onSave: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
}


export function PreferencesForm({
  initialData,
  onSave,
  isSubmitting
}: PreferencesFormProps) {
  const { setTheme } = useTheme();
  const { i18n } = useTranslation();


  const form = useForm<FormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: initialData.theme,
      language: initialData.language,
      extras: {
        notifications: initialData.extras?.notifications ?? true,
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    await onSave(data);
    setTheme(data.theme);
    i18n.changeLanguage(data.language);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          { ...form }
        >
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-8"
          >
            <FormField
              control={ form.control }
              name="theme"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <FormDescription>
                      Select the theme for your interface.
                    </FormDescription>
                    <Select
                      onValueChange={ field.onChange }
                      defaultValue={ field.value }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )
              }
            />

            <FormField
              control={ form.control }
              name="language"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormDescription>
                      Select your preferred language.
                    </FormDescription>
                    <Select
                      onValueChange={ field.onChange }
                      defaultValue={ field.value }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="us">
                          English (US)
                        </SelectItem>
                        <SelectItem value="vi">
                          Tiếng Việt
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )
              }
            />

            <FormField
              control={ form.control }
              name="extras.notifications"
              render={
                ({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>
                        Enable Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive notifications about mentions and other activity.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={ field.value }
                        onCheckedChange={ field.onChange }
                      />
                    </FormControl>
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
                Save Preferences
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
