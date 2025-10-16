"use client";


import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCommunity } from "@/context/CommunityContext";
import { useMembership } from "@/context/MembershipContext";
import { CommunityFlair } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { UpdateFlairDialog } from "@/components/features/community/manage/flairs/UpdateFlairDialog";
import { CreateFlairDialog } from "@/components/features/community/manage/flairs/CreateFlairDialog";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Hash,
  ArrowLeft,
  Lock
} from "lucide-react";


export default function ManageFlairsPage() {
  const community = useCommunity();
  const membershipContext = useMembership();

  const [ flairs, setFlairs ] = useState<CommunityFlair[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false);
  const [ editingFlair, setEditingFlair ] = useState<CommunityFlair | null>(null);

  const isLoadingContexts = !community || !membershipContext;
  const canManage =
    membershipContext?.membership?.role === "OWNER"
    || membershipContext?.membership?.role === "MODERATOR";

  const fetchFlairs = useCallback(async () => {
    if (!community) return;
    setIsLoading(true);
    try {
      const response = await communityService.getFlairs(community.id);
      setFlairs(response);
    } catch (error) {
      toast.error("Could not fetch flairs for this community.");
      setFlairs([]);
    } finally {
      setIsLoading(false);
    }
  }, [ community ]);

  useEffect(() => {
    fetchFlairs();
  }, [ fetchFlairs ]);

  const handleFlairCreated = (newFlair: CommunityFlair) => {
    setFlairs(prev => [ ...prev, newFlair ]);
    toast.success(`Flair "${newFlair.name}" created successfully.`);
  };

  const handleFlairUpdated = (updatedFlair: CommunityFlair) => {
    setFlairs(prev => prev.map(f => f.id === updatedFlair.id ? updatedFlair : f));
    toast.success(`Flair "${updatedFlair.name}" updated successfully.`);
  };

  const handleDeleteFlair = async (flairId: string, flairName: string) => {
    if (!community) return;
    try {
      await communityService.deleteFlair(community.id, flairId);
      setFlairs(prev => prev.filter(f => f.id !== flairId));
      toast.success(`Flair "${flairName}" has been deleted.`);
    } catch (error) {
      toast.error("Failed to delete flair.");
    }
  };


  if (isLoadingContexts) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      </div>
    );
  };

  if (!canManage) {
    return (
      <div className="text-center py-20">
        <Lock className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">
          Access Denied
        </h1>
        <p className="mt-2 text-muted-foreground">
          You do not have permission to manage flairs for this community.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link
          href={ `/c/${community.name}/manage` }
        >
          <Button
            variant="ghost"
            className="-ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Management Tools
          </Button>
        </Link>

        <Card className="mt-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Hash />
                  Manage Post Flairs
                </CardTitle>
                <CardDescription>
                  Create and manage the flairs available for posts in c/{ community.name }.
                </CardDescription>
              </div>
              <Button
                onClick={ () => setIsCreateDialogOpen(true) }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Flair
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              {
                isLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : flairs.length === 0 ? (
                  <p className="p-8 text-sm text-center text-muted-foreground">
                    No flairs have been created yet. Click "Add New Flair" to start.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {
                      flairs.map((flair) => (
                        <li
                          key={ flair.id }
                          className="p-3 pr-1 flex justify-between items-center hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                              style={ {
                                backgroundColor: flair.color ?? "#64748B",
                                color: "#FFFFFF"
                              } }
                            >
                              { flair.name }
                            </span>
                            {
                              flair.description && (
                                <p className="text-sm text-muted-foreground hidden md:block">
                                  { flair.description }
                                </p>
                              )
                            }
                          </div>
                          <div className="flex items-center shrink-0">
                            <Button
                              title="Edit Flair"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={ () => setEditingFlair(flair) }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  title="Delete Flair"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete flair "{ flair.name }"?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone and will remove the flair from any posts using it.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={ () => handleDeleteFlair(flair.id, flair.name) }
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
          </CardContent>
        </Card>
      </div>


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
