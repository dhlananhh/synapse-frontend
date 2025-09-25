"use client";


import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Post,
  Award
} from "@/types";
import { giveAwardToPost } from "@/libs/mock-api";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/context/AuthContext";
import VoteClient from "./VoteClient";
import SavePostButton from "./SavePostButton";
import AwardDisplay from "../awards/AwardDisplay";
import AwardSelectionDialog from "../awards/AwardSelectionDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Share2,
  Ribbon
} from "lucide-react";


interface PostCardProps {
  post: Post;
}


const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  ({ post }, ref) => {
    const [ isAwardDialogOpen, setIsAwardDialogOpen ] = useState(false);
    const { spendCoins } = useUserStore();
    const { user } = useAuth();
    const [ livePost, setLivePost ] = useState(post);

    const handleGiveAward = async (award: Award) => {
      if (!user) return;

      if (!spendCoins(award.cost)) {
        toast.error("Not enough coins", {
          description: "You don't have enough coins to give this award."
        });
        return;
      }
      try {
        await giveAwardToPost(livePost.id, award);
        setLivePost(prev => ({
          ...prev,
          receivedAwards: [ ...(prev.receivedAwards || []), award ]
        }));
        toast.success(`You gave the "${award.name}" award!`);
      } catch (e) {
        toast.error("Failed to give award.");
      }
    };

    return (
      <>
        <Card
          ref={ ref }
          className="flex flex-col h-full overflow-hidden shadow-sm hover:border-primary/50 transition-colors
          w-full max-w-xl mx-auto rounded-2xl sm:rounded-xl border bg-card
          min-w-0 sm:min-w-[400px]"
        >
          <CardHeader className="p-3 sm:p-4">
            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-1">
              Posted by { " " }
              <Link
                href={ `/u/${post.author.username}` }
                className="font-medium text-foreground hover:underline"
              >
                u/{ post.author.username }
              </Link>
              • { formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) } in { " " }
              <Link
                href={ `/c/${post.community.slug}` }
                className="font-medium text-foreground hover:underline"
              >
                c/{ post.community.slug }
              </Link>
            </div>
            {
              livePost.receivedAwards && livePost.receivedAwards.length > 0 && (
                <div className="mb-2">
                  <AwardDisplay awards={ livePost.receivedAwards } />
                </div>
              )
            }
            <CardTitle className="mt-1 text-lg sm:text-xl font-semibold leading-tight break-words">
              <Link
                href={ `/p/${post.id}` }
                className="hover:underline"
              >
                { post.title }
              </Link>
            </CardTitle>
            <CardTitle className="mt-1 text-xl flex items-center gap-2">
              {
                post.flair && (
                  <Badge
                    style={
                      {
                        backgroundColor: post.flair.color,
                        color: "#fff"
                      }
                    }
                    className="flex-shrink-0"
                  >
                    { post.flair.name }
                  </Badge>
                )
              }
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 sm:p-4 pt-0 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-4 break-words">
              { post.content }
            </p>
          </CardContent>

          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-sm font-medium text-muted-foreground p-2 sm:px-4 border-t">
            <VoteClient
              itemId={ post.id }
              initialVotes={ post.votes }
            />

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full flex items-center gap-1.5 px-2"
            >
              <Link href={ `/p/${post.id}` }>
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">
                  { post.comments.length } Comments
                </span>
                <span className="inline sm:hidden">
                  { post.comments.length }
                </span>
              </Link>
            </Button>

            <Button
              onClick={
                () => (
                  user
                    ? setIsAwardDialogOpen(true)
                    : toast.error("Please log in to give awards.")
                )
              }
              variant="ghost"
              size="sm"
              className="rounded-full flex items-center gap-1.5 px-2"
            >
              <Ribbon className="h-5 w-5" />
              <span className="hidden sm:inline">
                Award
              </span>
            </Button>

            <SavePostButton postId={ post.id } />

            <Button
              variant="ghost"
              size="lg"
              className="rounded-full flex items-center gap-1.5 px-2"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden sm:inline">
                Share
              </span>
            </Button>
          </div>
        </Card>


        <AwardSelectionDialog
          isOpen={ isAwardDialogOpen }
          onOpenChange={ setIsAwardDialogOpen }
          onAwardGiven={ handleGiveAward }
        />
      </>
    )
  }
)

PostCard.displayName = "PostCard";

export default PostCard;
