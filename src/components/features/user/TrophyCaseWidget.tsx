// "use client";

// import React, { useEffect, useState } from "react";
// import { Trophy } from "@/types";
// import { fetchUserTrophies } from "@/libs/mock-api";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// export default function TrophyCaseWidget({ username }: { username: string }) {
//   const [ trophies, setTrophies ] = useState<Trophy[]>([]);
//   const [ isLoading, setIsLoading ] = useState(true);

//   useEffect(() => {
//     const loadTrophies = async () => {
//       setIsLoading(true);
//       const data = await fetchUserTrophies(username);
//       setTrophies(data);
//       setIsLoading(false);
//     };
//     loadTrophies();
//   }, [ username ]);

//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-6 w-3/4" />
//         </CardHeader>
//         <CardContent className="grid grid-cols-4 gap-4">
//           <Skeleton className="h-12 w-12 rounded-lg" />
//           <Skeleton className="h-12 w-12 rounded-lg" />
//           <Skeleton className="h-12 w-12 rounded-lg" />
//           <Skeleton className="h-12 w-12 rounded-lg" />
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>
//           Trophy Case
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {
//           trophies.length > 0 ? (
//             <TooltipProvider delayDuration={ 100 }>
//               <div className="grid grid-cols-4 gap-4">
//                 {
//                   trophies.map(
//                     ({ id, name, description, Icon }) => (
//                       <Tooltip key={ id }>
//                         <TooltipTrigger asChild>
//                           <div className="flex items-center justify-center p-3 bg-secondary rounded-lg border aspect-square">
//                             <Icon className="h-8 w-8 text-amber-500" />
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p className="font-bold">
//                             { name }
//                           </p>
//                           <p className="text-xs text-gray-300">
//                             { description }
//                           </p>
//                         </TooltipContent>
//                       </Tooltip>
//                     )
//                   )
//                 }
//               </div>
//             </TooltipProvider>
//           ) : (
//             <p className="text-sm text-muted-foreground text-center">
//               This user hasn't earned any trophies yet.
//             </p>
//           )
//         }
//       </CardContent>
//     </Card>
//   );
// }
