"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const CommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty."),
});
type TCommentSchema = z.infer<typeof CommentSchema>;

interface CommentFormProps {
  onCommentSubmit: (text: string) => Promise<void>;
}

export default function CommentForm({
  onCommentSubmit,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCommentSchema>({
    resolver: zodResolver(CommentSchema),
  });

  const onSubmit = async (data: TCommentSchema) => {
    await onCommentSubmit(data.text);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-2">
        <Textarea
          {...register("text")}
          placeholder="What are your thoughts?"
          rows={3}
        />
        {errors.text && (
          <p className="text-destructive text-xs">
            {errors.text.message}
          </p>
        )}
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Post Comment
          </Button>
        </div>
      </div>
    </form>
  );
}
