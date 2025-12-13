// "use client";

// import { useState } from "react";
// import { useAuth } from "@/context/MockAuthContext";
// import { toast } from "sonner";
// import { SUPPORTED_LANGUAGES } from "@/libs/languages";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// interface ChangeContentLanguagesDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function ChangeContentLanguagesDialog({
//   isOpen,
//   onOpenChange
// }: ChangeContentLanguagesDialogProps) {

//   const { contentLanguages, setContentLanguages } = useAuth();
//   const [ selectedLanguages, setSelectedLanguages ] = useState<string[]>(contentLanguages);

//   const handleLanguageToggle = (langCode: string, checked: boolean) => {
//     if (checked) {
//       setSelectedLanguages(prev => [ ...prev, langCode ]);
//     } else {
//       setSelectedLanguages(prev => prev.filter(code => code !== langCode));
//     }
//   };

//   const handleSave = () => {
//     setContentLanguages(selectedLanguages);
//     toast.success("Content language preferences have been updated.");
//     onOpenChange(false);
//   }

//   return (
//     <Dialog
//       open={ isOpen }
//       onOpenChange={ onOpenChange }
//     >
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Select content languages</DialogTitle>
//           <DialogDescription>
//             We will show you content in the languages you select.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="py-4 space-y-2 max-h-60 overflow-y-auto">
//           { SUPPORTED_LANGUAGES.map(({ code, name, FlagComponent }) => (
//             <div
//               key={ code }
//               className="flex items-center space-x-3 rounded-md p-3 hover:bg-secondary"
//             >
//               <Checkbox
//                 id={ `content-lang-${code}` }
//                 checked={ selectedLanguages.includes(code) }
//                 onCheckedChange={ (checked) => handleLanguageToggle(code, !!checked) }
//               />
//               <Label
//                 htmlFor={ `content-lang-${code}` }
//                 className="flex-1 flex items-center gap-3 cursor-pointer"
//               >
//                 <FlagComponent className="h-5 w-5" />
//                 <span>{ name }</span>
//               </Label>
//             </div>
//           )) }
//         </div>

//         <DialogFooter>
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={ () => onOpenChange(false) }
//           >
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             onClick={ handleSave }
//           >
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
