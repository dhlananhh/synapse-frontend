// "use client";

// import { useAuth } from "@/context/MockAuthContext";
// import { mockCommunities } from "@/libs/mock-data";
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
// import { VolumeX } from "lucide-react";

// interface MutedCommunitiesDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function MutedCommunitiesDialog({
//   isOpen,
//   onOpenChange
// }: MutedCommunitiesDialogProps) {

//   const { mutedCommunityIds, toggleMuteCommunity } = useAuth();

//   const mutedCommunities = mockCommunities.filter(c => mutedCommunityIds.includes(c.id));

//   const handleUnmute = (community: typeof mutedCommunities[ 0 ]) => {
//     toggleMuteCommunity(community.id);
//     toast.success(`Unmuted c/${community.slug}`);
//   };

//   return (
//     <Dialog
//       open={ isOpen }
//       onOpenChange={ onOpenChange }
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             Muted Communities
//           </DialogTitle>
//           <DialogDescription>
//             You won't see posts from these communities in your home feed or recommendations.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="py-4 space-y-3 max-h-80 overflow-y-auto">
//           {
//             mutedCommunities.length > 0 ? (
//               mutedCommunities.map(community => (
//                 <div
//                   key={ community.id }
//                   className="flex items-center justify-between p-2 rounded-md hover:bg-secondary"
//                 >
//                   <div className="flex items-center gap-3">
//                     <UserAvatar
//                       name={ community.slug }
//                       imageUrl={ community.imageUrl }
//                     />
//                     <p className="font-semibold">
//                       c/{ community.slug }
//                     </p>
//                   </div>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={ () => handleUnmute(community) }
//                   >
//                     Unmute
//                   </Button>
//                 </div>
//               ))
//             ) : (
//               <EmptyState
//                 Icon={ VolumeX }
//                 title="No Muted Communities"
//                 description="When you mute a community, you'll see it here."
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
