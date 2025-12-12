'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface NavigationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  options: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  }[]
}

export default function NavigationDialog({
  open,
  onOpenChange,
  title = 'Post submitted!',
  description = 'Where would you like to go next?',
  options,
}: NavigationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex flex-col gap-2'>
          {options.map((opt, idx) => (
            <Button
              key={idx}
              variant={opt.variant || 'default'}
              onClick={() => {
                opt.onClick()
                onOpenChange(false)
              }}
            >
              {opt.label}
            </Button>
          ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
