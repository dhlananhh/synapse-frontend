"use client";

import React, { useState, useEffect } from "react";
import {
  useForm,
  Controller,
  useWatch,
} from "react-hook-form";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TPostSchema,
  PostSchema,
} from "@/libs/validators/post-validator";
import { useAuth } from "@/context/AuthContext";
import {
  createPost,
  fetchFlairsForCommunity,
} from "@/libs/mock-api";
import { mockCommunities } from "@/libs/mock-data";
import { Community, Flair, Post, User } from "@/types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Editor from "@/components/shared/Editor";
import { cn } from "@/libs/utils";
import { PATHS } from "@/libs/paths";
import { FormProvider } from "react-hook-form";
import { AuthUser } from "@/types/services/auth";

export default function CreatePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [flairs, setFlairs] = useState<Flair[]>([]);
  const [isLoadingFlairs, setIsLoadingFlairs] =
    useState(false);

  const preselectedCommunitySlug =
    searchParams.get("community");
  const preselectedCommunity = mockCommunities.find(
    (c) => c.slug === preselectedCommunitySlug
  );

  const methods = useForm<TPostSchema>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      communityId: preselectedCommunity?.id || "",
    },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedCommunityId = useWatch({
    control,
    name: "communityId",
  });

  useEffect(() => {
    if (!selectedCommunityId) {
      setFlairs([]);
      return;
    }

    const loadFlairs = async () => {
      setIsLoadingFlairs(true);
      try {
        const fetchedFlairs = await fetchFlairsForCommunity(
          selectedCommunityId
        );
        setFlairs(fetchedFlairs);
      } catch (error) {
        console.error("Failed to fetch flairs", error);
        toast.error(
          "Could not load flairs for this community."
        );
        setFlairs([]);
      } finally {
        setIsLoadingFlairs(false);
      }
    };

    loadFlairs();
  }, [selectedCommunityId]);

  const onSubmit = async (data: TPostSchema) => {
    if (!user) {
      toast.error(
        "You must be logged in to create a post."
      );
      return;
    }

    try {
      const newPost = await createPost(
        data,
        user as AuthUser
      );
      toast.success("Post created successfully!");
      router.push(PATHS.post(newPost.id));
    } catch (error: any) {
      toast.error("Failed to create post", {
        description:
          error.message ||
          "A community with that URL already exists. Please choose another.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
          <CardDescription>
            Choose a community and share your thoughts with
            the world.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Choose a Community</Label>
            <Controller
              control={control}
              name="communityId"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="mt-1 w-full justify-between"
                    >
                      {field.value
                        ? `c/${mockCommunities.find((c) => c.id === field.value)?.slug}`
                        : "Select a community..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search communities..." />
                      <CommandList>
                        <CommandEmpty>
                          No communities found.
                        </CommandEmpty>
                        <CommandGroup>
                          {mockCommunities.map(
                            (community) => (
                              <CommandItem
                                key={community.id}
                                value={community.slug}
                                onSelect={() =>
                                  field.onChange(
                                    community.id
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    community.id ===
                                      field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                c/{community.slug}
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.communityId && (
              <p className="text-destructive mt-1 text-sm">
                {errors.communityId.message}
              </p>
            )}
          </div>

          <div
            className={cn(
              "space-y-2 transition-opacity",
              !selectedCommunityId
                ? "pointer-events-none opacity-50"
                : "opacity-100"
            )}
          >
            <Label>Flair (Optional)</Label>
            <Controller
              control={control}
              name="flairId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={
                    !selectedCommunityId || isLoadingFlairs
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingFlairs
                          ? "Loading flairs..."
                          : "Select a flair..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {flairs.length > 0 ? (
                      flairs.map((flair) => (
                        <SelectItem
                          key={flair.id}
                          value={flair.id}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              style={{
                                backgroundColor:
                                  flair.color,
                              }}
                              className="h-4 w-4 rounded-full"
                            />
                            {flair.name}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <p className="text-muted-foreground p-2 text-sm">
                        No flairs for this community.
                      </p>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-destructive mt-1 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <FormProvider {...methods}>
              <Editor name="content" />
            </FormProvider>
            {errors.content && (
              <p className="text-destructive mt-1 text-sm">
                {(errors.content as any).message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Post
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
