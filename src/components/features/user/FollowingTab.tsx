// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/context/MockAuthContext";
// import { User } from "@/types";
// import { fetchUsersByIds } from "@/libs/mock-api";
// import { Skeleton } from "@/components/ui/skeleton";
// import EmptyState from "@/components/shared/EmptyState";
// import { Users } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { UserAvatar } from "@/components/shared/UserAvatar";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// function UserListCard({ user }: { user: User }) {
//   return (
//     <Card>
//       <CardContent className="p-4 flex items-center justify-between">
//         <Link
//           href={ `/u/${user.username}` }
//           className="flex items-center gap-4 group"
//         >
//           <UserAvatar user={ user } className="h-10 w-10" />
//           <div>
//             <p className="font-bold group-hover:underline">
//               { user.displayName || user.username }
//             </p>
//             <p className="text-sm text-muted-foreground">
//               u/{ user.username }
//             </p>
//           </div>
//         </Link>
//         <Button
//           asChild
//           variant="outline"
//           size="sm"
//         >
//           <Link href={ `/u/${user.username}` }>
//             View Profile
//           </Link>
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

// export default function FollowingTab() {
//   const { followingUserIds } = useAuth();
//   const [ followedUsers, setFollowedUsers ] = useState<User[]>([]);
//   const [ isLoading, setIsLoading ] = useState(true);

//   useEffect(() => {
//     const loadFollowedUsers = async () => {
//       if (followingUserIds.length === 0) {
//         setFollowedUsers([]);
//         setIsLoading(false);
//         return;
//       }
//       setIsLoading(true);
//       try {
//         const users = await fetchUsersByIds(followingUserIds);
//         setFollowedUsers(users);
//       } catch (error) {
//         console.error("Failed to fetch followed users:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadFollowedUsers();
//   }, [ followingUserIds ]);

//   if (isLoading) {
//     return (
//       <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//         { Array.from({ length: 4 }).map((_, i) => <Skeleton key={ i } className="h-20 w-full" />) }
//       </div>
//     );
//   }

//   if (followedUsers.length === 0) {
//     return (
//       <div className="mt-6">
//         <EmptyState
//           Icon={ Users }
//           title="Not Following Anyone"
//           description={ `When you follow users, you'll see them listed here. Find interesting people to follow!` }
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//       {
//         followedUsers.map(user =>
//           <UserListCard key={ user.id } user={ user } />
//         )
//       }
//     </div>
//   );
// }
