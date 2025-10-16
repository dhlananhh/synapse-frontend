import Image from "next/image";
import Link from "next/link";
import { SearchCommunityResult } from "@/types/services/community";
import { Lock, TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CommunitySearchResultItem({
  community,
}: {
  community: SearchCommunityResult;
}) {
  return (
    <li>
      <Link
        href={`/c/${community.name}`}
        className="hover:bg-accent flex min-h-[90px] items-center gap-4 rounded px-2 py-6 transition"
      >
        {/* Avatar */}
        <div className="bg-muted flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
          {community.avatarUrl ? (
            <Image
              src={community.avatarUrl}
              alt={community.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-xl">
              {community.name[0].toUpperCase()}
            </span>
          )}
        </div>
        {/* Info */}
        <div>
          <div className="text-lg font-semibold">
            c/{community.name}
          </div>
          <div className="mt-2 mb-2 flex gap-2">
            {community.status === "PRIVATE" && (
              <span
                title="Private Community"
                className="inline-flex items-center gap-1 rounded bg-indigo-700 px-3 py-1 text-xs font-bold text-white"
              >
                <Lock className="h-4 w-4" />
                Private
              </span>
            )}
            {community.isNSFW && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex cursor-pointer items-center gap-1 rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                    <TriangleAlert className="h-4 w-4" />
                    NSFW
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">
                  This community contains mature content
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="text-muted-foreground text-base">
            {community.description}
          </div>
          <div className="text-muted-foreground mt-1 flex gap-4 text-sm">
            <span>
              <span className="font-semibold">
                {community.memberCount} member
                {community.memberCount > 1 ? "s" : ""}
              </span>
            </span>
            <span>
              <span className="font-semibold">
                {community.postCount} post
                {community.postCount > 1 ? "s" : ""}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
