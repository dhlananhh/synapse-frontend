"use client"


import React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner";
import { adminService } from "@/modules/services/admin-service";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  MoreHorizontal,
  ArrowUpDown,
  UserX,
  CheckCircle2
} from "lucide-react"


export type AdminUser = {
  id: string;
  accountId: string;
  username: string;
  email: string;
  role: "USER" | "SYSTEM_ADMIN";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  createdAt: string;
}


const handleUserAction = async (
  user: AdminUser,
  action: "suspend" | "activate",
  onActionComplete: () => void
) => {
  const actionToastId = toast.loading(`
    ${action === "suspend" ? "Suspending" : "Activating"} user @${user.username}...`
  );
  try {
    const newStatus = action === "suspend" ? "SUSPENDED" : "ACTIVE";
    await adminService.adminUpdateUserStatus(user.id, newStatus);
    toast.success(
      `User @${user.username} has been ${action === "suspend" ? "suspended" : "activated"}.`,
      { id: actionToastId }
    );
    onActionComplete();
  } catch (error) {
    toast.error(`Failed to ${action} user.`, { id: actionToastId });
  }
}


export const getColumns = (onActionComplete: () => void): ColumnDef<AdminUser>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={ (value) => table.toggleAllPageRowsSelected(!!value) }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={ row.getIsSelected() }
        onCheckedChange={ (value) => row.toggleSelected(!!value) }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="font-medium">{ row.getValue("username") }</div>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{ row.getValue("email") }</div>,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" = "secondary";
      if (status === "ACTIVE") variant = "default";
      if (status === "SUSPENDED") variant = "destructive";

      return (
        <Badge
          variant={ variant }
          className="capitalize"
        >
          { status.toLowerCase() }
        </Badge>
      )
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
        >
          Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">
        { new Date(row.getValue("createdAt")).toLocaleDateString() }
      </div>
    )
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={ () => navigator.clipboard.writeText(user.id) }
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {
              user.status === "ACTIVE" && (
                <DropdownMenuItem
                  onClick={ () => handleUserAction(user, "suspend", onActionComplete) }
                  className="text-orange-600 focus:text-orange-600"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Suspend User
                </DropdownMenuItem>
              )
            }
            {
              user.status === "SUSPENDED" && (
                <DropdownMenuItem
                  onClick={ () => handleUserAction(user, "activate", onActionComplete) }
                  className="text-green-600 focus:text-green-600"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
