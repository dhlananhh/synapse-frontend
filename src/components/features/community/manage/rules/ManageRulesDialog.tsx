"use client";


import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  Community,
  CommunityRule,
} from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { CreateRuleDialog } from "./CreateRuleDialog";
import { UpdateRuleDialog } from "./UpdateRuleDialog";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Settings,
} from "lucide-react";


interface ManageRulesDialogProps {
  community: Community;
  rules: CommunityRule[];
  setRules: React.Dispatch<React.SetStateAction<CommunityRule[]>>;
  trigger?: React.ReactNode;
}


export function ManageRulesDialog({
  community,
  rules,
  setRules,
  trigger,
}: ManageRulesDialogProps) {
  const [ open, setOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const [ isCreateOpen, setIsCreateOpen ] = useState(false);
  const [ editingRule, setEditingRule ] = useState<CommunityRule | null>(null);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await communityService.getRules(community.id);
      const sorted = response.sort(
        (a, b) => a.order - b.order
      );
      setRules(sorted);
    } catch {
      toast.error("Could not fetch community rules.");
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  }, [ community.id, setRules ]);

  // Always refresh when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) fetchRules();
  };

  useEffect(() => {
    // optional: initial silent prefetch if desired
    // fetchRules()
  }, [ fetchRules ]);

  const handleRuleCreated = (newRule: CommunityRule) => {
    setRules((prev) =>
      [ ...prev, newRule ].sort((a, b) => a.order - b.order)
    );
    setIsCreateOpen(false);
  };

  const handleRuleUpdated = (updatedRule: CommunityRule) => {
    setRules((prev) =>
      prev
        .map((r) =>
          r.id === updatedRule.id ? updatedRule : r
        )
        .sort((a, b) => a.order - b.order)
    );
    setEditingRule(null);
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await communityService.deleteRule(
        community.id,
        ruleId
      );
      setRules((prev) =>
        prev.filter((r) => r.id !== ruleId)
      );
      toast.success("Rule deleted successfully.");
    } catch {
      toast.error("Failed to delete rule.");
    }
  };

  return (
    <>
      <Dialog
        open={ open }
        onOpenChange={ handleOpenChange }
      >
        <DialogTrigger asChild>
          {
            trigger ? (
              trigger
            ) : (
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
                Manage Rules
              </Button>
            )
          }
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Community Rules
            </DialogTitle>
            <DialogDescription>
              Set clear expectations for your community.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <h3 className="text-muted-foreground text-sm font-semibold">
              CREATE A NEW RULE
            </h3>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={ () => setIsCreateOpen(true) }
              >
                <Plus className="h-4 w-4" />
                Add New Rule
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-semibold">
                EXISTING RULES
              </h3>

              {
                isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : rules.length === 0 ? (
                  <p className="py-4 text-center text-sm">
                    No rules created yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {
                      rules
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((rule, index) => (
                          <li
                            key={ rule.id }
                            className="rounded-lg border p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold">
                                  Rule { index + 1 }: { rule.title }
                                </h4>
                                {
                                  rule.description && (
                                    <p className="text-muted-foreground mt-1 text-sm">
                                      { rule.description }
                                    </p>
                                  )
                                }
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={ () =>
                                    setEditingRule(rule)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">
                                    Edit
                                  </span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive h-8 w-8"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">
                                        Delete
                                      </span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure you want to
                                        delete this rule?
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
                                          handleDeleteRule(
                                            rule.id
                                          )
                                        }
                                      >
                                        Delete Rule
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
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


      <CreateRuleDialog
        isOpen={ isCreateOpen }
        onOpenChange={ setIsCreateOpen }
        communityId={ community.id }
        onRuleCreated={ handleRuleCreated }
      />

      {
        editingRule && (
          <UpdateRuleDialog
            isOpen={ !!editingRule }
            onOpenChange={ () => setEditingRule(null) }
            communityId={ community.id }
            rule={ editingRule }
            onRuleUpdated={ handleRuleUpdated }
          />
        )
      }
    </>
  );
}
