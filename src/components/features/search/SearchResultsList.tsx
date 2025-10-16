import { UserSearchResultItem } from "@/components/features/search/UserSearchResultItem";
import { CommunitySearchResultItem } from "@/components/features/search/CommunitySearchResultem";
import { SearchUserResult } from "@/types/services/user";
import { SearchCommunityResult } from "@/types/services/community";

interface SearchResultsListProps {
  type: string;
  userResults: SearchUserResult[];
  communityResults: SearchCommunityResult[];
}

export function SearchResultsList({
  type,
  userResults,
  communityResults,
}: SearchResultsListProps) {
  if (type === "user") {
    return (
      <ul className="divide-muted bg-background divide-y rounded-lg shadow-sm">
        {userResults.map((user) => (
          <UserSearchResultItem key={user.id} user={user} />
        ))}
      </ul>
    );
  }
  if (type === "community") {
    return (
      <ul className="divide-muted bg-background divide-y rounded-lg shadow-sm">
        {communityResults.map((community) => (
          <CommunitySearchResultItem
            key={community.id}
            community={community}
          />
        ))}
      </ul>
    );
  }
  return (
    <div className="text-muted-foreground py-8 text-center">
      <span className="text-base">
        Search for this type is not implemented yet.
      </span>
    </div>
  );
}
