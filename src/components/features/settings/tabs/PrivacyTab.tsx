// "use client";

// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import SettingsRow from "../SettingsRow";
// import BlockedUsersDialog from '../dialogs/BlockedUsersDialog';
// import { ChevronRight } from "lucide-react";

// export default function PrivacyTab() {
//   const [ isBlockDialogOpen, setIsBlockDialogOpen ] = useState(false);

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle className="uppercase">Privacy & Security</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">

//           <h3 className="font-semibold text-sm px-4 pt-2 text-muted-foreground uppercase tracking-wider">
//             Social interactions
//           </h3>

//           <SettingsRow
//             title="Allow people to follow you"
//             description="Let people follow you to see your profile posts in their home feed"
//           >
//             <Switch defaultChecked />
//           </SettingsRow>

//           <SettingsRow
//             title="Who can send you chat requests"
//             description="Control who can initiate a chat with you"
//             href="#"
//           >
//             <span>Everyone</span>
//           </SettingsRow>

//           <div
//             onClick={ () => setIsBlockDialogOpen(true) }
//             className="cursor-pointer"
//           >
//             <SettingsRow
//               title="Blocked accounts"
//               description="View and manage accounts you've blocked"
//             >
//               <Button variant="ghost" size="default">
//                 <ChevronRight className="h-5 w-5 text-muted-foreground" />
//               </Button>
//             </SettingsRow>
//           </div>

//           <h3 className="font-semibold text-sm px-4 pt-6 text-muted-foreground uppercase tracking-wider">
//             Discoverability
//           </h3>
//           <SettingsRow
//             title="Show up in search results"
//             description="Allow search engines like Google to link to your profile"
//           >
//             <Switch defaultChecked />
//           </SettingsRow>

//           <h3 className="font-semibold text-sm px-4 pt-6 text-muted-foreground uppercase tracking-wider">
//             Advanced
//           </h3>

//           <SettingsRow
//             title="Third-party app authorizations"
//             description="Manage apps you've given access to your account"
//             href="#"
//             isExternal={ true }
//           >
//             <span></span>
//           </SettingsRow>
//           <SettingsRow
//             title="Clear history"
//             description="Delete your post views history"
//           >
//             <Button
//               size="sm"
//               variant="outline"
//             >
//               Clear
//             </Button>
//           </SettingsRow>

//         </CardContent>
//       </Card>

//       <BlockedUsersDialog
//         isOpen={ isBlockDialogOpen }
//         onOpenChange={ setIsBlockDialogOpen }
//       />
//     </>
//   );
// }
