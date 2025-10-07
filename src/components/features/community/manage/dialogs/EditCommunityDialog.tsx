// "use client";

// import React from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   TEditCommunitySchema,
//   EditCommunitySchema
// } from "@/libs/validators/community-validator";
// import { updateCommunity } from "@/libs/mock-api";
// import { Community } from "@/types";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// interface EditCommunityDialogProps {
//   community: Community;
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function EditCommunityDialog({
//   community,
//   isOpen,
//   onOpenChange
// }: EditCommunityDialogProps) {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isDirty }
//   } = useForm<TEditCommunitySchema>({
//     resolver: zodResolver(EditCommunitySchema),
//     defaultValues: {
//       name: community.name,
//       description: community.description,
//     }
//   });

//   const onSubmit = async (data: TEditCommunitySchema) => {
//     try {
//       await updateCommunity(community.id, data);
//       toast.success(`c/${community.slug} has been updated.`);
//       onOpenChange(false);
//       router.refresh();
//     } catch (error: any) {
//       toast.error("Failed to update community", { description: error.message });
//     }
//   };

//   return (
//     <Dialog
//       open={ isOpen }
//       onOpenChange={ onOpenChange }
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             Edit Community Details
//           </DialogTitle>
//           <DialogDescription>
//             Update the name and description for c/{ community.slug }. The community URL cannot be changed.
//           </DialogDescription>
//         </DialogHeader>
//         <form
//           id="edit-community-form"
//           onSubmit={ handleSubmit(onSubmit) }
//           className="space-y-4 py-4"
//         >
//           <div className="space-y-2">
//             <Label htmlFor="name">
//               Community Name
//             </Label>
//             <Input
//               id="name"
//               { ...register("name") }
//             />
//             {
//               errors.name && (
//                 <p className="text-sm text-destructive">
//                   { errors.name.message }
//                 </p>
//               )
//             }
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               { ...register("description") }
//               rows={ 4 }
//             />
//             {
//               errors.description && (
//                 <p className="text-sm text-destructive">
//                   { errors.description.message }
//                 </p>
//               )
//             }
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
//             form="edit-community-form"
//             disabled={ isSubmitting || !isDirty }
//           >
//             {
//               isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             }
//             Save Changes
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
