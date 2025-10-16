"use client";


import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityService } from "@/modules/services/community-service";
import {
  TRuleSchema,
  RuleSchema,
} from "@/libs/validators/community-validator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


interface CreateRuleDialogProps {
  communityId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRuleCreated: (newRule: any) => void;
}


export function CreateRuleDialog({
  communityId,
  isOpen,
  onOpenChange,
  onRuleCreated,
}: CreateRuleDialogProps) {
  const form = useForm<TRuleSchema>({
    resolver: zodResolver(RuleSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: TRuleSchema) => {
    try {
      const response = await communityService.createRule(communityId, data);
      toast.success("Rule created successfully!");
      onRuleCreated(response);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to create rule.", {
        description: error.response?.data?.message,
      });
    }
  };

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ onOpenChange }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a New Rule
          </DialogTitle>
        </DialogHeader>
        <Form
          { ...form }
        >
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-4 py-4"
          >
            <FormField
              control={ form.control }
              name="title"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <FormField
              control={ form.control }
              name="description"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={ form.formState.isSubmitting }
              >
                Create Rule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
