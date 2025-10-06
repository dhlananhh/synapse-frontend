'use client'

import React from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CommunityRule } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import { TRuleSchema, RuleSchema } from '@/libs/validators/community-validator'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface UpdateRuleDialogProps {
  communityId: string
  rule: CommunityRule
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onRuleUpdated: (updatedRule: any) => void
}

export function UpdateRuleDialog({
  communityId,
  rule,
  isOpen,
  onOpenChange,
  onRuleUpdated,
}: UpdateRuleDialogProps) {
  const form = useForm<TRuleSchema>({
    resolver: zodResolver(RuleSchema),
    defaultValues: {
      title: rule.title || '',
      description: rule.description || '',
    },
  })

  const onSubmit = async (data: TRuleSchema) => {
    try {
      const response = await communityService.updateRule(communityId, rule.id, data)
      toast.success('Rule updated successfully!')
      onRuleUpdated(response)
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Failed to update rule.', {
        description: error.response?.data?.message,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Rule</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
