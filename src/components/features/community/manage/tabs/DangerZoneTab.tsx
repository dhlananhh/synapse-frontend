// "use client";

// import React, { useState } from "react";
// import { Community } from "@/types";
// import SettingsRow from "@/components/features/settings/SettingsRow";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription
// } from "@/components/ui/card";
// import DeleteCommunityDialog from "../dialogs/DeleteCommunityDialog";
// import TransferOwnershipDialog from "../dialogs/TransferOwnershipDialog";
// import { ChevronRight } from "lucide-react";

// export default function DangerZoneTab({ community }: { community: Community }) {
//   const [ isTransferDialogOpen, setIsTransferDialogOpen ] = useState(false);
//   const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState(false);

//   return (
//     <>
//       <Card className="border-destructive">
//         <CardHeader>
//           <CardTitle className="text-destructive">
//             Danger Zone
//           </CardTitle>
//           <CardDescription>
//             These actions are irreversible. Please proceed with caution.
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="p-0">
//           <div
//             onClick={ () => setIsTransferDialogOpen(true) }
//             className="cursor-pointer"
//           >
//             <SettingsRow
//               title="Transfer Ownership"
//               description={ `Transfer this community to another user.` }
//             >
//               <ChevronRight className="h-5 w-5" />
//             </SettingsRow>
//           </div>
//           <div
//             onClick={ () => setIsDeleteDialogOpen(true) }
//             className="cursor-pointer"
//           >
//             <SettingsRow
//               title="Delete this community"
//               description={ `Permanently delete c/${community.slug}, including all its content.` }
//             >
//               <ChevronRight className="h-5 w-5" />
//             </SettingsRow>
//           </div>
//         </CardContent>
//       </Card>

//       <TransferOwnershipDialog
//         isOpen={ isTransferDialogOpen }
//         onOpenChange={ setIsTransferDialogOpen }
//         community={ community }
//       />

//       <DeleteCommunityDialog
//         isOpen={ isDeleteDialogOpen }
//         onOpenChange={ setIsDeleteDialogOpen }
//         community={ community }
//       />
//     </>
//   );
// }
