import Link from "next/link";
import Image from "next/image";
import { SearchUserResult } from "@/types/services/user";
import { Lock } from "lucide-react";

export function UserSearchResultItem({
  user,
}: {
  user: SearchUserResult;
}) {
  return (
    <li>
      <Link
        href={`/profile/${user.id}`}
        className="hover:bg-accent flex min-h-[80px] items-center gap-5 rounded-lg px-2 py-6 transition"
      >
        {/* Avatar */}
        <div className="bg-muted flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-2xl">
              {user.username[0].toUpperCase()}
            </span>
          )}
        </div>
        {/* Info */}
        <div>
          <div className="text-md flex items-center gap-1 font-semibold">
            u/{user.username}
            {user.isPrivate && (
              <Lock className="text-muted-foreground h-5 w-5" />
            )}
          </div>
          <div className="text-muted-foreground text-base">
            {user.firstName} {user.lastName} &middot;{" "}
            {user.followerCount} followers
          </div>
        </div>
      </Link>
    </li>
  );
}
