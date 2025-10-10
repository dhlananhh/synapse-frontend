"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function Editor({ name }: { name: string }) {
  const { register } = useFormContext();
  return (
    <div className="w-full">
      <Textarea
        {...register(name)}
        rows={10}
        placeholder="What's on your mind?"
        className="prose dark:prose-invert resize-y"
      />
    </div>
  );
}
