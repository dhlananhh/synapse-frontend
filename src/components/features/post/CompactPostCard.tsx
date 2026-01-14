// "use client";

// import React from "react";
// import Link from "next/link";
// import { Post } from "@/types";
// import VoteClient from "./VoteClient";
// import SavePostButton from "./SavePostButton";
// import { MessageCircle } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

// interface CompactPostCardProps {
//   post: Post;
// }

// const CompactPostCard = React.forwardRef<HTMLDivElement, CompactPostCardProps>(
//   ({ post }, ref) => {
//     return (
//       <div
//         ref={ ref }
//         className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
//       >
//         <VoteClient
//           itemId={ post.id }
//           initialVotes={ post.votes }
//         />

//         <div className="flex-1 min-w-0">
//           <Link
//             href={ `/p/${post.id}` }
//             className="block"
//           >
//             <p className="font-semibold text-base truncate group-hover:underline">
//               { post.title }
//             </p>
//           </Link>
//           <div className="text-xs text-muted-foreground mt-1 flex items-center flex-wrap gap-x-2">
//             <span>
//               Posted by { " " }
//               <Link
//                 href={ `/u/${post.author.username}` }
//                 className="hover:underline"
//               >u/{ post.author.username }
//               </Link>
//             </span>
//             <span>
//               in { " " }
//               <Link
//                 href={ `/c/${post.community.slug}` }
//                 className="hover:underline"
//               >
//                 c/{ post.community.slug }
//               </Link>
//             </span>
//             <span>
//               { formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) }
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Link
//             href={ `/p/${post.id}` }
//             className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm"
//           >
//             <MessageCircle className="h-4 w-4" />
//             <span>
//               { post.comments.length }
//             </span>
//           </Link>
//           <SavePostButton postId={ post.id } />
//         </div>
//       </div>
//     );
//   }
// );

// CompactPostCard.displayName = "CompactPostCard";

// export default CompactPostCard;
