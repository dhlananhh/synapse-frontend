"use client";


import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUpdateBirthdaySchema,
  UpdateBirthdaySchema
} from "@/libs/validators/user-validator";
import { toast } from "sonner";
import { useAuth } from "@/context/MockAuthContext";
import { format } from "date-fns";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Loader2,
  CalendarIcon
} from "lucide-react";
import { cn } from "@/libs/utils";


interface UpdateBirthdayDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}


export default function UpdateBirthdayDialog({
  isOpen,
  onOpenChange
}: UpdateBirthdayDialogProps) {

  const {
    user,
    updateUserProfile
  } = useAuth();

  const form = useForm<TUpdateBirthdaySchema>({
    resolver: zodResolver(UpdateBirthdaySchema),
    defaultValues: {
      birthday: user?.birthday ? new Date(user.birthday) : undefined,
    }
  });

  const onSubmit = async (data: TUpdateBirthdaySchema) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const birthdayString = data.birthday.toISOString().split("T")[ 0 ];

    console.log("Updating birthday:", birthdayString);
    updateUserProfile({ birthday: birthdayString });

    toast.success("Date of birth updated successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update your date of birth
          </DialogTitle>
          <DialogDescription>
            This is used for age verification and will not be displayed on your public profile.
          </DialogDescription>
        </DialogHeader>

        <Form
          { ...form }
        >
          <form
            id="update-birthday-form"
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-4 py-4"
          >
            <FormField
              control={ form.control }
              name="birthday"
              render={
                ({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={ "outline" }
                            className={
                              cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )
                            }
                          >
                            {
                              field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )
                            }
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="max-w-full max-h-full min-w-full min-h-full p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={ field.value }
                          onSelect={ field.onChange }
                          disabled={ (date) => date > new Date() }
                          autoFocus
                          className="max-w-full max-h-full min-w-full min-h-full"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
          </form>
        </Form>

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
            form="update-birthday-form"
            disabled={ form.formState.isSubmitting }
          >
            {
              form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            }
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
