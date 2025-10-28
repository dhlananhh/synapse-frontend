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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  MoreHorizontal,
  ArrowUpDown,
  ShieldOff,
  ShieldCheck
} from "lucide-react"


export type AdminCommunity = {
  id: string;
  name: string;
  ownerId: string;
  memberCount: number;
  postCount: number;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  createdAt: string;
}


const handleCommunityAction = async (
  community: AdminCommunity,
  action: "suspend" | "activate",
  onActionComplete: () => void
) => {
  const actionToastId = toast.loading(
    `${action === "suspend" ? "Suspending" : "Activating"} c/${community.name}...`
  );
  try {
    const newStatus = action === "suspend" ? "SUSPENDED" : "ACTIVE";
    await adminService.adminUpdateCommunityStatus(community.id, newStatus);
    toast.success(
      `Community c/${community.name} has been ${action === "suspend" ? "suspended" : "activated"}.`,
      { id: actionToastId }
    );
    onActionComplete();
  } catch (error) {
    toast.error(`Failed to ${action} community.`, { id: actionToastId });
  }
}


export const getColumns = (onActionComplete: () => void): ColumnDef<AdminCommunity>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={ table.getIsAllPageRowsSelected() }
        onCheckedChange={ (value) => table.toggleAllPageRowsSelected(!!value) }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={ row.getIsSelected() }
        onCheckedChange={ (value) => row.toggleSelected(!!value) }
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        c/{ row.getValue("name") }
      </div>
    )
  },
  {
    accessorKey: "ownerId",
    header: "Owner ID"
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
      >
        Members
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        { row.getValue("memberCount") }
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" = status === "ACTIVE" ? "default" : status === "SUSPENDED" ? "destructive" : "secondary";
      return (
        <Badge
          variant={ variant }
          className="capitalize"
        >
          { status.toLowerCase() }
        </Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
        >
          Created At <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt") as string;
      if (!dateValue)
        return "N/A";
      const parsableDate = dateValue.replace(" ", "T");
      const date = new Date(parsableDate);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return (
        <div>
          { date.toLocaleDateString() }
        </div>
      );
    }
  },
  {
    id: "actions", cell: ({ row }) => {
      const community = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={ () => navigator.clipboard.writeText(community.id) }
            >
              Copy Community ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {

              community.status === "ACTIVE" && (
                <DropdownMenuItem
                  onClick={ () => handleCommunityAction(community, "suspend", onActionComplete) } className="text-orange-600"
                >
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Suspend Community
                </DropdownMenuItem>
              )
            }
            {

              community.status === "SUSPENDED" && (
                <DropdownMenuItem
                  onClick={ () => handleCommunityAction(community, "activate", onActionComplete) }
                  className="text-green-600"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Reactivate Community
                </DropdownMenuItem>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
];
