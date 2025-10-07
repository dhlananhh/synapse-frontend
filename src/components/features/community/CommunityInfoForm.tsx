'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateCommunitySchema,
  TCreateCommunitySchema,
} from '@/libs/validators/community-validator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface CommunityInfoFormProps {
  onSubmit: (data: TCreateCommunitySchema) => void
  isSubmitting: boolean
}

export function CommunityInfoForm({ onSubmit, isSubmitting }: CommunityInfoFormProps) {
  const form = useForm<TCreateCommunitySchema>({
    resolver: zodResolver(CreateCommunitySchema),
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
      isNSFW: false,
    },
  })

  return (
    <Card>
      <CardHeader className='pt-2'>
        <CardTitle>Community Information</CardTitle>
        <CardDescription>
          This is the first step to building your own community on Synapse.
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-2'>
        {/* provide form context for FormField components */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log('valid submit', data)
                onSubmit(data)
              },
              (errors) => {
                console.log('validation errors', errors)
              }
            )}
            className='space-y-8'
            noValidate
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your community name' {...field} />
                  </FormControl>
                  <FormDescription>
                    Community name can only contain letters, numbers, underscores, and hyphens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='A community for...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isPrivate'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel>Private Community</FormLabel>
                    <FormDescription>
                      If turned on, only members you approve can view and post.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isNSFW'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel>Adult Content</FormLabel>
                    <FormDescription>Is your community 18+ (Not Safe For Work)?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={isSubmitting}
                onClick={() => console.log('submit button clicked')}
              >
                {isSubmitting ? 'Creating...' : 'Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
