"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useCommandMenu } from "@/context/CommandMenuContext";
import { SearchIcon } from "lucide-react";

const SearchSchema = z.object({
  query: z
    .string()
    .min(1, { message: "Search query cannot be empty." }),
});
type TSearchSchema = z.infer<typeof SearchSchema>;

function getShortcutLabel(platform: string) {
  if (platform.includes("mac"))
    return (
      <>
        <span className="text-lg">⌘</span>K
      </>
    );
  return <>Ctrl K</>;
}

export default function SearchBar() {
  const { t } = useTranslation();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsOpen } = useCommandMenu();

  const { register, handleSubmit } = useForm<TSearchSchema>(
    {
      resolver: zodResolver(SearchSchema),
      defaultValues: {
        query: searchParams.get("q") || "",
      },
    }
  );

  const onSubmit = (data: TSearchSchema) => {
    router.push(
      `/search?q=${encodeURIComponent(data.query)}`
    );
  };

  const [platform, setPlatform] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPlatform(window.navigator.platform.toLowerCase());
    }
  }, []);

  return (
    <div className="relative w-full max-w-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-lg"
      >
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            {...register("query")}
            placeholder={t("navbar.search_placeholder")}
            className="pl-9"
          />
          <div className="text-muted-foreground absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs sm:flex">
            {platform && getShortcutLabel(platform)}
          </div>
        </div>
      </form>
    </div>
  );
}
