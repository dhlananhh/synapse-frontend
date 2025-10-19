"use client";


import React, {
  useEffect,
  useState
} from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCommunity } from "@/context/CommunityContext";
import { useMembership } from "@/context/MembershipContext";
import { CommunityFlair } from "@/types/services/community";
import { communityService } from "@/modules/services/community-service";
import { ManageFlairsDialog } from "@/components/features/community/manage/flairs/ManageFlairsDialog";
import CommunityFlairsWidgetSkeleton from "@/components/features/community/widgets/CommunityFlairsWidgetSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Tag,
  Settings
} from "lucide-react";


export default function CommunityFlairsWidget() {
  const community = useCommunity();
  const membershipContext = useMembership();

  const [ flairs, setFlairs ] = useState<CommunityFlair[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ isManageOpen, setIsManageOpen ] = useState(false);

  useEffect(() => {
    if (!community?.id) {
      setIsLoading(false);
      return;
    };

    setIsLoading(true);
    setError(null);

    communityService.getFlairs(community.id)
      .then(response => {
        setFlairs(response);
      })
      .catch(() => {
        setError("Failed to load flairs.");
        toast.error("An error occurred while fetching flairs.");
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [ community?.id ]);


  if (!community) {
    return <CommunityFlairsWidgetSkeleton />;
  }

  const membership = membershipContext?.membership ?? null;
  const canManageFlairs =
    membership?.role === "OWNER"
    || membership?.role === "MODERATOR";

  return (
    <>
      <Card
        className="animate-fade-in-down"
        style={ { animationDelay: '300ms' } }
      >
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
        >
          <AccordionItem
            value="item-1"
            className="border-b-0"
          >
            <CardHeader className="p-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-base font-bold">
                    Flairs ({ isLoading ? "..." : flairs.length })
                  </CardTitle>
                </div>

                <div className="flex items-center">
                  {
                    canManageFlairs && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Manage Flairs"
                        onClick={ () => setIsManageOpen(true) }
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    )
                  }
                  <AccordionTrigger
                    className="p-1 text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:rotate-180"
                  />
                </div>
              </div>
            </CardHeader>

            <AccordionContent>
              <CardContent className="p-3 pt-0">
                {
                  isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                  ) : error ? (
                    <p className="text-sm text-destructive">
                      { error }
                    </p>
                  ) : flairs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      This community has no flairs.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {
                        flairs
                          .slice(0, 7)
                          .map((flair) => (
                            <li
                              key={ flair.id }
                              className="flex items-center justify-between p-1 rounded-md border hover:bg-muted/50 transition-all duration-200 hover:ml-2"
                            >
                              <Link
                                href={ `/c/${community.name}?flair=${flair.id}` }
                                className="flex items-center gap-2 p-1.5 rounded-md transition-colors hover:bg-accent"
                              >
                                <span
                                  aria-hidden
                                  className="block h-3 w-3 rounded-full flex-shrink-0"
                                  style={ { backgroundColor: flair.color ?? "#94A3B8" } }
                                />
                                <span className="text-sm font-medium">
                                  { flair.name }
                                </span>
                              </Link>
                            </li>
                          ))
                      }

                      {
                        flairs.length > 7 && (
                          <p className="text-xs text-muted-foreground mt-2 pl-1.5">
                            + { flairs.length - 7 } more
                          </p>
                        )
                      }
                    </ul>
                  )
                }
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>


      {
        canManageFlairs && (
          <ManageFlairsDialog
            community={ community }
            flairs={ flairs }
            setFlairs={ setFlairs }
            isOpen={ isManageOpen }
            onOpenChange={ setIsManageOpen }
          />
        )
      }
    </>
  );
}
