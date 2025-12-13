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
// import {
//   RadioGroup,
//   RadioGroupItem
// } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

// interface ChangeDisplayLanguageDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// export default function ChangeDisplayLanguageDialog({
//   isOpen,
//   onOpenChange
// }: ChangeDisplayLanguageDialogProps) {

//   const { displayLanguage, setDisplayLanguage } = useAuth();
//   const [ selectedLanguage, setSelectedLanguage ] = useState(displayLanguage);

//   const handleSave = () => {
//     setDisplayLanguage(selectedLanguage);
//     toast.success(`Display language set to ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}.`);
//     onOpenChange(false);
//   }

//   return (
//     <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Select display language</DialogTitle>
//           <DialogDescription>
//             Choose the language you want to see throughout the Synapse interface.
//           </DialogDescription>
//         </DialogHeader>

//         <RadioGroup value={ selectedLanguage } onValueChange={ setSelectedLanguage } className="py-4 space-y-2">
//           { SUPPORTED_LANGUAGES.map(({ code, name, FlagComponent }) => (
//             <Label
//               key={ code }
//               htmlFor={ `lang-${code}` }
//               className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:bg-secondary has-[:checked]:border-primary transition-colors cursor-pointer"
//             >
//               <RadioGroupItem value={ code } id={ `lang-${code}` } />
//               <FlagComponent className="h-5 w-5" />
//               <span>{ name }</span>
//             </Label>
//           )) }
//         </RadioGroup>

//         <DialogFooter>
//           <Button type="button" variant="ghost" onClick={ () => onOpenChange(false) }>Cancel</Button>
//           <Button type="button" onClick={ handleSave }>
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
