"use client";


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";


interface ActionConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: React.ReactNode;
  actionLabel: string;
  isConfirming?: boolean;

  withReason?: {
    label: string;
    placeholder: string;
    isRequired?: boolean;
  };
}


export function ActionConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  actionLabel,
  isConfirming = false,
  withReason
}: ActionConfirmDialogProps) {
  const [ reason, setReason ] = useState("");

  const handleConfirmClick = () => {
    if (withReason?.isRequired && !reason.trim()) {
      alert("Reason is required.");
      return;
    }
    onConfirm(withReason ? reason : undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReason("");
    }
    onOpenChange(open);
  }

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ handleOpenChange }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            { title }
          </DialogTitle>
          <DialogDescription>
            { description }
          </DialogDescription>
        </DialogHeader>

        {
          withReason && (
            <div className="py-4 space-y-2">
              <Label htmlFor="reason-input">
                { withReason.label } { " " } { withReason.isRequired && <span className="text-destructive">*</span> }
              </Label>
              <Textarea
                id="reason-input"
                value={ reason }
                onChange={ (e) => setReason(e.target.value) }
                placeholder={ withReason.placeholder }
                rows={ 3 }
              />
            </div>
          )
        }

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={ () => onOpenChange(false) }
            disabled={ isConfirming }
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={ handleConfirmClick }
            disabled={ isConfirming }
          >
            { isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            { actionLabel }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
