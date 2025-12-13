// "use client";

// import React, {
//   useState,
//   useEffect,
//   useCallback
// } from "react";
// import {
//   Post,
//   SortType
// } from "@/types";
// import { fetchPosts } from "@/libs/mock-api";
// import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
// import { useAuth } from "@/context/MockAuthContext";
// import { cn } from "@/libs/utils";
// import SortTabs from "./SortTabs";
// import PostCard from "./PostCard";
// import PostFeedSkeleton from "./PostFeedSkeleton";
// import EmptyState from "@/components/shared/EmptyState";
// import {
//   Globe,
//   Loader2
// } from "lucide-react";
// import CompactPostCard from "./CompactPostCard";
// import CompactPostCardSkeleton from "./CompactPostCardSkeleton";
// import ViewModeToggle from "./ViewModeToggle";

// export default function PostFeed() {
//   const [ posts, setPosts ] = useState<Post[]>([]);
//   const [ page, setPage ] = useState(1);
//   const [ isLoading, setIsLoading ] = useState(false);
//   const [ isInitialLoading, setIsInitialLoading ] = useState(true);
//   const [ hasMore, setHasMore ] = useState(true);
//   const [ sortBy, setSortBy ] = useState<SortType>("hot");

//   const { viewMode, mutedCommunityIds, isBlocked } = useAuth();

//   const loadPosts = useCallback(async (isNewSort = false) => {
//     if (isLoading || (!hasMore && !isNewSort)) return;

//     setIsLoading(true);
//     if (isNewSort) {
//       setIsInitialLoading(true);
//       setPosts([]);
//     }

//     const pageToFetch = isNewSort ? 1 : page;

//     try {
//       const { data: newPosts, hasMore: newHasMore } = await fetchPosts(
//         pageToFetch,
//         sortBy,
//         mutedCommunityIds
//       );

//       setPosts(prevPosts => isNewSort ? newPosts : [ ...prevPosts, ...newPosts ]);
//       setPage(pageToFetch + 1);
//       setHasMore(newHasMore);

//     } catch (error) {
//       console.error("Failed to fetch posts:", error);
//     } finally {
//       setIsLoading(false);
//       if (isNewSort || isInitialLoading) {
//         setIsInitialLoading(false);
//       }
//     }
//   }, [
//     isLoading,
//     hasMore,
//     page,
//     sortBy,
//     mutedCommunityIds,
//     isInitialLoading
//   ]);

//   useEffect(() => {
//     if (!isInitialLoading) {
//       loadPosts(true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ sortBy ]);

//   useEffect(() => {
//     loadPosts(true);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const { lastElementRef } = useIntersectionObserver({
//     onIntersect: () => loadPosts(false),
//     isLoading,
//     hasMore
//   });

//   const handleSortChange = (newSort: SortType) => {
//     if (newSort === sortBy) return;
//     setSortBy(newSort);
//   }

//   const renderPost = (post: Post, isLast: boolean) => {
//     const ref = isLast ? lastElementRef : null;
//     if (viewMode === "compact") {
//       return (
//         <CompactPostCard
//           ref={ ref as any }
//           key={ `${post.id}-compact` }
//           post={ post }
//         />
//       )
//     }
//     return (
//       <PostCard
//         ref={ ref as any }
//         key={ `${post.id}-card` }
//         post={ post }
//       />
//     )
//   };

//   const renderSkeletons = () => {
//     if (viewMode === "compact") {
//       return (
//         <div className="flex flex-col gap-2">
//           {
//             Array
//               .from({ length: 8 })
//               .map(
//                 (_, i) => <CompactPostCardSkeleton key={ i } />
//               )
//           }
//         </div>
//       )
//     }
//     return (
//       <PostFeedSkeleton />
//     )
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-start mb-4">
//         <SortTabs
//           currentSort={ sortBy }
//           onSortChange={ handleSortChange }
//         />
//         <ViewModeToggle />
//       </div>

//       {
//         isInitialLoading ? (
//           renderSkeletons()
//         ) : posts.filter(p => !isBlocked(p.author.id)).length === 0 ? (
//           <EmptyState
//             Icon={ Globe }
//             title="The Feed is Empty"
//             description="There are no posts matching your criteria. Why not be the first?"
//             action={
//               {
//                 label: "Create a Post",
//                 href: "/submit"
//               }
//             }
//           />
//         ) : (
//           <>
//             <div className={
//               cn(
//                 "flex flex-col",
//                 viewMode === "card" ? "gap-4" : "gap-2"
//               )
//             }>
//               {
//                 posts
//                   .filter(post => !isBlocked(post.author.id))
//                   .map((post, index) => renderPost(post, index === posts.length - 1))
//               }
//             </div>

//             {
//               isLoading && !isInitialLoading && (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//               )
//             }

//             {
//               !hasMore && posts.length > 0 && (
//                 <div className="text-center text-muted-foreground py-10">
//                   <p>You&apos;ve reached the end of the line!</p>
//                 </div>
//               )
//             }
//           </>
//         )
//       }
//     </div>
//   );
// }
