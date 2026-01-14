// "use client";

// import React, { useState } from "react";
// import { Community } from "@/types";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import ManageFlairsDialog from "../dialogs/ManageFlairsDialog";
// import { Tags } from "lucide-react";

// export default function ManageFlairsTab({ community }: { community: Community }) {
//   const [ isFlairsDialogOpen, setIsFlairsDialogOpen ] = useState(false);

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             Post Flairs
//           </CardTitle>
//           <CardDescription>
//             Flairs help users categorize and filter content within your community.
//             You can create, edit, and delete flairs here.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button onClick={ () => setIsFlairsDialogOpen(true) }>
//             <Tags className="mr-2 h-4 w-4" />
//             Manage Flairs
//           </Button>
//         </CardContent>
//       </Card>

//       <ManageFlairsDialog
//         isOpen={ isFlairsDialogOpen }
//         onOpenChange={ setIsFlairsDialogOpen }
//         community={ community }
//       />
//     </>
//   );
// }
