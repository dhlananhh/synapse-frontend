"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPreferences } from "@/types/services/user";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  theme: z.enum([ "light", "dark" ]),
  language: z.string(),
  extras: z.object({
    notifications: z.boolean(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PreferencesFormProps {
  initialData: UserPreferences;
  onSave: (data: FormValues) => Promise<void>;
}

export function PreferencesForm({
  initialData,
  onSave,
}: PreferencesFormProps) {
  const { setTheme } = useTheme();
  const { i18n } = useTranslation();
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: initialData.theme,
      language: initialData.language,
      extras: {
        notifications:
          initialData.extras?.notifications ?? true,
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    await onSave(data);

    setTheme(data.theme);
    i18n.changeLanguage(data.language);

    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Display & Feeds</CardTitle>
        <CardDescription>
          Customize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form { ...form }>
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-8"
          >
            <FormField
              control={ form.control }
              name="theme"
              render={ ({ field }) => (
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
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">
                        Light
                      </SelectItem>
                      <SelectItem value="dark">
                        Dark
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              ) }
            />

            <FormField
              control={ form.control }
              name="language"
              render={ ({ field }) => (
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
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">
                        English
                      </SelectItem>
                      <SelectItem value="vi">
                        Tiếng Việt
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              ) }
            />

            <FormField
              control={ form.control }
              name="extras.notifications"
              render={ ({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>
                      Enable Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive notifications about your
                      activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={ field.value }
                      onCheckedChange={ field.onChange }
                    />
                  </FormControl>
                </FormItem>
              ) }
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={ isSubmitting }>
                { isSubmitting
                  ? "Saving..."
                  : "Save Changes" }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
