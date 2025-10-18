'use client'

// import React from "react";
// import { useAuth } from "@/context/MockAuthContext";
// import { Button } from "@/components/ui/button";
// import { LayoutGrid, List } from "lucide-react";

// export default function ViewModeToggle() {
//   const { viewMode, setViewMode } = useAuth();

//   return (
//     <div className="flex items-center">
//       <Button
//         variant={ viewMode === "card" ? "secondary" : "ghost" }
//         size="icon"
//         onClick={ () => setViewMode("card") }
//         aria-label="Card View"
//       >
//         <LayoutGrid className="h-5 w-5" />
//       </Button>
//       <Button
//         variant={ viewMode === "compact" ? "secondary" : "ghost" }
//         size="icon"
//         onClick={ () => setViewMode("compact") }
//         aria-label="Compact View"
//       >
//         <List className="h-5 w-5" />
//       </Button>
//     </div>
//   );
// }
