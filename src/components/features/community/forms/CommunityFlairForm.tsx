"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HexColorPicker } from "react-colorful";
import { CommunityFlair } from "@/types/services/community";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  name: z.string().min(1, "Flair name is required").max(30),
  description: z.string().max(100).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color")
    .optional()
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface CommunityFlairFormProps {
  initialData?: CommunityFlair | null;
  onSubmit: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function CommunityFlairForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: CommunityFlairFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      color: initialData?.color || "#3b82f6",
    },
  });

  return (
    <Form { ...form }>
      <form
        onSubmit={ form.handleSubmit(onSubmit) }
        className="space-y-4 rounded-md border p-4"
      >
        <FormField
          control={ form.control }
          name="name"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel>Flair Name</FormLabel>
              <FormControl>
                <Input { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="description"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="color"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={ {
                          backgroundColor:
                            field.value ?? undefined,
                        } }
                      />
                      <span>{ field.value }</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-0 p-0">
                  <HexColorPicker
                    color={ field.value ?? "" }
                    onChange={ field.onChange }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          ) }
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={ onCancel }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={ isSubmitting }
          >
            {
              isSubmitting
                ? "Saving..."
                : initialData
                  ? "Save Changes"
                  : "Create Flair"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
