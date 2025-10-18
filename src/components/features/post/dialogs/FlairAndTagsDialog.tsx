'use client'
import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { CommunityFlair } from '@/types/services/community'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/libs/utils'

interface FlairAndTagsDialogProps {
  flairs: CommunityFlair[]
  disabled?: boolean
  trigger?: React.ReactNode
}

export function FlairAndTagsDialog({ flairs, disabled, trigger }: FlairAndTagsDialogProps) {
  const { watch, setValue } = useFormContext()
  const currentFlairId = watch('flairId')
  const isNSFW = watch('isNSFW')
  const isSpoiler = watch('isSpoiler')
  const isOC = watch('isOC')

  const [open, setOpen] = useState(false)

  // Defensive init (if schema defaults missing)
  useEffect(() => {
    if (isNSFW === undefined) setValue('isNSFW', false)
    if (isSpoiler === undefined) setValue('isSpoiler', false)
    if (isOC === undefined) setValue('isOC', false)
  }, [isNSFW, isSpoiler, isOC, setValue])

  const handleSelectFlair = (id: string | null) => {
    setValue('flairId', id || '')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type='button' variant='outline' size='sm' disabled={disabled}>
            {currentFlairId ? 'Edit Flair & Tags' : 'Add Flair & Tags'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Flair & Post Tags</DialogTitle>
          <DialogDescription>
            Choose a flair (optional) and mark additional tags for your post.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Flair Section */}
          <div className='space-y-3'>
            <p className='text-xs font-medium uppercase text-muted-foreground'>Flair</p>
            <ScrollArea className='h-48 rounded border p-2'>
              <div className='grid gap-2'>
                <button
                  type='button'
                  onClick={() => handleSelectFlair(null)}
                  className={cn(
                    'flex items-center justify-between rounded border px-3 py-2 text-sm hover:bg-muted transition',
                    !currentFlairId && 'border-primary ring-1 ring-primary'
                  )}
                >
                  <span className='font-medium'>No flair</span>
                </button>
                {flairs.length === 0 && (
                  <div className='text-xs text-muted-foreground px-1'>No flairs available.</div>
                )}
                {flairs.map((f) => {
                  const active = currentFlairId === f.id
                  return (
                    <button
                      key={f.id}
                      type='button'
                      onClick={() => handleSelectFlair(f.id)}
                      className={cn(
                        'flex items-center justify-between rounded border px-3 py-2 text-sm hover:bg-muted transition',
                        active && 'border-primary ring-1 ring-primary'
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        <span
                          className='h-4 w-4 rounded-full ring-1 ring-border'
                          style={{ backgroundColor: f.color || '#CBD5E1' }}
                        />
                        <span className='font-medium'>{f.name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Tags Section */}
          <div className='space-y-4'>
            <p className='text-xs font-medium uppercase text-muted-foreground'>Tags</p>
            <div className='flex items-center justify-between'>
              <Label htmlFor='tag-nsfw' className='text-sm'>
                NSFW
              </Label>
              <Switch
                id='tag-nsfw'
                checked={!!isNSFW}
                onCheckedChange={(v) => setValue('isNSFW', v, { shouldDirty: true })}
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='tag-spoiler' className='text-sm'>
                Spoiler
              </Label>
              <Switch
                id='tag-spoiler'
                checked={!!isSpoiler}
                onCheckedChange={(v) => setValue('isSpoiler', v, { shouldDirty: true })}
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='tag-oc' className='text-sm'>
                Original Content
              </Label>
              <Switch
                id='tag-oc'
                checked={!!isOC}
                onCheckedChange={(v) => setValue('isOC', v, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button variant='secondary' type='button' onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button type='button' onClick={() => setOpen(false)}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
