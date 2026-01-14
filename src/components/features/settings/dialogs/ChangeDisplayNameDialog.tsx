// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   TUpdateDisplayNameSchema,
//   UpdateDisplayNameSchema
// } from "@/libs/validators/user-validator";
// import { toast } from "sonner";
// import { useAuth } from "@/context/MockAuthContext";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2 } from "lucide-react";

// interface ChangeDisplayNameDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function ChangeDisplayNameDialog({
//   isOpen,
//   onOpenChange
// }: ChangeDisplayNameDialogProps) {

//   const { user, updateUserProfile } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isDirty }
//   } = useForm<TUpdateDisplayNameSchema>({
//     resolver: zodResolver(UpdateDisplayNameSchema),
//     defaultValues: {
//       displayName: user?.displayName || ""
//     }
//   });

//   const onSubmit = async (data: TUpdateDisplayNameSchema) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     console.log("Updating display name:", data);
//     updateUserProfile(data);

//     toast.success("Display name updated successfully.");
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Change your display name</DialogTitle>
//           <DialogDescription>
//             Help people discover your account by using the name you're known by: either your full name, nickname, or business name.
//             You can only change this twice within 14 days.
//           </DialogDescription>
//         </DialogHeader>

//         <form
//           id="change-display-name-form"
//           onSubmit={ handleSubmit(onSubmit) }
//           className="space-y-4 py-4"
//         >
//           <div className="space-y-2">
//             <Label htmlFor="displayName">Display Name</Label>
//             <Input
//               id="displayName"
//               type="text" { ...register("displayName") }
//               placeholder="e.g., Alex Smith"
//             />
//             { errors.displayName && <p className="text-sm text-destructive">{ errors.displayName.message }</p> }
//           </div>
//         </form>

//         <DialogFooter>
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={ () => onOpenChange(false) }
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             form="change-display-name-form"
//             disabled={ isSubmitting || !isDirty }
//           >
//             { isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
