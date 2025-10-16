"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { toast } from "sonner";
import {
  Community,
  CommunityFlair
} from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { CreateFlairDialog } from "./CreateFlairDialog";
import { UpdateFlairDialog } from "./UpdateFlairDialog";
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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Hash,
  Settings
} from "lucide-react";


interface ManageFlairsDialogProps {
  community: Community;
  flairs: CommunityFlair[];
  setFlairs: React.Dispatch<React.SetStateAction<CommunityFlair[]>>;
  trigger?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}


export function ManageFlairsDialog({
  community,
  flairs,
  setFlairs,
  trigger,
  isOpen,
  onOpenChange
}: ManageFlairsDialogProps) {
  const [ isLoading, setIsLoading ] = useState(false);

  const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false);
  const [ editingFlair, setEditingFlair ] = useState<CommunityFlair | null>(null);

  const fetchFlairs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await communityService.getFlairs(community.id);
      setFlairs(response);
    } catch (error) {
      toast.error("Could not fetch flairs for this community.");
    } finally {
      setIsLoading(false);
    }
  }, [ community.id, setFlairs ]);

  useEffect(() => {
    if (isOpen) {
      fetchFlairs();
    }
  }, [ isOpen, fetchFlairs ]);

  const handleFlairCreated = (newFlair: CommunityFlair) => {
    setFlairs(prev => [ ...prev, newFlair ]);
  };
  const handleFlairUpdated = (updatedFlair: CommunityFlair) => {
    setFlairs(prev => prev.map(f => f.id === updatedFlair.id ? updatedFlair : f));
  };

  const handleDeleteFlair = async (flairId: string, flairName: string) => {
    try {
      await communityService.deleteFlair(community.id, flairId);
      setFlairs(prev => prev.filter(f => f.id !== flairId));
      toast.success(`Flair "${flairName}" has been deleted.`);
    } catch (error) {
      toast.error("Failed to delete flair.");
    }
  };

  return (
    <>
      <Dialog
        open={ isOpen }
        onOpenChange={ onOpenChange }
      >
        <DialogTrigger asChild>{ trigger }</DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Community Flairs</DialogTitle>
            <DialogDescription>
              Create, edit, and delete flairs for c/{ community.name }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <h3 className="text-muted-foreground text-sm font-semibold">
              CREATE A NEW FLAIR
            </h3>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={ () => setIsCreateDialogOpen(true) }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Flair
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-semibold">
                EXISTING FLAIRS
              </h3>

              {
                isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                  </div>
                ) : flairs.length === 0 ? (
                  <p className="text-sm text-center py-4 text-muted-foreground">
                    No flairs created yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {
                      flairs.map(flair => (
                        <li
                          key={ flair.id }
                          className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50"
                        >
                          <span
                            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                            style={ {
                              backgroundColor: flair.color ?? "#64748B",
                              color: "#FFFFFF"
                            } }
                          >
                            { flair.name }
                          </span>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={ () => setEditingFlair(flair) }
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
                                    delete this flair?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action is permanent
                                    and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={ () =>
                                      handleDeleteFlair(flair.id, flair.name)
                                    }
                                  >
                                    Delete Flair
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


      <CreateFlairDialog
        communityId={ community.id }
        isOpen={ isCreateDialogOpen }
        onOpenChange={ setIsCreateDialogOpen }
        onFlairCreated={ handleFlairCreated }
      />

      {
        editingFlair && (
          <UpdateFlairDialog
            communityId={ community.id }
            flair={ editingFlair }
            isOpen={ !!editingFlair }
            onOpenChange={ () => setEditingFlair(null) }
            onFlairUpdated={ handleFlairUpdated }
          >
            <button className="hidden"></button>
          </UpdateFlairDialog>
        )
      }
    </>
  );
}
