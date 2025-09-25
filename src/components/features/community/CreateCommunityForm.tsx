"use client";


import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TCreateCommunitySchema, CreateCommunitySchema
} from "@/libs/validators/community-validator";
import { useAuth } from "@/context/AuthContext";
import { createCommunity } from "@/libs/mock-api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


export default function CreateCommunityForm() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TCreateCommunitySchema>({
    resolver: zodResolver(CreateCommunitySchema)
  });

  const onSubmit = async (data: TCreateCommunitySchema) => {
    if (!user) return;

    try {
      const newCommunity = await createCommunity(data, user.email);
      toast.success(`Community c/${newCommunity.slug} created successfully!`, {
        description: "You are now the owner of this community."
      });
      router.push("/communities/create");
    } catch (error: any) {
      toast.error("Failed to create community", {
        description: error.message || "An unexpected error occurred."
      });
    }
  };

  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
      <Card>
        <CardHeader>
          <CardTitle>
            Create a Community
          </CardTitle>
          <CardDescription>
            Give your new community a name and a unique URL slug to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              { ...register("name") }
              placeholder="e.g., React Developers"
            />
            {
              errors.name && (
                <p className="text-sm text-destructive">
                  { errors.name.message }
                </p>
              )
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">
              Community URL
            </Label>
            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-muted-foreground">
                c/
              </p>
              <Input
                id="slug"
                { ...register("slug") }
                className="pl-6"
                placeholder="react_devs"
              />
            </div>
            {
              errors.slug && (
                <p className="text-sm text-destructive">
                  { errors.slug.message }
                </p>
              )
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              { ...register("description") }
              rows={ 3 }
              placeholder="A short description of your community's purpose."
            />
            {
              errors.description && (
                <p className="text-sm text-destructive">
                  { errors.description.message }
                </p>
              )
            }
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            type="submit"
            disabled={ isSubmitting || !isDirty }
          >
            {
              isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )
            }
            Create Community
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
