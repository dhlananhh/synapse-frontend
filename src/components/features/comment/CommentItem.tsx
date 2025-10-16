"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/MockAuthContext";
import { Comment } from "@/types";
import {
  deleteComment,
  updateComment,
} from "@/libs/mock-api";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import ReportDialog from "../report/ReportDialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Flag,
} from "lucide-react";

interface CommentItemProps {
  postId: string;
  comment: Comment;
  onCommentDeleted: (commentId: string) => void;
  onCommentUpdated: (
    commentId: string,
    newText: string
  ) => void;
}

const EditCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty."),
});

type TEditCommentSchema = z.infer<typeof EditCommentSchema>;

export default function CommentItem({
  postId,
  comment,
  onCommentDeleted,
  onCommentUpdated,
}: CommentItemProps) {
  const { user } = useAuth();
  const isAuthor = user?.id === comment.author.id;

  const [isReportDialogOpen, setIsReportDialogOpen] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TEditCommentSchema>({
    resolver: zodResolver(EditCommentSchema),
    defaultValues: { text: comment.text },
  });

  const handleUpdate = async (data: TEditCommentSchema) => {
    try {
      await updateComment(postId, comment.id, data.text);
      onCommentUpdated(comment.id, data.text);
      setIsEditing(false);
      toast.success("Comment updated successfully.");
    } catch {
      toast.error("Failed to update comment.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(postId, comment.id);
      onCommentDeleted(comment.id);
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <UserAvatar
            user={comment.author}
            className="h-6 w-6"
          />
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <p className="text-primary font-semibold">
              {comment.author.username}
            </p>
            <span>•</span>
            <p>
              {formatDistanceToNow(
                new Date(comment.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </p>
            {isEditing && (
              <span className="text-amber-500">
                (editing)
              </span>
            )}
          </div>

          {user && !isEditing && (
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => setIsEditing(true)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setIsDeleteDialogOpen(true)
                        }
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        setIsReportDialogOpen(true)
                      }
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="ml-8 space-y-2"
          >
            <Textarea {...register("text")} rows={3} />
            {errors.text && (
              <p className="text-destructive text-xs">
                {errors.text.message}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <p className="ml-8 text-sm">{comment.text}</p>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 space-y-4 border-l-2 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                postId={postId}
                comment={reply}
                onCommentDeleted={onCommentDeleted}
                onCommentUpdated={onCommentUpdated}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        title="Delete this comment?"
        description="This action cannot be undone."
        confirmText="Delete"
      />

      <ReportDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        itemId={comment.id}
        itemType="COMMENT"
      />
    </>
  );
}
