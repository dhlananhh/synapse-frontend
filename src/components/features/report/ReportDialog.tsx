"use client";


import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TReportSchema,
  ReportSchema,
  REPORT_REASONS
} from "@/libs/validators/report-validator";
import { useAuth } from "@/context/MockAuthContext";
import { reportContent } from "@/libs/mock-api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";


interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemId: string;
  itemType: "POST" | "COMMENT";
}


export default function ReportDialog({
  isOpen,
  onOpenChange,
  itemId,
  itemType
}: ReportDialogProps) {

  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TReportSchema>({
    resolver: zodResolver(ReportSchema)
  });

  const onSubmit = async (data: TReportSchema) => {
    if (!user) return;

    try {
      await reportContent(itemId, itemType, data.reason, user.id);
      toast.success("Report submitted successfully.", {
        description: "Our moderators will review the content shortly. Thank you for helping keep Synapse safe."
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit report.", {
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ handleOpenChange }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Report Content
          </DialogTitle>
          <DialogDescription>
            Please select the reason for your report. Your report is anonymous to the author of the content.
          </DialogDescription>
        </DialogHeader>

        <form
          id="report-form"
          onSubmit={ handleSubmit(onSubmit) }
          className="space-y-4 py-4"
        >
          <Controller
            control={ control }
            name="reason"
            render={ ({ field }) => (
              <RadioGroup
                onValueChange={ field.onChange }
                value={ field.value }
                className="space-y-2"
              >
                {
                  REPORT_REASONS.map((reason) => (
                    <Label
                      key={ reason }
                      htmlFor={ reason }
                      className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:bg-secondary 
                      has-[:checked]:border-primary cursor-pointer"
                    >
                      <RadioGroupItem value={ reason } id={ reason } />
                      <span>{ reason }</span>
                    </Label>
                  ))
                }
              </RadioGroup>
            ) }
          />
          {
            errors.reason && (
              <p className="text-sm text-destructive">
                { errors.reason.message }
              </p>
            )
          }
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={ () => onOpenChange(false) }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="report-form"
            disabled={ isSubmitting }
            variant="destructive"
          >
            { isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
