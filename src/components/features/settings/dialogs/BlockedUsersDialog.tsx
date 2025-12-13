// "use client";

// import { useAuth } from "@/context/MockAuthContext";
// import { allMockUsers } from "@/libs/mock-data";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { UserAvatar } from "@/components/shared/UserAvatar";
// import EmptyState from "@/components/shared/EmptyState";
// import { UserX } from "lucide-react";

// interface BlockedUsersDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function BlockedUsersDialog({
//   isOpen,
//   onOpenChange
// }: BlockedUsersDialogProps) {

//   const {
//     blockedUserIds,
//     toggleBlockUser
//   } = useAuth();

//   const blockedUsers = allMockUsers.filter(u => blockedUserIds.includes(u.id));

//   const handleUnblock = (user: (typeof blockedUsers)[ 0 ]) => {
//     toggleBlockUser(user.id);
//     toast.success(`Unblocked u/${user.username}`);
//   };

//   return (
//     <Dialog
//       open={ isOpen }
//       onOpenChange={ onOpenChange }
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             Blocked Accounts
//           </DialogTitle>
//           <DialogDescription>
//             You won"t see content from or be able to interact with these users.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="py-4 space-y-3 max-h-80 overflow-y-auto">
//           {
//             blockedUsers.length > 0 ? (
//               blockedUsers.map(user => (
//                 <div
//                   key={ user.id }
//                   className="flex items-center justify-between p-2 rounded-md hover:bg-secondary"
//                 >
//                   <div className="flex items-center gap-3">
//                     <UserAvatar user={ user } />
//                     <p className="font-semibold">
//                       u/{ user.username }
//                     </p>
//                   </div>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={ () => handleUnblock(user) }
//                   >
//                     Unblock
//                   </Button>
//                 </div>
//               ))
//             ) : (
//               <EmptyState
//                 Icon={ UserX }
//                 title="No Blocked Users"
//                 description="When you block a user, you'll see them here."
//               />
//             )
//           }
//         </div>

//         <DialogFooter>
//           <Button
//             type="button"
//             onClick={ () => onOpenChange(false) }
//           >
//             Done
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
