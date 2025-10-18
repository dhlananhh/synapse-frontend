"use client";


import React from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/utils";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";


const SearchSchema = z.object({
  query: z.string(),
});
type TSearchSchema = z.infer<typeof SearchSchema>;


export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit } = useForm<TSearchSchema>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: searchParams.get("q") || "",
    },
  });

  const onSubmit = (data: TSearchSchema) => {
    const query = data.query.trim();
    if (!query) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full max-w-lg">
      <form
        onSubmit={ handleSubmit(onSubmit) }
      >
        <div
          className={
            cn(
              "relative w-full rounded-lg bg-transparent p-[2.5px]",
              "transition-all duration-300",
              "focus-within:bg-gradient-to-r focus-within:from-blue-500 focus-within:to-cyan-400"
            )
          }
        >
          <div className="relative flex w-full items-center rounded-[7px] bg-background">
            <SearchIcon
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              { ...register("query") }
              placeholder="Find anything"
              className="w-full border-t bg-transparent pl-9 pr-4 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
