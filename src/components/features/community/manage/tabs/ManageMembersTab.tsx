// "use client";

// import React, { useState } from "react";
// import { allMockUsers } from "@/libs/mock-data";
// import { Community, User } from "@/types";
// import { toast } from "sonner";
// import { updateCommunityModerators } from "@/libs/mock-api";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription
// } from "@/components/ui/card";
// import { UserAvatar } from "@/components/shared/UserAvatar";
// import { Button } from "@/components/ui/button";
// import {
//   Shield,
//   ShieldOff,
//   Loader2
// } from "lucide-react";
// import ConfirmDialog from "@/components/shared/ConfirmDialog";

// export default function ManageMembersTab({ community }: { community: Community }) {
//   const allMembers = allMockUsers;
//   const [ moderators, setModerators ] = useState(community.moderatorIds);
//   const ownerId = community.ownerId;

//   const [ isRevokeDialogOpen, setIsRevokeDialogOpen ] = useState(false);
//   const [ targetUser, setTargetUser ] = useState<User | null>(null);
//   const [ isUpdating, setIsUpdating ] = useState(false);

//   const handleGrantMod = async (memberId: string) => {
//     setIsUpdating(true);
//     const newModerators = [ ...moderators, memberId ];

//     try {
//       await updateCommunityModerators(community.id, newModerators);
//       setModerators(newModerators);
//       toast.success("Moderator status has been granted.");
//     } catch {
//       toast.error("Failed to grant moderator status. Please try again.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleRevokeModClick = (member: User) => {
//     if (member.id === ownerId) return;
//     setTargetUser(member);
//     setIsRevokeDialogOpen(true);
//   };

//   const handleConfirmRevokeMod = async () => {
//     if (!targetUser) return;
//     setIsUpdating(true);

//     const newModerators = moderators.filter(id => id !== targetUser.id);

//     try {
//       await updateCommunityModerators(community.id, newModerators);
//       setModerators(newModerators);
//       toast.success(`Moderator status has been revoked for u/${targetUser.username}.`);
//     } catch {
//       toast.error("Failed to revoke moderator status. Please try again.");
//     } finally {
//       setIsUpdating(false);
//       setIsRevokeDialogOpen(false);
//       setTargetUser(null);
//     }
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             Members & Moderators
//           </CardTitle>
//           <CardDescription>
//             Grant or revoke moderator permissions for community members.
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-3">
//           {
//             allMembers.map(member => {
//               const isOwner = member.id === ownerId;
//               const isMod = moderators.includes(member.id);

//               return (
//                 <div
//                   key={ member.id }
//                   className="flex items-center justify-between p-2 rounded-md hover:bg-secondary"
//                 >
//                   <div className="flex items-center gap-3">
//                     <UserAvatar user={ member } />
//                     <div>
//                       <p className="font-semibold">{ member.username }</p>
//                       <p className="text-xs text-muted-foreground">
//                         { isOwner ? "Owner" : isMod ? "Moderator" : "Member" }
//                       </p>
//                     </div>
//                   </div>

//                   {
//                     !isOwner && (
//                       <Button
//                         variant={ isMod ? "destructive" : "outline" }
//                         size="sm"
//                         onClick={ () => isMod ? handleRevokeModClick(member) : handleGrantMod(member.id) }
//                         disabled={ isUpdating }
//                       >
//                         { isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" /> }
//                         { isMod ? <ShieldOff className="h-4 w-4 mr-2" /> : <Shield className="h-4 w-4 mr-2" /> }
//                         { isMod ? "Revoke Moderator" : "Assign Moderator" }
//                       </Button>
//                     )
//                   }
//                 </div>
//               )
//             })
//           }
//         </CardContent>
//       </Card>

//       <ConfirmDialog
//         open={ isRevokeDialogOpen }
//         onOpenChange={ setIsRevokeDialogOpen }
//         onConfirm={ handleConfirmRevokeMod }
//         isConfirming={ isUpdating }
//         title={ `Revoke moderator permissions for u/${targetUser?.username}?` }
//         description={ `This user will lose all moderator abilities in this community. Are you sure you want to proceed?` }
//         confirmText="Yes, revoke"
//         isDestructive={ true }
//       />
//     </>
//   );
// }
