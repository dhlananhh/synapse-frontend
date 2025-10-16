import { User } from "@/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type UserAvatarProps =
  | { user: User; name?: never; imageUrl?: never }
  | { user?: never; name: string; imageUrl?: string };

type CombinedProps = UserAvatarProps &
  React.HTMLAttributes<HTMLSpanElement>;

export function UserAvatar({
  user,
  name,
  imageUrl,
  ...props
}: CombinedProps) {
  const src = user?.avatarUrl || imageUrl;
  const displayName =
    user?.firstName + " " + user?.lastName ||
    user?.username;

  return (
    <Avatar {...props}>
      <AvatarImage src={src} alt={displayName} />
      <AvatarFallback>
        {displayName?.slice(0, 2).toUpperCase() || "??"}
      </AvatarFallback>
    </Avatar>
  );
}
