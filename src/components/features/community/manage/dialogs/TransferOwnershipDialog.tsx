"use client";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Community, User } from "@/types";
import { toast } from "sonner";
import { allMockUsers } from "@/libs/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/context/MockAuthContext";
import { cn } from "@/libs/utils";


interface TransferOwnershipDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  community: Community;
}

export default function TransferOwnershipDialog({
  isOpen,
  onOpenChange,
  community
}: TransferOwnershipDialogProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [ selectedUser, setSelectedUser ] = useState<User | null>(null);
  const [ confirmationText, setConfirmationText ] = useState("");
  const [ isTransferring, setIsTransferring ] = useState(false);
  const [ isComboboxOpen, setIsComboboxOpen ] = useState(false);

  const eligibleMembers = allMockUsers.filter(u => u.id !== user?.id);

  const isConfirmationMatched = confirmationText === selectedUser?.username;

  const handleTransfer = async () => {
    if (!selectedUser) {
      toast.error("You must select a new owner.");
      return;
    }
    if (!isConfirmationMatched) {
      toast.error("The text you entered does not match the selected user's username.");
      return;
    }

    setIsTransferring(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Ownership of c/${community.slug} transferred to ${selectedUser.username}`);

    toast.success(`Ownership Transferred`, {
      description: `You are no longer the owner of c/${community.slug}. The community is now owned by u/${selectedUser.username}.`
    });

    setIsTransferring(false);
    onOpenChange(false);
    router.push(`/c/${community.slug}`);
    router.refresh();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedUser(null);
      setConfirmationText("");
      setIsComboboxOpen(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ handleOpenChange }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Community Ownership</DialogTitle>
          <DialogDescription className="text-destructive font-semibold">
            Warning: This action is irreversible.
            You will lose all owner permissions and will not be able to undo this.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Select new owner</Label>
            <Popover
              open={ isComboboxOpen }
              onOpenChange={ setIsComboboxOpen }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={ isComboboxOpen }
                  className="w-full justify-between"
                >
                  { selectedUser ? selectedUser.username : "Select a member..." }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Looking for members..." />
                  <CommandEmpty>No members found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {
                        eligibleMembers.map((member) => (
                          <CommandItem
                            key={ member.id }
                            value={ member.username }
                            onSelect={ () => {
                              setSelectedUser(member);
                              setIsComboboxOpen(false);
                            } }
                          >
                            <Check
                              className={
                                cn("mr-2 h-4 w-4", selectedUser?.id === member.id ? "opacity-100" : "opacity-0")
                              }
                            />
                            { member.username }
                          </CommandItem>
                        ))
                      }
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {
            selectedUser && (
              <div className="space-y-2">
                <Label htmlFor="transfer-confirm">
                  To confirm, please type the new owner"s username:
                  <strong className="text-foreground">
                    { selectedUser.username }
                  </strong>
                </Label>
                <Input
                  id="transfer-confirm"
                  value={ confirmationText }
                  onChange={ (e) => setConfirmationText(e.target.value) }
                />
              </div>
            )
          }
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={ () => onOpenChange(false) }
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={ !isConfirmationMatched || isTransferring }
            onClick={ handleTransfer }
          >
            { isTransferring && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            Transfer Ownership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
