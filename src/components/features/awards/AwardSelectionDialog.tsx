// "use client";

// import React, { useState } from "react";
// import { useUserStore } from "@/store/useUserStore";
// import { allMockAwards } from "@/libs/mock-data";
// import { Award } from "@/types";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader, DialogTitle
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { cn } from "@/libs/utils";

// interface AwardSelectionDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   onAwardGiven: (award: Award) => Promise<void>;
// }

// export default function AwardSelectionDialog({
//   isOpen,
//   onOpenChange,
//   onAwardGiven
// }: AwardSelectionDialogProps) {
//   const { coins } = useUserStore();
//   const [ selectedAward, setSelectedAward ] = useState<Award | null>(null);
//   const [ isSubmitting, setIsSubmitting ] = useState(false);

//   const canAfford = selectedAward ? coins >= selectedAward.cost : false;

//   const handleGiveAward = async () => {
//     if (!selectedAward || !canAfford)
//       return;

//     setIsSubmitting(true);
//     await onAwardGiven(selectedAward);
//     setIsSubmitting(false);
//     onOpenChange(false);
//     setSelectedAward(null);
//   }

//   return (
//     <Dialog
//       open={ isOpen }
//       onOpenChange={
//         (open) => {
//           onOpenChange(open);
//           setSelectedAward(null);
//         }
//       }
//     >
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             Give an Award
//           </DialogTitle>
//           <DialogDescription>
//             Show your appreciation for this content. Your remaining balance is { " " }
//             <strong>
//               { coins.toLocaleString() } coins
//             </strong>.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
//           {
//             allMockAwards.map(award => (
//               <Card
//                 key={ award.id }
//                 onClick={ () => setSelectedAward(award) }
//                 className={
//                   cn(
//                     "cursor-pointer transition-all",
//                     selectedAward?.id === award.id && "ring-2 ring-primary",
//                     coins < award.cost && "opacity-50 grayscale cursor-not-allowed"
//                   )
//                 }
//               >
//                 <CardContent className="p-4 flex flex-col items-center text-center">
//                   <award.Icon className="h-10 w-10 text-amber-500 mb-2" />
//                   <p className="font-bold">
//                     { award.name }
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     { award.cost.toLocaleString() } coins
//                   </p>
//                 </CardContent>
//               </Card>
//             ))
//           }
//         </div>

//         <DialogFooter>
//           <Button
//             variant="ghost"
//             onClick={ () => onOpenChange(false) }
//           >
//             Cancel
//           </Button>
//           <Button
//             disabled={ !selectedAward || !canAfford || isSubmitting }
//             onClick={ handleGiveAward }
//           >
//             {
//               isSubmitting
//                 ? "Giving..."
//                 : `Give "${selectedAward?.name || "..."}" Award`
//             }
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
