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
import { CommunityRule } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { CreateRuleDialog } from "@/components/features/community/manage/dialogs/CreateRuleDialog";
import { UpdateRuleDialog } from "@/components/features/community/manage/dialogs/UpdateRuleDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Lock
} from "lucide-react";


export default function ManageRulesPage() {
  const community = useCommunity();
  const membershipContext = useMembership();

  const [ rules, setRules ] = useState<CommunityRule[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState(false);
  const [ editingRule, setEditingRule ] = useState<CommunityRule | null>(null);

  const isLoadingContexts = !community || !membershipContext;
  const canManage =
    membershipContext?.membership?.role === "OWNER"
    || membershipContext?.membership?.role === "MODERATOR";

  const fetchRules = useCallback(async () => {
    if (!community) return;
    setIsLoading(true);
    try {
      const response = await communityService.getRules(community.id);
      setRules(response.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error("Could not fetch community rules.");
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  }, [ community ]);

  useEffect(() => {
    fetchRules();
  }, [ fetchRules ]);


  const handleRuleCreated = (newRule: CommunityRule) => {
    setRules(prev => [ ...prev, newRule ].sort((a, b) => a.order - b.order));
    toast.success(`Rule "${newRule.title}" created.`);
  };

  const handleRuleUpdated = (updatedRule: CommunityRule) => {
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r).sort((a, b) => a.order - b.order));
    toast.success(`Rule "${updatedRule.title}" updated.`);
  };

  const handleDeleteRule = async (ruleId: string, ruleTitle: string) => {
    if (!community) return;
    try {
      await communityService.deleteRule(community.id, ruleId);
      setRules(prev => prev.filter(r => r.id !== ruleId));
      toast.success(`Rule "${ruleTitle}" has been deleted.`);
    } catch (error) {
      toast.error("Failed to delete rule.");
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
          You do not have permission to manage rules for this community.
        </p>
      </div>
    );
  }

  return (
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
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck />
            Manage Community Rules
          </CardTitle>
          <CardDescription>
            Create, edit, reorder, and delete the rules for c/{ community.name }.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              onClick={ () => setIsCreateDialogOpen(true) }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Rule
            </Button>
          </div>

          <div className="border rounded-lg">
            {
              isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : rules.length === 0 ? (
                <p className="text-center text-sm p-8 text-muted-foreground">
                  This community has no rules yet. Click "Add New Rule" to get started.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {
                    rules.map((rule, index) => (
                      <li
                        key={ rule.id }
                        className="p-4"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-bold text-base">
                              Rule { index + 1 }: { rule.title }
                            </h4>
                            {
                              rule.description && (
                                <p className="text-sm text-muted-foreground mt-1 max-w-prose">
                                  { rule.description }
                                </p>
                              )
                            }
                          </div>
                          <div className="flex items-center shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={ () => setEditingRule(rule) }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete this rule?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the rule: { " " }
                                    <span className="font-bold">"{ rule.title }"</span>. { " " }
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={ () => handleDeleteRule(rule.id, rule.title) }
                                  >
                                    Confirm Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </li>
                    )) }
                </ul>
              ) }
          </div>
        </CardContent>
      </Card>


      <CreateRuleDialog
        isOpen={ isCreateDialogOpen }
        onOpenChange={ setIsCreateDialogOpen }
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
    </div>
  );
}
