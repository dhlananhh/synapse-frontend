// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useAuth } from "@/context/MockAuthContext";
// import {
//   TUserProfileSchema,
//   UserProfileSchema
// } from "@/libs/validators/user-validator";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2 } from "lucide-react";

// export default function UpdateProfileForm() {
//   const { user, updateUserProfile } = useAuth();
//   const [ successMessage, setSuccessMessage ] = useState<string>("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isDirty },
//   } = useForm<TUserProfileSchema>({
//     resolver: zodResolver(UserProfileSchema),
//     defaultValues: {
//       username: user?.username || "",
//     }
//   });

//   const onSubmit = async (data: TUserProfileSchema) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     updateUserProfile(data);

//     toast.success("Profile Updated", {
//       description: "Your public profile has been updated successfully.",
//       duration: 3000,
//     });
//   }

//   if (!user) {
//     return <p>Loading user data...</p>;
//   }

//   return (
//     <form onSubmit={ handleSubmit(onSubmit) }>
//       <Card>
//         <CardHeader>
//           <CardTitle>Public Profile</CardTitle>
//           <CardDescription>
//             This is how others will see you on the site.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-2">
//             <Label htmlFor="username">Username</Label>
//             <div className="relative">
//               <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-muted-foreground">u/</p>
//               <Input
//                 { ...register("username") }
//                 id="username"
//                 className="pl-6"
//               />
//             </div>
//             { errors.username && <p className="text-xs text-destructive">{ errors.username.message }</p> }
//           </div>
//         </CardContent>
//         <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
//           { successMessage && <p className="text-sm text-emerald-600">{ successMessage }</p> }
//           <Button type="submit" disabled={ isSubmitting || !isDirty }>
//             { isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
//             Save Changes
//           </Button>
//         </CardFooter>
//       </Card>
//     </form>
//   );
// }
