"use client";


import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCommunitySchema,
  TCreateCommunitySchema
} from "@/libs/validators/community-validator"
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";


interface CommunityInfoFormProps {
  onSubmit: (data: TCreateCommunitySchema) => void;
  isSubmitting: boolean;
}


export function CommunityInfoForm({
  onSubmit,
  isSubmitting
}: CommunityInfoFormProps) {
  const form = useForm<TCreateCommunitySchema>({
    resolver: zodResolver(CreateCommunitySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "PUBLIC",
      isNSFW: false
    },
  });

  return (
    <Card>
      <CardContent className="pt-2">
        <Form
          { ...form }
        >
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-8"
          >
            <FormField
              control={ form.control }
              name="name"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your community name"
                        { ...field }
                      />
                    </FormControl>
                    <FormDescription>
                      Community name can only contain letters, numbers, underscores, and hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <FormField
              control={ form.control }
              name="description"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A community for..."
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage /
                    ></FormItem>
                )
              }
            />
            <FormField
              control={ form.control }
              name="status"
              render={
                ({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Community Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={ field.onChange }
                        defaultValue={ field.value }
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="PUBLIC" />
                          </FormControl>
                          <FormLabel className="font-normal">Public</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="PRIVATE" />
                          </FormControl>
                          <FormLabel className="font-normal">Private</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <FormField
              control={ form.control }
              name="isNSFW"
              render={
                ({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Adult Content</FormLabel>
                      <FormDescription>
                        Is your community 18+ (Not Safe For Work)?
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
                { isSubmitting ? "Creating..." : "Continue" }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
