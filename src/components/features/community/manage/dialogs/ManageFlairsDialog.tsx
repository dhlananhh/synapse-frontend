"use client";


import React, {
  useState,
  useEffect
} from "react";
import { toast } from "sonner";
import {
  Community,
  CommunityFlair,
} from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { CommunityFlairForm } from "@/components/features/community/forms/CommunityFlairForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Hash,
} from "lucide-react";


interface ManageCommunityFlairDialogProps {
  community: Community;
  flairs: CommunityFlair[];
  setFlairs: React.Dispatch<
    React.SetStateAction<CommunityFlair[]>
  >;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ManageFlairsDialog({
  community,
  flairs,
  setFlairs,
  trigger,
  open,
  onOpenChange,
}: ManageCommunityFlairDialogProps) {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ editingFlairId, setEditingFlairId ] = useState<string | null>(null);

  const fetchFlairs = async () => {
    setIsLoading(true);
    try {
      const response = await communityService.getFlairs(community.id);
      setFlairs(response ?? []);
    } catch (error) {
      toast.error("Could not fetch flairs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open === undefined) {
      fetchFlairs();
    } else if (open) {
      fetchFlairs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open, community.id ]);

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (onOpenChange) onOpenChange(isOpen);
    if (isOpen) {
      fetchFlairs();
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingFlairId === "new") {
        const response = await communityService.createFlair(
          community.id,
          data
        );
        setFlairs((prev) => [ ...prev, response ]);
        toast.success("Flair created successfully!");
      } else if (editingFlairId) {
        const response = await communityService.updateFlair(
          community.id,
          editingFlairId,
          data
        );
        setFlairs((prev) => prev.map((f) => f.id === editingFlairId ? response : f));
        toast.success("Flair updated successfully!");
      }
      setEditingFlairId(null);
    } catch (error: any) {
      toast.error("Failed to update the flair", {
        description: error.response?.data?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (flairId: string) => {
    try {
      await communityService.deleteFlair(
        community.id,
        flairId
      );
      setFlairs((prev) => prev.filter((f) => f.id !== flairId));
      toast.success("Flair deleted.");
    } catch (error) {
      toast.error("Failed to delete flair.");
    }
  };

  return (
    <Dialog
      open={ open }
      onOpenChange={ handleDialogOpenChange }
    >
      {
        trigger ? (
          <DialogTrigger asChild>
            { trigger }
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
            >
              <Hash className="h-4 w-4" />
              Manage Flairs
            </Button>
          </DialogTrigger>
        )
      }

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Community Flairs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <h3 className="text-muted-foreground text-sm font-semibold">
            CREATE A NEW FLAIR
          </h3>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={ () => setEditingFlairId("new") }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Flair
            </Button>
          </div>

          {
            editingFlairId && (
              <CommunityFlairForm
                initialData={
                  editingFlairId === "new"
                    ? null
                    : flairs.find((f) => f.id === editingFlairId)
                }
                onSubmit={ handleFormSubmit }
                isSubmitting={ isSubmitting }
                onCancel={ () => setEditingFlairId(null) }
              />
            )
          }

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-semibold">
              EXISTING FLAIRS
            </h3>
            {
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : flairs.length === 0 ? (
                <p className="py-4 text-center text-sm">
                  No flairs created yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {
                    flairs.map((flair) => (
                      <li
                        key={ flair.id }
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span
                          className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                          style={ {
                            backgroundColor:
                              flair.color ?? "#ccc",
                            color: "#fff",
                          } }
                        >
                          { flair.name }
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={ () =>
                              setEditingFlairId(flair.id)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to
                                  delete "{ flair.name }"?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={ () =>
                                    handleDelete(flair.id)
                                  }
                                >
                                  Confirm Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              )
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
