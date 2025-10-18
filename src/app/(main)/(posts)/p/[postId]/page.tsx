// "use client";

// import React, {
//   useEffect,
//   useState
// } from "react";
// import Link from "next/link";
// import {
//   useRouter,
//   notFound,
//   useParams
// } from "next/navigation";
// import { toast } from "sonner";
// import { formatDistanceToNow } from "date-fns";

// import { useAuth } from "@/context/MockAuthContext";
// import {
//   fetchPostById,
//   deletePost
// } from "@/libs/mock-api";
// import { Post } from "@/types";
// import { PATHS } from "@/libs/paths";

// import ConfirmDialog from "@/components/shared/ConfirmDialog";
// import ReportDialog from "@/components/features/report/ReportDialog";
// import PostCardSkeleton from "@/components/features/post/PostCardSkeleton";
// import ErrorDisplay from "@/components/shared/ErrorDisplay";
// import { UserAvatar } from "@/components/shared/UserAvatar";
// import AwardDisplay from "@/components/features/awards/AwardDisplay";
// import VoteClient from "@/components/features/post/VoteClient";
// import CommentSection from "@/components/features/comment/CommentSection";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   MoreHorizontal,
//   Pencil,
//   Trash2,
//   Flag
// } from "lucide-react";

// function PostView({ post }: { post: Post }) {
//   const { user, logPostView } = useAuth();
//   const router = useRouter();
//   const isAuthor = user?.id === post.author.id;

//   const [ isDeleting, setIsDeleting ] = useState(false);
//   const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState(false);
//   const [ isReportDialogOpen, setIsReportDialogOpen ] = useState(false);

//   useEffect(() => {
//     logPostView(post.id);
//   }, [ post.id, logPostView ]);

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await deletePost(post.id);
//       toast.success("Post deleted successfully.");
//       router.push(PATHS.community(post.community.slug));
//       router.refresh();
//     } catch (error) {
//       toast.error("Failed to delete post.");
//     } finally {
//       setIsDeleting(false);
//       setIsDeleteDialogOpen(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mt-10">
//         <VoteClient
//           itemId={ post.id }
//           initialVotes={ post.votes }
//         />
//         <div className="w-full rounded-md bg-card border p-4 sm:p-6">
//           <div className="flex justify-between items-start">
//             <div className="flex-1 text-xs text-muted-foreground">
//               Posted by { " " }
//               <Link
//                 href={ PATHS.userProfile(post.author.username) }
//                 className="font-semibold text-primary hover:underline"
//               >
//                 u/{ post.author.username }
//               </Link>
//               { " " } in{ " " }
//               <Link
//                 href={ PATHS.community(post.community.slug) }
//                 className="font-semibold text-primary hover:underline"
//               >
//                 c/{ post.community.slug }
//               </Link>
//               { " • " }
//               <span>
//                 { formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) }
//               </span>
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 w-8 p-0"
//                 >
//                   <MoreHorizontal className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {
//                   isAuthor ? (
//                     <>
//                       <DropdownMenuItem asChild>
//                         <Link href={ PATHS.postEdit(post.id) }>
//                           <Pencil className="mr-2 h-4 w-4" />
//                           Edit Post
//                         </Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         onClick={ () => setIsDeleteDialogOpen(true) }
//                         className="text-destructive focus:bg-destructive/10 focus:text-destructive"
//                       >
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Delete Post
//                       </DropdownMenuItem>
//                     </>
//                   ) : (
//                     user && (
//                       <DropdownMenuItem onClick={ () => setIsReportDialogOpen(true) }>
//                         <Flag className="mr-2 h-4 w-4" />
//                         Report
//                       </DropdownMenuItem>
//                     )
//                   )
//                 }
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <h1 className="mt-2 text-2xl font-bold leading-tight flex items-center gap-2 flex-wrap">
//             {
//               post.flair && (
//                 <Badge
//                   style={
//                     {
//                       backgroundColor: post.flair.color,
//                       color: "#fff"
//                     }
//                   }
//                 >
//                   { post.flair.name }
//                 </Badge>
//               )
//             }
//             <span>
//               { post.title }
//             </span>
//           </h1>
//           {
//             post.receivedAwards && post.receivedAwards.length > 0 && (
//               <div className="mt-3">
//                 <AwardDisplay awards={ post.receivedAwards } />
//               </div>
//             )
//           }

//           <p className="mt-4 text-foreground/80 whitespace-pre-wrap">
//             { post.content }
//           </p>
//           <CommentSection
//             postId={ post.id }
//             initialComments={ post.comments }
//           />
//         </div>
//       </div>

//       <ConfirmDialog
//         open={ isDeleteDialogOpen }
//         onOpenChange={ setIsDeleteDialogOpen }
//         onConfirm={ handleDelete }
//         title="Are you sure you want to delete this post?"
//         description="This action cannot be undone. All comments and votes will be permanently lost."
//         confirmText="Delete Post"
//         isConfirming={ isDeleting }
//       />

//       <ReportDialog
//         isOpen={ isReportDialogOpen }
//         onOpenChange={ setIsReportDialogOpen }
//         itemId={ post.id }
//         itemType="POST"
//       />
//     </>
//   );
// }

// export default function PostDetailPage() {
//   const params = useParams();
//   const postId = typeof params.postId === "string" ? params.postId : "";
//   const [ post, setPost ] = useState<Post | null>(null);
//   const [ isLoading, setIsLoading ] = useState(true);
//   const [ error, setError ] = useState<string | null>(null);

//   useEffect(() => {
//     const loadPost = async () => {
//       if (!postId) return;
//       setIsLoading(true);
//       setError(null);
//       try {
//         const fetchedPost = await fetchPostById(postId);
//         setPost(fetchedPost);
//       } catch (err: any) {
//         if ((err as any).status === 404) notFound();
//         else setError(err.message || "An unknown error occurred.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadPost();
//   }, [ postId, setPost ]);

//   if (isLoading) {
//     return (
//       <div className="p-4 sm:p-6">
//         <PostCardSkeleton />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <ErrorDisplay message={ error } />
//     )
//   }

//   if (post) {
//     return (
//       <PostView post={ post } />
//     )
//   }

//   return null;
// }
