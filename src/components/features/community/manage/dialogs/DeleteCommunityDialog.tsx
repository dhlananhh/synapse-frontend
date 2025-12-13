// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Community } from "@/types";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { deleteCommunity } from "@/libs/mock-api";
// import { Loader2 } from "lucide-react";

// export default function DeleteCommunityDialog(
//   {
//     isOpen,
//     onOpenChange,
//     community
//   }: {
//     isOpen: boolean,
//     onOpenChange: (isOpen: boolean) => void,
//     community: Community
//   }
// ) {
//   const router = useRouter();
//   const [ confirmationText, setConfirmationText ] = useState("");
//   const [ isDeleting, setIsDeleting ] = useState(false);
//   const expectedConfirmation = `c/${community.slug}`;

//   const handleDelete = async () => {
//     if (confirmationText !== expectedConfirmation) {
//       toast.error("The text you entered does not match the community name.");
//       return;
//     }

//     setIsDeleting(true);

//     try {
//       await deleteCommunity(community.id);

//       toast.success(`Community c/${community.slug} has been deleted.`, {
//         description: "You will be redirected to the main feed."
//       });

//       onOpenChange(false);
//       router.push('/feed');
//       router.refresh();

//     } catch (error) {
//       console.error("Failed to delete community:", error);
//       toast.error("Failed to delete community.", {
//         description: "An unexpected error occurred. Please try again later."
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <AlertDialog open={ isOpen } onOpenChange={ onOpenChange }>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>
//             Are you sure you want to delete this community?
//           </AlertDialogTitle>
//           <AlertDialogDescription>
//             This is a permanent action. All posts, comments, and members associated with
//             <strong>c/{ community.slug }</strong> will be lost forever.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <div className="space-y-2 py-2">
//           <Label htmlFor="delete-confirm">
//             Please type <strong className="text-foreground">{ expectedConfirmation }</strong> to confirm.
//           </Label>
//           <Input
//             id="delete-confirm"
//             value={ confirmationText }
//             onChange={ (e) => setConfirmationText(e.target.value) }
//           />
//         </div>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction asChild>
//             <Button
//               variant="destructive"
//               disabled={ confirmationText !== expectedConfirmation || isDeleting }
//               onClick={ handleDelete }
//             >
//               { isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
//               Delete this Community
//             </Button>
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
