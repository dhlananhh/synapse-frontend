'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { authService } from '@/modules/services/auth-service'
import { VerifyEmailSchema, TVerifyEmailSchema } from '@/libs/validators/auth-validator'

import VerifyEmailSkeleton from '@/components/features/auth/VerifyEmailSkeleton'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { BrainCircuit, Loader2 } from 'lucide-react'

export default function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ isClient, setIsClient ] = useState(false)
  const [ isResending, setIsResending ] = useState(false)
  const [ cooldown, setCooldown ] = useState(0) // Cooldown timer state
  const email = searchParams.get('email')

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [ cooldown ])

  const form = useForm<TVerifyEmailSchema>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: { code: '' },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: TVerifyEmailSchema) => {
    if (!email) return

    try {
      await authService.verifyEmail({ email, code: data.code })
      toast.success('Email Verified!', {
        description: 'Your account is now active. You can log in.',
      })
      router.push('/login')
    } catch (error: any) {
      toast.error('Verification Failed', {
        description: error.response?.data?.message || 'Invalid or expired code.',
      })
    }
  }

  const handleResendCode = async () => {
    if (!email || cooldown > 0) return

    setIsResending(true)
    try {
      await authService.resendVerification({ email })
      toast.info('A new verification code has been sent.')
      setCooldown(180) // Set cooldown to 3 minutes (180 seconds)
    } catch (error: any) {
      toast.error('Failed to Resend Code', {
        description: error.response?.data?.message || 'Please try again later.',
      })
    } finally {
      setIsResending(false)
    }
  }

  // Format cooldown as mm:ss
  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  if (!isClient) {
    return <VerifyEmailSkeleton />
  }

  if (!email) {
    return (
      <Card className='mx-auto max-w-lg w-full'>
        <CardHeader className='text-center'>
          <CardTitle className='text-destructive'>Error</CardTitle>
          <CardDescription>
            Email parameter is missing from the URL. Please return to the registration page and try
            again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className='w-full'>
            <Link href='/register'>Go to Registration</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-lg w-full'>
      <CardHeader className='items-center text-center'>
        <Link href='/' className='flex flex-col items-center gap-2 mb-4'>
          <BrainCircuit className='h-10 w-10 text-primary' />
          <CardTitle className='text-2xl'>Synapse</CardTitle>
        </Link>

        <CardTitle className='text-2xl mt-5 uppercase'>Verify Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit verification code to <strong>{ email }</strong>. <br />
          Please enter it below to activate your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form { ...form }>
          <form onSubmit={ form.handleSubmit(onSubmit) } className='space-y-6'>
            <FormField
              control={ form.control }
              name='code'
              render={ ({ field }) => (
                <FormItem className='flex flex-col items-center'>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={ 6 } { ...field }>
                      <InputOTPGroup>
                        <InputOTPSlot index={ 0 } />
                        <InputOTPSlot index={ 1 } />
                        <InputOTPSlot index={ 2 } />
                        <InputOTPSlot index={ 3 } />
                        <InputOTPSlot index={ 4 } />
                        <InputOTPSlot index={ 5 } />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              ) }
            />
            <Button type='submit' className='w-full' disabled={ isSubmitting }>
              { isSubmitting ? <Loader2 className='animate-spin' /> : 'Verify Account' }
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm text-muted-foreground'>
          Didn&apos;t receive a code?{ ' ' }
          <Button
            variant='link'
            className='p-0 h-auto'
            onClick={ handleResendCode }
            disabled={ isResending || cooldown > 0 }
          >
            { isResending
              ? 'Sending...'
              : cooldown > 0
                ? `Resend Code (${formatCooldown(cooldown)})`
                : 'Resend Code' }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
