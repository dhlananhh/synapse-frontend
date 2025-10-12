"use client";

import React, {
  useEffect,
  useState
} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { communityService } from "@/modules/services/community-service";
import type {
  Community,
  CommunityFlair,
} from "@/types/services/community";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tag, Settings } from "lucide-react";
import { useMembership } from "@/context/MembershipContext";
import { Button } from "@/components/ui/button";
import { useCommunity } from "@/context/CommunityContext";
import { ManageFlairsDialog } from "@/components/features/community/manage/dialogs/ManageFlairsDialog";


export default function CommunityFlairsWidget() {
  const community = useCommunity();
  const communityId = community?.id ?? "";
  const communityName = community?.name ?? "";
  const membershipContext = useMembership();
  const membership = membershipContext?.membership ?? null;
  const isOwner = membership?.role === "OWNER";
  const isModerator = membership?.role === "MODERATOR";
  const canEditFlairs = isOwner || isModerator;
  const [ flairs, setFlairs ] = useState<CommunityFlair[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await communityService.getFlairs(communityId);
        if (!mounted)
          return;
        setFlairs((response ?? []) as CommunityFlair[]);
      } catch (error: any) {
        console.error("Failed to load flairs", error);
        if (mounted)
          setError("Failed to load flairs");
      } finally {
        if (mounted)
          setLoading(false);
      }
    }
    if (communityId)
      load();
    else {
      setFlairs([]);
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [ communityId ]);

  return (
    <Card className="p-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="flairs">
          <CardHeader className="p-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />-{ " " }
                <CardTitle className="m-0 p-0">
                  { `Flairs (${flairs.length})` }
                </CardTitle>
              </div>

              <div className="flex items-center gap-3">
                { canEditFlairs && (
                  <ManageFlairsDialog
                    community={ community as Community }
                    flairs={ flairs }
                    setFlairs={ setFlairs }
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Manage flairs"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    }
                  />
                ) }
                <AccordionTrigger className="rounded-md px-2 py-0 text-sm">
                  {/* Trigger arrow/icon styling depends on your Accordion implementation */ }
                </AccordionTrigger>
              </div>
            </div>
          </CardHeader>

          <AccordionContent>
            <CardContent>
              { loading ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ) : error ? (
                <p className="text-destructive text-sm">
                  { error }
                </p>
              ) : flairs.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  This community currently has no flairs.
                </p>
              ) : (
                <ul className="space-y-3">
                  { flairs.map((flair) => (
                    <li
                      key={ flair.id }
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden
                        style={ {
                          backgroundColor:
                            flair.color ?? "#CBD5E1",
                        } }
                        className="ring-border inline-block h-6 w-6 rounded-full ring-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">
                            { flair.name }
                          </span>
                        </div>
                        { flair.description && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            { flair.description }
                          </p>
                        ) }
                      </div>
                    </li>
                  )) }
                </ul>
              ) }
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
