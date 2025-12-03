// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// import { useAuth } from "@/context/AuthContext";
// import { Comment, User } from "@/types";

// import CommentForm from "./CommentForm";
// import CommentItem from "@/components/features/comment/CommentItem";

// interface CommentSectionProps {
//   postId: string;
//   initialComments: Comment[];
// }

// export default function CommentSection({
//   postId,
//   initialComments
// }: CommentSectionProps) {
//   const {
//     user,
//     isBlocked
//   } = useAuth();
//   const [ comments, setComments ] = useState<Comment[]>(initialComments);

//   const handleAddComment = async (text: string) => {
//     const newComment: Comment = {
//       id: `c${Date.now()}`,
//       text,
//       author: user as User,
//       createdAt: new Date().toISOString(),
//       votes: 1,
//       replies: [],
//     };
//     setComments(prev => [ newComment, ...prev ]);
//   };

//   const removeCommentFromState = (commentId: string) => {
//     const filterRecursive = (comments: Comment[]): Comment[] => {
//       return comments
//         .filter(c => c.id !== commentId)
//         .map(c => ({ ...c, replies: c.replies ? filterRecursive(c.replies) : [] }));
//     };
//     setComments(filterRecursive);
//   }

//   const updateCommentInState = (commentId: string, newText: string) => {
//     const updateRecursive = (comments: Comment[]): Comment[] => {
//       return comments.map(c => {
//         if (c.id === commentId) {
//           return { ...c, text: newText };
//         }
//         return { ...c, replies: c.replies ? updateRecursive(c.replies) : [] };
//       });
//     };
//     setComments(updateRecursive);
//   }

//   const filterBlockedComments = (commentList: Comment[]): Comment[] => {
//     return commentList
//       .filter(comment => !isBlocked(comment.author.id))
//       .map(comment => {
//         if (comment.replies && comment.replies.length > 0) {
//           return { ...comment, replies: filterBlockedComments(comment.replies) };
//         }
//         return comment;
//       });
//   };

//   const visibleComments = filterBlockedComments(comments);

//   return (
//     <div className="mt-8">
//       <hr className="my-6" />
//       {
//         user ? (
//           <div>
//             <p className="text-sm mb-2">
//               Comment as { " " }
//               <span className="font-semibold text-primary">
//                 { user.username }
//               </span>
//             </p>
//             <CommentForm onCommentSubmit={ handleAddComment } />
//           </div>
//         ) : (
//           <div className="text-center text-muted-foreground p-4 border rounded-md">
//             <Link
//               href="/login"
//               className="text-primary font-semibold hover:underline"
//             >
//               Log in
//             </Link>
//             { " " } or { " " }
//             <Link
//               href="/register"
//               className="text-primary font-semibold hover:underline"
//             >
//               Sign up
//             </Link>
//             { " " } to leave a comment.
//           </div>
//         )
//       }

//       <div className="mt-6 space-y-4">
//         {
//           visibleComments.map(comment => (
//             <CommentItem
//               key={ comment.id }
//               comment={ comment }
//               postId={ postId }
//               onCommentDeleted={ removeCommentFromState }
//               onCommentUpdated={ updateCommentInState }
//             />
//           ))
//         }
//       </div>
//     </div>
//   );
// }
