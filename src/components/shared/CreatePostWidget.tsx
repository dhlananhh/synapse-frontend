"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { Image, LinkIcon } from "lucide-react";


export default function CreatePostWidget() {
  const router = useRouter();
  const { user } = useAuth();

  const goToSubmitPage = () => router.push("/submit");

  return (
    <div className="mb-8 p-3 rounded-md bg-card flex items-center gap-4 border">
      {/*
        {
          user && <UserAvatar user={ user } />
        }
      */}

      <div className="relative w-full">
        <Input
          onClick={ goToSubmitPage }
          readOnly
          placeholder="Create a new post..."
          className="cursor-pointer"
        />
      </div>

      <Button
        onClick={ goToSubmitPage }
        variant="ghost"
        size="icon"
        title="Create Image Post"
      >
        <Image className="h-5 w-5" />
      </Button>
      <Button
        onClick={ goToSubmitPage }
        variant="ghost"
        size="icon"
        title="Create Link Post"
      >
        <LinkIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}
