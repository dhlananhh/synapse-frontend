// "use client";

// import { useState } from "react";
// import { useAuth } from "@/context/MockAuthContext";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface DeleteAccountDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function DeleteAccountDialog({
//   isOpen,
//   onOpenChange
// }: DeleteAccountDialogProps) {

//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [ confirmationText, setConfirmationText ] = useState("");
//   const [ isDeleting, setIsDeleting ] = useState(false);

//   const isConfirmationMatched = confirmationText === user?.username;

//   const handleDeleteAccount = async () => {
//     if (!isConfirmationMatched) {
//       toast.error("The text you entered does not match your username.");
//       return;
//     }

//     setIsDeleting(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     console.log("Account deleted for user:", user?.username);
//     toast.success("Account deleted successfully.", {
//       description: "We're sad to see you go."
//     });

//     logout();
//     onOpenChange(false);
//     router.push("/");
//   };

//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       setConfirmationText("");
//     }
//     onOpenChange(open);
//   };

//   return (
//     <AlertDialog open={ isOpen } onOpenChange={ handleOpenChange }>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone.
//             This will permanently delete your account, posts, comments, and remove all your data from our servers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <div className="space-y-2 py-2">
//           <Label htmlFor="delete-confirm">
//             Please type <strong className="text-foreground">{ user?.username }</strong> to confirm.
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
//               disabled={ !isConfirmationMatched || isDeleting }
//               onClick={ handleDeleteAccount }
//             >
//               { isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
//               Delete Account
//             </Button>
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }
